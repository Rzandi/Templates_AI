/**
 * Invoices view - List of all invoices
 * @module views/invoices
 */

import { getInvoices } from '../api/invoices.js';
import { formatPrice, formatDate } from '../utils/format.js';

/**
 * Render invoices view
 */
export async function render() {
  const root = document.getElementById('view-root');
  
  // Show loading
  root.innerHTML = `
    <div class="fade-in">
      <section class="section">
        <div class="container">
          <h1 style="margin-bottom: var(--spacing-8);" data-testid="text-invoices-title">Invoices</h1>
          
          <div class="loading-screen" style="min-height: 300px;">
            <div class="spinner"></div>
            <p>Loading invoices...</p>
          </div>
        </div>
      </section>
    </div>
  `;
  
  try {
    const invoices = await getInvoices();
    renderInvoices(invoices);
  } catch (error) {
    console.error('Error loading invoices:', error);
    showError();
  }
}

/**
 * Render invoices list
 * @param {Array} invoices - Invoices array
 */
function renderInvoices(invoices) {
  const root = document.getElementById('view-root');
  
  if (invoices.length === 0) {
    root.innerHTML = `
      <div class="fade-in">
        <section class="section">
          <div class="container">
            <h1 style="margin-bottom: var(--spacing-8);">Invoices</h1>
            
            <div style="text-align: center; padding: var(--spacing-16) 0;">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" stroke-width="1.5" style="margin: 0 auto var(--spacing-6);">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <p style="font-size: 1.25rem; color: var(--text-secondary);" data-testid="text-no-invoices">
                No invoices yet
              </p>
              <a href="#/products" class="btn btn--primary" style="margin-top: var(--spacing-6);" data-testid="link-start-shopping">
                Start Shopping
              </a>
            </div>
          </div>
        </section>
      </div>
    `;
    return;
  }
  
  root.innerHTML = `
    <div class="fade-in">
      <section class="section">
        <div class="container">
          <h1 style="margin-bottom: var(--spacing-8);" data-testid="text-invoices-title">Invoices</h1>
          
          <!-- Invoices Table -->
          <div class="card">
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 2px solid var(--border);">
                    <th style="padding: var(--spacing-4); text-align: left; font-weight: 600;">Invoice #</th>
                    <th style="padding: var(--spacing-4); text-align: left; font-weight: 600;">Date</th>
                    <th style="padding: var(--spacing-4); text-align: left; font-weight: 600;">Amount</th>
                    <th style="padding: var(--spacing-4); text-align: left; font-weight: 600;">Status</th>
                    <th style="padding: var(--spacing-4); text-align: left; font-weight: 600;">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoices.map((invoice, index) => `
                    <tr style="border-bottom: 1px solid var(--border);" data-testid="row-invoice-${invoice.id}">
                      <td style="padding: var(--spacing-4);">
                        <span style="font-weight: 500; font-family: var(--font-mono);" data-testid="text-invoice-number-${invoice.id}">
                          #${invoice.invoiceNumber || invoice.id}
                        </span>
                      </td>
                      <td style="padding: var(--spacing-4);" data-testid="text-invoice-date-${invoice.id}">
                        ${formatDate(invoice.date || new Date())}
                      </td>
                      <td style="padding: var(--spacing-4);">
                        <span style="font-weight: 600; color: var(--accent);" data-testid="text-invoice-amount-${invoice.id}">
                          ${formatPrice(invoice.total)}
                        </span>
                      </td>
                      <td style="padding: var(--spacing-4);">
                        <span class="badge badge--${getStatusClass(invoice.status)}" data-testid="badge-status-${invoice.id}">
                          ${invoice.status || 'Paid'}
                        </span>
                      </td>
                      <td style="padding: var(--spacing-4);">
                        <a 
                          href="#/invoices/${invoice.id}" 
                          class="btn btn--sm btn--outline"
                          data-testid="button-view-${invoice.id}"
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}

/**
 * Get status badge class
 * @param {string} status - Invoice status
 * @returns {string} Badge class
 */
function getStatusClass(status) {
  const statusLower = (status || 'paid').toLowerCase();
  
  if (statusLower === 'paid') return 'success';
  if (statusLower === 'pending') return 'warning';
  if (statusLower === 'overdue') return 'error';
  
  return 'info';
}

/**
 * Show error
 */
function showError() {
  const root = document.getElementById('view-root');
  root.innerHTML = `
    <div class="fade-in">
      <section class="section">
        <div class="container">
          <h1 style="margin-bottom: var(--spacing-8);">Invoices</h1>
          
          <div style="text-align: center; padding: var(--spacing-16) 0;">
            <p style="font-size: 1.25rem; color: var(--error);">
              Error loading invoices. Please try again later.
            </p>
          </div>
        </div>
      </section>
    </div>
  `;
}

/**
 * Cleanup function
 */
export function cleanup() {
  // No cleanup needed
}
