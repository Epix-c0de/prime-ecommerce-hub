import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Image as ImageIcon, Loader2, Boxes, Store } from 'lucide-react';
import { ModelUploadGuide } from './ModelUploadGuide';
import { ProductVariantManager } from './ProductVariantManager';
import { MultiImageUpload } from '@/components/ui/image-upload';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  original_price: number | null;
  stock: number;
  category_id: string | null;
  brand: string | null;
  images: string[];
  tags: string[];
  is_featured: boolean;
  is_flash_sale: boolean;
  flash_sale_ends_at: string | null;
  ar_enabled: boolean;
  model_url: string | null;
  personalization_enabled: boolean;
  specifications: any;
  store_type: string;
  store_id: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  store_type: string;
}

interface StoreData {
  id: string;
  name: string;
  store_type: string;
}

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [variantProduct, setVariantProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    original_price: '',
    stock: '',
    category_id: '',
    brand: '',
    images: [] as string[],
    tags: '',
    is_featured: false,
    is_flash_sale: false,
    ar_enabled: false,
    personalization_enabled: false,
    store_type: 'tech',
    store_id: '',
    model_url: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes, storesRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('id, name, slug, store_type').order('name'),
        supabase.from('stores').select('id, name, store_type').eq('is_active', true)
      ]);

      if (productsRes.data) setProducts(productsRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (storesRes.data) setStores(storesRes.data);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error loading data', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
      description: formData.description || null,
      price: parseFloat(formData.price),
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      stock: parseInt(formData.stock) || 0,
      category_id: formData.category_id || null,
      brand: formData.brand || null,
      images: formData.images,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
      is_featured: formData.is_featured,
      is_flash_sale: formData.is_flash_sale,
      ar_enabled: formData.ar_enabled,
      personalization_enabled: formData.personalization_enabled,
      store_type: formData.store_type,
      store_id: formData.store_id || null,
      model_url: formData.model_url || null
    };

    try {
      if (editingProduct) {
        const { error } = await supabase.from('products').update(productData).eq('id', editingProduct.id);
        if (error) throw error;
        toast({ title: 'Product updated successfully' });
      } else {
        const { error } = await supabase.from('products').insert([productData]);
        if (error) throw error;
        toast({ title: 'Product created successfully' });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error saving product', description: error.message });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: product.price.toString(),
      original_price: product.original_price?.toString() || '',
      stock: product.stock?.toString() || '0',
      category_id: product.category_id || '',
      brand: product.brand || '',
      images: product.images || [],
      tags: product.tags?.join(', ') || '',
      is_featured: product.is_featured || false,
      is_flash_sale: product.is_flash_sale || false,
      ar_enabled: product.ar_enabled || false,
      personalization_enabled: product.personalization_enabled || false,
      store_type: product.store_type,
      store_id: product.store_id || '',
      model_url: product.model_url || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Product deleted successfully' });
      fetchData();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error deleting product', description: error.message });
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '', slug: '', description: '', price: '', original_price: '', stock: '',
      category_id: '', brand: '', images: [], tags: '', is_featured: false,
      is_flash_sale: false, ar_enabled: false, personalization_enabled: false,
      store_type: 'tech', store_id: '', model_url: ''
    });
  };

  const filteredCategories = categories.filter(c => c.store_type === formData.store_type);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Product Management</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" />Add Product</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Create New Product'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="auto-generated" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (KSh) *</Label>
                    <Input id="price" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="original_price">Original Price</Label>
                    <Input id="original_price" type="number" step="0.01" value={formData.original_price} onChange={(e) => setFormData({ ...formData, original_price: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input id="stock" type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Store Type</Label>
                    <Select value={formData.store_type} onValueChange={(value) => setFormData({ ...formData, store_type: value, category_id: '' })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech">Tech Store</SelectItem>
                        <SelectItem value="lifestyle">Lifestyle Store</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Assign to Store (Optional)</Label>
                    <Select value={formData.store_id} onValueChange={(value) => setFormData({ ...formData, store_id: value })}>
                      <SelectTrigger><SelectValue placeholder="All stores of this type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Stores</SelectItem>
                        {stores.filter(s => s.store_type === formData.store_type).map(store => (
                          <SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {filteredCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input id="brand" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Product Images (drag and drop)</Label>
                  <MultiImageUpload
                    value={formData.images}
                    onChange={(urls) => setFormData({ ...formData, images: urls })}
                    bucket="products"
                    folder="images"
                    maxImages={8}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input id="tags" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="electronics, sale, popular" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model_url">3D Model URL (.glb/.gltf for AR)</Label>
                  <Input id="model_url" value={formData.model_url} onChange={(e) => setFormData({ ...formData, model_url: e.target.value })} placeholder="https://example.com/model.glb" />
                  <p className="text-xs text-muted-foreground">Upload 3D models to external storage and paste the URL here for AR viewing</p>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="is_featured">Featured Product</Label>
                      <Switch id="is_featured" checked={formData.is_featured} onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="is_flash_sale">Flash Sale</Label>
                      <Switch id="is_flash_sale" checked={formData.is_flash_sale} onCheckedChange={(checked) => setFormData({ ...formData, is_flash_sale: checked })} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="ar_enabled">AR Enabled</Label>
                      <Switch id="ar_enabled" checked={formData.ar_enabled} onCheckedChange={(checked) => setFormData({ ...formData, ar_enabled: checked })} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="personalization_enabled">Personalization</Label>
                      <Switch id="personalization_enabled" checked={formData.personalization_enabled} onCheckedChange={(checked) => setFormData({ ...formData, personalization_enabled: checked })} />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">{editingProduct ? 'Update' : 'Create'} Product</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>KSh {product.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={product.stock && product.stock > 0 ? 'default' : 'destructive'}>{product.stock || 0}</Badge>
                  </TableCell>
                  <TableCell>{categories.find(c => c.id === product.category_id)?.name || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      <Store className="h-3 w-3 mr-1" />
                      {product.store_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {product.is_featured && <Badge className="bg-orange-500">Featured</Badge>}
                      {product.is_flash_sale && <Badge variant="destructive">Flash</Badge>}
                      {product.ar_enabled && <Badge>AR</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="outline" onClick={() => setVariantProduct(product)} title="Variants">
                        <Boxes className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)}>
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

      {/* Variant Manager Modal */}
      {variantProduct && (
        <Dialog open={!!variantProduct} onOpenChange={(open) => !open && setVariantProduct(null)}>
          <DialogContent className="max-w-2xl">
            <ProductVariantManager productId={variantProduct.id} productName={variantProduct.name} />
          </DialogContent>
        </Dialog>
      )}

      <ModelUploadGuide />
    </>
  );
}
