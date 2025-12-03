import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Calendar as CalendarIcon,
  Percent,
  Tag,
  Megaphone,
  Zap,
  Image,
  Copy
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  minPurchase: number;
  maxUses: number | null;
  usesCount: number;
  expiresAt: Date | null;
  isActive: boolean;
}

interface FlashSale {
  id: string;
  title: string;
  discount: number;
  startDate: Date;
  endDate: Date;
  products: string[];
  isActive: boolean;
}

const mockCoupons: Coupon[] = [
  { id: '1', code: 'SUMMER20', type: 'percentage', value: 20, minPurchase: 50, maxUses: 100, usesCount: 45, expiresAt: new Date('2024-08-31'), isActive: true },
  { id: '2', code: 'FREESHIP', type: 'free_shipping', value: 0, minPurchase: 75, maxUses: null, usesCount: 234, expiresAt: null, isActive: true },
  { id: '3', code: 'FLASH50', type: 'fixed', value: 50, minPurchase: 200, maxUses: 50, usesCount: 50, expiresAt: new Date('2024-06-15'), isActive: false },
];

const mockFlashSales: FlashSale[] = [
  { id: '1', title: 'Weekend Tech Sale', discount: 30, startDate: new Date(), endDate: new Date(Date.now() + 86400000 * 2), products: ['phone1', 'laptop1'], isActive: true },
  { id: '2', title: 'Fashion Friday', discount: 25, startDate: new Date(Date.now() + 86400000 * 5), endDate: new Date(Date.now() + 86400000 * 6), products: ['shirt1', 'shoes1'], isActive: false },
];

