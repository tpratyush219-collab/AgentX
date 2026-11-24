/* AgentX: dependency-free UI enhancements and same-origin Netlify Forms submissions. */
'use strict';

document.documentElement.classList.replace('no-js', 'js');

// Collapsible mobile navigation. Escape and outside clicks close it; links keep native behavior.
const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('#primary-nav');
const header = document.querySelector('.site-header');
const mobileQuery = window.matchMedia('(max-width: 640px)');

function setMenuOpen(open, returnFocus = false) {
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  primaryNav.classList.toggle('is-open', open);
  if (returnFocus) menuToggle.focus();
}

menuToggle.addEventListener('click', () => {
  setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});
primaryNav.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenuOpen(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false, true);
  }
});
document.addEventListener('click', (event) => {
  if (!header.contains(event.target)) setMenuOpen(false);
});
// Close when keyboard focus moves outside the header, without trapping focus on a simple disclosure.
header.addEventListener('focusout', (event) => {
  if (!header.contains(event.relatedTarget)) setMenuOpen(false);
});
mobileQuery.addEventListener('change', () => setMenuOpen(false));

let scrollTicking = false;
function updateHeader() {
  header.classList.toggle('is-scrolled', window.scrollY > 12);
  scrollTicking = false;
}
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(updateHeader);
    scrollTicking = true;
  }
}, { passive: true });
updateHeader();

// A visible pause control complements the operating system's reduced-motion preference.
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionToggle = document.querySelector('.motion-toggle');
let motionPaused = motionQuery.matches;
function updateMotion() {
  document.body.classList.toggle('motion-paused', motionPaused || motionQuery.matches);
  motionToggle.setAttribute('aria-pressed', String(motionPaused || motionQuery.matches));
  motionToggle.querySelector('.motion-label').textContent = motionPaused ? 'Resume animation' : 'Pause animation';
}
motionToggle.hidden = false;
motionToggle.addEventListener('click', () => {
  motionPaused = !motionPaused;
  updateMotion();
});
motionQuery.addEventListener('change', () => {
  motionPaused = motionQuery.matches;
  updateMotion();
});
updateMotion();

// Observers are enhancements only. Without them, all content stays visible and usable.
if ('IntersectionObserver' in window) {
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px 24px 0px' });

  if (!motionQuery.matches) {
    reveals.forEach((element) => {
      element.classList.add('reveal-pending');
      revealObserver.observe(element);
    });
  }

  const navLinks = [...primaryNav.querySelectorAll('a[href^="#"]')];
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    });
  }, { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
  document.querySelectorAll('main section[id]').forEach((section) => sectionObserver.observe(section));
}

// Concept descriptions are explicit about what is illustrative and what is implemented.
document.querySelectorAll('.project-details-toggle').forEach((button) => {
  const panel = document.getElementById(button.getAttribute('aria-controls'));
  button.hidden = false;
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    panel.hidden = expanded;
  });
});

// Native <details> provides keyboard/screen-reader support; only one FAQ stays open at a time.
const faqItems = [...document.querySelectorAll('.faq-list details')];
faqItems.forEach((item) => {
  item.addEventListener('toggle', () => {
    if (item.open) faqItems.forEach((other) => { if (other !== item) other.open = false; });
  });
});

// Pricing links add context without overwriting anything the visitor has already typed.
const enquiryForm = document.querySelector('#enquiry-form');
const enquiryFields = document.querySelector('#enquiry-fields');
const selectedPlan = document.querySelector('#selected-plan');
const planInput = document.querySelector('#enquiry-plan');
const serviceInput = document.querySelector('#service');
const formStatus = document.querySelector('#form-status');
const submitButton = enquiryForm.querySelector('[type="submit"]');
const submitLabel = submitButton.querySelector('.submit-label');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const messageInput = document.querySelector('#message');
const submissionTimeoutMs = 20000;
let isSubmitting = false;
let autoSelectedService = '';

// A manual project-type choice takes precedence over later package suggestions.
serviceInput.addEventListener('change', () => { autoSelectedService = ''; });

function setFormStatus(state, message, focus = false) {
  formStatus.dataset.state = state;
  formStatus.textContent = message;
  if (focus) formStatus.focus();
}

