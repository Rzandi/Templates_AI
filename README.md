

<html>
 <h1> Langsung aja </h1>
 <a href=https://templates-ai-gamma.vercel.app/</a> <p> Check this out! </p><br>
 <a href=https://templatesai-production.up.railway.app/</a> <p>kamu juga bisa check disini</p>
</html>

# Premium E-Commerce - Vanilla JavaScript SPA

A production-ready single-page application built with vanilla HTML, CSS, and JavaScript (ES2022 modules). No frameworks, no build tools - just clean, modular code.

## Features

✅ **Complete E-Commerce Flow**
- Product catalog with search, filtering, and pagination
- Shopping cart with localStorage persistence
- Secure checkout process
- Order management and invoice generation

✅ **Modern Architecture**
- Hash-based routing (#/products, #/cart, #/checkout, #/invoices)
- ES2022 modules for clean code organization
- Pub/sub state management
- Fetch API with automatic retry and error handling

✅ **Premium UX**
- Dark mode toggle (persisted in localStorage)
- Responsive design (mobile-first approach)
- Smooth animations and micro-interactions
- Accessible markup with ARIA labels and keyboard navigation

✅ **Production Ready**
- Mock data fallback for offline development
- Server-side invoice rendering
- RESTful API with in-memory storage
- Comprehensive error handling

## Project Structure

```
public/
 ├─ index.html              # SPA shell
 ├─ app/
 │   ├─ main.js            # Bootstrap + router setup
 │   ├─ router.js          # Hash-based router
 │   ├─ store.js           # Global state (cart, theme, auth)
 │   ├─ api/               # API services
 │   │   ├─ api.js         # Fetch wrapper with retry logic
 │   │   ├─ products.js
 │   │   ├─ orders.js
 │   │   └─ invoices.js
 │   ├─ views/             # Page components
 │   │   ├─ home.js
 │   │   ├─ products.js
 │   │   ├─ productDetail.js
 │   │   ├─ checkout.js
 │   │   ├─ invoices.js
 │   │   └─ invoiceViewer.js
 │   ├─ components/        # Reusable components
 │   │   ├─ header.js
 │   │   ├─ footer.js
 │   │   ├─ productCard.js
 │   │   ├─ modal.js
 │   │   ├─ toast.js
 │   │   └─ cart.js
 │   ├─ templates/         # HTML templates
 │   │   └─ productCard.html
 │   └─ utils/             # Helper functions
 │       ├─ debounce.js
 │       ├─ format.js
 │       └─ storage.js
 ├─ css/
 │   ├─ base.css           # Reset, typography, colors
 │   ├─ layout.css         # Grid, flex, spacing
 │   └─ components.css     # Component styles
 ├─ assets/
 │   └─ images/            # Static images
 └─ data/
     └─ mock/
         └─ products.json  # Fallback product data
```

## Tech Stack

**Frontend (Vanilla)**
- HTML5 (Semantic markup)
- CSS3 (Custom properties, Grid, Flexbox)
- JavaScript ES2022 (ES Modules, async/await)

**Backend**
- Node.js + Express
- TypeScript
- In-memory data storage

**Design System**
- Typography: Inter (body), Sora (headings)
- Colors: Custom HSL palette with dark mode support
- Spacing: Consistent 8px grid system
- Components: BEM naming convention

## Getting Started

### Prerequisites
- Node.js 18+ installed

### Installation

1. **Clone and Install**
```bash
npm install
```

2. **Run Development Server**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

### How It Works

**Development Mode:**
- Express serves the vanilla JS SPA from `public/` directory
- API endpoints available at `/api/*`
- Changes to JS/CSS files require browser refresh (no hot reload)

**Production Mode:**
```bash
npm run build  # If needed
npm start
```

## Pages / Routes

All routes use hash-based navigation:

- `#/` - Home/Landing page with hero section
- `#/products` - Product catalog (grid, filters, search, pagination)
- `#/products/:id` - Product detail page
- `#/cart` - Cart drawer (opens from header)
- `#/checkout` - Checkout flow with customer form
- `#/invoices` - Invoice list
- `#/invoices/:id` - Invoice viewer (printable)

## API Endpoints

**Products**
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get single product

**Orders**
- `POST /api/orders` - Create new order
- `GET /api/orders` - List all orders
- `GET /api/orders/:id` - Get single order

**Invoices**
- `GET /api/invoices` - List all invoices
- `GET /api/invoices/:id` - Get invoice data
- `GET /api/invoices/:id/view` - View invoice as HTML (for printing)

## State Management

The app uses a simple pub/sub pattern in `store.js`:

```javascript
import * as store from './store.js';

// Get state
const cart = store.get('cart');
const theme = store.get('theme');

// Set state
store.set('theme', 'dark');
store.addToCart(product, quantity);

// Subscribe to changes
store.subscribe('cart', (newCart) => {
  console.log('Cart updated:', newCart);
});
```

**Persisted State:**
- `ff_cart_v1` - Shopping cart items
- `ff_theme_v1` - Dark/light mode preference
- `ff_auth_v1` - Authentication token (if implemented)

## Router Usage

The hash router is simple and extensible:

```javascript
// In main.js
import * as router from './router.js';

// Register routes
router.register('/', () => import('./views/home.js'));
router.register('/products/:id', () => import('./views/productDetail.js'));

// Navigate programmatically
router.navigate('/products');
// or
window.location.hash = '#/products';

// Start router
router.start();
```

**View Module Structure:**
```javascript
// views/example.js
export async function render(params) {
  const root = document.getElementById('view-root');
  root.innerHTML = `<div>Hello ${params.id}</div>`;
}

export function cleanup() {
  // Clean up event listeners, subscriptions, etc.
}
```

## Extending the Application

### Adding a New Route

1. Create view module in `app/views/`:
```javascript
// app/views/profile.js
export async function render(params) {
  // Render your view
}

export function cleanup() {
  // Clean up
}
```

2. Register route in `app/main.js`:
```javascript
router.register('/profile', () => import('./views/profile.js'));
```

3. Add navigation link:
```html
<a href="#/profile">Profile</a>
```

### Adding a New API Endpoint

1. Update `shared/schema.ts` with types
2. Add methods to `server/storage.ts`
3. Add route handlers in `server/routes.ts`
4. Create API service in `public/app/api/`

## Design References

The UI design draws inspiration from:
- **MagicUI** - Hero sections, animated marketing blocks
- **21st.dev** - Spacing system, readable layouts
- **ReactBits** - Micro-interactions, smooth transitions
- **Stripe/Shopify** - Checkout flow patterns

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Performance

- Lazy-loaded views using dynamic `import()`
- Debounced search input (300ms)
- Pagination for large lists
- Optimized images (Unsplash CDN)
- Minimal DOM updates

## Accessibility

- Semantic HTML5 elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus visible outlines
- Alt text on images
- Screen reader friendly

## Development Notes

**No Build Step Required:**
- Files are served directly from `public/` directory
- ES modules work natively in modern browsers
- CSS uses custom properties (no preprocessor needed)

**Mock Data:**
- If API fails, app falls back to `public/data/mock/products.json`
- Graceful degradation for offline development

**Code Style:**
- ES2022 modules with JSDoc comments
- BEM CSS naming convention
- Functional programming approach
- Single responsibility principle

## License

MIT

## Author

Built as a demonstration of modern vanilla JavaScript SPA architecture.
