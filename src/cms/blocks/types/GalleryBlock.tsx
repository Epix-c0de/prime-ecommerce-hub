import { BlockDefinition } from "../types";

interface GalleryBlockProps {
  images: { url: string; alt?: string }[];
  columns?: number;
}

const GalleryBlockComponent = ({ images, columns = 3 }: GalleryBlockProps) => {
  if (!images || images.length === 0) return null;
  const columnClass =
    {
      2: "md:grid-cols-2",
      3: "md:grid-cols-3",
      4: "md:grid-cols-4",
    }[columns as 2 | 3 | 4] ?? "md:grid-cols-3";
  return (
    <div className={`grid grid-cols-2 gap-4 ${columnClass}`}>
      {images.map((image, index) => (
        <img
          key={`${image.url}-${index}`}
          src={image.url}
          alt={image.alt ?? `Gallery image ${index + 1}`}
          className="aspect-square w-full rounded-xl object-cover"
        />
      ))}
    </div>
  );
};

export const GalleryBlockDefinition: BlockDefinition<GalleryBlockProps> = {
  type: "gallery",
  displayName: "Gallery",
  category: "media",
  description: "Responsive image gallery.",
  schema: {
    type: "object",
    properties: {
      columns: { type: "number" },
      images: {
        type: "array",
        items: {
          type: "object",
          properties: {
            url: { type: "string" },
            alt: { type: "string" },
          },
          required: ["url"],
        },
      },
    },
    required: ["images"],
  },
  defaultProps: {
    columns: 3,
    images: [
      { url: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef" },
      { url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" },
      { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e" },
    ],
  },
  component: GalleryBlockComponent,
};