export function MarketingAdmin() {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [flashSales, setFlashSales] = useState<FlashSale[]>(mockFlashSales);
  const [newCoupon, setNewCoupon] = useState<{
    code: string;
    type: 'percentage' | 'fixed' | 'free_shipping';
    value: number;
    minPurchase: number;
    maxUses: number | null;
    expiresAt: Date | null;
  }>({
    code: '',
    type: 'percentage',
    value: 10,
    minPurchase: 0,
    maxUses: null,
    expiresAt: null,
  });

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewCoupon({ ...newCoupon, code });
  };

  const createCoupon = () => {
    if (!newCoupon.code) {
      toast({ title: 'Error', description: 'Please enter a coupon code', variant: 'destructive' });
      return;
    }
    const coupon: Coupon = {
      id: String(Date.now()),
      ...newCoupon,
      usesCount: 0,
      isActive: true,
    };
    setCoupons([...coupons, coupon]);
    setNewCoupon({ code: '', type: 'percentage', value: 10, minPurchase: 0, maxUses: null, expiresAt: null });
    toast({ title: 'Coupon Created', description: `Coupon ${coupon.code} has been created.` });
  };

  const toggleCoupon = (id: string) => {
    setCoupons(coupons.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  const deleteCoupon = (id: string) => {
    setCoupons(coupons.filter(c => c.id !== id));
    toast({ title: 'Coupon Deleted', description: 'The coupon has been removed.' });
  };

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: 'Copied!', description: `${code} copied to clipboard.` });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Marketing & Promotions</h2>
        <p className="text-muted-foreground">
          Manage coupons, flash sales, banners, and promotional campaigns
        </p>
      </div>

      <Tabs defaultValue="coupons" className="space-y-4">
        <TabsList>
          <TabsTrigger value="coupons">Coupon Codes</TabsTrigger>
          <TabsTrigger value="flash-sales">Flash Sales</TabsTrigger>
          <TabsTrigger value="banners">Banners & Ads</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="coupons" className="space-y-4">
          {/* Create Coupon */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Create New Coupon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Coupon Code</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                      placeholder="SUMMER20"
                    />
                    <Button variant="outline" size="icon" onClick={generateCouponCode}>
                      <Zap className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Discount Type</Label>
                  <Select
                    value={newCoupon.type}
                    onValueChange={(v: 'percentage' | 'fixed' | 'free_shipping') => 
                      setNewCoupon({ ...newCoupon, type: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage Off</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="free_shipping">Free Shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newCoupon.type !== 'free_shipping' && (
                  <div className="space-y-2">
                    <Label>Value {newCoupon.type === 'percentage' ? '(%)' : '($)'}</Label>
                    <Input
                      type="number"
                      value={newCoupon.value}
                      onChange={(e) => setNewCoupon({ ...newCoupon, value: Number(e.target.value) })}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Minimum Purchase ($)</Label>
                  <Input
                    type="number"
                    value={newCoupon.minPurchase}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minPurchase: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Uses (leave empty for unlimited)</Label>
                  <Input
                    type="number"
                    value={newCoupon.maxUses || ''}
                    onChange={(e) => setNewCoupon({ ...newCoupon, maxUses: e.target.value ? Number(e.target.value) : null })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Expiry Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newCoupon.expiresAt ? format(newCoupon.expiresAt, 'PPP') : 'No expiry'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newCoupon.expiresAt || undefined}
                        onSelect={(date) => setNewCoupon({ ...newCoupon, expiresAt: date || null })}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <Button className="mt-4" onClick={createCoupon}>
                <Plus className="h-4 w-4 mr-2" />
                Create Coupon
              </Button>
            </CardContent>
          </Card>

          {/* Coupons Table */}
          <Card>
            <CardHeader>
              <CardTitle>Active Coupons</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Min. Purchase</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="bg-muted px-2 py-1 rounded">{coupon.code}</code>
                          <Button variant="ghost" size="icon" onClick={() => copyCouponCode(coupon.code)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{coupon.type.replace('_', ' ')}</TableCell>
                      <TableCell>
                        {coupon.type === 'percentage' ? `${coupon.value}%` :
                         coupon.type === 'fixed' ? `$${coupon.value}` : '-'}
                      </TableCell>
                      <TableCell>${coupon.minPurchase}</TableCell>
                      <TableCell>
                        {coupon.usesCount}{coupon.maxUses ? `/${coupon.maxUses}` : ''}
                      </TableCell>
                      <TableCell>
                        {coupon.expiresAt ? format(coupon.expiresAt, 'PP') : 'Never'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={coupon.isActive ? 'default' : 'secondary'}>
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Switch
                            checked={coupon.isActive}
                            onCheckedChange={() => toggleCoupon(coupon.id)}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => deleteCoupon(coupon.id)}
                          >
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

        <TabsContent value="flash-sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Flash Sales Schedule
              </CardTitle>
              <CardDescription>
                Create time-limited sales events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {flashSales.map((sale) => (
                  <div key={sale.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{sale.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {format(sale.startDate, 'PPP')} - {format(sale.endDate, 'PPP')}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={sale.isActive ? 'default' : 'secondary'}>
                          {sale.isActive ? 'Active' : 'Scheduled'}
                        </Badge>
                        <Badge variant="outline">{sale.discount}% OFF</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Flash Sale
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banners" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Banner Management
              </CardTitle>
              <CardDescription>
                Manage promotional banners across the site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Hero Banner', 'Category Banner', 'Sidebar Ad', 'Footer Promo'].map((banner) => (
                  <div key={banner} className="border rounded-lg p-4">
                    <div className="h-32 bg-muted rounded-lg mb-3 flex items-center justify-center">
                      <Image className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h4 className="font-medium">{banner}</h4>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm">Upload Image</Button>
                      <Button variant="outline" size="sm">Settings</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                Marketing Campaigns
              </CardTitle>
              <CardDescription>
                Create and manage email & promotional campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Summer Collection Launch</h4>
                    <Badge>Running</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Email + Push notification campaign for new summer arrivals
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Sent</p>
                      <p className="font-semibold">12,458</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Open Rate</p>
                      <p className="font-semibold">24.5%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Click Rate</p>
                      <p className="font-semibold">8.2%</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
