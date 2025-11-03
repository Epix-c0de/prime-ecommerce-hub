import { Smartphone, Tv, Laptop, Home, Camera, Lightbulb, Package } from "lucide-react";
import { useCategories } from "@/hooks/useProducts";

const iconMap: Record<string, any> = {
  smartphone: Smartphone,
  tv: Tv,
  laptop: Laptop,
  home: Home,
  camera: Camera,
  lightbulb: Lightbulb,
  package: Package,
};

interface CategoryGridProps {
  storeType?: 'tech' | 'lifestyle';
}

const CategoryGrid = ({ storeType }: CategoryGridProps) => {
  const { data: categories = [], isLoading } = useCategories(storeType);

  if (isLoading) {
    return <div className="text-center py-8">Loading categories...</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
      {categories.slice(0, 6).map((category) => {
        const Icon = iconMap[category.slug] || Package;
        return (
          <a
            key={category.id}
            href={`#${category.slug}`}
            className="bg-card rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-md transition-all hover:-translate-y-1 group"
          >
            <Icon className="h-12 w-12 mb-3 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-center">{category.name}</span>
          </a>
        );
      })}
    </div>
  );
};

export default CategoryGrid;
