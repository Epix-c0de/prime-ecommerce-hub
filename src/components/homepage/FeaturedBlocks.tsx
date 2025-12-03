import { FeaturedBlock } from "@/config/homepageConfig";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeaturedBlocksProps {
  blocks: FeaturedBlock[];
}

export const FeaturedBlocks = ({ blocks }: FeaturedBlocksProps) => {
  if (!blocks.length) return null;

  return (
    <section className="bg-card py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {blocks.map((block) => (
            <FeaturedBlockCard key={block.id} block={block} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturedBlockCard = ({ block }: { block: FeaturedBlock }) => {
  if (block.type === 'grid') {
    return (
      <div 
        className="bg-background rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
        style={block.background ? { backgroundImage: `url(${block.background})`, backgroundSize: 'cover' } : {}}
      >
        <h3 className="text-lg font-bold mb-3">{block.title}</h3>
        <div className="grid grid-cols-2 gap-2">
          {block.items.slice(0, 4).map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="group relative overflow-hidden rounded aspect-square"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="absolute bottom-2 left-2 text-xs text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
        {block.cta && block.ctaLink && (
          <Link 
            to={block.ctaLink}
            className="inline-flex items-center gap-1 text-primary text-sm font-medium mt-3 hover:underline"
          >
            {block.cta}
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    );
  }

  if (block.type === 'mixed') {
    return (
      <div className="bg-background rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-lg font-bold mb-3">{block.title}</h3>
        <div className="space-y-2">
          {/* Main large item */}
          {block.items[0] && (
            <Link
              to={block.items[0].link}
              className="group relative overflow-hidden rounded block aspect-video"
            >
              <img
                src={block.items[0].image}
                alt={block.items[0].title}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute bottom-3 left-3 text-white font-semibold">
                {block.items[0].title}
              </span>
            </Link>
          )}
          {/* Small items row */}
          <div className="grid grid-cols-2 gap-2">
            {block.items.slice(1, 3).map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="group relative overflow-hidden rounded aspect-video"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute bottom-2 left-2 text-xs text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
        {block.cta && block.ctaLink && (
          <Link 
            to={block.ctaLink}
            className="inline-flex items-center gap-1 text-primary text-sm font-medium mt-3 hover:underline"
          >
            {block.cta}
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    );
  }

  // Banner type
  return (
    <Link
      to={block.items[0]?.link || '#'}
      className="relative overflow-hidden rounded-lg block group"
    >
      <img
        src={block.items[0]?.image}
        alt={block.title}
        className="w-full h-48 object-cover transition-transform group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center px-6">
        <h3 className="text-white text-xl font-bold mb-2">{block.title}</h3>
        {block.cta && (
          <span className="bg-primary text-primary-foreground px-4 py-2 rounded-md inline-block w-max text-sm font-medium">
            {block.cta}
          </span>
        )}
      </div>
    </Link>
  );
};
