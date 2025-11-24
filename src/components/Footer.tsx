import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { useMemo, type CSSProperties } from "react";
import { useConfig } from "@/contexts/ConfigContext";
import type { FooterLink } from "@/config/footerConfig";

const socialIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
};

const Footer = () => {
  const { footerConfig } = useConfig();
  const {
    backgroundType,
    backgroundColor,
    gradientColors,
    textColor,
    accentColor,
    headingFont,
    bodyFont,
    animationStyle,
    enableMarquee,
    marqueeText,
    backgroundImage,
    backgroundVideo,
    overlayColor,
    overlayOpacity,
    sections,
    footerNote,
    socialLinks,
  } = footerConfig;

  const containerStyle = useMemo(() => {
    const style: CSSProperties = {
      color: textColor,
      fontFamily: bodyFont,
    };

    if (backgroundType === "solid") {
      style.backgroundColor = backgroundColor;
    }

    if (backgroundType === "gradient") {
      style.backgroundImage = `linear-gradient(135deg, ${gradientColors[0]}, ${gradientColors[1]})`;
      style.backgroundSize = animationStyle === "gradient" ? "400% 400%" : "cover";
    }

    if (backgroundType === "image" && backgroundImage) {
      style.backgroundImage = `url(${backgroundImage})`;
      style.backgroundSize = "cover";
      style.backgroundPosition = "center";
    }

    if (animationStyle === "pulse") {
      style.animation = "footerPulse 10s ease-in-out infinite";
    } else if (animationStyle === "float") {
      style.animation = "footerFloat 18s ease-in-out infinite";
    } else if (animationStyle === "gradient") {
      style.animation = "footerGradientShift 15s linear infinite";
    }

    return style;
  }, [backgroundType, backgroundColor, gradientColors, backgroundImage, textColor, bodyFont, animationStyle]);

  const renderSocialIcon = (link: FooterLink) => {
    const key = link.label.toLowerCase();
    const Icon = socialIconMap[key];
    if (!Icon) {
      return <span className="text-sm font-medium">{link.label}</span>;
    }
    return <Icon className="h-5 w-5" />;
  };

  return (
    <footer className="relative mt-8 overflow-hidden" style={containerStyle}>
      {backgroundType === "video" && backgroundVideo && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          src={backgroundVideo}
        />
      )}

      <div
        className="absolute inset-0"
        style={{
          backgroundColor: overlayColor,
          opacity: overlayOpacity,
        }}
      />

      <div className="relative z-10">
        {enableMarquee && marqueeText && (
          <div className="border-b border-white/10 bg-black/20">
            <div
              className="animate-footer-marquee whitespace-nowrap py-3 text-sm uppercase tracking-[0.3em]"
              style={{ color: accentColor, fontFamily: headingFont }}
            >
              {marqueeText}
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 pt-10 pb-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {sections.map((section) => (
              <div key={section.id}>
                <h3
                  className="mb-4 text-lg font-bold"
                  style={{ color: accentColor, fontFamily: headingFont }}
                >
                  {section.title}
                </h3>
                {section.description && (
                  <p className="mb-3 text-sm text-white/70">{section.description}</p>
                )}
                <ul className="space-y-2 text-sm text-white/80">
                  {section.links.map((link) => (
                    <li key={`${section.id}-${link.label}`}>
                      <a
                        href={link.href}
                        className="inline-flex items-center gap-2 transition hover:translate-x-1 hover:text-white"
                        style={{ color: textColor }}
                      >
                        {section.id === "connect" ? (
                          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white">
                            {renderSocialIcon(link)}
                          </span>
                        ) : null}
                        <span style={{ fontFamily: bodyFont }}>{link.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t border-white/10 pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-white/70">{footerNote}</p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-widest text-white/80 transition hover:border-white hover:text-white"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
