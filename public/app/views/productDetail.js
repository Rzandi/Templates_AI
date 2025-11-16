/**
 * Product detail view
 * @module views/productDetail
 */

import { getProduct } from '../api/products.js';
import { formatPrice } from '../utils/format.js';
import * as store from '../store.js';
import { showToast } from '../components/toast.js';

/**
 * Render product detail view
 * @param {Object} params - Route parameters
 * @param {string} params.id - Product ID
 */
export async function render(params) {
  const root = document.getElementById('view-root');
  
  // Show loading
  root.innerHTML = `
    <div class="loading-screen">
      <div class="spinner"></div>
      <p>Loading product...</p>
    </div>
  `;
  
  try {
    const product = await getProduct(params.id);
    
    if (!product) {
      showNotFound();
      return;
    }
    
    root.innerHTML = `
      <div class="fade-in">
        <section class="section">
          <div class="container">
            <!-- Back Button -->
            <a href="#/products" class="btn btn--outline" style="margin-bottom: var(--spacing-8);" data-testid="link-back">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Back to Products
            </a>
            
            <!-- Product Detail -->
            <div style="display: grid; grid-template-columns: 1fr; gap: var(--spacing-12); align-items: start;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-12); align-items: start;">
                <!-- Product Image -->
                <div>
                  <img 
                    src="${product.image}" 
                    alt="${product.name}"
                    style="width: 100%; border-radius: var(--radius-lg); box-shadow: var(--shadow-lg);"
                    data-testid="img-product-detail"
                  />
                </div>
                
                <!-- Product Info -->
                <div>
                  <h1 style="margin-bottom: var(--spacing-4);" data-testid="text-product-name">
                    ${product.name}
                  </h1>
                  
                  <div style="font-size: 2rem; font-weight: 700; color: var(--accent); margin-bottom: var(--spacing-6);" data-testid="text-product-price">
                    ${formatPrice(product.price)}
                  </div>
                  
                  ${product.category ? `
                    <div style="margin-bottom: var(--spacing-6);">
                      <span class="badge badge--info" data-testid="badge-category">${product.category}</span>
                    </div>
                  ` : ''}
                  
                  <p style="color: var(--text-secondary); font-size: 1.125rem; line-height: 1.6; margin-bottom: var(--spacing-8);" data-testid="text-product-description">
                    ${product.description || 'No description available.'}
                  </p>
                  
                  <!-- Quantity Selector -->
                  <div style="margin-bottom: var(--spacing-6);">
                    <label class="form-label">Quantity</label>
                    <div style="display: flex; align-items: center; gap: var(--spacing-3); max-width: 200px;">
                      <button 
                        class="btn btn--outline btn--icon" 
                        id="qty-decrease"
                        aria-label="Decrease quantity"
                        data-testid="button-qty-decrease"
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        id="qty-input"
                        class="form-input" 
                        value="1" 
                        min="1" 
                        max="99"
                        style="text-align: center;"
                        aria-label="Quantity"
                        data-testid="input-quantity"
                      />
                      <button 
                        class="btn btn--outline btn--icon" 
                        id="qty-increase"
                        aria-label="Increase quantity"
                        data-testid="button-qty-increase"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <!-- Add to Cart Button -->
                  <button 
                    class="btn btn--primary btn--lg" 
                    id="add-to-cart-btn"
                    style="width: 100%;"
                    data-testid="button-add-cart"
                  >
                    Add to Cart
                  </button>
                  
                  <!-- Product Features -->
                  <div style="margin-top: var(--spacing-8); padding-top: var(--spacing-8); border-top: 1px solid var(--border);">
                    <div style="display: flex; gap: var(--spacing-6); flex-wrap: wrap;">
                      <div style="flex: 1; min-width: 150px;">
                        <div style="display: flex; gap: var(--spacing-2); align-items: center; margin-bottom: var(--spacing-2);">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2">
                            <path d="M20 7h-9"></path>
                            <path d="M14 17H5"></path>
                            <circle cx="17" cy="17" r="3"></circle>
                            <circle cx="7" cy="7" r="3"></circle>
                          </svg>
                          <span style="font-weight: 500;">Free Shipping</span>
                        </div>
                        <p style="color: var(--text-secondary); font-size: 0.875rem;">On orders over $50</p>
                      </div>
                      
                      <div style="flex: 1; min-width: 150px;">
                        <div style="display: flex; gap: var(--spacing-2); align-items: center; margin-bottom: var(--spacing-2);">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          <span style="font-weight: 500;">Easy Returns</span>
                        </div>
                        <p style="color: var(--text-secondary); font-size: 0.875rem;">30-day return policy</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;
    
    // Add event listeners
    setupEventListeners(product);
  } catch (error) {
    console.error('Error loading product:', error);
    showError();
  }
}

/**
 * Setup event listeners
 * @param {Object} product - Product data
 */
function setupEventListeners(product) {
  const qtyInput = document.getElementById('qty-input');
  const qtyDecrease = document.getElementById('qty-decrease');
  const qtyIncrease = document.getElementById('qty-increase');
  const addToCartBtn = document.getElementById('add-to-cart-btn');
  
  qtyDecrease.addEventListener('click', () => {
    const currentValue = parseInt(qtyInput.value);
    if (currentValue > 1) {
      qtyInput.value = currentValue - 1;
    }
  });
  
  qtyIncrease.addEventListener('click', () => {
    const currentValue = parseInt(qtyInput.value);
    if (currentValue < 99) {
      qtyInput.value = currentValue + 1;
    }
  });
  
  addToCartBtn.addEventListener('click', () => {
    const quantity = parseInt(qtyInput.value);
    store.addToCart(product, quantity);
    showToast(`${quantity} ${quantity === 1 ? 'item' : 'items'} added to cart`, 'success');
  });
}

/**
 * Show not found
 */
function showNotFound() {
  const root = document.getElementById('view-root');
  root.innerHTML = `
    <div class="container section">
      <div style="text-align: center; padding: 4rem 0;">
        <h1 style="font-size: 3rem; margin-bottom: 1rem;">Product Not Found</h1>
        <p style="font-size: 1.25rem; color: var(--text-secondary); margin-bottom: 2rem;">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <a href="#/products" class="btn btn--primary">
          Browse Products
        </a>
      </div>
    </div>
  `;
}

/**
 * Show error
 */
function showError() {
  const root = document.getElementById('view-root');
  root.innerHTML = `
    <div class="container section">
      <div style="text-align: center; padding: 4rem 0;">
        <h1 style="font-size: 3rem; margin-bottom: 1rem; color: var(--error);">Error</h1>
        <p style="font-size: 1.25rem; color: var(--text-secondary); margin-bottom: 2rem;">
          Failed to load product. Please try again later.
        </p>
        <a href="#/products" class="btn btn--primary">
          Browse Products
        </a>
      </div>
    </div>
  `;
}

/**
 * Cleanup function
 */
export function cleanup() {
  // No cleanup needed
}
