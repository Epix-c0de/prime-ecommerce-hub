import { useState } from "react";
import { useProductVariants, useCreateVariant, useUpdateVariant, useDeleteVariant } from "@/hooks/useProductVariants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Package } from "lucide-react";

interface ProductVariantManagerProps {
  productId: string;
  productName: string;
}

export function ProductVariantManager({ productId, productName }: ProductVariantManagerProps) {
  const { data: variants, isLoading } = useProductVariants(productId);
  const createVariant = useCreateVariant();
  const updateVariant = useUpdateVariant();
  const deleteVariant = useDeleteVariant();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    options: {} as Record<string, string>,
    price_adjustment: 0,
    stock: 0,
  });

  const [optionKey, setOptionKey] = useState("");
  const [optionValue, setOptionValue] = useState("");

  const handleSubmit = async () => {
    const variantData = {
      ...formData,
      product_id: productId,
    };

    if (editingVariant) {
      await updateVariant.mutateAsync({ id: editingVariant.id, updates: variantData });
    } else {
      await createVariant.mutateAsync(variantData);
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      sku: "",
      options: {},
      price_adjustment: 0,
      stock: 0,
    });
    setEditingVariant(null);
    setOptionKey("");
    setOptionValue("");
  };

  const handleEdit = (variant: any) => {
    setEditingVariant(variant);
    setFormData({
      name: variant.name,
      sku: variant.sku || "",
      options: variant.options,
      price_adjustment: variant.price_adjustment,
      stock: variant.stock,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (variantId: string) => {
    if (confirm("Delete this variant?")) {
      await deleteVariant.mutateAsync(variantId);
    }
  };

  const addOption = () => {
    if (optionKey && optionValue) {
      setFormData({
        ...formData,
        options: { ...formData.options, [optionKey]: optionValue },
      });
      setOptionKey("");
      setOptionValue("");
    }
  };

  const removeOption = (key: string) => {
    const newOptions = { ...formData.options };
    delete newOptions[key];
    setFormData({ ...formData, options: newOptions });
  };

  if (isLoading) {
    return <div>Loading variants...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            <CardTitle>Product Variants - {productName}</CardTitle>
          </div>
          <Button size="sm" onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Variant
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {variants && variants.length > 0 ? (
          <div className="space-y-4">
            {variants.map((variant) => (
              <div key={variant.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{variant.name}</h4>
                    {variant.sku && (
                      <Badge variant="outline">{variant.sku}</Badge>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(variant.options).map(([key, value]) => (
                      <Badge key={key} variant="secondary">
                        {key}: {value}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Price adjustment: ${variant.price_adjustment} | Stock: {variant.stock}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(variant)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(variant.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No variants yet. Add your first variant to get started.
          </p>
        )}

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingVariant ? "Edit Variant" : "Add Variant"}</DialogTitle>
              <DialogDescription>
                {editingVariant ? "Update variant details" : "Create a new product variant"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="variant-name">Variant Name</Label>
                <Input
                  id="variant-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Small / Red"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="variant-sku">SKU (optional)</Label>
                <Input
                  id="variant-sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="SKU-001"
                />
              </div>

              <div className="space-y-2">
                <Label>Variant Options</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Option (e.g., Size)"
                    value={optionKey}
                    onChange={(e) => setOptionKey(e.target.value)}
                  />
                  <Input
                    placeholder="Value (e.g., Large)"
                    value={optionValue}
                    onChange={(e) => setOptionValue(e.target.value)}
                  />
                  <Button onClick={addOption} type="button">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2 flex-wrap mt-2">
                  {Object.entries(formData.options).map(([key, value]) => (
                    <Badge key={key} variant="secondary" className="cursor-pointer" onClick={() => removeOption(key)}>
                      {key}: {value} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price-adjustment">Price Adjustment ($)</Label>
                  <Input
                    id="price-adjustment"
                    type="number"
                    step="0.01"
                    value={formData.price_adjustment}
                    onChange={(e) => setFormData({ ...formData, price_adjustment: parseFloat(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingVariant ? "Save Changes" : "Add Variant"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}