import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';

interface BannerData {
  id: string;
  name: string;
  type: string;
  image_url: string | null;
  link_url: string | null;
  title: string | null;
  subtitle: string | null;
  is_active: boolean;
  store_type: string;
}

interface AdOverlayBannersProps {
  storeType?: string;
}

export function AdOverlayBanners({ storeType = 'tech' }: AdOverlayBannersProps) {
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchBanners();
  }, [storeType]);

  const fetchBanners = async () => {
    const { data } = await supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .in('store_type', [storeType, 'all'])
      .in('type', ['popup', 'hero', 'category'])
      .order('display_order');

    if (data) setBanners(data);
  };

  const dismiss = (id: string) => {
    setDismissedIds(prev => new Set([...prev, id]));
  };

  // Show hero/category banners inline, popup as overlay
  const popupBanner = banners.find(b => b.type === 'popup' && !dismissedIds.has(b.id));
  const inlineBanners = banners.filter(b => b.type !== 'popup' && !dismissedIds.has(b.id));

  return (
    <>
      {/* Inline ad banners between sections */}
      {inlineBanners.length > 0 && (
        <section className="container mx-auto px-4 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inlineBanners.slice(0, 2).map(banner => (
              <Link
                key={banner.id}
                to={banner.link_url || '#'}
                className="block rounded-lg overflow-hidden group relative"
              >
                <div className="relative h-32 md:h-40 bg-muted">
                  {banner.image_url ? (
                    <img
                      src={banner.image_url}
                      alt={banner.title || banner.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-primary/80 to-primary/40" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-5">
                    {banner.title && (
                      <h3 className="text-white text-lg font-bold">{banner.title}</h3>
                    )}
                    {banner.subtitle && (
                      <p className="text-white/80 text-sm mt-1">{banner.subtitle}</p>
                    )}
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-1 right-1 h-6 w-6 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full"
                  onClick={(e) => { e.preventDefault(); dismiss(banner.id); }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Popup overlay banner */}
      <AnimatePresence>
        {popupBanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => dismiss(popupBanner.id)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-card rounded-xl overflow-hidden max-w-lg w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-black/20 text-white hover:bg-black/40"
                onClick={() => dismiss(popupBanner.id)}
              >
                <X className="h-4 w-4" />
              </Button>
              {popupBanner.image_url && (
                <img
                  src={popupBanner.image_url}
                  alt={popupBanner.title || popupBanner.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6 text-center">
                {popupBanner.title && (
                  <h3 className="text-xl font-bold mb-2">{popupBanner.title}</h3>
                )}
                {popupBanner.subtitle && (
                  <p className="text-muted-foreground mb-4">{popupBanner.subtitle}</p>
                )}
                {popupBanner.link_url && (
                  <Link to={popupBanner.link_url}>
                    <Button>Shop Now</Button>
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
