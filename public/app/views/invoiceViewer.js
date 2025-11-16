/**
 * Invoice viewer - Display server-rendered invoice in iframe
 * @module views/invoiceViewer
 */

import { getInvoice, getInvoiceUrl } from '../api/invoices.js';
import { formatPrice, formatDate } from '../utils/format.js';

/**
 * Render invoice viewer
 * @param {Object} params - Route parameters
 * @param {string} params.id - Invoice ID
 */
export async function render(params) {
  const root = document.getElementById('view-root');
  
  // Show loading
  root.innerHTML = `
    <div class="loading-screen">
      <div class="spinner"></div>
      <p>Loading invoice...</p>
    </div>
  `;
  
  try {
    const invoice = await getInvoice(params.id);
    const invoiceUrl = getInvoiceUrl(params.id);
    
    root.innerHTML = `
      <div class="fade-in">
        <section class="section">
          <div class="container">
            <!-- Header with Actions -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--spacing-8); flex-wrap: wrap; gap: var(--spacing-4);">
              <a href="#/invoices" class="btn btn--outline" data-testid="link-back-invoices">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                Back to Invoices
              </a>
              
              <div style="display: flex; gap: var(--spacing-3);">
                <button 
                  class="btn btn--outline" 
                  onclick="window.print()"
                  data-testid="button-print"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                  </svg>
                  Print
                </button>
                <a 
                  href="${invoiceUrl}" 
                  target="_blank" 
                  class="btn btn--primary"
                  data-testid="button-download"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Download PDF
                </a>
              </div>
            </div>
            
            <!-- Invoice Display -->
            <div class="card" style="max-width: 900px; margin: 0 auto;">
              <div class="card__body" style="padding: var(--spacing-12);">
                <!-- Invoice Header -->
                <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-12); flex-wrap: wrap; gap: var(--spacing-6);">
                  <div>
                    <h1 style="font-family: var(--font-accent); font-size: 2rem; color: var(--accent); margin-bottom: var(--spacing-3);">
                      Premium
                    </h1>
                    <p style="color: var(--text-secondary);">
                      123 Business Street<br>
                      New York, NY 10001<br>
                      United States
                    </p>
                  </div>
                  
                  <div style="text-align: right;">
                    <h2 style="font-size: 2rem; margin-bottom: var(--spacing-3);" data-testid="text-invoice-title">
                      INVOICE
                    </h2>
                    <p style="color: var(--text-secondary);">
                      <strong>Invoice #:</strong> <span data-testid="text-invoice-id">${invoice.invoiceNumber || invoice.id}</span><br>
                      <strong>Date:</strong> ${formatDate(invoice.date || new Date())}<br>
                      <strong>Status:</strong> 
                      <span class="badge badge--${getStatusClass(invoice.status)}" style="margin-left: var(--spacing-2);">
                        ${invoice.status || 'Paid'}
                      </span>
                    </p>
                  </div>
                </div>
                
                <!-- Bill To -->
                ${invoice.customer ? `
                  <div style="margin-bottom: var(--spacing-8);">
                    <h3 style="margin-bottom: var(--spacing-3);">Bill To:</h3>
                    <p style="color: var(--text-secondary);">
                      <strong>${invoice.customer.fullName || 'N/A'}</strong><br>
                      ${invoice.customer.email || ''}<br>
                      ${invoice.customer.address || ''}<br>
                      ${invoice.customer.city || ''}, ${invoice.customer.zipCode || ''}<br>
                      ${invoice.customer.country || ''}
                    </p>
                  </div>
                ` : ''}
                
                <!-- Line Items -->
                <div style="margin-bottom: var(--spacing-8); overflow-x: auto;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                      <tr style="background-color: var(--bg-secondary); border-bottom: 2px solid var(--border);">
                        <th style="padding: var(--spacing-4); text-align: left;">Item</th>
                        <th style="padding: var(--spacing-4); text-align: center;">Quantity</th>
                        <th style="padding: var(--spacing-4); text-align: right;">Price</th>
                        <th style="padding: var(--spacing-4); text-align: right;">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${(invoice.items || []).map((item, index) => `
                        <tr style="border-bottom: 1px solid var(--border);">
                          <td style="padding: var(--spacing-4);">${item.name}</td>
                          <td style="padding: var(--spacing-4); text-align: center;">${item.quantity}</td>
                          <td style="padding: var(--spacing-4); text-align: right;">${formatPrice(item.price)}</td>
                          <td style="padding: var(--spacing-4); text-align: right; font-weight: 600;">${formatPrice(item.price * item.quantity)}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
                
                <!-- Total -->
                <div style="display: flex; justify-content: flex-end;">
                  <div style="min-width: 300px;">
                    <div style="display: flex; justify-content: space-between; padding: var(--spacing-3) 0; border-bottom: 1px solid var(--border);">
                      <span style="color: var(--text-secondary);">Subtotal:</span>
                      <span>${formatPrice(invoice.total || 0)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: var(--spacing-3) 0; border-bottom: 2px solid var(--border);">
                      <span style="color: var(--text-secondary);">Shipping:</span>
                      <span>${invoice.shipping ? formatPrice(invoice.shipping) : 'FREE'}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: var(--spacing-4) 0; font-size: 1.5rem; font-weight: 700;">
                      <span>Total:</span>
                      <span style="color: var(--accent);" data-testid="text-invoice-total">
                        ${formatPrice(invoice.total || 0)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <!-- Footer -->
                <div style="margin-top: var(--spacing-12); padding-top: var(--spacing-6); border-top: 1px solid var(--border); text-align: center; color: var(--text-tertiary); font-size: 0.875rem;">
                  <p>Thank you for your business!</p>
                  <p style="margin-top: var(--spacing-2);">
                    For questions, contact us at support@premium.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;
  } catch (error) {
    console.error('Error loading invoice:', error);
    showError();
  }
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
    <div class="container section">
      <div style="text-align: center; padding: 4rem 0;">
        <h1 style="font-size: 3rem; margin-bottom: 1rem; color: var(--error);">Error</h1>
        <p style="font-size: 1.25rem; color: var(--text-secondary); margin-bottom: 2rem;">
          Failed to load invoice. Please try again later.
        </p>
        <a href="#/invoices" class="btn btn--primary">
          Back to Invoices
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