document.querySelectorAll('[data-enquiry]').forEach((link) => {
  link.addEventListener('click', () => {
    // An in-flight enquiry is immutable; do not alter its package context mid-request.
    if (isSubmitting) return;
    const plan = link.dataset.enquiry;
    planInput.value = plan;
    selectedPlan.textContent = `You’re exploring: ${plan}. Your final scope will be agreed together.`;
    selectedPlan.hidden = false;
    if (!serviceInput.value || serviceInput.value === autoSelectedService) {
      const suggestedServices = {
        'Landing page': 'Website or landing page',
        'Business website': 'Website or landing page',
        'Premium website': 'Website or landing page',
        Maintenance: 'Website care and refinement',
        'International project': 'Not sure yet'
      };
      serviceInput.value = suggestedServices[plan] || '';
      autoSelectedService = serviceInput.value;
    }
    setFormStatus('', '');
  });
});

enquiryForm.addEventListener('input', (event) => {
  if (typeof event.target.setCustomValidity === 'function') event.target.setCustomValidity('');
  if (!isSubmitting) setFormStatus('', '');
});
enquiryForm.addEventListener('change', () => {
  if (!isSubmitting) setFormStatus('', '');
});

// Without fetch/AbortController, the static POST form retains Netlify's native fallback.
enquiryForm.addEventListener('submit', async (event) => {
  if (!window.fetch || !window.AbortController) return;
  event.preventDefault();
  if (isSubmitting) return;

  nameInput.value = nameInput.value.trim();
  emailInput.value = emailInput.value.trim();
  nameInput.setCustomValidity(nameInput.value ? '' : 'Please enter your name.');
  messageInput.setCustomValidity(messageInput.value.trim().length >= 20 ? '' : 'Please describe your project in at least 20 non-padding characters.');
  if (!enquiryForm.reportValidity()) return;

  // Construct the payload before disabling fields; disabled controls are omitted by FormData.
  const data = new FormData(enquiryForm);
  if (String(data.get('bot-field') || '')) {
    setFormStatus('error', 'Unable to submit this enquiry. Please email agentx.digital.official@gmail.com for help.', true);
    return;
  }

  if (!['http:', 'https:'].includes(window.location.protocol)) {
    setFormStatus('error', 'Please use the published AgentX website to submit, or email agentx.digital.official@gmail.com. Your details are still here.', true);
    return;
  }
  if (navigator.onLine === false) {
    setFormStatus('error', 'You appear to be offline. Your details are still here. Reconnect to submit, or email agentx.digital.official@gmail.com.', true);
    return;
  }

  data.set('form-name', enquiryForm.getAttribute('name'));
  data.set('message', messageInput.value.trim());
  const body = new URLSearchParams(data).toString();
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), submissionTimeoutMs);
  isSubmitting = true;
  enquiryFields.disabled = true;
  enquiryForm.setAttribute('aria-busy', 'true');
  submitLabel.textContent = 'Sending enquiry…';
  setFormStatus('loading', 'Sending your enquiry. Please wait.');

  try {
    // Netlify parses the static form at deploy time and receives URL-encoded POSTs here.
    // No API key or custom backend is required. Only a successful HTTP response confirms submission.
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      credentials: 'same-origin',
      mode: 'same-origin',
      signal: controller.signal
    });
    if (!response.ok) throw new Error('Submission was not accepted');

    enquiryForm.reset();
    // Setting a hidden input's value also changes its default, so reset it explicitly.
    planInput.value = '';
    autoSelectedService = '';
    selectedPlan.hidden = true;
    selectedPlan.textContent = '';
    setFormStatus('success', 'Thank you — your enquiry has been submitted. We’ll reply using the email you provided.', true);
  } catch (error) {
    // A lost connection or timeout can happen after server acceptance. Do not claim non-delivery.
    const message = error.name === 'AbortError'
      ? 'We couldn’t confirm receipt before the request timed out. Your details are still here. Please email agentx.digital.official@gmail.com before retrying to avoid duplicates.'
      : 'We couldn’t confirm your submission. Your details are still here. Please try again or email agentx.digital.official@gmail.com.';
    setFormStatus('error', message, true);
  } finally {
    window.clearTimeout(timeout);
    isSubmitting = false;
    enquiryFields.disabled = false;
    enquiryForm.removeAttribute('aria-busy');
    submitLabel.textContent = 'Send enquiry';
  }
});

// No personal data is written to localStorage, analytics, or console logs.
document.querySelector('#year').textContent = String(new Date().getFullYear());
