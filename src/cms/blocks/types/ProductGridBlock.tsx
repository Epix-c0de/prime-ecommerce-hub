import { useMemo } from "react";
import { BlockDefinition } from "../types";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";

interface ProductGridBlockProps {
  title?: string;
  style?: "grid" | "carousel";
  productIds?: string[];
  limit?: number;
}

const ProductGridComponent = ({
  title,
  style = "grid",
  productIds,
  limit = 4,
}: ProductGridBlockProps) => {
  const { data: products = [] } = useProducts();
  const items = useMemo(() => {
    if (productIds && productIds.length > 0) {
      return products.filter((product) => productIds.includes(product.id)).slice(0, limit);
    }
    return products.slice(0, limit);
  }, [products, productIds, limit]);

  const handleAddToCart = (productId: string) => {
    // This is a CMS preview, so we don't actually add to cart
    console.log("Add to cart:", productId);
  };

  if (!items.length) {
    return (
      <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
        Product data not available. Connect to backend later.
      </div>
    );
  }

  return (
    <section className="space-y-4">
      {title && <h3 className="text-2xl font-semibold">{title}</h3>}
      <div
        className={
          style === "grid"
            ? "grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            : "flex gap-4 overflow-x-auto"
        }
      >
        {items.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
        ))}
      </div>
    </section>
  );
};

export const ProductGridBlockDefinition: BlockDefinition<ProductGridBlockProps> = {
  type: "productGrid",
  displayName: "Product Grid",
  category: "commerce",
  description: "Displays products from the catalog.",
  schema: {
    type: "object",
    properties: {
      title: { type: "string" },
      style: { type: "string", enum: ["grid", "carousel"] },
      limit: { type: "number" },
      productIds: {
        type: "array",
        items: { type: "string" },
      },
    },
  },
  defaultProps: {
    title: "Featured products",
    style: "grid",
    limit: 4,
  },
  component: ProductGridComponent,
};

