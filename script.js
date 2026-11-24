/* AgentX: dependency-free enhancements. Enquiry information never leaves the browser. */
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
const briefResult = document.querySelector('#brief-result');
const briefText = document.querySelector('#brief-text');
const briefHeading = document.querySelector('#brief-heading');
const formStatus = document.querySelector('#form-status');
let preparedBrief = '';
let autoSelectedService = '';

// A manual project-type choice takes precedence over later package suggestions.
serviceInput.addEventListener('change', () => { autoSelectedService = ''; });

function clearBrief() {
  preparedBrief = '';
  briefText.textContent = '';
  briefResult.hidden = true;
  formStatus.textContent = '';
}

document.querySelectorAll('[data-enquiry]').forEach((link) => {
  link.addEventListener('click', () => {
    const plan = link.dataset.enquiry;
    planInput.value = plan;
    selectedPlan.textContent = `You’re exploring: ${plan}. Your final scope will be agreed together.`;
    selectedPlan.hidden = false;
    if (!serviceInput.value || serviceInput.value === autoSelectedService) {
      const suggestedServices = {
        Launch: 'Website or landing page',
        Build: 'Not sure yet',
        Evolve: 'Website care and refinement'
      };
      serviceInput.value = suggestedServices[plan] || '';
      autoSelectedService = serviceInput.value;
    }
    clearBrief();
  });
});

enquiryForm.addEventListener('input', clearBrief);
enquiryForm.addEventListener('change', clearBrief);

// No fetch, email action, analytics, localStorage, or simulated submission.
// Register the submit handler BEFORE enabling fields so a failed script cannot submit a native GET.
enquiryForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!enquiryForm.reportValidity()) return;
  const data = new FormData(enquiryForm);
  const name = String(data.get('name') || '').trim();
  const email = String(data.get('email') || '').trim();
  const message = String(data.get('message') || '').trim();

  if (!name || message.length < 20) {
    formStatus.textContent = !name ? 'Please enter your name.' : 'Please describe your project in at least 20 non-padding characters.';
    document.querySelector(!name ? '#name' : '#message').focus();
    return;
  }

  preparedBrief = [
    'AGENTX — PROJECT ENQUIRY',
    'Prepared locally. This enquiry has NOT been sent.',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Project type: ${data.get('service')}`,
    ...(data.get('plan') ? [`Starting point: ${data.get('plan')}`] : []),
    '',
    'PROJECT IDEA',
    message,
    '',
    'Enquiry delivery is not configured. Keep this brief for a verified contact channel.'
  ].join('\n');

  // textContent prevents user-entered markup from becoming executable HTML.
  briefText.textContent = preparedBrief;
  briefResult.hidden = false;
  formStatus.textContent = 'Brief prepared on this device. Nothing has been sent.';
  briefHeading.focus();
});
enquiryFields.disabled = false;

document.querySelector('#copy-brief').addEventListener('click', async () => {
  if (!preparedBrief) return;
  try {
    if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(preparedBrief);
    formStatus.textContent = 'Brief copied. It has not been sent.';
  } catch {
    formStatus.textContent = 'Clipboard access is unavailable. Select the brief text to copy it, or use Download .txt.';
    const selection = window.getSelection();
    if (selection) {
      const range = document.createRange();
      range.selectNodeContents(briefText);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    briefText.focus();
  }
});

document.querySelector('#download-brief').addEventListener('click', () => {
  if (!preparedBrief) return;
  const blob = new Blob([preparedBrief], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'agentx-project-enquiry.txt';
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  formStatus.textContent = 'Brief download requested. Nothing has been sent to AgentX.';
});

document.querySelector('#year').textContent = String(new Date().getFullYear());
