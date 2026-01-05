import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ImageUpload } from '@/components/ui/image-upload';
import { 
  Plus, Trash2, Edit, Calendar as CalendarIcon, Percent, Tag, Megaphone, Zap, Image, Copy, Loader2, Settings
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface Banner {
  id: string;
  name: string;
  type: string;
  image_url: string | null;
  link_url: string | null;
  title: string | null;
  subtitle: string | null;
  is_active: boolean;
  store_type: string;
  display_order: number;
}

interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  min_purchase: number | null;
  max_uses: number | null;
  uses_count: number | null;
  expires_at: string | null;
  is_active: boolean | null;
}

export function MarketingAdmin() {
  const { toast } = useToast();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerDialogOpen, setBannerDialogOpen] = useState(false);
  const [bannerForm, setBannerForm] = useState({
    name: '',
    type: 'hero',
    image_url: '',
    link_url: '',
    title: '',
    subtitle: '',
    store_type: 'tech',
    is_active: true
  });

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: 10,
    min_purchase: 0,
    max_uses: null as number | null,
    expires_at: null as Date | null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bannersRes, couponsRes] = await Promise.all([
        supabase.from('banners').select('*').order('display_order'),
        supabase.from('coupons').select('*').order('created_at', { ascending: false })
      ]);

      if (bannersRes.data) setBanners(bannersRes.data);
      if (couponsRes.data) setCoupons(couponsRes.data);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error loading data', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Banner functions
  const saveBanner = async () => {
    try {
      const data = {
        name: bannerForm.name,
        type: bannerForm.type,
        image_url: bannerForm.image_url || null,
        link_url: bannerForm.link_url || null,
        title: bannerForm.title || null,
        subtitle: bannerForm.subtitle || null,
        store_type: bannerForm.store_type,
        is_active: bannerForm.is_active
      };

      if (editingBanner) {
        const { error } = await supabase.from('banners').update(data).eq('id', editingBanner.id);
        if (error) throw error;
        toast({ title: 'Banner updated' });
      } else {
        const { error } = await supabase.from('banners').insert([data]);
        if (error) throw error;
        toast({ title: 'Banner created' });
      }

      setBannerDialogOpen(false);
      resetBannerForm();
      fetchData();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error saving banner', description: error.message });
    }
  };

  const deleteBanner = async (id: string) => {
    if (!confirm('Delete this banner?')) return;
    try {
      const { error } = await supabase.from('banners').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Banner deleted' });
      fetchData();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const editBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setBannerForm({
      name: banner.name,
      type: banner.type,
      image_url: banner.image_url || '',
      link_url: banner.link_url || '',
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      store_type: banner.store_type,
      is_active: banner.is_active
    });
    setBannerDialogOpen(true);
  };

  const resetBannerForm = () => {
    setEditingBanner(null);
    setBannerForm({
      name: '', type: 'hero', image_url: '', link_url: '', title: '', subtitle: '', store_type: 'tech', is_active: true
    });
  };

  // Coupon functions
  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    setNewCoupon({ ...newCoupon, code });
  };

  const createCoupon = async () => {
    if (!newCoupon.code) {
      toast({ title: 'Error', description: 'Please enter a coupon code', variant: 'destructive' });
      return;
    }
    try {
      const { error } = await supabase.from('coupons').insert([{
        code: newCoupon.code,
        discount_type: newCoupon.discount_type,
        discount_value: newCoupon.discount_value,
        min_purchase: newCoupon.min_purchase || null,
        max_uses: newCoupon.max_uses,
        expires_at: newCoupon.expires_at?.toISOString() || null,
        is_active: true
      }]);
      if (error) throw error;
      toast({ title: 'Coupon Created', description: `Coupon ${newCoupon.code} has been created.` });
      setNewCoupon({ code: '', discount_type: 'percentage', discount_value: 10, min_purchase: 0, max_uses: null, expires_at: null });
      fetchData();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const toggleCoupon = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase.from('coupons').update({ is_active: !isActive }).eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const deleteCoupon = async (id: string) => {
    try {
      const { error } = await supabase.from('coupons').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Coupon Deleted' });
      fetchData();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: 'Copied!', description: `${code} copied to clipboard.` });
  };

  const bannerTypes = [
    { value: 'hero', label: 'Hero Banner' },
    { value: 'category', label: 'Category Banner' },
    { value: 'sidebar', label: 'Sidebar Ad' },
    { value: 'footer', label: 'Footer Promo' },
    { value: 'popup', label: 'Popup Ad' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Marketing & Promotions</h2>
        <p className="text-muted-foreground">Manage coupons, flash sales, banners, and promotional campaigns</p>
      </div>

      <Tabs defaultValue="banners" className="space-y-4">
        <TabsList>
          <TabsTrigger value="banners">Banners & Ads</TabsTrigger>
          <TabsTrigger value="coupons">Coupon Codes</TabsTrigger>
          <TabsTrigger value="flash-sales">Flash Sales</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        </TabsList>

        {/* Banners Tab */}
        <TabsContent value="banners" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Banner Management
                </CardTitle>
                <CardDescription>Manage promotional banners across the site</CardDescription>
              </div>
              <Dialog open={bannerDialogOpen} onOpenChange={(open) => {
                setBannerDialogOpen(open);
                if (!open) resetBannerForm();
              }}>
                <DialogTrigger asChild>
                  <Button><Plus className="mr-2 h-4 w-4" />Add Banner</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingBanner ? 'Edit Banner' : 'Create Banner'}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Banner Name *</Label>
                        <Input
                          value={bannerForm.name}
                          onChange={(e) => setBannerForm({ ...bannerForm, name: e.target.value })}
                          placeholder="Summer Sale Banner"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Banner Type</Label>
                        <Select value={bannerForm.type} onValueChange={(v) => setBannerForm({ ...bannerForm, type: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {bannerTypes.map(t => (
                              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Banner Image</Label>
                      <ImageUpload
                        value={bannerForm.image_url}
                        onChange={(url) => setBannerForm({ ...bannerForm, image_url: url })}
                        bucket="banners"
                        folder={bannerForm.type}
                        aspectRatio={bannerForm.type === 'hero' ? 'wide' : 'video'}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Title (optional)</Label>
                        <Input
                          value={bannerForm.title}
                          onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                          placeholder="Big Summer Sale"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Subtitle (optional)</Label>
                        <Input
                          value={bannerForm.subtitle}
                          onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                          placeholder="Up to 50% off"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Link URL</Label>
                        <Input
                          value={bannerForm.link_url}
                          onChange={(e) => setBannerForm({ ...bannerForm, link_url: e.target.value })}
                          placeholder="/products?sale=true"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Store</Label>
                        <Select value={bannerForm.store_type} onValueChange={(v) => setBannerForm({ ...bannerForm, store_type: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tech">Tech Store</SelectItem>
                            <SelectItem value="lifestyle">Lifestyle Store</SelectItem>
                            <SelectItem value="all">All Stores</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={bannerForm.is_active}
                        onCheckedChange={(checked) => setBannerForm({ ...bannerForm, is_active: checked })}
                      />
                      <Label>Active</Label>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setBannerDialogOpen(false)}>Cancel</Button>
                      <Button onClick={saveBanner}>{editingBanner ? 'Update' : 'Create'} Banner</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {banners.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    No banners yet. Create your first banner to get started.
                  </div>
                ) : (
                  banners.map((banner) => (
                    <div key={banner.id} className="border rounded-lg overflow-hidden">
                      <div className="aspect-video bg-muted relative">
                        {banner.image_url ? (
                          <img src={banner.image_url} alt={banner.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Image className="h-12 w-12 text-muted-foreground/50" />
                          </div>
                        )}
                        <Badge className="absolute top-2 left-2" variant={banner.is_active ? 'default' : 'secondary'}>
                          {banner.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium truncate">{banner.name}</h4>
                          <Badge variant="outline" className="capitalize text-xs">{banner.type}</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => editBanner(banner)}>
                            <Edit className="h-3 w-3 mr-1" />Edit
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteBanner(banner.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Coupons Tab */}
        <TabsContent value="coupons" className="space-y-4">
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
                    value={newCoupon.discount_type}
                    onValueChange={(v) => setNewCoupon({ ...newCoupon, discount_type: v })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage Off</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="free_shipping">Free Shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newCoupon.discount_type !== 'free_shipping' && (
                  <div className="space-y-2">
                    <Label>Value {newCoupon.discount_type === 'percentage' ? '(%)' : '(KSh)'}</Label>
                    <Input
                      type="number"
                      value={newCoupon.discount_value}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discount_value: Number(e.target.value) })}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Minimum Purchase (KSh)</Label>
                  <Input
                    type="number"
                    value={newCoupon.min_purchase}
                    onChange={(e) => setNewCoupon({ ...newCoupon, min_purchase: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Uses (leave empty for unlimited)</Label>
                  <Input
                    type="number"
                    value={newCoupon.max_uses || ''}
                    onChange={(e) => setNewCoupon({ ...newCoupon, max_uses: e.target.value ? Number(e.target.value) : null })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Expiry Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newCoupon.expires_at ? format(newCoupon.expires_at, 'PPP') : 'No expiry'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newCoupon.expires_at || undefined}
                        onSelect={(date) => setNewCoupon({ ...newCoupon, expires_at: date || null })}
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

          <Card>
            <CardHeader><CardTitle>Active Coupons</CardTitle></CardHeader>
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
                      <TableCell className="capitalize">{coupon.discount_type.replace('_', ' ')}</TableCell>
                      <TableCell>
                        {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` :
                         coupon.discount_type === 'fixed' ? `KSh ${coupon.discount_value}` : '-'}
                      </TableCell>
                      <TableCell>KSh {coupon.min_purchase || 0}</TableCell>
                      <TableCell>
                        {coupon.uses_count || 0}{coupon.max_uses ? `/${coupon.max_uses}` : ''}
                      </TableCell>
                      <TableCell>
                        {coupon.expires_at ? format(new Date(coupon.expires_at), 'PP') : 'Never'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={coupon.is_active ? 'default' : 'secondary'}>
                          {coupon.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Switch
                            checked={coupon.is_active || false}
                            onCheckedChange={() => toggleCoupon(coupon.id, coupon.is_active || false)}
                          />
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteCoupon(coupon.id)}>
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
              <CardDescription>Create time-limited sales events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Flash sales are managed through product settings.</p>
                <p className="text-sm">Enable "Flash Sale" on individual products in Product Management.</p>
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
              <CardDescription>Create and manage email & promotional campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Campaign management coming soon.</p>
                <p className="text-sm">Email and push notification campaigns will be available in a future update.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
