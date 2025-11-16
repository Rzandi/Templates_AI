/**
 * Checkout view
 * @module views/checkout
 */

import * as store from '../store.js';
import { formatPrice } from '../utils/format.js';
import { createOrder } from '../api/orders.js';
import { showToast } from '../components/toast.js';

/**
 * Render checkout view
 */
export async function render() {
  const root = document.getElementById('view-root');
  const cart = store.get('cart');
  
  // Redirect if cart is empty
  if (cart.items.length === 0) {
    window.location.hash = '#/products';
    showToast('Your cart is empty', 'info');
    return;
  }
  
  root.innerHTML = `
    <div class="fade-in">
      <section class="section">
        <div class="container">
          <!-- Progress Steps -->
          <div style="margin-bottom: var(--spacing-12);">
            <div style="display: flex; align-items: center; justify-content: center; gap: var(--spacing-6); max-width: 600px; margin: 0 auto;">
              <div style="flex: 1; text-align: center;">
                <div style="width: 2rem; height: 2rem; margin: 0 auto var(--spacing-2); background-color: var(--accent); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700;">1</div>
                <div style="font-size: 0.875rem; font-weight: 500;">Cart</div>
              </div>
              <div style="flex: 1; height: 2px; background-color: var(--accent);"></div>
              <div style="flex: 1; text-align: center;">
                <div style="width: 2rem; height: 2rem; margin: 0 auto var(--spacing-2); background-color: var(--accent); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700;">2</div>
                <div style="font-size: 0.875rem; font-weight: 500;">Information</div>
              </div>
              <div style="flex: 1; height: 2px; background-color: var(--border);"></div>
              <div style="flex: 1; text-align: center;">
                <div style="width: 2rem; height: 2rem; margin: 0 auto var(--spacing-2); background-color: var(--bg-secondary); color: var(--text-tertiary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700;">3</div>
                <div style="font-size: 0.875rem; font-weight: 500;">Confirm</div>
              </div>
            </div>
          </div>
          
          <!-- Checkout Form -->
          <div class="checkout-layout">
            <!-- Form -->
            <div>
              <form id="checkout-form" data-testid="form-checkout">
                <!-- Contact Information -->
                <div class="card" style="margin-bottom: var(--spacing-6);">
                  <div class="card__header">
                    <h3 style="margin: 0;">Contact Information</h3>
                  </div>
                  <div class="card__body">
                    <div class="form-group">
                      <label class="form-label" for="email">Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email"
                        class="form-input" 
                        placeholder="your@email.com"
                        required
                        data-testid="input-email"
                      />
                    </div>
                  </div>
                </div>
                
                <!-- Shipping Information -->
                <div class="card" style="margin-bottom: var(--spacing-6);">
                  <div class="card__header">
                    <h3 style="margin: 0;">Shipping Address</h3>
                  </div>
                  <div class="card__body">
                    <div class="form-group">
                      <label class="form-label" for="fullName">Full Name</label>
                      <input 
                        type="text" 
                        id="fullName" 
                        name="fullName"
                        class="form-input" 
                        placeholder="John Doe"
                        required
                        data-testid="input-fullname"
                      />
                    </div>
                    
                    <div class="form-group">
                      <label class="form-label" for="address">Address</label>
                      <input 
                        type="text" 
                        id="address" 
                        name="address"
                        class="form-input" 
                        placeholder="123 Main St"
                        required
                        data-testid="input-address"
                      />
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-4);">
                      <div class="form-group">
                        <label class="form-label" for="city">City</label>
                        <input 
                          type="text" 
                          id="city" 
                          name="city"
                          class="form-input" 
                          placeholder="New York"
                          required
                          data-testid="input-city"
                        />
                      </div>
                      
                      <div class="form-group">
                        <label class="form-label" for="zipCode">ZIP Code</label>
                        <input 
                          type="text" 
                          id="zipCode" 
                          name="zipCode"
                          class="form-input" 
                          placeholder="10001"
                          required
                          data-testid="input-zip"
                        />
                      </div>
                    </div>
                    
                    <div class="form-group">
                      <label class="form-label" for="country">Country</label>
                      <select 
                        id="country" 
                        name="country"
                        class="form-select"
                        required
                        data-testid="select-country"
                      >
                        <option value="">Select country</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AU">Australia</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <!-- Payment Information -->
                <div class="card" style="margin-bottom: var(--spacing-6);">
                  <div class="card__header">
                    <h3 style="margin: 0;">Payment</h3>
                  </div>
                  <div class="card__body">
                    <div class="form-group">
                      <label class="form-label" for="cardNumber">Card Number</label>
                      <input 
                        type="text" 
                        id="cardNumber" 
                        name="cardNumber"
                        class="form-input" 
                        placeholder="1234 5678 9012 3456"
                        required
                        data-testid="input-card"
                      />
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-4);">
                      <div class="form-group">
                        <label class="form-label" for="expiryDate">Expiry Date</label>
                        <input 
                          type="text" 
                          id="expiryDate" 
                          name="expiryDate"
                          class="form-input" 
                          placeholder="MM/YY"
                          required
                          data-testid="input-expiry"
                        />
                      </div>
                      
                      <div class="form-group">
                        <label class="form-label" for="cvv">CVV</label>
                        <input 
                          type="text" 
                          id="cvv" 
                          name="cvv"
                          class="form-input" 
                          placeholder="123"
                          required
                          data-testid="input-cvv"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Submit Button -->
                <button 
                  type="submit" 
                  class="btn btn--primary btn--lg" 
                  style="width: 100%;"
                  id="submit-btn"
                  data-testid="button-submit-order"
                >
                  Place Order
                </button>
              </form>
            </div>
            
            <!-- Order Summary -->
            <div>
              <div class="card" style="position: sticky; top: calc(var(--spacing-16) + 60px);">
                <div class="card__header">
                  <h3 style="margin: 0;">Order Summary</h3>
                </div>
                <div class="card__body">
                  <!-- Cart Items -->
                  <div style="margin-bottom: var(--spacing-6);">
                    ${cart.items.map(item => `
                      <div style="display: flex; gap: var(--spacing-3); margin-bottom: var(--spacing-4);">
                        <img 
                          src="${item.image}" 
                          alt="${item.name}"
                          style="width: 60px; height: 60px; object-fit: cover; border-radius: var(--radius-sm);"
                        />
                        <div style="flex: 1;">
                          <div style="font-weight: 500; margin-bottom: var(--spacing-1);">${item.name}</div>
                          <div style="color: var(--text-secondary); font-size: 0.875rem;">Qty: ${item.quantity}</div>
                        </div>
                        <div style="font-weight: 600;">${formatPrice(item.price * item.quantity)}</div>
                      </div>
                    `).join('')}
                  </div>
                  
                  <!-- Totals -->
                  <div style="border-top: 1px solid var(--border); padding-top: var(--spacing-4);">
                    <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-3);">
                      <span style="color: var(--text-secondary);">Subtotal</span>
                      <span>${formatPrice(cart.total)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-3);">
                      <span style="color: var(--text-secondary);">Shipping</span>
                      <span>${cart.total >= 50 ? 'FREE' : formatPrice(9.99)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding-top: var(--spacing-4); border-top: 1px solid var(--border); font-size: 1.25rem; font-weight: 700;">
                      <span>Total</span>
                      <span style="color: var(--accent);" data-testid="text-order-total">
                        ${formatPrice(cart.total + (cart.total >= 50 ? 0 : 9.99))}
                      </span>
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
  
  // Add form submit handler
  const form = document.getElementById('checkout-form');
  form.addEventListener('submit', handleCheckoutSubmit);
}

/**
 * Handle checkout form submit
 * @param {Event} e - Submit event
 */
async function handleCheckoutSubmit(e) {
  e.preventDefault();
  
  const submitBtn = document.getElementById('submit-btn');
  const originalText = submitBtn.textContent;
  
  // Disable button and show loading
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <div class="spinner" style="width: 1.5rem; height: 1.5rem; border-width: 2px;"></div>
    Processing...
  `;
  
  try {
    const formData = new FormData(e.target);
    const cart = store.get('cart');
    
    const orderData = {
      customer: {
        email: formData.get('email'),
        fullName: formData.get('fullName'),
        address: formData.get('address'),
        city: formData.get('city'),
        zipCode: formData.get('zipCode'),
        country: formData.get('country')
      },
      items: cart.items,
      total: cart.total + (cart.total >= 50 ? 0 : 9.99)
    };
    
    const response = await createOrder(orderData);
    
    // Clear cart
    store.clearCart();
    
    // Show success message
    showToast('Order placed successfully!', 'success');
    
    // Open invoice in new tab if available
    if (response.invoiceUrl) {
      window.open(response.invoiceUrl, '_blank');
    }
    
    // Redirect to invoices page
    setTimeout(() => {
      window.location.hash = '#/invoices';
    }, 1000);
  } catch (error) {
    console.error('Checkout error:', error);
    showToast(error.message || 'Failed to place order. Please try again.', 'error');
    
    // Re-enable button
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

/**
 * Cleanup function
 */
export function cleanup() {
  // No cleanup needed
}
