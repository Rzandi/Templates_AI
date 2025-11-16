/**
 * Home view - Hero section with marketing content
 * @module views/home
 */

import { getProducts } from '../api/products.js';
import * as productCard from '../components/productCard.js';

/**
 * Render home view
 */
export async function render() {
  const root = document.getElementById('view-root');
  
  root.innerHTML = `
    <div class="fade-in">
      <!-- Hero Section -->
      <section class="hero">
        <div class="container">
          <div class="hero__content">
            <!-- Text Content -->
            <div class="hero__text">
              <h1 data-testid="text-hero-title" style="animation: fadeIn 0.6s ease-out;">
                Premium Products, Seamless Experience
              </h1>
              <p style="font-size: 1.25rem; color: var(--text-secondary); margin-bottom: var(--spacing-8); animation: fadeIn 0.6s ease-out 0.1s both;">
                Discover our curated collection of high-quality products. 
                Fast shipping, secure checkout, and exceptional customer service.
              </p>
              <div style="display: flex; gap: var(--spacing-4); flex-wrap: wrap; animation: fadeIn 0.6s ease-out 0.2s both;">
                <a href="#/products" class="btn btn--primary btn--lg" data-testid="button-shop-now">
                  Shop Now
                </a>
                <a href="#/products" class="btn btn--outline btn--lg" data-testid="link-view-collection">
                  View Collection
                </a>
              </div>
            </div>
            
            <!-- Hero Image -->
            <div class="hero__image" style="animation: fadeIn 0.8s ease-out 0.3s both;">
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop" 
                alt="Featured products"
                style="width: 100%; height: auto; border-radius: var(--radius-lg); box-shadow: var(--shadow-xl);"
                data-testid="img-hero"
              />
            </div>
          </div>
        </div>
      </section>
      
      <!-- Featured Products -->
      <section class="section" style="background-color: var(--bg-secondary);">
        <div class="container">
          <div style="text-align: center; margin-bottom: var(--spacing-12);">
            <h2 data-testid="text-featured-title">Featured Products</h2>
            <p style="color: var(--text-secondary); font-size: 1.125rem;">
              Hand-picked selection of our best sellers
            </p>
          </div>
          
          <div id="featured-products" class="products-grid">
            <!-- Loading skeleton -->
            ${Array(4).fill(0).map(() => `
              <div class="card">
                <div class="skeleton" style="width: 100%; padding-top: 100%;"></div>
                <div class="card__body">
                  <div class="skeleton" style="width: 70%; height: 1.5rem; margin-bottom: var(--spacing-2);"></div>
                  <div class="skeleton" style="width: 40%; height: 1.25rem;"></div>
                </div>
              </div>
            `).join('')}
          </div>
          
          <div style="text-align: center; margin-top: var(--spacing-12);">
            <a href="#/products" class="btn btn--primary" data-testid="link-view-all">
              View All Products
            </a>
          </div>
        </div>
      </section>
      
      <!-- Features Section -->
      <section class="section">
        <div class="container">
          <div class="grid grid-cols-3" style="gap: var(--spacing-8);">
            <div style="text-align: center;">
              <div style="width: 4rem; height: 4rem; margin: 0 auto var(--spacing-4); background-color: var(--accent-light); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2">
                  <path d="M20 7h-9"></path>
                  <path d="M14 17H5"></path>
                  <circle cx="17" cy="17" r="3"></circle>
                  <circle cx="7" cy="7" r="3"></circle>
                </svg>
              </div>
              <h3 style="font-size: 1.25rem; margin-bottom: var(--spacing-2);">Fast Shipping</h3>
              <p style="color: var(--text-secondary);">Free delivery on orders over $50</p>
            </div>
            
            <div style="text-align: center;">
              <div style="width: 4rem; height: 4rem; margin: 0 auto var(--spacing-4); background-color: var(--accent-light); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h3 style="font-size: 1.25rem; margin-bottom: var(--spacing-2);">Secure Checkout</h3>
              <p style="color: var(--text-secondary);">Your payment information is safe</p>
            </div>
            
            <div style="text-align: center;">
              <div style="width: 4rem; height: 4rem; margin: 0 auto var(--spacing-4); background-color: var(--accent-light); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <h3 style="font-size: 1.25rem; margin-bottom: var(--spacing-2);">Easy Returns</h3>
              <p style="color: var(--text-secondary);">30-day return policy</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
  
  // Load featured products
  loadFeaturedProducts();
}

/**
 * Load featured products
 */
async function loadFeaturedProducts() {
  try {
    const products = await getProducts({ limit: 4 });
    const container = document.getElementById('featured-products');
    
    if (container && products.length > 0) {
      container.innerHTML = products.slice(0, 4).map(product => 
        productCard.create(product)
      ).join('');
      
      productCard.attachListeners(container);
    }
  } catch (error) {
    console.error('Error loading featured products:', error);
  }
}

/**
 * Cleanup function
 */
export function cleanup() {
  // No cleanup needed
}
