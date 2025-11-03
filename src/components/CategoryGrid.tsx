import { useCategories } from "@/hooks/useProducts";
import smartphonesImg from "@/assets/categories/smartphones.jpg";
import tvAudioImg from "@/assets/categories/tv-audio.jpg";
import computingImg from "@/assets/categories/computing.jpg";
import homeAppliancesImg from "@/assets/categories/home-appliances.jpg";
import camerasImg from "@/assets/categories/cameras.jpg";
import fashionImg from "@/assets/categories/fashion.jpg";
import beautyImg from "@/assets/categories/beauty.jpg";
import toysImg from "@/assets/categories/toys.jpg";

const imageMap: Record<string, string> = {
  smartphone: smartphonesImg,
  tv: tvAudioImg,
  laptop: computingImg,
  home: homeAppliancesImg,
  camera: camerasImg,
  fashion: fashionImg,
  beauty: beautyImg,
  toys: toysImg,
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
        const categoryImage = imageMap[category.slug] || smartphonesImg;
        return (
          <a
            key={category.id}
            href={`#${category.slug}`}
            className="bg-card rounded-lg overflow-hidden hover:shadow-md transition-all hover:-translate-y-1 group"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img 
                src={categoryImage} 
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute bottom-3 left-0 right-0 text-sm font-semibold text-white text-center px-2">
                {category.name}
              </span>
            </div>
          </a>
        );
      })}
    </div>
  );
};

export default CategoryGrid;
