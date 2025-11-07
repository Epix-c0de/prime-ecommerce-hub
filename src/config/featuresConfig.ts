/**
 * Feature Toggles Configuration
 * Controls which features are enabled/disabled across the app
 */

export interface FeatureFlags {
  // AI Features
  aiChatbot: boolean;
  aiRecommendations: boolean;
  aiSearch: boolean;
  aiContentGeneration: boolean;
  visualSearch: boolean;
  voiceSearch: boolean;

  // Product Features
  arViewer: boolean;
  productPersonalization: boolean;
  productComparison: boolean;
  completeTheSet: boolean;
  quickView: boolean;

  // Shopping Features
  wishlist: boolean;
  giftRegistry: boolean;
  priceAlerts: boolean;
  restockAlerts: boolean;
  savedAddresses: boolean;

  // UX Features
  recentlyViewed: boolean;
  socialProof: boolean;
  liveInventory: boolean;
  flashSales: boolean;
  seasonalThemes: boolean;

  // Personalization
  userPreferences: boolean;
  styleQuiz: boolean;
  dynamicHomepage: boolean;
  productRecommendations: boolean;

  // Performance
  lazyLoading: boolean;
  imageOptimization: boolean;
  codesplitting: boolean;

  // Admin
  realtimeSync: boolean;
  livePreview: boolean;
}

export const defaultFeatures: FeatureFlags = {
  // AI Features
  aiChatbot: true,
  aiRecommendations: true,
  aiSearch: true,
  aiContentGeneration: false,
  visualSearch: false,
  voiceSearch: false,

  // Product Features
  arViewer: true,
  productPersonalization: true,
  productComparison: true,
  completeTheSet: true,
  quickView: true,

  // Shopping Features
  wishlist: true,
  giftRegistry: true,
  priceAlerts: false,
  restockAlerts: false,
  savedAddresses: true,

  // UX Features
  recentlyViewed: true,
  socialProof: true,
  liveInventory: true,
  flashSales: true,
  seasonalThemes: true,

  // Personalization
  userPreferences: true,
  styleQuiz: true,
  dynamicHomepage: false,
  productRecommendations: true,

  // Performance
  lazyLoading: true,
  imageOptimization: true,
  codesplitting: true,

  // Admin
  realtimeSync: true,
  livePreview: false,
};

// Feature dependencies - some features require others to be enabled
export const featureDependencies: Partial<Record<keyof FeatureFlags, (keyof FeatureFlags)[]>> = {
  aiRecommendations: ['productRecommendations'],
  aiChatbot: ['aiSearch'],
  productComparison: ['quickView'],
  priceAlerts: ['wishlist'],
  restockAlerts: ['wishlist'],
  dynamicHomepage: ['userPreferences', 'productRecommendations'],
};

export const isFeatureEnabled = (
  feature: keyof FeatureFlags,
  flags: FeatureFlags = defaultFeatures
): boolean => {
  if (!flags[feature]) return false;

  // Check dependencies
  const dependencies = featureDependencies[feature];
  if (dependencies) {
    return dependencies.every((dep) => flags[dep]);
  }

  return true;
};
