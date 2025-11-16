/**
 * Product card component
 * @module components/productCard
 */

import { formatPrice } from '../utils/format.js';
import * as store from '../store.js';
import { showToast } from './toast.js';

/**
 * Create product card element
 * @param {Object} product - Product data
 * @returns {string} HTML string
 */
export function create(product) {
  return `
    <article class="product-card" data-product-id="${product.id}" data-testid="card-product-${product.id}">
      <div class="product-card__image-container">
        <img 
          src="${product.image}" 
          alt="${product.name}"
          class="product-card__image"
          loading="lazy"
          data-testid="img-product-${product.id}"
        />
      </div>
      <div class="product-card__content">
        <h3 class="product-card__name" data-testid="text-product-name-${product.id}">
          ${product.name}
        </h3>
        <p class="product-card__price" data-testid="text-product-price-${product.id}">
          ${formatPrice(product.price)}
        </p>
        <button 
          class="btn btn--primary product-card__add-btn" 
          data-action="add-to-cart"
          data-product='${JSON.stringify(product)}'
          data-testid="button-add-cart-${product.id}"
        >
          Add to Cart
        </button>
      </div>
    </article>
  `;
}

/**
 * Attach event listeners to product cards
 * @param {HTMLElement} container - Container element
 */
export function attachListeners(container) {
  // Add to cart buttons
  container.addEventListener('click', (e) => {
    const button = e.target.closest('[data-action="add-to-cart"]');
    if (button) {
      const product = JSON.parse(button.dataset.product);
      handleAddToCart(product);
    }
    
    // Product card click (navigate to detail)
    const card = e.target.closest('.product-card');
    if (card && !e.target.closest('button')) {
      const productId = card.dataset.productId;
      window.location.hash = `#/products/${productId}`;
    }
  });
}

/**
 * Handle add to cart
 * @param {Object} product - Product data
 */
function handleAddToCart(product) {
  store.addToCart(product, 1);
  showToast(`${product.name} added to cart`, 'success');
}
