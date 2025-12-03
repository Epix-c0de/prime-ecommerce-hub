import { SpotlightSection as SpotlightConfig } from "@/config/homepageConfig";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface SpotlightSectionProps {
  spotlight: SpotlightConfig[];
}

export const SpotlightSection = ({ spotlight }: SpotlightSectionProps) => {
  if (!spotlight.length) return null;

  return (
    <section className="bg-card py-6">
      <div className="container mx-auto px-4">
        {spotlight.map((section) => (
          <div 
            key={section.id}
            className="relative overflow-hidden rounded-xl"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={section.image}
                alt={section.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 md:p-8 lg:p-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                {section.title}
              </h2>
              <p className="text-muted-foreground mb-6">
                {section.subtitle}
              </p>

              {/* Category Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {section.categories.map((category, index) => (
                  <Link
                    key={index}
                    to={category.link}
                    className="group bg-background/80 backdrop-blur-sm rounded-lg p-4 hover:bg-background transition-colors"
                  >
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <h3 className="text-sm font-medium text-center">
                      {category.name}
                    </h3>
                    <div className="flex items-center justify-center gap-1 text-primary text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Shop <ArrowRight className="w-3 h-3" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
