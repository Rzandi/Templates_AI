/**
 * Cart drawer component
 * @module components/cart
 */

import * as store from '../store.js';
import { formatPrice } from '../utils/format.js';

let isOpen = false;
let unsubscribe = null;

/**
 * Show cart drawer
 */
export function showCart() {
  const root = document.getElementById('cart-root');
  const cart = store.get('cart');
  
  isOpen = true;
  
  // Create backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.id = 'cart-backdrop';
  backdrop.style.zIndex = 'var(--z-modal-backdrop)';
  
  // Create drawer
  const drawer = document.createElement('div');
  drawer.className = 'cart-drawer';
  drawer.id = 'cart-drawer';
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-label', 'Shopping cart');
  drawer.setAttribute('data-testid', 'cart-drawer');
  
  drawer.innerHTML = `
    <div class="cart-drawer__header">
      <h2 class="cart-drawer__title" data-testid="text-cart-title">Your Cart</h2>
      <button 
        class="btn btn--icon" 
        aria-label="Close cart"
        data-action="close"
        data-testid="button-cart-close"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    
    <div class="cart-drawer__body" id="cart-items">
      ${renderCartItems(cart)}
    </div>
    
    ${cart.items.length > 0 ? `
      <div class="cart-drawer__footer">
        <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-4);">
          <span style="font-weight: 600; font-size: 1.125rem;">Total:</span>
          <span style="font-weight: 700; font-size: 1.25rem; color: var(--accent);" data-testid="text-cart-total">
            ${formatPrice(cart.total)}
          </span>
        </div>
        <a 
          href="#/checkout" 
          class="btn btn--primary" 
          style="width: 100%;"
          data-testid="button-checkout"
        >
          Proceed to Checkout
        </a>
      </div>
    ` : ''}
  `;
  
  root.innerHTML = '';
  root.appendChild(backdrop);
  root.appendChild(drawer);
  
  // Event listeners
  backdrop.addEventListener('click', hideCart);
  drawer.addEventListener('click', handleCartAction);
  
  // Subscribe to cart updates
  unsubscribe = store.subscribe('cart', updateCartDisplay);
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
}

/**
 * Hide cart drawer
 */
export function hideCart() {
  if (!isOpen) return;
  
  const root = document.getElementById('cart-root');
  root.innerHTML = '';
  isOpen = false;
  
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
  
  // Restore body scroll
  document.body.style.overflow = '';
}

/**
 * Render cart items
 * @param {Object} cart - Cart data
 * @returns {string} HTML string
 */
function renderCartItems(cart) {
  if (cart.items.length === 0) {
    return `
      <div class="cart-drawer__empty">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <p data-testid="text-cart-empty">Your cart is empty</p>
        <a href="#/products" class="btn btn--primary" data-testid="link-shop-now">
          Shop Now
        </a>
      </div>
    `;
  }
  
  return cart.items.map(item => `
    <div class="cart-item" data-testid="cart-item-${item.id}">
      <img 
        src="${item.image}" 
        alt="${item.name}"
        class="cart-item__image"
        data-testid="img-cart-item-${item.id}"
      />
      <div class="cart-item__details">
        <div class="cart-item__name" data-testid="text-cart-item-name-${item.id}">
          ${item.name}
        </div>
        <div class="cart-item__price" data-testid="text-cart-item-price-${item.id}">
          ${formatPrice(item.price)}
        </div>
        <div class="cart-item__quantity">
          <button 
            class="cart-item__qty-btn" 
            data-action="decrease"
            data-id="${item.id}"
            aria-label="Decrease quantity"
            data-testid="button-decrease-${item.id}"
          >
            -
          </button>
          <span class="cart-item__qty-value" data-testid="text-quantity-${item.id}">
            ${item.quantity}
          </span>
          <button 
            class="cart-item__qty-btn" 
            data-action="increase"
            data-id="${item.id}"
            aria-label="Increase quantity"
            data-testid="button-increase-${item.id}"
          >
            +
          </button>
        </div>
      </div>
      <button 
        class="cart-item__remove" 
        data-action="remove"
        data-id="${item.id}"
        aria-label="Remove item"
        data-testid="button-remove-${item.id}"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    </div>
  `).join('');
}

/**
 * Handle cart actions
 * @param {Event} e - Click event
 */
function handleCartAction(e) {
  const button = e.target.closest('[data-action]');
  if (!button) return;
  
  const action = button.dataset.action;
  const id = button.dataset.id;
  
  switch (action) {
    case 'close':
      hideCart();
      break;
    case 'increase':
      {
        const cart = store.get('cart');
        const item = cart.items.find(i => i.id === id);
        if (item) {
          store.updateCartQuantity(id, item.quantity + 1);
        }
      }
      break;
    case 'decrease':
      {
        const cart = store.get('cart');
        const item = cart.items.find(i => i.id === id);
        if (item) {
          store.updateCartQuantity(id, item.quantity - 1);
        }
      }
      break;
    case 'remove':
      store.removeFromCart(id);
      break;
  }
}

/**
 * Update cart display
 */
function updateCartDisplay() {
  const itemsContainer = document.getElementById('cart-items');
  if (!itemsContainer) return;
  
  const cart = store.get('cart');
  const drawer = document.getElementById('cart-drawer');
  
  // Update items
  itemsContainer.innerHTML = renderCartItems(cart);
  
  // Update footer
  const footer = drawer.querySelector('.cart-drawer__footer');
  if (cart.items.length > 0) {
    if (!footer) {
      drawer.insertAdjacentHTML('beforeend', `
        <div class="cart-drawer__footer">
          <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-4);">
            <span style="font-weight: 600; font-size: 1.125rem;">Total:</span>
            <span style="font-weight: 700; font-size: 1.25rem; color: var(--accent);" data-testid="text-cart-total">
              ${formatPrice(cart.total)}
            </span>
          </div>
          <a 
            href="#/checkout" 
            class="btn btn--primary" 
            style="width: 100%;"
            data-testid="button-checkout"
          >
            Proceed to Checkout
          </a>
        </div>
      `);
    } else {
      const totalEl = footer.querySelector('[data-testid="text-cart-total"]');
      if (totalEl) {
        totalEl.textContent = formatPrice(cart.total);
      }
    }
  } else if (footer) {
    footer.remove();
  }
}
