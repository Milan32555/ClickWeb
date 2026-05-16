const cookieBanner = document.getElementById('cookie-banner');
const burgerButton = document.getElementById('burgerButton');
const mobileNav = document.getElementById('mobileNav');
const openModalButtons = document.querySelectorAll('[data-open-modal]');
const closeModalButtons = document.querySelectorAll('[data-close-modal]');
const modalOverlays = document.querySelectorAll('.modal-overlay');
const cookieButtons = document.querySelectorAll('[data-cookie-action]');
let activeModal = null;
let lastFocusedElement = null;

function lockBodyScroll() {
  document.body.style.overflow = 'hidden';
}

function unlockBodyScroll() {
  document.body.style.overflow = '';
}

function setCookieBannerState() {
  const consent = localStorage.getItem('cw_cookie_consent');
  const visible = consent === null;
  cookieBanner.dataset.visible = visible ? 'true' : 'false';
  cookieBanner.setAttribute('aria-hidden', visible ? 'false' : 'true');
}

function acceptCookies() {
  localStorage.setItem('cw_cookie_consent', 'accepted');
  setCookieBannerState();
  if (activeModal) closeModal(activeModal.id);
}

function rejectCookies() {
  localStorage.setItem('cw_cookie_consent', 'rejected');
  setCookieBannerState();
  if (activeModal) closeModal(activeModal.id);
}

function toggleMobileNav() {
  const expanded = burgerButton.getAttribute('aria-expanded') === 'true';
  const opening = !expanded;
  burgerButton.setAttribute('aria-expanded', String(opening));
  mobileNav.classList.toggle('open', opening);
  mobileNav.setAttribute('aria-hidden', String(!opening));
  if (opening) {
    lockBodyScroll();
    const firstLink = mobileNav.querySelector('a, button:not(.mobile-nav-close)');
    if (firstLink) firstLink.focus();
  } else {
    unlockBodyScroll();
  }
}

function closeMobileNav() {
  burgerButton.setAttribute('aria-expanded', 'false');
  mobileNav.classList.remove('open');
  mobileNav.setAttribute('aria-hidden', 'true');
  unlockBodyScroll();
}

function openModal(id) {
  const modalOverlay = document.getElementById(id);
  if (!modalOverlay) return;
  lastFocusedElement = document.activeElement;
  modalOverlay.classList.add('open');
  modalOverlay.setAttribute('aria-hidden', 'false');
  activeModal = modalOverlay;
  lockBodyScroll();
  const focusable = modalOverlay.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])');
  if (focusable.length) focusable[0].focus();
}

function closeModal(id) {
  const modalOverlay = document.getElementById(id);
  if (!modalOverlay) return;
  modalOverlay.classList.remove('open');
  modalOverlay.setAttribute('aria-hidden', 'true');
  activeModal = null;
  if (!mobileNav.classList.contains('open')) {
    unlockBodyScroll();
  }
  if (lastFocusedElement) lastFocusedElement.focus();
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
  if (event.key === 'Escape') {
    if (activeModal) {
      closeModal(activeModal.id);
    } else if (mobileNav.classList.contains('open')) {
      closeMobileNav();
      burgerButton.focus();
    }
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

  const mobileNavClose = document.getElementById('mobileNavClose');
  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeMobileNav);
  }

  mobileNav.addEventListener('click', event => {
    if (event.target === mobileNav) closeMobileNav();
  });

  document.querySelectorAll('#mobileNav a').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileNav();
    });
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
    let i = 0;
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${i * 0.1}s`;
        entry.target.classList.add('visible');
        i++;
        observerInstance.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', init);
