import { AdPlacement } from "@/config/homepageConfig";
import { Link } from "react-router-dom";

interface AdPlacementsProps {
  ads: AdPlacement[];
  type?: 'horizontal' | 'inline' | 'all';
}

export const AdPlacements = ({ ads, type = 'all' }: AdPlacementsProps) => {
  const filteredAds = type === 'all' 
    ? ads 
    : ads.filter(ad => ad.type === type);

  if (!filteredAds.length) return null;

  return (
    <section className="bg-card py-4">
      <div className="container mx-auto px-4">
        {filteredAds.map((ad) => (
          <AdBanner key={ad.id} ad={ad} />
        ))}
      </div>
    </section>
  );
};

const AdBanner = ({ ad }: { ad: AdPlacement }) => {
  if (ad.type === 'horizontal') {
    return (
      <Link 
        to={ad.link}
        className="block overflow-hidden rounded-lg group"
      >
        <div className="relative">
          <img
            src={ad.image}
            alt={ad.title || 'Promotional Banner'}
            className="w-full h-24 md:h-32 lg:h-40 object-cover transition-transform group-hover:scale-[1.02]"
          />
          {ad.title && (
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
              <span className="text-white text-lg md:text-xl font-bold ml-6">
                {ad.title}
              </span>
            </div>
          )}
        </div>
      </Link>
    );
  }

  if (ad.type === 'inline') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link 
          to={ad.link}
          className="block overflow-hidden rounded-lg group"
        >
          <div className="relative">
            <img
              src={ad.image}
              alt={ad.title || 'Promotional Banner'}
              className="w-full h-40 md:h-48 object-cover transition-transform group-hover:scale-105"
            />
            {ad.title && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <span className="text-white text-lg font-bold p-4">
                  {ad.title}
                </span>
              </div>
            )}
          </div>
        </Link>
      </div>
    );
  }

  return null;
};

// Promotional Banners Component (Two side-by-side)
export const PromotionalBanners = ({ 
  banners 
}: { 
  banners: Array<{ image: string; title: string; subtitle: string; link: string }> 
}) => {
  if (!banners.length) return null;

  return (
    <section className="bg-card py-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banners.slice(0, 2).map((banner, index) => (
            <Link 
              key={index}
              to={banner.link}
              className="block rounded-lg overflow-hidden group"
            >
              <div className="relative h-40 md:h-48">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center px-6">
                  <h3 className="text-white text-lg md:text-xl font-bold mb-2">
                    {banner.title}
                  </h3>
                  <p className="text-white/90 text-sm mb-3">
                    {banner.subtitle}
                  </p>
                  <span className="bg-card text-primary px-3 py-1 rounded-md inline-block w-max text-sm font-medium">
                    Shop Now
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
