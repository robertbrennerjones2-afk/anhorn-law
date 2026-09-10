/**
 * Lead Form Handler
 * Validates inputs and safely formats the submission data.
 */
(function () {
  'use strict';

  document.addEventListener('componentLoaded', (event) => {
    if (event.detail.path.includes('lead-form.html')) {
      initFormValidation();
    }
  });

  function initFormValidation() {
    const form = Utils.$('#lead-intake-form');
    if (!form) return;

    const phoneInput = Utils.$('#phone', form);

    // Auto-format phone number as the user types
    if (phoneInput) {
      Utils.on(phoneInput, 'input', (e) => {
        const cursorPosition = e.target.selectionStart;
        const previousLength = e.target.value.length;
        
        e.target.value = Utils.formatPhoneNumber(e.target.value);
        
        // Basic cursor position preservation
        if (e.target.value.length !== previousLength) {
          e.target.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
        }
      });
    }

    Utils.on(form, 'submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const requiredFields = Utils.$$('[required]', form);

      // Reset previous error states
      Utils.$$('.error-message', form).forEach(el => el.remove());
      requiredFields.forEach(field => field.classList.remove('is-invalid'));

      // Validate empty fields
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          showError(field, 'This field is required.');
          isValid = false;
        }
      });

      // Validate email format
      const emailField = Utils.$('#email', form);
      if (emailField && emailField.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailField.value)) {
          showError(emailField, 'Please enter a valid email address.');
          isValid = false;
        }
      }

      if (isValid) {
        processSubmission(form);
      }
    });
  }

  function showError(inputElement, message) {
    inputElement.classList.add('is-invalid');
    const errorNode = document.createElement('div');
    errorNode.className = 'error-message';
    errorNode.textContent = message;
    inputElement.parentNode.appendChild(errorNode);
  }

  function processSubmission(form) {
    const formData = new FormData(form);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const caseDesc = formData.get('caseDescription');

    // Format the email body for the mailto action
    const subject = encodeURIComponent(`New Consultation Request: ${firstName} ${lastName}`);
    const body = encodeURIComponent(
      `Name: ${firstName} ${lastName}\n` +
      `Phone: ${phone}\n` +
      `Email: ${email}\n\n` +
      `Case Description:\n${caseDesc}\n\n` +
      `---\nSubmitted via AnhornLaw.com`
    );

    // Redirect to native mail client
    window.location.href = `mailto:jordan@anhornlaw.com?subject=${subject}&body=${body}`;
    
    // Reset form and show success state
    form.reset();
    form.innerHTML = `<div style="text-align:center; padding: 2rem;">
      <h3 style="color: var(--color-primary); margin-bottom: 1rem;">Thank You</h3>
      <p>Your message has been formatted. Please hit send in your email client to complete the request.</p>
    </div>`;
  }
})();