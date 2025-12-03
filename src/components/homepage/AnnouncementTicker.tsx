import { AnnouncementTicker as TickerType } from "@/config/homepageConfig";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface AnnouncementTickerProps {
  tickers: TickerType[];
}

export const AnnouncementTicker = ({ tickers }: AnnouncementTickerProps) => {
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!tickers.length) return null;

  // Duplicate tickers for seamless loop
  const duplicatedTickers = [...tickers, ...tickers, ...tickers];

  return (
    <div 
      className="bg-primary text-primary-foreground py-2 overflow-hidden relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      ref={containerRef}
    >
      <div 
        className={cn(
          "flex whitespace-nowrap animate-ticker",
          isPaused && "pause-animation"
        )}
      >
        {duplicatedTickers.map((ticker, index) => (
          <span
            key={`${ticker.id}-${index}`}
            className="inline-flex items-center mx-8 text-sm font-medium"
          >
            {ticker.link ? (
              <a 
                href={ticker.link} 
                className="hover:underline transition-all"
              >
                {ticker.text}
              </a>
            ) : (
              ticker.text
            )}
            <span className="mx-8 opacity-50">•</span>
          </span>
        ))}
      </div>
      
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-ticker {
          animation: ticker 30s linear infinite;
        }
        .pause-animation {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};
