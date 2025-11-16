/**
 * Global state management with pub/sub pattern
 * Manages: auth, cart, theme
 * @module store
 */

import { storage } from './utils/storage.js';

// Storage keys
const CART_KEY = 'ff_cart_v1';
const THEME_KEY = 'ff_theme_v1';
const AUTH_KEY = 'ff_auth_v1';

// State
const state = {
  auth: storage.get(AUTH_KEY, { token: null, user: null }),
  cart: storage.get(CART_KEY, { items: [], total: 0 }),
  theme: storage.get(THEME_KEY, 'light')
};

// Subscribers
const subscribers = {
  auth: [],
  cart: [],
  theme: []
};

/**
 * Subscribe to state changes
 * @param {string} key - State key to subscribe to
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
export function subscribe(key, callback) {
  if (!subscribers[key]) {
    console.warn(`Unknown state key: ${key}`);
    return () => {};
  }
  
  subscribers[key].push(callback);
  
  // Return unsubscribe function
  return () => {
    const index = subscribers[key].indexOf(callback);
    if (index > -1) {
      subscribers[key].splice(index, 1);
    }
  };
}

/**
 * Get current state value
 * @param {string} key - State key
 * @returns {*} State value
 */
export function get(key) {
  return state[key];
}

/**
 * Set state value and notify subscribers
 * @param {string} key - State key
 * @param {*} value - New value
 */
export function set(key, value) {
  state[key] = value;
  
  // Persist to localStorage
  if (key === 'cart') {
    storage.set(CART_KEY, value);
  } else if (key === 'theme') {
    storage.set(THEME_KEY, value);
    applyTheme(value);
  } else if (key === 'auth') {
    storage.set(AUTH_KEY, value);
  }
  
  // Notify subscribers
  if (subscribers[key]) {
    subscribers[key].forEach(callback => callback(value));
  }
}

/**
 * Apply theme to document
 * @param {string} theme - 'light' or 'dark'
 */
function applyTheme(theme) {
  // Add transitioning class to prevent animations during theme change
  document.body.classList.add('theme-transitioning');
  
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
  
  // Remove transitioning class after a brief delay
  setTimeout(() => {
    document.body.classList.remove('theme-transitioning');
  }, 50);
}

/**
 * Toggle theme
 */
export function toggleTheme() {
  const currentTheme = get('theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  set('theme', newTheme);
}

/**
 * Add item to cart
 * @param {Object} product - Product to add
 * @param {number} quantity - Quantity to add
 */
export function addToCart(product, quantity = 1) {
  const cart = get('cart');
  const existingItem = cart.items.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity
    });
  }
  
  calculateCartTotal(cart);
  set('cart', cart);
}

/**
 * Update cart item quantity
 * @param {string} productId - Product ID
 * @param {number} quantity - New quantity
 */
export function updateCartQuantity(productId, quantity) {
  const cart = get('cart');
  const item = cart.items.find(item => item.id === productId);
  
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = quantity;
      calculateCartTotal(cart);
      set('cart', cart);
    }
  }
}

/**
 * Remove item from cart
 * @param {string} productId - Product ID
 */
export function removeFromCart(productId) {
  const cart = get('cart');
  cart.items = cart.items.filter(item => item.id !== productId);
  calculateCartTotal(cart);
  set('cart', cart);
}

/**
 * Clear cart
 */
export function clearCart() {
  set('cart', { items: [], total: 0 });
}

/**
 * Calculate cart total
 * @param {Object} cart - Cart object
 */
function calculateCartTotal(cart) {
  cart.total = cart.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
}

/**
 * Get cart item count
 * @returns {number} Total items in cart
 */
export function getCartCount() {
  const cart = get('cart');
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Set auth token
 * @param {string} token - Auth token
 * @param {Object} user - User object
 */
export function setAuth(token, user) {
  set('auth', { token, user });
}

/**
 * Clear auth
 */
export function clearAuth() {
  set('auth', { token: null, user: null });
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated
 */
export function isAuthenticated() {
  const auth = get('auth');
  return !!auth.token;
}

// Initialize theme on load
applyTheme(state.theme);
