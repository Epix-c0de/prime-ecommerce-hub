import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function BulkOperations() {
  const { toast } = useToast();
  const [operationType, setOperationType] = useState<string>("import");
  const [entityType, setEntityType] = useState<string>("products");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to import.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const products = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',');
          const product: any = {};
          headers.forEach((header, index) => {
            product[header] = values[index]?.trim();
          });
          products.push(product);
        }
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Create bulk operation record
        const { data: operation } = await supabase
          .from('bulk_operations')
          .insert({
            operation_type: 'import',
            entity_type: entityType,
            status: 'processing',
            total_items: products.length,
            performed_by: user.id,
            started_at: new Date().toISOString(),
          })
          .select()
          .single();

        // Process products
        let processed = 0;
        let failed = 0;
        for (const product of products) {
          try {
            await supabase.from('products').insert({
              name: product.name,
              slug: product.slug || product.name.toLowerCase().replace(/\s+/g, '-'),
              description: product.description,
              price: parseFloat(product.price),
              stock: parseInt(product.stock) || 0,
              store_type: product.store_type || 'tech',
              is_featured: product.is_featured === 'true',
            });
            processed++;
          } catch (error) {
            failed++;
          }
        }

        // Update operation status
        await supabase
          .from('bulk_operations')
          .update({
            status: 'completed',
            processed_items: processed,
            failed_items: failed,
            completed_at: new Date().toISOString(),
          })
          .eq('id', operation!.id);

        toast({
          title: "Import completed",
          description: `Processed ${processed} items. Failed: ${failed}`,
        });
      } catch (error: any) {
        toast({
          title: "Import failed",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    reader.readAsText(file);
  };

  const handleExport = async () => {
    try {
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('store_type', 'tech');

      if (!products) return;

      const headers = ['name', 'slug', 'description', 'price', 'stock', 'store_type', 'is_featured'];
      const csv = [
        headers.join(','),
        ...products.map(p => 
          headers.map(h => {
            const value = (p as any)[h];
            return typeof value === 'string' && value.includes(',') 
              ? `"${value}"` 
              : value;
          }).join(',')
        )
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `products-export-${Date.now()}.csv`;
      a.click();

      toast({
        title: "Export completed",
        description: "Products have been exported to CSV.",
      });
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Operations</CardTitle>
        <CardDescription>
          Import, export, or bulk edit products and variants
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Operation Type</Label>
            <Select value={operationType} onValueChange={setOperationType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="import">Import CSV</SelectItem>
                <SelectItem value="export">Export CSV</SelectItem>
                <SelectItem value="bulk_edit">Bulk Edit</SelectItem>
                <SelectItem value="bulk_delete">Bulk Delete</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Entity Type</Label>
            <Select value={entityType} onValueChange={setEntityType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="products">Products</SelectItem>
                <SelectItem value="variants">Variants</SelectItem>
                <SelectItem value="categories">Categories</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {operationType === 'import' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csv-file">CSV File</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
              />
              <p className="text-sm text-muted-foreground">
                Upload a CSV file with columns: name, slug, description, price, stock, store_type, is_featured
              </p>
            </div>
            <Button onClick={handleImport} className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Import Products
            </Button>
          </div>
        )}

        {operationType === 'export' && (
          <Button onClick={handleExport} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Export to CSV
          </Button>
        )}

        {operationType === 'bulk_edit' && (
          <div className="text-center py-8 text-muted-foreground">
            <Edit className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Bulk edit functionality coming soon</p>
          </div>
        )}

        {operationType === 'bulk_delete' && (
          <div className="text-center py-8 text-muted-foreground">
            <Trash2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Bulk delete functionality coming soon</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}