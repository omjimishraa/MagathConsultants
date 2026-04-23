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

loadDotEnv(__DIR__ . DIRECTORY_SEPARATOR . '.env');

// Reject direct access and allow only form POST requests.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: contact.html');
    exit;
}

$firstName = trim($_POST['first_name'] ?? '');
$lastName = trim($_POST['last_name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$serviceType = trim($_POST['service_type'] ?? '');
$message = trim($_POST['message'] ?? '');

if (
    $firstName === '' ||
    $lastName === '' ||
    $email === '' ||
    $phone === '' ||
    $serviceType === '' ||
    $message === '' ||
    !filter_var($email, FILTER_VALIDATE_EMAIL)
) {
    header('Location: contact.html?status=error');
    exit;
}

// SMTP configuration (Gmail) from environment variables.
$smtpHost = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
$smtpPort = (int) (getenv('SMTP_PORT') ?: 587);
$smtpUser = getenv('SMTP_USER') ?: 'rahul.kgr27@gmail.com';
$smtpPass = getenv('SMTP_PASS') ?: '';

$to = getenv('CONTACT_TO_EMAIL') ?: 'info@magathconsultants.com';

if ($smtpPass === '') {
    header('Location: contact.html?status=error');
    exit;
}

$fromEmail = $smtpUser;
$fromName = 'Magath Website Contact Form';
$subject = 'New Contact Form Submission - Magath Consultants';

$fullName = trim($firstName . ' ' . $lastName);

// Prevent header injection in user-provided values.
$safeFullName = str_replace(["\r", "\n"], ' ', $fullName);
$safeEmail = str_replace(["\r", "\n"], '', $email);
$safePhone = str_replace(["\r", "\n"], ' ', $phone);
$safeServiceType = str_replace(["\r", "\n"], ' ', $serviceType);
$safeMessage = str_replace(["\r", "\n"], ' ', $message);

$bodyText = "You have received a new contact form submission.\r\n\r\n" .
    "Name: {$safeFullName}\r\n" .
    "Email: {$safeEmail}\r\n" .
    "Phone: {$safePhone}\r\n" .
    "Service Type: {$safeServiceType}\r\n" .
    "Message: {$safeMessage}\r\n";

$messageData = '';
$messageData .= 'From: ' . $fromName . ' <' . $fromEmail . ">\r\n";
$messageData .= 'To: <' . $to . ">\r\n";
$messageData .= 'Reply-To: ' . $safeEmail . "\r\n";
$messageData .= 'Subject: ' . $subject . "\r\n";
$messageData .= "MIME-Version: 1.0\r\n";
$messageData .= "Content-Type: text/plain; charset=UTF-8\r\n";
$messageData .= "\r\n";
$messageData .= $bodyText;

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

$isSent = false;
$socket = @stream_socket_client('tcp://' . $smtpHost . ':' . $smtpPort, $errno, $errstr, 20);

if ($socket) {
    stream_set_timeout($socket, 20);

    $step1 = smtpExpect($socket, [220]);
    $step2 = $step1 && smtpSend($socket, 'EHLO ' . ($_SERVER['SERVER_NAME'] ?? 'localhost'), [250]);
    $step3 = $step2 && smtpSend($socket, 'STARTTLS', [220]);

    if ($step3 && stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
        $step4 = smtpSend($socket, 'EHLO ' . ($_SERVER['SERVER_NAME'] ?? 'localhost'), [250]);
        $step5 = $step4 && smtpSend($socket, 'AUTH LOGIN', [334]);
        $step6 = $step5 && smtpSend($socket, base64_encode($smtpUser), [334]);
        $step7 = $step6 && smtpSend($socket, base64_encode($smtpPass), [235]);
        $step8 = $step7 && smtpSend($socket, 'MAIL FROM:<' . $fromEmail . '>', [250]);
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
    header('Location: contact.html?status=success');
    exit;
}

header('Location: contact.html?status=error');
exit;
