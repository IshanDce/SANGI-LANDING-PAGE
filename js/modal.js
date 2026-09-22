/**
 * SANGI - Modal Dialog Handler
 */

document.addEventListener('DOMContentLoaded', () => {
  initModals();
});

function initModals() {
  const modalOverlays = document.querySelectorAll('.modal-overlay');

  // Open modal triggers
  document.querySelectorAll('[data-open-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-open-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        openModal(targetModal);

        // If trigger contains pre-selected service for booking modal
        const presetService = trigger.getAttribute('data-preset-service');
        if (presetService && modalId === 'bookingModal') {
          const serviceSelect = document.getElementById('bookingModalService');
          if (serviceSelect) {
            serviceSelect.value = presetService;
          }
        }
      }
    });
  });

  // Close modal triggers
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const parentModal = btn.closest('.modal-overlay');
      if (parentModal) closeModal(parentModal);
    });
  });

  // Click outside modal dialog to close
  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  // ESC key closes any open modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModalElem = document.querySelector('.modal-overlay.open');
      if (openModalElem) closeModal(openModalElem);
    }
  });

  // Handle Booking Form Submit
  const bookingForm = document.getElementById('quickBookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const modal = document.getElementById('bookingModal');
      if (modal) closeModal(modal);

      const serviceName = document.getElementById('bookingModalService')?.value || 'Service';
      if (window.showToast) {
        window.showToast(`Success! Booking request for ${serviceName} confirmed. A verified SANGI pro will contact you.`);
      }
      bookingForm.reset();
    });
  }
}

function openModal(modal) {
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.remove('open');
  const otherOpen = document.querySelector('.modal-overlay.open');
  if (!otherOpen) {
    document.body.style.overflow = '';
  }
}
