import { BlockDefinition } from "../types";

interface ImageBlockProps {
  url: string;
  alt?: string;
  caption?: string;
  rounded?: boolean;
}

const ImageBlockComponent = ({ url, alt, caption, rounded = true }: ImageBlockProps) => {
  if (!url) return null;
  return (
    <figure className="space-y-3">
      <img
        src={url}
        alt={alt ?? caption ?? "Image block"}
        className={rounded ? "w-full rounded-2xl object-cover" : "w-full object-cover"}
      />
      {caption && <figcaption className="text-sm text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
};

export const ImageBlockDefinition: BlockDefinition<ImageBlockProps> = {
  type: "image",
  displayName: "Image",
  category: "media",
  description: "Single responsive image with optional caption.",
  schema: {
    type: "object",
    properties: {
      url: { type: "string" },
      alt: { type: "string" },
      caption: { type: "string" },
      rounded: { type: "boolean" },
    },
    required: ["url"],
  },
  defaultProps: {
    url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    alt: "Product image",
    rounded: true,
  },
  component: ImageBlockComponent,
};

