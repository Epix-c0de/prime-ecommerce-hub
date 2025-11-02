import { Smartphone, Tv, Laptop, Home, Camera, Lightbulb } from "lucide-react";

const categories = [
  { name: "Phones & Tablets", icon: Smartphone },
  { name: "TVs & Audio", icon: Tv },
  { name: "Computing", icon: Laptop },
  { name: "Home Appliances", icon: Home },
  { name: "Cameras", icon: Camera },
  { name: "Smart Home", icon: Lightbulb },
];

const CategoryGrid = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <a
            key={category.name}
            href="#"
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
