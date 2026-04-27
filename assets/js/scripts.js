const cookieBanner = document.getElementById('cookie-banner');
const burgerButton = document.getElementById('burgerButton');
const mobileNav = document.getElementById('mobileNav');
const openModalButtons = document.querySelectorAll('[data-open-modal]');
const closeModalButtons = document.querySelectorAll('[data-close-modal]');
const modalOverlays = document.querySelectorAll('.modal-overlay');
const cookieButtons = document.querySelectorAll('[data-cookie-action]');
let activeModal = null;
let lastFocusedElement = null;

function setCookieBannerState() {
  const consent = localStorage.getItem('cw_cookie_consent');
  const visible = consent === null;
  cookieBanner.dataset.visible = visible ? 'true' : 'false';
  cookieBanner.setAttribute('aria-hidden', visible ? 'false' : 'true');
}

function acceptCookies() {
  localStorage.setItem('cw_cookie_consent', 'accepted');
  setCookieBannerState();
}

function rejectCookies() {
  localStorage.setItem('cw_cookie_consent', 'rejected');
  setCookieBannerState();
}

function toggleMobileNav() {
  const expanded = burgerButton.getAttribute('aria-expanded') === 'true';
  burgerButton.setAttribute('aria-expanded', String(!expanded));
  mobileNav.classList.toggle('open');
  mobileNav.setAttribute('aria-hidden', String(expanded));
}

function closeMobileNav() {
  burgerButton.setAttribute('aria-expanded', 'false');
  mobileNav.classList.remove('open');
  mobileNav.setAttribute('aria-hidden', 'true');
}

function openModal(id) {
  const modalOverlay = document.getElementById(id);
  if (!modalOverlay) return;
  lastFocusedElement = document.activeElement;
  modalOverlay.classList.add('open');
  modalOverlay.setAttribute('aria-hidden', 'false');
  activeModal = modalOverlay;
  const focusable = modalOverlay.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])');
  if (focusable.length) {
    focusable[0].focus();
  }
}

function closeModal(id) {
  const modalOverlay = document.getElementById(id);
  if (!modalOverlay) return;
  modalOverlay.classList.remove('open');
  modalOverlay.setAttribute('aria-hidden', 'true');
  activeModal = null;
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

function trapFocus(event) {
  if (!activeModal) return;
  const focusable = Array.from(activeModal.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'))
    .filter(el => !el.hasAttribute('disabled'));
  if (!focusable.length) return;
  const firstElement = focusable[0];
  const lastElement = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

function onDocumentKeyDown(event) {
  if (event.key === 'Escape' && activeModal) {
    closeModal(activeModal.id);
  }
  if (event.key === 'Tab') {
    trapFocus(event);
  }
}

function onOverlayClick(event) {
  if (event.target === event.currentTarget) {
    closeModal(event.currentTarget.id);
  }
}

function init() {
  setCookieBannerState();

  cookieButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (button.dataset.cookieAction === 'accept') {
        acceptCookies();
      } else {
        rejectCookies();
      }
    });
  });

  burgerButton.addEventListener('click', toggleMobileNav);

  document.querySelectorAll('#mobileNav a').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  openModalButtons.forEach(button => {
    button.addEventListener('click', () => openModal(button.dataset.openModal));
  });

  closeModalButtons.forEach(button => {
    button.addEventListener('click', () => closeModal(button.dataset.closeModal));
  });

  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', onOverlayClick);
  });

  document.addEventListener('keydown', onDocumentKeyDown);

  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.style.transitionDelay = `${index * 0.08}s`;
        observerInstance.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', init);
