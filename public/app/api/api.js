/**
 * Core API module with fetch wrapper and error handling
 * Includes automatic retry logic and 401 handling
 * @module api/api
 */

import * as store from '../store.js';

const API_BASE = window.__API_BASE__ || '/api';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

/**
 * Fetch wrapper with automatic retry and error handling
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @param {number} retryCount - Current retry count
 * @returns {Promise<Object>} Response data
 */
async function fetchWithRetry(endpoint, options = {}, retryCount = 0) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    
    // Handle 401 Unauthorized
    if (response.status === 401) {
      store.clearAuth();
      window.location.hash = '#/';
      throw new Error('Unauthorized - please log in');
    }
    
    // Parse JSON response
    const data = await response.json();
    
    // Check for success response
    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }
    
    return data;
  } catch (error) {
    // Retry on network errors
    if (retryCount < MAX_RETRIES && error.name === 'TypeError') {
      console.warn(`Retry ${retryCount + 1}/${MAX_RETRIES} for ${endpoint}`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(endpoint, options, retryCount + 1);
    }
    
    throw error;
  }
}

/**
 * Make API request
 * @param {string} method - HTTP method
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise<Object>} Response data
 */
export async function apiRequest(method, endpoint, data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  // Add auth token if available
  const auth = store.get('auth');
  if (auth.token) {
    options.headers['Authorization'] = `Bearer ${auth.token}`;
  }
  
  // Add body for POST/PUT/PATCH
  if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
    options.body = JSON.stringify(data);
  }
  
  return fetchWithRetry(endpoint, options);
}

/**
 * GET request
 * @param {string} endpoint - API endpoint
 * @returns {Promise<Object>} Response data
 */
export async function get(endpoint) {
  return apiRequest('GET', endpoint);
}

/**
 * POST request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise<Object>} Response data
 */
export async function post(endpoint, data) {
  return apiRequest('POST', endpoint, data);
}

/**
 * PUT request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise<Object>} Response data
 */
export async function put(endpoint, data) {
  return apiRequest('PUT', endpoint, data);
}

/**
 * DELETE request
 * @param {string} endpoint - API endpoint
 * @returns {Promise<Object>} Response data
 */
export async function del(endpoint) {
  return apiRequest('DELETE', endpoint);
}
