/**
 * Footer component
 * @module components/footer
 */

/**
 * Render footer
 */
export function render() {
  const root = document.getElementById('footer-root');
  
  root.innerHTML = `
    <footer class="footer" role="contentinfo">
      <div class="footer__container">
        <div class="footer__content">
          <!-- Brand Column -->
          <div>
            <div class="footer__brand">Premium</div>
            <p class="footer__description">
              Quality products with seamless shopping experience. 
              Fast shipping, secure checkout, and exceptional customer service.
            </p>
          </div>
          
          <!-- Quick Links -->
          <div>
            <h4 style="margin-bottom: var(--spacing-4); font-size: 1rem;">Quick Links</h4>
            <ul class="footer__links">
              <li>
                <a href="#/" class="footer__link" data-testid="link-footer-home">Home</a>
              </li>
              <li>
                <a href="#/products" class="footer__link" data-testid="link-footer-products">Products</a>
              </li>
              <li>
                <a href="#/invoices" class="footer__link" data-testid="link-footer-invoices">Invoices</a>
              </li>
            </ul>
          </div>
          
          <!-- Support -->
          <div>
            <h4 style="margin-bottom: var(--spacing-4); font-size: 1rem;">Support</h4>
            <ul class="footer__links">
              <li>
                <a href="#" class="footer__link">Contact Us</a>
              </li>
              <li>
                <a href="#" class="footer__link">Shipping Info</a>
              </li>
              <li>
                <a href="#" class="footer__link">Returns</a>
              </li>
              <li>
                <a href="#" class="footer__link">FAQ</a>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Bottom Bar -->
        <div class="footer__bottom">
          <p>&copy; ${new Date().getFullYear()} Premium E-Commerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `;
}

/**
 * Cleanup function
 */
export function cleanup() {
  // No cleanup needed
}
