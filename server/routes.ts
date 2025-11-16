import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema } from "@shared/schema";
import express from "express";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve vanilla JS SPA from root public/ directory
  const publicPath = path.resolve(process.cwd(), "public");
  app.use(express.static(publicPath));
  
  // Products endpoints
  app.get("/api/products", async (_req, res) => {
    try {
      const products = await storage.getProducts();
      res.json({ success: true, data: products });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch products" 
      });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: "Product not found" 
        });
      }
      
      res.json({ success: true, data: product });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch product" 
      });
    }
  });

  // Orders endpoints
  app.post("/api/orders", async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertOrderSchema.parse(req.body);
      
      // Create order
      const order = await storage.createOrder(validatedData);
      
      // Get the invoice that was automatically created
      const invoices = await storage.getInvoices();
      const invoice = invoices.find(inv => inv.orderId === order.id);
      
      res.json({ 
        success: true, 
        data: {
          order,
          invoiceUrl: invoice ? `/api/invoices/${invoice.id}/view` : null
        },
        message: "Order created successfully"
      });
    } catch (error) {
      console.error('Order creation error:', error);
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to create order" 
      });
    }
  });

  app.get("/api/orders", async (_req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json({ success: true, data: orders });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch orders" 
      });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      
      if (!order) {
        return res.status(404).json({ 
          success: false, 
          message: "Order not found" 
        });
      }
      
      res.json({ success: true, data: order });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch order" 
      });
    }
  });

  // Invoices endpoints
  app.get("/api/invoices", async (_req, res) => {
    try {
      const invoices = await storage.getInvoices();
      res.json({ success: true, data: invoices });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch invoices" 
      });
    }
  });

  app.get("/api/invoices/:id", async (req, res) => {
    try {
      const invoice = await storage.getInvoice(req.params.id);
      
      if (!invoice) {
        return res.status(404).json({ 
          success: false, 
          message: "Invoice not found" 
        });
      }
      
      res.json({ success: true, data: invoice });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch invoice" 
      });
    }
  });

  // Invoice viewer - returns HTML for viewing/printing
  app.get("/api/invoices/:id/view", async (req, res) => {
    try {
      const invoice = await storage.getInvoice(req.params.id);
      
      if (!invoice) {
        return res.status(404).send('<html><body><h1>Invoice not found</h1></body></html>');
      }
      
      // Generate invoice HTML
      const html = generateInvoiceHTML(invoice);
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } catch (error) {
      res.status(500).send('<html><body><h1>Error loading invoice</h1></body></html>');
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

/**
 * Generate invoice HTML for viewing/printing
 */
function generateInvoiceHTML(invoice: any): string {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice #${invoice.invoiceNumber}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          line-height: 1.6;
          color: #1a1a1a;
          background: #f8f9fa;
          padding: 2rem;
        }
        
        .invoice {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          padding: 3rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }
        
        .company {
          color: #3b82f6;
          font-size: 2rem;
          font-weight: 700;
        }
        
        .invoice-details {
          text-align: right;
        }
        
        .invoice-title {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        
        .bill-to {
          margin-bottom: 2rem;
        }
        
        .bill-to h3 {
          margin-bottom: 0.5rem;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 2rem;
        }
        
        thead {
          background: #f8f9fa;
        }
        
        th, td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        
        th {
          font-weight: 600;
        }
        
        .text-right {
          text-align: right;
        }
        
        .text-center {
          text-align: center;
        }
        
        .totals {
          margin-left: auto;
          min-width: 300px;
        }
        
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .total-final {
          font-size: 1.5rem;
          font-weight: 700;
          border-top: 2px solid #e5e7eb;
          padding-top: 1rem;
          color: #3b82f6;
        }
        
        .footer {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #666;
          font-size: 0.875rem;
        }
        
        .badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .badge-success {
          background: #d1fae5;
          color: #065f46;
        }
        
        .badge-warning {
          background: #fef3c7;
          color: #92400e;
        }
        
        .badge-error {
          background: #fee2e2;
          color: #991b1b;
        }
        
        @media print {
          body {
            background: white;
            padding: 0;
          }
          
          .invoice {
            box-shadow: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice">
        <div class="header">
          <div>
            <div class="company">Premium</div>
            <p style="color: #666;">
              123 Business Street<br>
              New York, NY 10001<br>
              United States
            </p>
          </div>
          
          <div class="invoice-details">
            <h2 class="invoice-title">INVOICE</h2>
            <p style="color: #666;">
              <strong>Invoice #:</strong> ${invoice.invoiceNumber}<br>
              <strong>Date:</strong> ${formatDate(invoice.date)}<br>
              <strong>Status:</strong> 
              <span class="badge badge-${invoice.status === 'paid' ? 'success' : invoice.status === 'pending' ? 'warning' : 'error'}">
                ${invoice.status}
              </span>
            </p>
          </div>
        </div>
        
        ${invoice.customer ? `
          <div class="bill-to">
            <h3>Bill To:</h3>
            <p style="color: #666;">
              <strong>${invoice.customer.fullName || 'N/A'}</strong><br>
              ${invoice.customer.email || ''}<br>
              ${invoice.customer.address || ''}<br>
              ${invoice.customer.city || ''}, ${invoice.customer.zipCode || ''}<br>
              ${invoice.customer.country || ''}
            </p>
          </div>
        ` : ''}
        
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th class="text-center">Quantity</th>
              <th class="text-right">Price</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map((item: any) => `
              <tr>
                <td>${item.name}</td>
                <td class="text-center">${item.quantity}</td>
                <td class="text-right">${formatPrice(item.price)}</td>
                <td class="text-right"><strong>${formatPrice(item.price * item.quantity)}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="totals">
          <div class="total-row">
            <span style="color: #666;">Subtotal:</span>
            <span>${formatPrice(invoice.total)}</span>
          </div>
          <div class="total-row">
            <span style="color: #666;">Shipping:</span>
            <span>${invoice.shipping ? formatPrice(invoice.shipping) : 'FREE'}</span>
          </div>
          <div class="total-row total-final">
            <span>Total:</span>
            <span>${formatPrice(invoice.total)}</span>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Thank you for your business!</strong></p>
          <p style="margin-top: 0.5rem;">
            For questions, contact us at support@premium.com
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
