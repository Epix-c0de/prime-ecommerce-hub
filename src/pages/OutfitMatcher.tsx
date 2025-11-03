import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Shirt, Watch, ShoppingBag, Sparkles } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useProducts } from "@/hooks/useProducts";

const occasions = [
  { id: "casual", name: "Casual Day Out", icon: Shirt },
  { id: "formal", name: "Formal Event", icon: Watch },
  { id: "party", name: "Party Night", icon: Sparkles },
  { id: "business", name: "Business Meeting", icon: ShoppingBag },
];

const OutfitMatcher = () => {
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();
  const { data: lifestyleProducts = [] } = useProducts('lifestyle');
  const [selectedOccasion, setSelectedOccasion] = useState("casual");

  const getOutfitRecommendations = () => {
    const outfits = {
      casual: {
        name: "Weekend Casual",
        description: "Perfect for a relaxed day out with friends or running errands",
        items: lifestyleProducts.slice(0, 4),
        totalPrice: lifestyleProducts.slice(0, 4).reduce((sum, p) => sum + Number(p.price), 0),
      },
      formal: {
        name: "Black Tie Ready",
        description: "Sophisticated ensemble for formal occasions and events",
        items: lifestyleProducts.slice(4, 8),
        totalPrice: lifestyleProducts.slice(4, 8).reduce((sum, p) => sum + Number(p.price), 0),
      },
      party: {
        name: "Party Perfect",
        description: "Stand out at any party with this trendy combination",
        items: lifestyleProducts.slice(8, 12),
        totalPrice: lifestyleProducts.slice(8, 12).reduce((sum, p) => sum + Number(p.price), 0),
      },
      business: {
        name: "Corporate Chic",
        description: "Professional attire that makes the right impression",
        items: lifestyleProducts.slice(12, 16),
        totalPrice: lifestyleProducts.slice(12, 16).reduce((sum, p) => sum + Number(p.price), 0),
      },
    };
    return outfits[selectedOccasion as keyof typeof outfits];
  };

  const outfit = getOutfitRecommendations();

  const handleAddOutfitToCart = () => {
    outfit.items.forEach(item => {
      addToCart({ productId: item.id });
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={cartItems.length} onCartClick={() => navigate("/cart")} />

      <main className="flex-grow bg-background py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Outfit Matcher</h1>
            </div>
            <p className="text-muted-foreground">
              Get AI-powered outfit recommendations for any occasion
            </p>
          </div>

          {/* Occasion Selector */}
          <Tabs value={selectedOccasion} onValueChange={setSelectedOccasion} className="mb-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto">
              {occasions.map((occasion) => (
                <TabsTrigger
                  key={occasion.id}
                  value={occasion.id}
                  className="flex flex-col items-center gap-2 py-4"
                >
                  <occasion.icon className="h-6 w-6" />
                  <span className="text-xs md:text-sm">{occasion.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Outfit Display */}
          <Card className="p-6 md:p-8 mb-6">
            <div className="mb-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{outfit.name}</h2>
                  <p className="text-muted-foreground">{outfit.description}</p>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  KSh {outfit.totalPrice.toLocaleString()}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {outfit.items.map((item, idx) => (
                <div key={idx} className="group">
                  <div className="bg-muted rounded-lg p-4 mb-3 overflow-hidden">
                    <img
                      src={item.images[0] || '/placeholder.svg'}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="font-medium text-sm mb-1 line-clamp-2">{item.name}</h3>
                  <p className="text-primary font-semibold">
                    KSh {Number(item.price).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button onClick={handleAddOutfitToCart} className="flex-1" size="lg">
                Add Complete Outfit to Cart
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/lifestyle")}
                className="flex-1"
                size="lg"
              >
                Browse More Items
              </Button>
            </div>
          </Card>

          {/* Why This Works */}
          <Card className="p-6 bg-muted/50">
            <h3 className="font-semibold mb-4">Why This Outfit Works</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium mb-2">Color Coordination</h4>
                <p className="text-sm text-muted-foreground">
                  Items complement each other with matching color palettes
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Style Harmony</h4>
                <p className="text-sm text-muted-foreground">
                  Pieces are selected to match the occasion and create a cohesive look
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Versatile Mix</h4>
                <p className="text-sm text-muted-foreground">
                  Each item can be mixed and matched with other wardrobe pieces
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OutfitMatcher;
