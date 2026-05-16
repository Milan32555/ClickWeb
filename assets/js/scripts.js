const cookieBanner = document.getElementById('cookie-banner');
const burgerButton = document.getElementById('burgerButton');
const mobileNav = document.getElementById('mobileNav');
const openModalButtons = document.querySelectorAll('[data-open-modal]');
const closeModalButtons = document.querySelectorAll('[data-close-modal]');
const modalOverlays = document.querySelectorAll('.modal-overlay');
const cookieButtons = document.querySelectorAll('[data-cookie-action]');
let activeModal = null;
let lastFocusedElement = null;
const modalStack = []; // soporte para modales anidados

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

function closeAllModals() {
  modalStack.forEach(item => {
    item.modal.classList.remove('open');
    item.modal.setAttribute('aria-hidden', 'true');
  });
  modalStack.length = 0;
  if (activeModal) {
    activeModal.classList.remove('open');
    activeModal.setAttribute('aria-hidden', 'true');
    activeModal = null;
  }
  if (!mobileNav.classList.contains('open')) unlockBodyScroll();
  if (lastFocusedElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
}

function acceptCookies() {
  localStorage.setItem('cw_cookie_consent', 'accepted');
  setCookieBannerState();
  closeAllModals();
}

function rejectCookies() {
  localStorage.setItem('cw_cookie_consent', 'rejected');
  setCookieBannerState();
  closeAllModals();
}

function toggleMobileNav() {
  const expanded = burgerButton.getAttribute('aria-expanded') === 'true';
  const opening = !expanded;
  burgerButton.setAttribute('aria-expanded', String(opening));
  mobileNav.classList.toggle('open', opening);
  mobileNav.setAttribute('aria-hidden', String(!opening));
  if (opening) {
    lockBodyScroll();
    const firstLink = mobileNav.querySelector('a:not(.mobile-nav-cta)');
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

  if (activeModal) {
    // Modal anidado: oculta el actual y empuja al stack
    modalStack.push({ modal: activeModal, focused: document.activeElement });
    activeModal.classList.remove('open');
    activeModal.setAttribute('aria-hidden', 'true');
  } else {
    lastFocusedElement = document.activeElement;
    lockBodyScroll();
  }

  modalOverlay.classList.add('open');
  modalOverlay.setAttribute('aria-hidden', 'false');
  activeModal = modalOverlay;

  const focusable = modalOverlay.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])');
  if (focusable.length) focusable[0].focus();
}

function closeModal(id) {
  const modalOverlay = document.getElementById(id);
  if (!modalOverlay) return;
  modalOverlay.classList.remove('open');
  modalOverlay.setAttribute('aria-hidden', 'true');

  if (modalStack.length > 0) {
    // Restaura el modal anterior del stack
    const prev = modalStack.pop();
    activeModal = prev.modal;
    activeModal.classList.add('open');
    activeModal.setAttribute('aria-hidden', 'false');
    if (prev.focused) prev.focused.focus();
  } else {
    activeModal = null;
    if (!mobileNav.classList.contains('open')) unlockBodyScroll();
    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  }
}

function trapFocus(event) {
  if (!activeModal) return;
  const focusable = Array.from(activeModal.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'))
    .filter(el => !el.hasAttribute('disabled'));
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
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
  if (event.key === 'Tab') trapFocus(event);
}

function onOverlayClick(event) {
  if (event.target === event.currentTarget) closeModal(event.currentTarget.id);
}

function init() {
  setCookieBannerState();

  cookieButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (button.dataset.cookieAction === 'accept') acceptCookies();
      else rejectCookies();
    });
  });

  burgerButton.addEventListener('click', toggleMobileNav);

  const mobileNavClose = document.getElementById('mobileNavClose');
  if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);

  mobileNav.addEventListener('click', event => {
    if (event.target === mobileNav) closeMobileNav();
  });

  // Cierra el nav al hacer clic en cualquier enlace (incluyendo .mobile-nav-cta)
  document.querySelectorAll('#mobileNav a').forEach(link => {
    link.addEventListener('click', () => closeMobileNav());
  });

  openModalButtons.forEach(button => {
    button.addEventListener('click', () => openModal(button.dataset.openModal));
  });

  closeModalButtons.forEach(button => {
    button.addEventListener('click', () => closeModal(button.dataset.closeModal));
  });

  modalOverlays.forEach(overlay => overlay.addEventListener('click', onOverlayClick));

  document.addEventListener('keydown', onDocumentKeyDown);

  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries, observerInstance) => {
    let i = 0;
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.transitionDelay = `${i * 0.1}s`;
        el.classList.add('visible');
        el.addEventListener('transitionend', () => { el.style.transitionDelay = ''; }, { once: true });
        i++;
        observerInstance.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', init);
