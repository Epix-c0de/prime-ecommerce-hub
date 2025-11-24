import { BlockDefinition } from "../types";

interface VideoBlockProps {
  url: string;
  poster?: string;
  caption?: string;
}

const VideoBlockComponent = ({ url, poster, caption }: VideoBlockProps) => {
  if (!url) return null;
  return (
    <figure className="space-y-3">
      <div className="aspect-video overflow-hidden rounded-2xl border">
        <iframe
          src={url}
          title={caption ?? "Embedded video"}
          className="h-full w-full"
          allowFullScreen
        />
      </div>
      {caption && <figcaption className="text-sm text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
};

export const VideoBlockDefinition: BlockDefinition<VideoBlockProps> = {
  type: "video",
  displayName: "Video Embed",
  category: "media",
  description: "Embed videos via iframe.",
  schema: {
    type: "object",
    properties: {
      url: { type: "string" },
      poster: { type: "string" },
      caption: { type: "string" },
    },
    required: ["url"],
  },
  defaultProps: {
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  component: VideoBlockComponent,
};

