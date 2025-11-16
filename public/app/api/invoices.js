/**
 * Invoices API
 * @module api/invoices
 */

import { get } from './api.js';

/**
 * Fetch all invoices
 * @returns {Promise<Array>} Invoices array
 */
export async function getInvoices() {
  const response = await get('/invoices');
  return response.data || response;
}

/**
 * Fetch single invoice by ID
 * @param {string} id - Invoice ID
 * @returns {Promise<Object>} Invoice object
 */
export async function getInvoice(id) {
  const response = await get(`/invoices/${id}`);
  return response.data || response;
}

/**
 * Get invoice URL for viewing/download
 * @param {string} id - Invoice ID
 * @returns {string} Invoice URL
 */
export function getInvoiceUrl(id) {
  const API_BASE = window.__API_BASE__ || '/api';
  return `${API_BASE}/invoices/${id}/view`;
}
