const contactForm = document.querySelector('#contact-form');
const contactStatus = document.querySelector('#contact-status');
const emailDraft = document.querySelector('#email-draft');
const contactFields = ['name', 'email', 'message'].map((name) => ({
  input: document.querySelector(`#contact-${name}`),
  error: document.querySelector(`#${name}-error`),
}));

function validateContactField({ input, error }) {
  let message = '';
  if (!input.value.trim()) {
    message = `Please enter your ${input.name}.`;
  } else if (input.validity.typeMismatch) {
    message = 'Please enter a valid email address, such as name@example.com.';
  } else if (input.value.length > input.maxLength) {
    message = `Please use ${input.maxLength} characters or fewer.`;
  }
  error.textContent = window.portfolioTranslate(message);
  error.hidden = !message;
  input.setAttribute('aria-invalid', String(Boolean(message)));
  return !message;
}

contactForm.noValidate = true;
contactForm.hidden = false;

contactFields.forEach((field) => {
  field.input.addEventListener('input', () => {
    emailDraft.hidden = true;
    emailDraft.removeAttribute('href');
    contactStatus.textContent = '';
    if (field.input.getAttribute('aria-invalid') === 'true') {
      validateContactField(field);
    }
  });
});

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const invalidFields = contactFields.filter((field) => !validateContactField(field));
  if (invalidFields.length) {
    emailDraft.hidden = true;
    emailDraft.removeAttribute('href');
    contactStatus.textContent = window.portfolioTranslate('Please correct the highlighted fields.');
    invalidFields[0].input.focus();
    return;
  }

  const [name, email, message] = contactFields.map(({ input }) => input.value.trim());
  const subject = window.portfolioTranslate('Portfolio inquiry');
  const body = `${window.portfolioTranslate('Name:')} ${name}\n${window.portfolioTranslate('Email:')} ${email}\n\n${message}`;
  emailDraft.href = `mailto:LV285@njit.edu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  emailDraft.hidden = false;
  contactStatus.textContent = window.portfolioTranslate('Your draft is ready. Open it in your email app, review it, and send it there. No message has been sent.');
});

document.addEventListener('languagechange', () => {
  const draftReady = !emailDraft.hidden;
  if (draftReady) {
    contactForm.requestSubmit();
  } else {
    const hadErrors = contactFields.some(({ input }) => input.getAttribute('aria-invalid') === 'true');
    contactFields.forEach((field) => {
      if (field.input.getAttribute('aria-invalid') === 'true') validateContactField(field);
    });
    if (hadErrors) contactStatus.textContent = window.portfolioTranslate('Please correct the highlighted fields.');
  }
});
