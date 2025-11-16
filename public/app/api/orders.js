/**
 * Orders API
 * @module api/orders
 */

import { get, post } from './api.js';

/**
 * Create new order
 * @param {Object} orderData - Order data
 * @returns {Promise<Object>} Order response with invoice URL
 */
export async function createOrder(orderData) {
  const response = await post('/orders', orderData);
  return response.data || response;
}

/**
 * Fetch user orders
 * @returns {Promise<Array>} Orders array
 */
export async function getOrders() {
  const response = await get('/orders');
  return response.data || response;
}

/**
 * Fetch single order by ID
 * @param {string} id - Order ID
 * @returns {Promise<Object>} Order object
 */
export async function getOrder(id) {
  const response = await get(`/orders/${id}`);
  return response.data || response;
}
