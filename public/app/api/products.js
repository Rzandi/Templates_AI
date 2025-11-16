/**
 * Products API
 * @module api/products
 */

import { get } from './api.js';

/**
 * Fetch all products with optional filters
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} Products array
 */
export async function getProducts(params = {}) {
  try {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    const response = await get(endpoint);
    return response.data || response;
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fallback to mock data if API fails
    return fetchMockProducts();
  }
}

/**
 * Fetch single product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object>} Product object
 */
export async function getProduct(id) {
  try {
    const response = await get(`/products/${id}`);
    return response.data || response;
  } catch (error) {
    console.error('Error fetching product:', error);
    // Fallback to mock data
    const mockProducts = await fetchMockProducts();
    return mockProducts.find(p => p.id === id);
  }
}

/**
 * Fetch mock products from local JSON
 * @returns {Promise<Array>} Mock products array
 */
async function fetchMockProducts() {
  try {
    const response = await fetch('/data/mock/products.json');
    if (!response.ok) throw new Error('Mock data not found');
    return await response.json();
  } catch (error) {
    console.warn('Mock data not available, using hardcoded fallback');
    return getHardcodedProducts();
  }
}

/**
 * Hardcoded fallback products
 * @returns {Array} Products array
 */
function getHardcodedProducts() {
  return [
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
      description: 'High-quality wireless headphones with noise cancellation',
      category: 'Electronics'
    },
    {
      id: '2',
      name: 'Smart Watch Pro',
      price: 399.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
      description: 'Advanced smartwatch with health tracking',
      category: 'Electronics'
    },
    {
      id: '3',
      name: 'Designer Backpack',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
      description: 'Stylish and durable backpack for everyday use',
      category: 'Accessories'
    },
    {
      id: '4',
      name: 'Minimalist Wallet',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=800&fit=crop',
      description: 'Slim leather wallet with RFID protection',
      category: 'Accessories'
    },
    {
      id: '5',
      name: 'Bluetooth Speaker',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop',
      description: 'Portable speaker with rich sound quality',
      category: 'Electronics'
    },
    {
      id: '6',
      name: 'Fitness Tracker',
      price: 99.99,
      image: 'https://images.unsplash.com/photo-1557935728-e6d1eaabe558?w=800&h=800&fit=crop',
      description: 'Track your fitness goals with precision',
      category: 'Electronics'
    },
    {
      id: '7',
      name: 'Sunglasses',
      price: 159.99,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop',
      description: 'UV protection with modern style',
      category: 'Accessories'
    },
    {
      id: '8',
      name: 'Laptop Stand',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=800&fit=crop',
      description: 'Ergonomic aluminum laptop stand',
      category: 'Office'
    }
  ];
}
