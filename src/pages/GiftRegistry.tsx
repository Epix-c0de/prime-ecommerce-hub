import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { usePublicRegistry } from '@/hooks/useGiftRegistry';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShoppingCart, Calendar, User } from 'lucide-react';

export default function GiftRegistry() {
  const { shareCode } = useParams();
  const { data, isLoading } = usePublicRegistry(shareCode || '');
  const { addToCart, cartItems } = useCart();

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Registry not found</div>;

  const { registry, items } = data;

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={cartItems.length} onCartClick={() => {}} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="p-6 mb-8">
          <h1 className="text-3xl font-bold mb-4">{registry.name}</h1>
          <div className="flex gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {registry.event_type}
            </div>
            {registry.event_date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(registry.event_date).toLocaleDateString()}
              </div>
            )}
          </div>
          {registry.description && (
            <p className="mt-4 text-muted-foreground">{registry.description}</p>
          )}
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item: any) => (
            <Card key={item.id} className="p-4">
              <img src={item.products.images[0]} alt={item.products.name} className="w-full h-48 object-cover rounded-lg mb-4" />
              <h3 className="font-semibold mb-2">{item.products.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Requested: {item.quantity_requested} | Purchased: {item.quantity_purchased}
              </p>
              <Button 
                onClick={() => addToCart({ productId: item.product_id })}
                className="w-full"
                disabled={item.quantity_purchased >= item.quantity_requested}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {item.quantity_purchased >= item.quantity_requested ? 'Fulfilled' : 'Purchase Gift'}
              </Button>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}