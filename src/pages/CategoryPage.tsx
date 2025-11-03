import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts, useCategories, useBrands, ProductFilters } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/FilterSidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

interface CategoryPageProps {
  storeType: 'tech' | 'lifestyle';
}

const CategoryPage = ({ storeType }: CategoryPageProps) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { cartCount, addToCart } = useCart();
  const { data: categories } = useCategories(storeType);
  
  const category = categories?.find(cat => cat.slug === slug);
  
  const [filters, setFilters] = useState<ProductFilters>({
    categoryId: category?.id,
    sortBy: 'newest'
  });

  const { data: products = [], isLoading } = useProducts(storeType, undefined, filters);
  const { data: brands = [] } = useBrands(storeType);

  const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleAddToCart = (productId: string) => {
    addToCart({ productId });
  };

  const FilterContent = () => (
    <FilterSidebar
      filters={filters}
      brands={brands}
      onFilterChange={handleFilterChange}
    />
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={cartCount} onCartClick={() => navigate('/cart')} />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <nav className="text-sm mb-4">
          <a href="/" className="text-muted-foreground hover:text-primary">Home</a>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium">{category?.name || slug}</span>
        </nav>

        {/* Category Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{category?.name || slug}</h1>
          <p className="text-muted-foreground">{category?.description}</p>
        </div>

        {/* Results and Sort */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {products.length} products found
          </p>
          
          <div className="flex items-center gap-4">
            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="sm">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <FilterContent />
              </SheetContent>
            </Sheet>

            {/* Sort Dropdown */}
            <Select
              value={filters.sortBy}
              onValueChange={(value) => handleFilterChange({ sortBy: value as any })}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest Arrivals</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <FilterContent />
          </aside>

          {/* Products Grid */}
          <div className="flex-grow">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No products found matching your filters.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
