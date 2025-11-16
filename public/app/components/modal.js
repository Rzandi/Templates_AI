/**
 * Modal component
 * @module components/modal
 */

let currentModal = null;

/**
 * Show modal
 * @param {Object} options - Modal options
 * @param {string} options.title - Modal title
 * @param {string} options.content - Modal content HTML
 * @param {Array} options.actions - Array of action buttons
 * @param {Function} options.onClose - Callback when modal closes
 */
export function showModal({ title, content, actions = [], onClose }) {
  const root = document.getElementById('modal-root');
  
  // Close existing modal
  if (currentModal) {
    closeModal();
  }
  
  const modalId = `modal-${Date.now()}`;
  
  root.innerHTML = `
    <div class="modal-backdrop" id="${modalId}" data-testid="modal-backdrop">
      <div class="modal" role="dialog" aria-labelledby="modal-title" aria-modal="true">
        <div class="modal__header">
          <h2 class="modal__title" id="modal-title" data-testid="text-modal-title">
            ${title}
          </h2>
          <button 
            class="modal__close" 
            aria-label="Close modal"
            data-action="close"
            data-testid="button-modal-close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal__body" data-testid="modal-body">
          ${content}
        </div>
        ${actions.length > 0 ? `
          <div class="modal__footer">
            ${actions.map((action, index) => `
              <button 
                class="btn ${action.primary ? 'btn--primary' : 'btn--secondary'}"
                data-action="${action.action || 'custom-' + index}"
                data-testid="button-${action.action || 'custom-' + index}"
              >
                ${action.label}
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </div>
  `;
  
  const backdrop = document.getElementById(modalId);
  currentModal = { element: backdrop, onClose };
  
  // Event listeners
  backdrop.addEventListener('click', (e) => {
    // Close on backdrop click
    if (e.target === backdrop) {
      closeModal();
    }
    
    // Close button
    if (e.target.closest('[data-action="close"]')) {
      closeModal();
    }
    
    // Custom actions
    const actionBtn = e.target.closest('[data-action]');
    if (actionBtn && actionBtn.dataset.action.startsWith('custom-')) {
      const index = parseInt(actionBtn.dataset.action.split('-')[1]);
      if (actions[index] && actions[index].handler) {
        actions[index].handler();
      }
    }
  });
  
  // Close on Escape key
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
  
  // Focus first focusable element
  setTimeout(() => {
    const firstFocusable = backdrop.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
      firstFocusable.focus();
    }
  }, 100);
}

/**
 * Close modal
 */
export function closeModal() {
  if (currentModal) {
    if (currentModal.onClose) {
      currentModal.onClose();
    }
    currentModal.element.remove();
    currentModal = null;
  }
}
