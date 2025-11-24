export type FooterBackgroundType = 'solid' | 'gradient' | 'image' | 'video';
export type FooterAnimationStyle = 'none' | 'pulse' | 'float' | 'gradient';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  id: string;
  title: string;
  description?: string;
  links: FooterLink[];
}

export interface FooterConfig {
  backgroundType: FooterBackgroundType;
  backgroundColor: string;
  gradientColors: [string, string];
  textColor: string;
  accentColor: string;
  overlayColor: string;
  overlayOpacity: number;
  headingFont: string;
  bodyFont: string;
  animationStyle: FooterAnimationStyle;
  enableMarquee: boolean;
  marqueeText: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  sections: FooterSection[];
  footerNote: string;
  socialLinks: FooterLink[];
}

export const defaultFooterConfig: FooterConfig = {
  backgroundType: 'solid',
  backgroundColor: '#0f172a',
  gradientColors: ['#0f172a', '#0f172a'],
  textColor: '#e2e8f0',
  accentColor: '#22c55e',
  overlayColor: '#0f172a',
  overlayOpacity: 0.6,
  headingFont: 'Space Grotesk, sans-serif',
  bodyFont: 'Inter, sans-serif',
  animationStyle: 'none',
  enableMarquee: false,
  marqueeText: 'Prime Enterprises Kimahuri — Nairobi\'s trusted destination for lifestyle & tech excellence.',
  sections: [
    {
      id: 'about',
      title: 'About Us',
      links: [
        { label: 'About Prime Enterprises', href: '/page/about-us' },
        { label: 'Careers', href: '/page/careers' },
        { label: 'Corporate Responsibility', href: '/page/corporate-responsibility' },
        { label: 'Press Center', href: '/page/press-center' },
        { label: 'Become a Seller', href: '/page/become-seller' },
      ],
    },
    {
      id: 'service',
      title: 'Customer Service',
      links: [
        { label: 'Help Center', href: '/page/help-center' },
        { label: 'Return Policy', href: '/page/return-policy' },
        { label: 'Shipping Info', href: '/page/shipping-info' },
        { label: 'Order Tracking', href: '/page/order-tracking' },
        { label: 'Contact Us', href: '/page/contact-us' },
      ],
    },
    {
      id: 'payment',
      title: 'Payment & Delivery',
      links: [
        { label: 'Payment Methods', href: '/page/payment-methods' },
        { label: 'Buy Now, Pay Later', href: '/page/buy-now-pay-later' },
        { label: 'Shipping Options', href: '/page/shipping-options' },
        { label: 'Delivery Tracking', href: '/page/delivery-tracking' },
        { label: 'Collection Points', href: '/page/collection-points' },
      ],
    },
    {
      id: 'connect',
      title: 'Connect With Us',
      description: 'Join our channels & never miss a drop.',
      links: [
        { label: 'Facebook', href: 'https://facebook.com' },
        { label: 'Instagram', href: 'https://instagram.com' },
        { label: 'Twitter', href: 'https://twitter.com' },
        { label: 'YouTube', href: 'https://youtube.com' },
      ],
    },
  ],
  footerNote: '© 2025 Prime Enterprises Kimahuri. All rights reserved.',
  socialLinks: [
    { label: 'Facebook', href: 'https://facebook.com' },
    { label: 'Twitter', href: 'https://twitter.com' },
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'YouTube', href: 'https://youtube.com' },
  ],
};

