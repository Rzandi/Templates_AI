# Design Guidelines: E-Commerce SPA

## Design Approach
**Reference-Based Approach** drawing from modern e-commerce and SaaS leaders:
- **Stripe/Shopify**: Clean checkout flows, trust-building elements, card-based layouts
- **MagicUI**: Animated hero sections with subtle motion
- **21st.dev**: Consistent spacing system, readable typography hierarchy
- **ReactBits**: Polished micro-interactions on interactive elements

Core principle: Build trust through clarity, guide users effortlessly through purchase journey.

---

## Typography System

**Font Families** (Google Fonts):
- Primary: `Inter` (400, 500, 600, 700) - UI elements, body text, navigation
- Accent: `Sora` (600, 700) - Hero headlines, section titles

**Hierarchy**:
- Hero headline: 3.5rem (56px), Sora Bold, tight leading (1.1)
- Section titles: 2.25rem (36px), Sora Semibold, leading 1.2
- Subsection headings: 1.5rem (24px), Inter Semibold
- Body text: 1rem (16px), Inter Regular, leading 1.6
- Small text/captions: 0.875rem (14px), Inter Regular
- Product prices: 1.25rem (20px), Inter Bold

---

## Layout & Spacing System

**Tailwind-inspired spacing units** (use consistently): `2, 4, 6, 8, 12, 16, 24, 32`

**Grid System**:
- Max content width: `1280px` centered
- Product grid: 4 columns desktop, 2 tablet, 1 mobile (gap-6)
- Checkout: 2-column split (form left 60%, summary right 40%)
- Invoice list: Single column with card-based rows

**Section Padding**: 
- Desktop: `py-32 px-8`
- Mobile: `py-16 px-4`

---

## Component Library

### Header
- Fixed top navigation with subtle backdrop blur on scroll
- Logo left, navigation center (Home, Products, Invoices), cart icon + dark mode toggle right
- Search bar expands from icon click (full width overlay on mobile)
- Cart badge shows item count with subtle pulse animation when updated

### Hero Section (Home)
- Full viewport height (100vh) split layout
- Left 50%: Bold headline (e.g., "Premium Products, Seamless Experience"), subheadline, dual CTAs (primary "Shop Now", secondary "View Collection")
- Right 50%: Large hero image showcasing featured product with subtle parallax scroll effect
- Gradient overlay on image for text contrast (dark gradient from bottom-left)
- Floating product cards with glass morphism effect positioned over hero image

### Product Card
- Clean white card (dark mode: dark gray) with hover elevation (shadow-md → shadow-xl)
- Product image fills top 65% with subtle zoom on hover (scale 1.05)
- Content padding: `p-6`
- Product name: semibold, 1.125rem
- Price: bold, 1.25rem, accent color
- "Add to Cart" button appears on hover (slide up from bottom)

### Cart Drawer
- Slide-in panel from right (400px width)
- Backdrop overlay with blur effect
- Item rows with thumbnail, name, quantity stepper, remove icon
- Sticky footer with subtotal and "Checkout" CTA
- Empty state: centered illustration + "Your cart is empty" message

### Checkout Form
- Two-column layout: Form (billing/shipping) left, Order summary right (sticky)
- Input fields with floating labels, subtle border focus states
- Credit card field with brand icon detection
- Progress indicator: Steps (Cart → Info → Payment → Confirm) as horizontal dots

### Invoice Viewer
- Clean document layout mimicking paper (white background, subtle shadow)
- Company logo top-left, invoice details top-right
- Line items in table format with alternating row backgrounds
- Prominent total in larger text, bold
- "Download PDF" and "Print" buttons in top-right corner

### Modal
- Centered overlay (max-width 600px)
- Backdrop: `rgba(0,0,0,0.6)` with blur
- White container (dark mode: dark gray) with rounded corners (12px)
- Close icon top-right, content padding `p-8`

### Toast Notifications
- Bottom-right stacked notifications
- Color-coded: Green (success), Red (error), Blue (info)
- Slide-in animation from right, auto-dismiss after 4s
- Icon left, message center, close button right

---

## Dark Mode Strategy

**Toggle Implementation**:
- Icon-based toggle in header (sun/moon icon with smooth rotation transition)
- Persisted via localStorage key `ff_theme_v1`

**Color Mapping** (CSS custom properties):
```
Light Mode:
--bg-primary: #ffffff
--bg-secondary: #f8f9fa
--text-primary: #1a1a1a
--text-secondary: #666666
--border: #e5e7eb
--accent: #3b82f6

Dark Mode:
--bg-primary: #1a1a1a
--bg-secondary: #2d2d2d
--text-primary: #ffffff
--text-secondary: #a0a0a0
--border: #404040
--accent: #60a5fa
```

---

## Animations & Interactions

**Use Sparingly**:
- Hero section: Subtle fade-up on load for headline and CTA (0.6s ease-out)
- Product cards: Elevation change on hover (0.2s), image scale (0.3s)
- Cart count badge: Scale pulse when item added (0.3s bounce)
- Page transitions: Fade in content (0.3s) when route changes
- Form validation: Shake animation on error (0.4s)

**No Animations**:
- Navigation links (instant feedback only)
- Background elements
- Continuous/looping animations

---

## Images

**Hero Section**: 
- Large lifestyle image (1920x1080) showing product in aspirational context
- Position: Right 50% of viewport
- Treatment: Subtle gradient overlay from bottom-left, slight blur on edges

**Product Images**:
- Square aspect ratio (1:1), minimum 800x800px
- White/transparent background for consistency
- Hover: show alternate view if available

**Empty States**:
- Simple line art illustrations (not photos) for empty cart, no invoices states
- Muted colors matching theme

---

## Key Pages Layout

**Products Page**:
- Hero banner: 40vh height with category headline + filter bar below
- Filter sidebar (left 20%, collapsible on mobile)
- Product grid (right 80%, 4-col responsive)
- Pagination bottom-center as numbered buttons

**Checkout**:
- Progress bar top (fixed)
- 60/40 split: Form left with grouped sections (Contact, Shipping, Payment), Summary right (sticky) with item list + total

**Invoices List**:
- Table layout with columns: Invoice #, Date, Amount, Status, Actions
- Status badges color-coded (Paid: green, Pending: yellow, Overdue: red)
- "View" button opens invoice in new tab

---

**Design Philosophy**: Prioritize clarity and trust. Every element serves the goal of seamless product discovery and frictionless checkout. Avoid visual clutter; let products and content breathe with generous whitespace.