/**
 * Header component with navigation, search, cart, and theme toggle
 * @module components/header
 */

import * as store from '../store.js';
import { showCart } from './cart.js';

let unsubscribers = [];

/**
 * Render header
 */
export function render() {
  const root = document.getElementById('header-root');
  const currentPath = window.location.hash.slice(1) || '/';
  const cartCount = store.getCartCount();
  const theme = store.get('theme');
  
  root.innerHTML = `
    <header class="header" role="banner">
      <div class="header__container">
        <!-- Logo -->
        <a href="#/" class="header__logo" data-testid="link-logo">
          Premium
        </a>
        
        <!-- Navigation -->
        <nav class="header__nav" role="navigation" aria-label="Main navigation">
          <a 
            href="#/" 
            class="header__nav-link ${currentPath === '/' ? 'active' : ''}"
            data-testid="link-home"
          >
            Home
          </a>
          <a 
            href="#/products" 
            class="header__nav-link ${currentPath.startsWith('/products') ? 'active' : ''}"
            data-testid="link-products"
          >
            Products
          </a>
          <a 
            href="#/invoices" 
            class="header__nav-link ${currentPath.startsWith('/invoices') ? 'active' : ''}"
            data-testid="link-invoices"
          >
            Invoices
          </a>
        </nav>
        
        <!-- Actions -->
        <div class="header__actions">
          <!-- Theme Toggle -->
          <button 
            class="theme-toggle" 
            aria-label="Toggle theme"
            data-testid="button-theme-toggle"
            id="theme-toggle-btn"
          >
            ${theme === 'dark' ? getSunIcon() : getMoonIcon()}
          </button>
          
          <!-- Cart Button -->
          <button 
            class="header__cart-btn btn btn--icon btn--outline" 
            aria-label="Shopping cart"
            data-testid="button-cart"
            id="cart-btn"
          >
            ${getCartIcon()}
            ${cartCount > 0 ? `
              <span class="header__cart-badge" data-testid="text-cart-count">
                ${cartCount}
              </span>
            ` : ''}
          </button>
        </div>
      </div>
    </header>
  `;
  
  // Add event listeners
  const themeToggle = document.getElementById('theme-toggle-btn');
  const cartBtn = document.getElementById('cart-btn');
  
  themeToggle.addEventListener('click', handleThemeToggle);
  cartBtn.addEventListener('click', handleCartClick);
  
  // Subscribe to store updates
  unsubscribers.push(
    store.subscribe('cart', updateCartBadge),
    store.subscribe('theme', updateThemeIcon)
  );
}

/**
 * Handle theme toggle click
 */
function handleThemeToggle() {
  store.toggleTheme();
}

/**
 * Handle cart button click
 */
function handleCartClick() {
  showCart();
}

/**
 * Update cart badge
 */
function updateCartBadge() {
  const cartBtn = document.getElementById('cart-btn');
  if (!cartBtn) return;
  
  const cartCount = store.getCartCount();
  const existingBadge = cartBtn.querySelector('.header__cart-badge');
  
  if (cartCount > 0) {
    if (existingBadge) {
      existingBadge.textContent = cartCount;
      existingBadge.setAttribute('data-testid', 'text-cart-count');
      // Trigger pulse animation
      existingBadge.style.animation = 'none';
      setTimeout(() => {
        existingBadge.style.animation = '';
      }, 10);
    } else {
      cartBtn.insertAdjacentHTML('beforeend', `
        <span class="header__cart-badge" data-testid="text-cart-count">
          ${cartCount}
        </span>
      `);
    }
  } else if (existingBadge) {
    existingBadge.remove();
  }
}

/**
 * Update theme icon
 */
function updateThemeIcon() {
  const themeToggle = document.getElementById('theme-toggle-btn');
  if (!themeToggle) return;
  
  const theme = store.get('theme');
  themeToggle.innerHTML = theme === 'dark' ? getSunIcon() : getMoonIcon();
}

/**
 * Cleanup function
 */
export function cleanup() {
  unsubscribers.forEach(unsub => unsub());
  unsubscribers = [];
}

/**
 * SVG Icons
 */
function getCartIcon() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
  `;
}

function getMoonIcon() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  `;
}

function getSunIcon() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  `;
}
