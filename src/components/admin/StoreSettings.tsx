import { useConfig } from '@/contexts/ConfigContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StoreType } from '@/config/storeConfig';
import { toast } from 'sonner';
import { Store, Smartphone } from 'lucide-react';

export function StoreSettings() {
  const { store, storeType, switchStore } = useConfig();

  const handleStoreSwitch = (type: StoreType) => {
    switchStore(type);
    toast.success(`Switched to ${type === 'tech' ? 'Tech' : 'Lifestyle'} store`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Store</CardTitle>
          <CardDescription>
            Viewing: <Badge variant="secondary">{store.name}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">{store.name}</h3>
              <p className="text-sm text-muted-foreground">{store.tagline}</p>
              <p className="text-sm text-muted-foreground mt-1">{store.description}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Brand Colors</h4>
              <div className="flex gap-2">
                <div
                  className="w-12 h-12 rounded border"
                  style={{ background: `hsl(${store.branding.primaryColor})` }}
                />
                <div
                  className="w-12 h-12 rounded border"
                  style={{ background: `hsl(${store.branding.accentColor})` }}
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Categories ({store.categories.length})</h4>
              <div className="flex flex-wrap gap-2">
                {store.categories.map((cat) => (
                  <Badge key={cat.id} variant="outline">
                    {cat.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Enabled Features</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(store.features)
                  .filter(([_, enabled]) => enabled)
                  .map(([feature]) => (
                    <Badge key={feature} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Switch Store</CardTitle>
          <CardDescription>
            Toggle between Tech and Lifestyle stores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={storeType === 'tech' ? 'default' : 'outline'}
              onClick={() => handleStoreSwitch('tech')}
              className="h-32 flex flex-col gap-3"
            >
              <Smartphone className="h-8 w-8" />
              <div className="text-center">
                <div className="font-medium">Tech Store</div>
                <div className="text-xs text-muted-foreground">
                  Electronics & Gadgets
                </div>
              </div>
              {storeType === 'tech' && <Badge variant="secondary">Active</Badge>}
            </Button>

            <Button
              variant={storeType === 'lifestyle' ? 'default' : 'outline'}
              onClick={() => handleStoreSwitch('lifestyle')}
              className="h-32 flex flex-col gap-3"
            >
              <Store className="h-8 w-8" />
              <div className="text-center">
                <div className="font-medium">Lifestyle Store</div>
                <div className="text-xs text-muted-foreground">
                  Fashion & Living
                </div>
              </div>
              {storeType === 'lifestyle' && <Badge variant="secondary">Active</Badge>}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
