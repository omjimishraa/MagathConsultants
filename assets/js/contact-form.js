(function () {
  var statusContainer = document.getElementById('form-status-message');
  var form = document.getElementById('contact-form');
  if (!statusContainer || !form) return;

  var defaultButtonHtml = '';

  function renderStatus(type, message) {
    var klass = type === 'success' ? 'alert-success' : 'alert-danger';
    statusContainer.innerHTML = '<div class="alert ' + klass + '" role="alert">' + message + '</div>';
    statusContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function resetSubmitButton(button) {
    if (!button) return;
    button.disabled = false;
    button.innerHTML = defaultButtonHtml;
  }

  try {
    var status = new URLSearchParams(window.location.search).get('status');
    if (status === 'success') {
      renderStatus('success', 'Thank you! Your message has been sent successfully.');
    } else if (status === 'error') {
      renderStatus('error', 'Sorry, we could not send your message right now. Please try again.');
    }
  } catch (error) {
    // Ignore invalid URL parsing and continue with form submission handling.
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      if (!defaultButtonHtml) {
        defaultButtonHtml = submitButton.innerHTML;
      }
      submitButton.disabled = true;
      submitButton.textContent = 'Sending…';
    }

    var formData = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: formData,
      credentials: 'same-origin'
    }).then(function (response) {
      if (response.status === 405) {
        resetSubmitButton(submitButton);
        renderStatus('error', 'Your hosting server is blocking POST requests to PHP (HTTP 405). Enable PHP for this site, then try again.');
        return;
      }

      return response.json().catch(function () {
        return null;
      }).then(function (data) {
        resetSubmitButton(submitButton);

        if (response.ok && data && data.ok) {
          renderStatus('success', 'Thank you! Your message has been sent successfully.');
          form.reset();
          return;
        }

        if (data && data.msg) {
          renderStatus('error', data.msg);
          return;
        }

        renderStatus('error', 'Sorry, we could not send your message right now. Please try again.');
      });
    }).catch(function () {
      resetSubmitButton(submitButton);
      renderStatus('error', 'Request failed. Please check server settings and try again.');
    });
  });
})();
