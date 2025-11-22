import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, ShoppingCart, Heart, Share2, Minus, Plus, Gift, Eye, GitCompare } from "lucide-react";
import { toast } from "sonner";
import { useProductBySlug, useProducts } from "@/hooks/useProducts";
import { useProductVariants } from "@/hooks/useProductVariants";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useReviews } from "@/hooks/useReviews";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useComparison } from "@/hooks/useComparison";
import ProductCard from "@/components/ProductCard";
import { Product3DViewer } from "@/components/Product3DViewer";
import { ARQuickView } from "@/components/ARQuickView";
import { ProductPersonalization } from "@/components/ProductPersonalization";
import { GiftRegistryDialog } from "@/components/GiftRegistryDialog";
import { CompleteTheSet } from "@/components/CompleteTheSet";
import { ComparisonButton } from "@/components/ComparisonButton";
import { ComparisonModal } from "@/components/ComparisonModal";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showRegistryDialog, setShowRegistryDialog] = useState(false);
  const [personalization, setPersonalization] = useState<Record<string, any>>({});
  const [show3D, setShow3D] = useState(false);
  const [showARModal, setShowARModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [variantOptions, setVariantOptions] = useState<Record<string, string>>({});
  
  const { data: product, isLoading } = useProductBySlug(slug || '');
  const { data: variants = [] } = useProductVariants(product?.id);
  const { data: allProducts = [] } = useProducts();
  const { cartItems, addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { reviews, averageRating, reviewCount } = useReviews(product?.id);
  const { addToRecentlyViewed } = useRecentlyViewed();
  const { addToComparison, compareProducts, removeFromComparison, clearComparison, isInComparison } = useComparison();
  const [showComparison, setShowComparison] = useState(false);

  // Get available variant option names (e.g., Size, Color)
  const availableOptions = variants.length > 0 
    ? Object.keys(variants[0]?.options || {})
    : [];

  // Get unique values for each option
  const getOptionValues = (optionName: string) => {
    const values = new Set<string>();
    variants.forEach(variant => {
      if (variant.options[optionName]) {
        values.add(variant.options[optionName]);
      }
    });
    return Array.from(values);
  };

  // Find matching variant based on selected options
  const getCurrentVariant = () => {
    if (!selectedVariant) return null;
    return variants.find(v => v.id === selectedVariant);
  };

  // Calculate effective price and stock based on variant
  const effectivePrice = () => {
    const variant = getCurrentVariant();
    return variant 
      ? product!.price + variant.price_adjustment 
      : product!.price;
  };

  const effectiveStock = () => {
    const variant = getCurrentVariant();
    return variant ? variant.stock : product!.stock;
  };

  // Update selected variant when options change
  useEffect(() => {
    if (variants.length > 0 && Object.keys(variantOptions).length > 0) {
      const matchingVariant = variants.find(v => {
        return availableOptions.every(option => 
          v.options[option] === variantOptions[option]
        );
      });
      if (matchingVariant) {
        setSelectedVariant(matchingVariant.id);
      }
    }
  }, [variantOptions, variants]);

  // Track product view
  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header cartCount={cartItems.length} onCartClick={() => navigate("/cart")} />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header cartCount={cartItems.length} onCartClick={() => navigate("/cart")} />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <Button onClick={() => navigate("/")}>Return to Home</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    // Validate variant selection if product has variants
    if (variants.length > 0 && !selectedVariant) {
      toast.error('Please select all product options');
      return;
    }

    if (effectiveStock() < quantity) {
      toast.error('Not enough stock available');
      return;
    }

    addToCart({ 
      productId: product.id, 
      quantity,
      // TODO: Add variant support to cart system
      // variantId: selectedVariant 
    });
    
    toast.success('Added to cart');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  const relatedProducts = allProducts.filter(p => p.id !== product.id).slice(0, 4);

  const discountPercentage = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const rating = averageRating || product.rating || 0;

  const handleWishlistToggle = () => {
    if (!product) return;
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={cartItems.length} onCartClick={() => navigate("/cart")} />

      <main className="flex-grow bg-background">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground mb-6">
            <a href="/" className="hover:text-primary">Home</a>
            <span className="mx-2">/</span>
            <span>Products</span>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Product Images & 3D/AR */}
            <div className="space-y-4">
              <div className="bg-card rounded-lg p-4 relative">
                {show3D && product.model_url ? (
                  <Product3DViewer 
                    modelUrl={product.model_url} 
                    productName={product.name}
                    arEnabled={product.ar_enabled || false}
                  />
                ) : (
                  <img
                    src={product.images[selectedImage] || product.images[0] || '/placeholder.svg'}
                    alt={product.name}
                    className="w-full h-96 object-contain"
                  />
                )}
                
                {/* 3D/AR Badge */}
                {product.model_url && (
                  <div className="absolute top-6 left-6 z-10">
                    <Badge variant="secondary" className="bg-primary/90 backdrop-blur-sm text-primary-foreground">
                      3D Model Available
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                {product.images.slice(0, 3).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedImage(idx);
                      setShow3D(false);
                    }}
                    className={`bg-card rounded-lg p-2 flex-1 transition-all hover:ring-2 hover:ring-primary/50 ${
                      selectedImage === idx && !show3D ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-20 object-contain" />
                  </button>
                ))}
                {product.model_url && (
                  <button
                    onClick={() => setShow3D(!show3D)}
                    className={`bg-card rounded-lg p-2 flex-1 flex items-center justify-center transition-all hover:ring-2 hover:ring-primary/50 ${
                      show3D ? "ring-2 ring-primary" : ""
                    }`}
                    title="View 3D Model"
                  >
                    <Eye className="w-6 h-6 text-primary" />
                  </button>
                )}
              </div>

              {/* AR Quick View Button */}
              {product.ar_enabled && product.model_url && (
                <Button
                  onClick={() => setShowARModal(true)}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <Eye className="mr-2 h-5 w-5" />
                  View in 3D & AR
                </Button>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl font-bold text-foreground">
                    KSh {effectivePrice().toLocaleString()}
                  </span>
                  {product.original_price && (
                    <>
                      <span className="text-xl text-muted-foreground line-through">
                        KSh {product.original_price.toLocaleString()}
                      </span>
                      <Badge className="bg-destructive text-destructive-foreground">
                        -{discountPercentage}%
                      </Badge>
                    </>
                  )}
                </div>
                <p className="text-sm text-success">
                  {effectiveStock() > 0 ? `In Stock (${effectiveStock()} available)` : 'Out of Stock'}
                </p>
              </div>

              {/* Variant Selection */}
              {variants.length > 0 && (
                <div className="mb-6 space-y-4">
                  <h3 className="font-semibold text-lg">Select Options</h3>
                  {availableOptions.map(optionName => (
                    <div key={optionName} className="space-y-2">
                      <label className="text-sm font-medium">{optionName}</label>
                      <Select
                        value={variantOptions[optionName] || ''}
                        onValueChange={(value) => 
                          setVariantOptions(prev => ({ ...prev, [optionName]: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${optionName}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {getOptionValues(optionName).map(value => (
                            <SelectItem key={value} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                  {selectedVariant && (
                    <Badge variant="secondary" className="mt-2">
                      Selected: {getCurrentVariant()?.name}
                    </Badge>
                  )}
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Quantity</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary hover:bg-primary-hover"
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button onClick={handleBuyNow} size="lg" className="flex-1">
                  Buy Now
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={handleWishlistToggle}
                >
                  <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => {
                    const added = addToComparison(product);
                    if (!added) {
                      toast.error("Maximum 3 products can be compared");
                    }
                  }}
                >
                  <GitCompare className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => setShowRegistryDialog(true)}
                >
                  <Gift className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Personalization */}
              {product.personalization_enabled && product.personalization_options && (
                <div className="mt-6">
                  <ProductPersonalization 
                    options={product.personalization_options as any[]}
                    onChange={setPersonalization}
                  />
                </div>
              )}

              {/* Key Features */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Key Features:</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Free delivery on orders above KSh 5,000</li>
                  <li>• Same day delivery in Nairobi</li>
                  <li>• 7-day return policy</li>
                  <li>• Genuine products with warranty</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Gift Registry Dialog */}
          <GiftRegistryDialog 
            open={showRegistryDialog}
            onOpenChange={setShowRegistryDialog}
            productId={product.id}
          />

          {/* Product Details Tabs */}
          <Tabs defaultValue="description" className="mb-12">
              <TabsList className="w-full justify-start">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviewCount})</TabsTrigger>
              <TabsTrigger value="shipping">Shipping Info</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="bg-card p-6 rounded-lg mt-4">
              <h3 className="font-semibold text-lg mb-4">Product Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description || `${product.name} - Experience premium quality with this exceptional product.
                Designed with the latest technology and built to last, this item offers
                outstanding performance and reliability. Perfect for everyday use or
                professional applications.`}
              </p>
            </TabsContent>
            <TabsContent value="specifications" className="bg-card p-6 rounded-lg mt-4">
              <h3 className="font-semibold text-lg mb-4">Technical Specifications</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {product.brand && (
                  <div className="border-b pb-2">
                    <span className="text-muted-foreground">Brand:</span>
                    <span className="float-right font-medium">{product.brand}</span>
                  </div>
                )}
                {product.sku && (
                  <div className="border-b pb-2">
                    <span className="text-muted-foreground">SKU:</span>
                    <span className="float-right font-medium">{product.sku}</span>
                  </div>
                )}
                {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="border-b pb-2">
                    <span className="text-muted-foreground">{key}:</span>
                    <span className="float-right font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="bg-card p-6 rounded-lg mt-4">
              <h3 className="font-semibold text-lg mb-4">Customer Reviews</h3>
              {reviewCount > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-gray-200 text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {review.title && <h4 className="font-semibold mb-1">{review.title}</h4>}
                      {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
              )}
            </TabsContent>
            <TabsContent value="shipping" className="bg-card p-6 rounded-lg mt-4">
              <h3 className="font-semibold text-lg mb-4">Shipping Information</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Free delivery on orders above KSh 5,000</li>
                <li>• Same day delivery available in Nairobi</li>
                <li>• Standard delivery: 2-5 business days</li>
                <li>• Express delivery: 1-2 business days</li>
                <li>• Track your order in real-time</li>
              </ul>
            </TabsContent>
          </Tabs>

          {/* Complete the Set */}
          {relatedProducts.length > 0 && (
            <div className="mb-12">
              <CompleteTheSet 
                mainProduct={product}
                bundleProducts={relatedProducts.slice(0, 3)}
                onAddToCart={(productId) => addToCart({ productId })}
              />
            </div>
          )}

          {/* Related Products */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  onAddToCart={(productId) => {
                    addToCart({ productId });
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Comparison Button */}
        <ComparisonButton onClick={() => setShowComparison(true)} />

        {/* Comparison Modal */}
        <ComparisonModal
          products={compareProducts}
          open={showComparison}
          onOpenChange={setShowComparison}
          onRemove={removeFromComparison}
          onClear={clearComparison}
          onAddToCart={(productId) => addToCart({ productId })}
        />

        {/* AR Quick View Modal */}
        {product.model_url && (
          <ARQuickView
            open={showARModal}
            onOpenChange={setShowARModal}
            modelUrl={product.model_url}
            productName={product.name}
            productUrl={window.location.href}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
