import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  Plus,
  Edit,
  Trash2,
  Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  baseFee: number;
  freeThreshold: number | null;
  estimatedDays: string;
  isActive: boolean;
}

interface DeliveryPartner {
  id: string;
  name: string;
  logo: string;
  trackingUrl: string;
  isActive: boolean;
  supportedZones: string[];
}

const mockZones: ShippingZone[] = [
  { id: '1', name: 'Local', countries: ['Kenya'], baseFee: 5, freeThreshold: 50, estimatedDays: '1-2', isActive: true },
  { id: '2', name: 'East Africa', countries: ['Uganda', 'Tanzania', 'Rwanda'], baseFee: 15, freeThreshold: 100, estimatedDays: '3-5', isActive: true },
  { id: '3', name: 'International', countries: ['USA', 'UK', 'Germany'], baseFee: 35, freeThreshold: null, estimatedDays: '7-14', isActive: true },
];

const mockPartners: DeliveryPartner[] = [
  { id: '1', name: 'G4S', logo: '', trackingUrl: 'https://g4s.com/track/', isActive: true, supportedZones: ['1', '2'] },
  { id: '2', name: 'Sendy', logo: '', trackingUrl: 'https://sendy.co.ke/track/', isActive: true, supportedZones: ['1'] },
  { id: '3', name: 'DHL', logo: '', trackingUrl: 'https://dhl.com/track/', isActive: true, supportedZones: ['2', '3'] },
  { id: '4', name: 'FedEx', logo: '', trackingUrl: 'https://fedex.com/track/', isActive: false, supportedZones: ['3'] },
];

export function ShippingAdmin() {
  const { toast } = useToast();
  const [zones, setZones] = useState<ShippingZone[]>(mockZones);
  const [partners, setPartners] = useState<DeliveryPartner[]>(mockPartners);

  const toggleZone = (id: string) => {
    setZones(zones.map(z => z.id === id ? { ...z, isActive: !z.isActive } : z));
    toast({ title: 'Zone Updated', description: 'Shipping zone status has been updated.' });
  };

  const togglePartner = (id: string) => {
    setPartners(partners.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
    toast({ title: 'Partner Updated', description: 'Delivery partner status has been updated.' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Shipping & Delivery</h2>
        <p className="text-muted-foreground">
          Manage shipping zones, fees, and delivery partners
        </p>
      </div>

      <Tabs defaultValue="zones" className="space-y-4">
        <TabsList>
          <TabsTrigger value="zones">Shipping Zones</TabsTrigger>
          <TabsTrigger value="partners">Delivery Partners</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="zones" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Shipping Zones
                  </CardTitle>
                  <CardDescription>
                    Configure shipping rates by region
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Zone
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Zone Name</TableHead>
                    <TableHead>Countries</TableHead>
                    <TableHead>Base Fee</TableHead>
                    <TableHead>Free Shipping</TableHead>
                    <TableHead>Est. Delivery</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {zones.map((zone) => (
                    <TableRow key={zone.id}>
                      <TableCell className="font-medium">{zone.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {zone.countries.slice(0, 2).map((c) => (
                            <Badge key={c} variant="outline">{c}</Badge>
                          ))}
                          {zone.countries.length > 2 && (
                            <Badge variant="outline">+{zone.countries.length - 2}</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>${zone.baseFee}</TableCell>
                      <TableCell>
                        {zone.freeThreshold ? `Over $${zone.freeThreshold}` : 'Not available'}
                      </TableCell>
                      <TableCell>{zone.estimatedDays} days</TableCell>
                      <TableCell>
                        <Badge variant={zone.isActive ? 'default' : 'secondary'}>
                          {zone.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Switch
                            checked={zone.isActive}
                            onCheckedChange={() => toggleZone(zone.id)}
                          />
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partners" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Delivery Partners
                  </CardTitle>
                  <CardDescription>
                    Manage courier integrations
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Partner
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {partners.map((partner) => (
                  <div key={partner.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                          <Truck className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{partner.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {partner.supportedZones.length} zones
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={partner.isActive}
                        onCheckedChange={() => togglePartner(partner.id)}
                      />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        Zones: {zones.filter(z => partner.supportedZones.includes(z.id)).map(z => z.name).join(', ')}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm">Configure</Button>
                      <Button variant="outline" size="sm">View Rates</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Default Shipping Method</Label>
                  <Input defaultValue="Standard Delivery" />
                </div>
                <div className="space-y-2">
                  <Label>Handling Time (days)</Label>
                  <Input type="number" defaultValue="1" />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Show Estimated Delivery Date</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Allow Customer Notes</Label>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Free Shipping Rules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Free Shipping</Label>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>Minimum Order Amount</Label>
                  <Input type="number" defaultValue="50" />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Free Shipping for VIP Customers</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Free Shipping on First Order</Label>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Tracking Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Auto-send Tracking Emails</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>SMS Tracking Updates</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Show Real-time Tracking</Label>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
