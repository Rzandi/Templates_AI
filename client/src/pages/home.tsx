import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Package, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">E-Commerce Store</h1>
          <Button>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Cart
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold mb-6">
            Welcome to Our Store
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Discover amazing products at great prices
          </p>
          <Button size="lg">
            Shop Now
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <ShoppingCart className="h-10 w-10 text-blue-500 mb-2" />
              <CardTitle>Easy Shopping</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Browse and shop from thousands of products
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Package className="h-10 w-10 text-green-500 mb-2" />
              <CardTitle>Fast Delivery</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get your orders delivered quickly and safely
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-purple-500 mb-2" />
              <CardTitle>Best Prices</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Competitive prices and regular discounts
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}