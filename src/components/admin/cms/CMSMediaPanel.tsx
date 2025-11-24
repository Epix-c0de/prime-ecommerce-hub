import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCMS } from "@/cms/state/CmsContext";

export const CMSMediaPanel = () => {
  const { media } = useCMS();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  // Uploads are mocked for now to keep scope frontend-only.
  const handleUpload = () => {
    inputRef.current?.click();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Media Library</CardTitle>
            <p className="text-sm text-muted-foreground">
              Drag-and-drop uploads with CDN-ready URLs (mocked for now).
            </p>
          </div>
          <Button variant="outline" onClick={handleUpload} disabled={uploading}>
            Upload
          </Button>
          <input ref={inputRef} type="file" className="hidden" onChange={() => setUploading(false)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {media.map((asset) => (
            <figure
              key={asset.id}
              className={cn(
                "space-y-2 rounded-xl border p-3",
                "transition hover:border-primary hover:shadow-lg"
              )}
            >
              <div className="aspect-video overflow-hidden rounded-lg bg-muted">
                <img
                  src={asset.url}
                  alt={asset.altText ?? asset.filename}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <figcaption>
                <p className="truncate text-sm font-medium">{asset.filename}</p>
                <p className="text-xs text-muted-foreground">
                  {asset.mimeType} • {asset.sizeBytes ? Math.round(asset.sizeBytes / 1024) : "—"} KB
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

