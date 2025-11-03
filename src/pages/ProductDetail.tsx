import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, ShoppingCart, Heart, Share2, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useProductBySlug, useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useReviews } from "@/hooks/useReviews";
import ProductCard from "@/components/ProductCard";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const { data: product, isLoading } = useProductBySlug(slug || '');
  const { data: allProducts = [] } = useProducts();
  const { cartItems, addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { reviews, averageRating, reviewCount } = useReviews(product?.id);

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
    addToCart({ productId: product.id, quantity });
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
            {/* Product Images */}
            <div>
              <div className="bg-card rounded-lg p-4 mb-4">
                <img
                  src={product.images[selectedImage] || product.images[0] || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-96 object-contain"
                />
              </div>
              <div className="flex gap-2">
                {product.images.slice(0, 3).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`bg-card rounded-lg p-2 flex-1 ${
                      selectedImage === idx ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-20 object-contain" />
                  </button>
                ))}
              </div>
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
                    KSh {product.price.toLocaleString()}
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
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </p>
              </div>

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

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="flex-1"
                  onClick={handleWishlistToggle}
                >
                  <Heart className={`mr-2 h-5 w-5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

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
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
