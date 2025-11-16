/**
 * Main application bootstrap
 * 
 * Hash-based Router System:
 * ---------------------------
 * This SPA uses hash-based routing (#/path) for client-side navigation.
 * Hash changes trigger the router to load the appropriate view module.
 * 
 * Routes are registered in the format:
 *   router.register(path, () => import('./views/moduleName.js'))
 * 
 * Dynamic routes support parameters:
 *   router.register('/products/:id', ...) matches #/products/123
 *   The :id parameter is passed to the view's render function
 * 
 * To extend with new routes:
 * 1. Create a new view module in app/views/
 * 2. Export a render(params) function from the view
 * 3. Register the route below using router.register()
 * 4. Navigate using window.location.hash = '#/your-path'
 * 
 * @module main
 */

import * as router from './router.js';
import * as header from './components/header.js';
import * as footer from './components/footer.js';

/**
 * Initialize application
 */
async function init() {
  console.log('%c🚀 Application Starting', 'color: #3b82f6; font-size: 16px; font-weight: bold;');
  
  // Render persistent components
  header.render();
  footer.render();
  
  // Register routes
  registerRoutes();
  
  // Start router
  router.start();
  
  // Re-render header on hash change (for active nav links)
  window.addEventListener('hashchange', () => {
    header.render();
  });
  
  console.log('%c✅ Application Ready', 'color: #10b981; font-size: 16px; font-weight: bold;');
}

/**
 * Register all application routes
 */
function registerRoutes() {
  // Home
  router.register('/', () => import('./views/home.js'));
  
  // Products
  router.register('/products', () => import('./views/products.js'));
  router.register('/products/:id', () => import('./views/productDetail.js'));
  
  // Checkout
  router.register('/checkout', () => import('./views/checkout.js'));
  
  // Invoices
  router.register('/invoices', () => import('./views/invoices.js'));
  router.register('/invoices/:id', () => import('./views/invoiceViewer.js'));
  
  console.log('📍 Routes registered:', [
    '/',
    '/products',
    '/products/:id',
    '/checkout',
    '/invoices',
    '/invoices/:id'
  ]);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Handle global errors
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});
