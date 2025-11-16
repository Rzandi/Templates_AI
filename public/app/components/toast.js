/**
 * Toast notification component
 * @module components/toast
 */

const TOAST_DURATION = 4000;
let toastCounter = 0;

/**
 * Show toast notification
 * @param {string} message - Toast message
 * @param {string} type - Toast type: 'success', 'error', 'info'
 */
export function showToast(message, type = 'info') {
  const root = document.getElementById('toast-root');
  
  // Ensure toast container exists
  let container = root.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    root.appendChild(container);
  }
  
  const toastId = `toast-${++toastCounter}`;
  const icon = getIcon(type);
  
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.id = toastId;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');
  toast.setAttribute('data-testid', `toast-${type}`);
  
  toast.innerHTML = `
    <div class="toast__icon">
      ${icon}
    </div>
    <div class="toast__content">
      <p class="toast__message" data-testid="text-toast-message">${message}</p>
    </div>
    <button 
      class="toast__close" 
      aria-label="Close notification"
      data-testid="button-toast-close"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  `;
  
  // Add to container
  container.appendChild(toast);
  
  // Close button
  const closeBtn = toast.querySelector('.toast__close');
  closeBtn.addEventListener('click', () => removeToast(toastId));
  
  // Auto dismiss
  setTimeout(() => removeToast(toastId), TOAST_DURATION);
}

/**
 * Remove toast
 * @param {string} toastId - Toast ID
 */
function removeToast(toastId) {
  const toast = document.getElementById(toastId);
  if (toast) {
    toast.style.animation = 'toastSlideIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }
}

/**
 * Get icon for toast type
 * @param {string} type - Toast type
 * @returns {string} SVG icon
 */
function getIcon(type) {
  switch (type) {
    case 'success':
      return `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      `;
    case 'error':
      return `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--error)" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      `;
    default:
      return `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--info)" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      `;
  }
}
