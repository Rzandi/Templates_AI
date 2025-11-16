/**
 * Hash-based router for SPA navigation
 * Handles routes like #/, #/products, #/products/:id, etc.
 * 
 * Usage:
 *   router.register('/', homeView);
 *   router.register('/products', productsView);
 *   router.register('/products/:id', productDetailView);
 *   router.start();
 * 
 * To navigate: window.location.hash = '#/products'
 * Or use: router.navigate('/products')
 * 
 * @module router
 */

const routes = [];
let currentView = null;

/**
 * Register a route
 * @param {string} path - Route path (can include :params)
 * @param {Function} handler - Async function that returns view module
 */
export function register(path, handler) {
  // Convert path to regex pattern
  const paramNames = [];
  const pattern = path
    .replace(/\//g, '\\/')
    .replace(/:(\w+)/g, (match, paramName) => {
      paramNames.push(paramName);
      return '([^/]+)';
    });
  
  routes.push({
    path,
    pattern: new RegExp(`^${pattern}$`),
    paramNames,
    handler
  });
}

/**
 * Navigate to a route
 * @param {string} path - Path to navigate to
 */
export function navigate(path) {
  window.location.hash = `#${path}`;
}

/**
 * Get current route path
 * @returns {string} Current path without #
 */
export function getCurrentPath() {
  return window.location.hash.slice(1) || '/';
}

/**
 * Match current hash to registered route
 * @returns {Object|null} Matched route with params
 */
function matchRoute() {
  const path = getCurrentPath();
  
  for (const route of routes) {
    const match = path.match(route.pattern);
    if (match) {
      const params = {};
      route.paramNames.forEach((name, index) => {
        params[name] = match[index + 1];
      });
      return { route, params };
    }
  }
  
  return null;
}

/**
 * Load and render view
 */
async function loadView() {
  const match = matchRoute();
  
  if (!match) {
    // 404 - load not found view
    console.warn('Route not found:', getCurrentPath());
    render404();
    return;
  }
  
  try {
    // Clean up current view if it has cleanup method
    if (currentView && typeof currentView.cleanup === 'function') {
      currentView.cleanup();
    }
    
    // Load view module
    const viewModule = await match.route.handler();
    currentView = viewModule;
    
    // Render view
    if (typeof viewModule.render === 'function') {
      await viewModule.render(match.params);
    } else {
      console.error('View module must export a render function');
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
  } catch (error) {
    console.error('Error loading view:', error);
    renderError(error);
  }
}

/**
 * Render 404 page
 */
function render404() {
  const root = document.getElementById('view-root');
  root.innerHTML = `
    <div class="container section">
      <div style="text-align: center; padding: 4rem 0;">
        <h1 style="font-size: 4rem; margin-bottom: 1rem;">404</h1>
        <p style="font-size: 1.5rem; color: var(--text-secondary); margin-bottom: 2rem;">
          Page not found
        </p>
        <button class="btn btn--primary" onclick="window.location.hash = '#/'">
          Go Home
        </button>
      </div>
    </div>
  `;
}

/**
 * Render error page
 * @param {Error} error - Error object
 */
function renderError(error) {
  const root = document.getElementById('view-root');
  root.innerHTML = `
    <div class="container section">
      <div style="text-align: center; padding: 4rem 0;">
        <h1 style="font-size: 3rem; margin-bottom: 1rem; color: var(--error);">
          Oops!
        </h1>
        <p style="font-size: 1.25rem; color: var(--text-secondary); margin-bottom: 2rem;">
          ${error.message || 'Something went wrong'}
        </p>
        <button class="btn btn--primary" onclick="window.location.hash = '#/'">
          Go Home
        </button>
      </div>
    </div>
  `;
}

/**
 * Start router - listen to hash changes
 */
export function start() {
  // Listen to hash changes
  window.addEventListener('hashchange', loadView);
  
  // Load initial route
  loadView();
}
