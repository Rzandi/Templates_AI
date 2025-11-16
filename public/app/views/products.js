/**
 * Products view - Product catalog with filters and pagination
 * @module views/products
 */

import { getProducts } from '../api/products.js';
import * as productCard from '../components/productCard.js';
import { debounce } from '../utils/debounce.js';

let currentPage = 1;
const ITEMS_PER_PAGE = 8;
let allProducts = [];
let filteredProducts = [];

/**
 * Render products view
 */
export async function render() {
  const root = document.getElementById('view-root');
  
  root.innerHTML = `
    <div class="fade-in">
      <!-- Hero Banner -->
      <section style="background-color: var(--bg-secondary); padding: var(--spacing-12) 0;">
        <div class="container">
          <h1 data-testid="text-products-title">Our Products</h1>
          <p style="color: var(--text-secondary); font-size: 1.125rem;">
            Browse our complete collection of premium products
          </p>
        </div>
      </section>
      
      <!-- Products Section -->
      <section class="section">
        <div class="container">
          <!-- Search and Filter Bar -->
          <div style="margin-bottom: var(--spacing-8);">
            <div style="display: flex; gap: var(--spacing-4); flex-wrap: wrap; align-items: center; justify-content: space-between;">
              <div style="flex: 1; min-width: 250px;">
                <input 
                  type="search" 
                  id="search-input"
                  class="form-input" 
                  placeholder="Search products..."
                  aria-label="Search products"
                  data-testid="input-search"
                />
              </div>
              <div>
                <select 
                  id="sort-select" 
                  class="form-select"
                  aria-label="Sort products"
                  data-testid="select-sort"
                >
                  <option value="">Sort by</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- Products Grid -->
          <div id="products-grid" class="products-grid">
            <!-- Loading skeleton -->
            ${Array(8).fill(0).map(() => `
              <div class="card">
                <div class="skeleton" style="width: 100%; padding-top: 100%;"></div>
                <div class="card__body">
                  <div class="skeleton" style="width: 70%; height: 1.5rem; margin-bottom: var(--spacing-2);"></div>
                  <div class="skeleton" style="width: 40%; height: 1.25rem;"></div>
                </div>
              </div>
            `).join('')}
          </div>
          
          <!-- Pagination -->
          <div id="pagination-container"></div>
        </div>
      </section>
    </div>
  `;
  
  // Load products
  await loadProducts();
  
  // Add event listeners
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-select');
  
  searchInput.addEventListener('input', debounce(handleSearch, 300));
  sortSelect.addEventListener('change', handleSort);
}

/**
 * Load products
 */
async function loadProducts() {
  try {
    allProducts = await getProducts();
    filteredProducts = [...allProducts];
    renderProducts();
  } catch (error) {
    console.error('Error loading products:', error);
    showError();
  }
}

/**
 * Handle search
 */
function handleSearch(e) {
  const query = e.target.value.toLowerCase().trim();
  
  if (query) {
    filteredProducts = allProducts.filter(product => 
      product.name.toLowerCase().includes(query) ||
      (product.description && product.description.toLowerCase().includes(query))
    );
  } else {
    filteredProducts = [...allProducts];
  }
  
  currentPage = 1;
  renderProducts();
}

/**
 * Handle sort
 */
function handleSort(e) {
  const sortValue = e.target.value;
  
  switch (sortValue) {
    case 'price-asc':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      filteredProducts = [...allProducts];
  }
  
  renderProducts();
}

/**
 * Render products
 */
function renderProducts() {
  const container = document.getElementById('products-grid');
  
  if (filteredProducts.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: var(--spacing-16) 0;">
        <p style="font-size: 1.25rem; color: var(--text-secondary);" data-testid="text-no-products">
          No products found
        </p>
      </div>
    `;
    document.getElementById('pagination-container').innerHTML = '';
    return;
  }
  
  // Pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pageProducts = filteredProducts.slice(startIndex, endIndex);
  
  // Render products
  container.innerHTML = pageProducts.map(product => 
    productCard.create(product)
  ).join('');
  
  productCard.attachListeners(container);
  
  // Render pagination
  renderPagination();
}

/**
 * Render pagination
 */
function renderPagination() {
  const container = document.getElementById('pagination-container');
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }
  
  let paginationHTML = '<div class="pagination">';
  
  // Previous button
  paginationHTML += `
    <button 
      class="pagination__btn" 
      ${currentPage === 1 ? 'disabled' : ''}
      data-page="${currentPage - 1}"
      aria-label="Previous page"
      data-testid="button-page-prev"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </button>
  `;
  
  // Page buttons
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      paginationHTML += `
        <button 
          class="pagination__btn ${i === currentPage ? 'active' : ''}" 
          data-page="${i}"
          aria-label="Page ${i}"
          aria-current="${i === currentPage ? 'page' : 'false'}"
          data-testid="button-page-${i}"
        >
          ${i}
        </button>
      `;
    } else if (
      i === currentPage - 2 ||
      i === currentPage + 2
    ) {
      paginationHTML += '<span style="padding: 0 0.5rem;">...</span>';
    }
  }
  
  // Next button
  paginationHTML += `
    <button 
      class="pagination__btn" 
      ${currentPage === totalPages ? 'disabled' : ''}
      data-page="${currentPage + 1}"
      aria-label="Next page"
      data-testid="button-page-next"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
  `;
  
  paginationHTML += '</div>';
  
  container.innerHTML = paginationHTML;
  
  // Add click handlers
  container.addEventListener('click', (e) => {
    const button = e.target.closest('[data-page]');
    if (button && !button.disabled) {
      currentPage = parseInt(button.dataset.page);
      renderProducts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

/**
 * Show error
 */
function showError() {
  const container = document.getElementById('products-grid');
  container.innerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; padding: var(--spacing-16) 0;">
      <p style="font-size: 1.25rem; color: var(--error);">
        Error loading products. Please try again later.
      </p>
    </div>
  `;
}

/**
 * Cleanup function
 */
export function cleanup() {
  currentPage = 1;
  allProducts = [];
  filteredProducts = [];
}
