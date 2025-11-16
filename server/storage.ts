import { type User, type InsertUser, type Product, type InsertProduct, type Order, type InsertOrder, type Invoice, type InsertInvoice } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  
  // Invoices
  getInvoices(): Promise<Invoice[]>;
  getInvoice(id: string): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private orders: Map<string, Order>;
  private invoices: Map<string, Invoice>;
  private invoiceCounter: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.invoices = new Map();
    this.invoiceCounter = 1000;
    
    // Initialize with sample products
    this.initializeProducts();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      ...insertOrder,
      id,
      status: 'paid',
      createdAt: new Date()
    };
    this.orders.set(id, order);
    
    // Automatically create invoice for the order
    const invoice: InsertInvoice = {
      orderId: id,
      customer: order.customer,
      items: order.items,
      total: order.total,
      status: 'paid',
      shipping: order.total >= 50 ? 0 : 9.99
    };
    
    await this.createInvoice(invoice);
    
    return order;
  }

  // Invoices
  async getInvoices(): Promise<Invoice[]> {
    return Array.from(this.invoices.values()).sort((a, b) => 
      b.date.getTime() - a.date.getTime()
    );
  }

  async getInvoice(id: string): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }

  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const id = randomUUID();
    const invoiceNumber = `INV-${this.invoiceCounter++}`;
    const invoice: Invoice = {
      ...insertInvoice,
      id,
      invoiceNumber,
      date: new Date()
    };
    this.invoices.set(id, invoice);
    return invoice;
  }

  // Initialize sample products
  private initializeProducts() {
    const sampleProducts: Omit<Product, 'id'>[] = [
      {
        name: 'Premium Wireless Headphones',
        price: 299.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
        description: 'Experience crystal-clear audio with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and premium comfort for all-day listening.',
        category: 'Electronics'
      },
      {
        name: 'Smart Watch Pro',
        price: 399.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
        description: 'Advanced smartwatch with comprehensive health tracking, GPS, and seamless smartphone integration. Track your fitness goals and stay connected on the go.',
        category: 'Electronics'
      },
      {
        name: 'Designer Backpack',
        price: 149.99,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
        description: 'Stylish and durable backpack perfect for everyday use. Features multiple compartments, laptop sleeve, and water-resistant material.',
        category: 'Accessories'
      },
      {
        name: 'Minimalist Wallet',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=800&fit=crop',
        description: 'Slim leather wallet with RFID protection. Holds up to 8 cards and cash while maintaining a sleek profile in your pocket.',
        category: 'Accessories'
      },
      {
        name: 'Bluetooth Speaker',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop',
        description: 'Portable Bluetooth speaker with 360-degree sound. Waterproof design and 12-hour battery life make it perfect for any adventure.',
        category: 'Electronics'
      },
      {
        name: 'Fitness Tracker',
        price: 99.99,
        image: 'https://images.unsplash.com/photo-1557935728-e6d1eaabe558?w=800&h=800&fit=crop',
        description: 'Track your fitness goals with precision. Monitors heart rate, sleep quality, steps, and calories burned throughout the day.',
        category: 'Electronics'
      },
      {
        name: 'Polarized Sunglasses',
        price: 159.99,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop',
        description: 'Premium sunglasses with 100% UV protection and polarized lenses. Modern design meets superior eye protection.',
        category: 'Accessories'
      },
      {
        name: 'Aluminum Laptop Stand',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=800&fit=crop',
        description: 'Ergonomic aluminum laptop stand improves posture and airflow. Adjustable height and angle for maximum comfort.',
        category: 'Office'
      },
      {
        name: 'Wireless Mouse',
        price: 59.99,
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&h=800&fit=crop',
        description: 'Precision wireless mouse with ergonomic design. Features silent clicks, adjustable DPI, and long battery life.',
        category: 'Office'
      },
      {
        name: 'Mechanical Keyboard',
        price: 179.99,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=800&fit=crop',
        description: 'Premium mechanical keyboard with RGB backlighting and tactile switches. Built for gaming and productivity.',
        category: 'Office'
      },
      {
        name: 'USB-C Hub',
        price: 69.99,
        image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800&h=800&fit=crop',
        description: '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and power delivery. Essential for modern laptops.',
        category: 'Office'
      },
      {
        name: 'Desk Organizer',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=800&fit=crop',
        description: 'Bamboo desk organizer keeps your workspace tidy. Multiple compartments for pens, notes, and accessories.',
        category: 'Office'
      }
    ];

    sampleProducts.forEach((product, index) => {
      const id = (index + 1).toString();
      this.products.set(id, { ...product, id });
    });
  }
}

export const storage = new MemStorage();
