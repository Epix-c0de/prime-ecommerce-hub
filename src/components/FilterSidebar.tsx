import { ProductFilters } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";

interface FilterSidebarProps {
  filters: ProductFilters;
  brands: string[];
  onFilterChange: (filters: Partial<ProductFilters>) => void;
}

const FilterSidebar = ({ filters, brands, onFilterChange }: FilterSidebarProps) => {
  const maxPrice = 500000; // Max price in KSh

  const handlePriceChange = (value: number[]) => {
    onFilterChange({
      minPrice: value[0],
      maxPrice: value[1]
    });
  };

  const handleBrandToggle = (brand: string) => {
    onFilterChange({
      brand: filters.brand === brand ? undefined : brand
    });
  };

  const handleRatingFilter = (rating: number) => {
    onFilterChange({
      minRating: filters.minRating === rating ? undefined : rating
    });
  };

  const clearFilters = () => {
    onFilterChange({
      minPrice: undefined,
      maxPrice: undefined,
      brand: undefined,
      minRating: undefined
    });
  };

  const hasActiveFilters = filters.minPrice || filters.maxPrice || filters.brand || filters.minRating;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        )}
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-4">
        <h4 className="font-medium">Price Range</h4>
        <div className="px-2">
          <Slider
            min={0}
            max={maxPrice}
            step={1000}
            value={[filters.minPrice || 0, filters.maxPrice || maxPrice]}
            onValueChange={handlePriceChange}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>KSh {(filters.minPrice || 0).toLocaleString()}</span>
            <span>KSh {(filters.maxPrice || maxPrice).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Brand Filter */}
      {brands.length > 0 && (
        <>
          <div className="space-y-3">
            <h4 className="font-medium">Brand</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={filters.brand === brand}
                    onCheckedChange={() => handleBrandToggle(brand)}
                  />
                  <Label
                    htmlFor={`brand-${brand}`}
                    className="text-sm cursor-pointer"
                  >
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Rating Filter */}
      <div className="space-y-3">
        <h4 className="font-medium">Customer Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <div
              key={rating}
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => handleRatingFilter(rating)}
            >
              <Checkbox
                id={`rating-${rating}`}
                checked={filters.minRating === rating}
              />
              <Label
                htmlFor={`rating-${rating}`}
                className="flex items-center gap-1 cursor-pointer"
              >
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
                <span className="text-sm ml-1">& Up</span>
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
