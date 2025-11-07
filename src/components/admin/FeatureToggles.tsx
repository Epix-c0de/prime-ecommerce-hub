import { useConfig } from '@/contexts/ConfigContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FeatureFlags } from '@/config/featuresConfig';
import { toast } from 'sonner';

const featureGroups = {
  'AI Features': [
    { key: 'aiChatbot', label: 'AI Chatbot', description: 'Smart shopping assistant' },
    { key: 'aiRecommendations', label: 'AI Recommendations', description: 'Personalized suggestions' },
    { key: 'aiSearch', label: 'AI Search', description: 'Intelligent product search' },
    { key: 'visualSearch', label: 'Visual Search', description: 'Search by image' },
    { key: 'voiceSearch', label: 'Voice Search', description: 'Voice-activated search' },
  ],
  'Product Features': [
    { key: 'arViewer', label: 'AR Viewer', description: '3D/AR product preview' },
    { key: 'productPersonalization', label: 'Personalization', description: 'Custom engravings, colors' },
    { key: 'productComparison', label: 'Comparison', description: 'Compare multiple products' },
    { key: 'completeTheSet', label: 'Complete the Set', description: 'Bundle suggestions' },
    { key: 'quickView', label: 'Quick View', description: 'Fast product preview' },
  ],
  'Shopping Features': [
    { key: 'wishlist', label: 'Wishlist', description: 'Save favorite items' },
    { key: 'giftRegistry', label: 'Gift Registry', description: 'Wedding/event registries' },
    { key: 'priceAlerts', label: 'Price Alerts', description: 'Notify on price drops' },
    { key: 'restockAlerts', label: 'Restock Alerts', description: 'Notify when back in stock' },
  ],
  'UX Features': [
    { key: 'recentlyViewed', label: 'Recently Viewed', description: 'Show browsing history' },
    { key: 'socialProof', label: 'Social Proof', description: 'Real-time purchase notifications' },
    { key: 'liveInventory', label: 'Live Inventory', description: 'Real-time stock updates' },
    { key: 'flashSales', label: 'Flash Sales', description: 'Limited-time deals' },
    { key: 'seasonalThemes', label: 'Seasonal Themes', description: 'Festive visual changes' },
  ],
};

export function FeatureToggles() {
  const { features, toggleFeature } = useConfig();

  const handleToggle = (feature: keyof FeatureFlags, enabled: boolean) => {
    toggleFeature(feature, enabled);
    toast.success(`${feature} ${enabled ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="space-y-6">
      {Object.entries(featureGroups).map(([groupName, groupFeatures]) => (
        <Card key={groupName}>
          <CardHeader>
            <CardTitle>{groupName}</CardTitle>
            <CardDescription>
              Toggle features in this category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {groupFeatures.map((feature) => (
                <div
                  key={feature.key}
                  className="flex items-center justify-between space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <Label htmlFor={feature.key} className="text-base font-medium cursor-pointer">
                      {feature.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                  <Switch
                    id={feature.key}
                    checked={features[feature.key as keyof FeatureFlags]}
                    onCheckedChange={(checked) =>
                      handleToggle(feature.key as keyof FeatureFlags, checked)
                    }
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
