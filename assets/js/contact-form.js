(function () {
  var statusContainer = document.getElementById('form-status-message');
  var form = document.getElementById('contact-form');
  if (!statusContainer || !form) return;

  function renderStatus(type, message) {
    var klass = type === 'success' ? 'alert-success' : 'alert-danger';
    statusContainer.innerHTML = '<div class="alert ' + klass + '" role="alert">' + message + '</div>';
    statusContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending…';
    }

    var formData = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: formData,
      credentials: 'same-origin'
    }).then(function (response) {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Free Consultation <span><i class="fa-solid fa-arrow-right"></i></span>';
      }

      if (response.status === 405) {
        renderStatus('error', 'Your hosting server is blocking POST requests to PHP (HTTP 405). Enable PHP for this site, then try again.');
        return;
      }

      if (response.ok && response.url && response.url.indexOf('status=success') !== -1) {
        renderStatus('success', 'Thank you! Your message has been sent successfully.');
        form.reset();
        return;
      }

      renderStatus('error', 'Sorry, we could not send your message right now. Please try again.');
    }).catch(function () {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Free Consultation <span><i class="fa-solid fa-arrow-right"></i></span>';
      }
      renderStatus('error', 'Request failed. Please check server settings and try again.');
    });
  });
})();
