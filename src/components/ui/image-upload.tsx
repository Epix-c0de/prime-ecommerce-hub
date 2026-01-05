import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  bucket: 'banners' | 'products';
  folder?: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'wide';
}

export function ImageUpload({ 
  value, 
  onChange, 
  bucket, 
  folder = '', 
  className,
  aspectRatio = 'video'
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[3/1]'
  };

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({ variant: 'destructive', title: 'Invalid file type', description: 'Please upload an image file' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ variant: 'destructive', title: 'File too large', description: 'Maximum file size is 5MB' });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder ? folder + '/' : ''}${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      onChange(publicUrl);
      toast({ title: 'Image uploaded successfully' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Upload failed', description: error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleRemove = async () => {
    if (value) {
      // Extract file path from URL
      const urlParts = value.split(`/${bucket}/`);
      if (urlParts[1]) {
        try {
          await supabase.storage.from(bucket).remove([urlParts[1]]);
        } catch (error) {
          console.error('Failed to delete file:', error);
        }
      }
    }
    onChange('');
  };

  return (
    <div className={cn("relative", className)}>
      {value ? (
        <div className={cn("relative rounded-lg overflow-hidden border bg-muted", aspectClasses[aspectRatio])}>
          <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
          <Button
            size="icon"
            variant="destructive"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "flex flex-col items-center justify-center rounded-lg border-2 border-dashed cursor-pointer transition-colors",
            aspectClasses[aspectRatio],
            dragOver 
              ? "border-primary bg-primary/10" 
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
            uploading && "pointer-events-none opacity-50"
          )}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 p-4">
              <div className="p-3 rounded-full bg-muted">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Drop image here or click to upload</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP up to 5MB</p>
              </div>
            </div>
          )}
        </label>
      )}
    </div>
  );
}

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  bucket: 'banners' | 'products';
  folder?: string;
  maxImages?: number;
  className?: string;
}

export function MultiImageUpload({
  value = [],
  onChange,
  bucket,
  folder = '',
  maxImages = 10,
  className
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const uploadFiles = async (files: FileList) => {
    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024);
    
    if (validFiles.length + value.length > maxImages) {
      toast({ variant: 'destructive', title: 'Too many images', description: `Maximum ${maxImages} images allowed` });
      return;
    }

    setUploading(true);
    const newUrls: string[] = [];

    try {
      for (const file of validFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${folder ? folder + '/' : ''}${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

        const { error } = await supabase.storage.from(bucket).upload(fileName, file, { upsert: true });
        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName);
        newUrls.push(publicUrl);
      }

      onChange([...value, ...newUrls]);
      toast({ title: `${newUrls.length} image(s) uploaded` });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Upload failed', description: error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
  }, [value]);

  const handleRemove = async (index: number) => {
    const urlToRemove = value[index];
    const urlParts = urlToRemove.split(`/${bucket}/`);
    if (urlParts[1]) {
      try {
        await supabase.storage.from(bucket).remove([urlParts[1]]);
      } catch (error) {
        console.error('Failed to delete:', error);
      }
    }
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {value.map((url, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden border bg-muted group">
            <img src={url} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
            <Button
              size="icon"
              variant="destructive"
              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemove(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}

        {value.length < maxImages && (
          <label
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
            className={cn(
              "aspect-square flex flex-col items-center justify-center rounded-lg border-2 border-dashed cursor-pointer transition-colors",
              dragOver ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-primary/50",
              uploading && "pointer-events-none opacity-50"
            )}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => e.target.files && uploadFiles(e.target.files)}
              className="hidden"
              disabled={uploading}
            />
            {uploading ? (
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            ) : (
              <>
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground mt-1">Add</span>
              </>
            )}
          </label>
        )}
      </div>
    </div>
  );
}
