<?php
function loadDotEnv($filePath)
{
    if (!is_readable($filePath)) {
        return;
    }

    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return;
    }

    foreach ($lines as $line) {
        $trimmed = trim($line);
        if ($trimmed === '' || strpos($trimmed, '#') === 0) {
            continue;
        }

        $parts = explode('=', $trimmed, 2);
        if (count($parts) !== 2) {
            continue;
        }

        $key = trim($parts[0]);
        $value = trim($parts[1]);

        if ($key === '') {
            continue;
        }

        $value = trim($value, "\"'");

        putenv($key . '=' . $value);
        $_ENV[$key] = $value;
        $_SERVER[$key] = $value;
    }
}

function redirectCareer($status)
{
    header('Location: career.html?status=' . $status);
    exit;
}

function smtpExpect($socket, array $okCodes)
{
    $response = '';
    while (($line = fgets($socket, 515)) !== false) {
        $response .= $line;
        if (preg_match('/^\d{3}\s/', $line)) {
            break;
        }
    }

    if ($response === '') {
        return false;
    }

    $code = (int) substr($response, 0, 3);
    return in_array($code, $okCodes, true);
}

function smtpSend($socket, $command, array $okCodes)
{
    fwrite($socket, $command . "\r\n");
    return smtpExpect($socket, $okCodes);
}

loadDotEnv(__DIR__ . DIRECTORY_SEPARATOR . '.env');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirectCareer('error');
}

$fullName = trim($_POST['fullName'] ?? '');
$email = trim($_POST['emailAddress'] ?? '');
$phone = trim($_POST['phoneNumber'] ?? '');
$message = trim($_POST['message'] ?? '');

if (
    $fullName === '' ||
    $email === '' ||
    $phone === '' ||
    $message === '' ||
    !filter_var($email, FILTER_VALIDATE_EMAIL)
) {
    redirectCareer('error');
}

if (!isset($_FILES['resumeFile']) || !is_array($_FILES['resumeFile'])) {
    redirectCareer('error');
}

$resume = $_FILES['resumeFile'];
if (($resume['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    redirectCareer('error');
}

$tmpPath = $resume['tmp_name'] ?? '';
$originalName = $resume['name'] ?? 'resume';
$fileSize = (int) ($resume['size'] ?? 0);

if ($tmpPath === '' || !is_uploaded_file($tmpPath) || $fileSize <= 0 || $fileSize > (5 * 1024 * 1024)) {
    redirectCareer('error');
}

$extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
$allowedExt = ['pdf', 'doc', 'docx'];
if (!in_array($extension, $allowedExt, true)) {
    redirectCareer('error');
}

$mimeType = 'application/octet-stream';
if (function_exists('mime_content_type')) {
    $detected = mime_content_type($tmpPath);
    if (is_string($detected) && $detected !== '') {
        $mimeType = $detected;
    }
}

$allowedMime = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/octet-stream',
];

if (!in_array($mimeType, $allowedMime, true)) {
    redirectCareer('error');
}

$fileContent = file_get_contents($tmpPath);
if ($fileContent === false) {
    redirectCareer('error');
}

$smtpHost = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
$smtpPort = (int) (getenv('SMTP_PORT') ?: 587);
$smtpUser = getenv('SMTP_USER') ?: 'rahul.kgr27@gmail.com';
$smtpPass = getenv('SMTP_PASS') ?: '';

$to = getenv('CAREER_TO_EMAIL') ?: 'hr@magathconsultants.com';
if ($smtpPass === '') {
    redirectCareer('error');
}

$safeFullName = str_replace(["\r", "\n"], ' ', $fullName);
$safeEmail = str_replace(["\r", "\n"], '', $email);
$safePhone = str_replace(["\r", "\n"], ' ', $phone);
$safeMessage = str_replace(["\r", "\n"], ' ', $message);
$safeFileName = preg_replace('/[^A-Za-z0-9._-]/', '_', basename($originalName));
if (!is_string($safeFileName) || $safeFileName === '') {
    $safeFileName = 'resume.' . $extension;
}

$bodyText = "New career application received.\r\n\r\n" .
    "Name: {$safeFullName}\r\n" .
    "Email: {$safeEmail}\r\n" .
    "Phone: {$safePhone}\r\n" .
    "Message: {$safeMessage}\r\n";

$boundary = 'boundary_' . md5((string) microtime(true));
$encodedFile = chunk_split(base64_encode($fileContent));

$messageData = '';
$messageData .= 'From: Magath Careers <' . $smtpUser . ">\r\n";
$messageData .= 'To: <' . $to . ">\r\n";
$messageData .= 'Reply-To: ' . $safeEmail . "\r\n";
$messageData .= 'Subject: New Career Application - ' . $safeFullName . "\r\n";
$messageData .= "MIME-Version: 1.0\r\n";
$messageData .= 'Content-Type: multipart/mixed; boundary="' . $boundary . '"' . "\r\n";
$messageData .= "\r\n";
$messageData .= '--' . $boundary . "\r\n";
$messageData .= "Content-Type: text/plain; charset=UTF-8\r\n";
$messageData .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
$messageData .= $bodyText . "\r\n";
$messageData .= '--' . $boundary . "\r\n";
$messageData .= 'Content-Type: ' . $mimeType . '; name="' . $safeFileName . '"' . "\r\n";
$messageData .= "Content-Transfer-Encoding: base64\r\n";
$messageData .= 'Content-Disposition: attachment; filename="' . $safeFileName . '"' . "\r\n\r\n";
$messageData .= $encodedFile . "\r\n";
$messageData .= '--' . $boundary . "--\r\n";

$isSent = false;
$socket = @stream_socket_client('tcp://' . $smtpHost . ':' . $smtpPort, $errno, $errstr, 20);

if ($socket) {
    stream_set_timeout($socket, 20);

    $serverName = $_SERVER['SERVER_NAME'] ?? 'localhost';
    $step1 = smtpExpect($socket, [220]);
    $step2 = $step1 && smtpSend($socket, 'EHLO ' . $serverName, [250]);
    $step3 = $step2 && smtpSend($socket, 'STARTTLS', [220]);

    if ($step3 && stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
        $step4 = smtpSend($socket, 'EHLO ' . $serverName, [250]);
        $step5 = $step4 && smtpSend($socket, 'AUTH LOGIN', [334]);
        $step6 = $step5 && smtpSend($socket, base64_encode($smtpUser), [334]);
        $step7 = $step6 && smtpSend($socket, base64_encode($smtpPass), [235]);
        $step8 = $step7 && smtpSend($socket, 'MAIL FROM:<' . $smtpUser . '>', [250]);
        $step9 = $step8 && smtpSend($socket, 'RCPT TO:<' . $to . '>', [250, 251]);
        $step10 = $step9 && smtpSend($socket, 'DATA', [354]);

        if ($step10) {
            fwrite($socket, $messageData . "\r\n.\r\n");
            $step11 = smtpExpect($socket, [250]);
            $isSent = $step11;
        }
    }

    @smtpSend($socket, 'QUIT', [221, 250]);
    fclose($socket);
}

if ($isSent) {
    redirectCareer('success');
}

redirectCareer('error');
