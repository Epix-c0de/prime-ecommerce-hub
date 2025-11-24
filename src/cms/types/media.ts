export interface Media {
  id: string;
  filename: string;
  url: string;
  cdnUrl?: string;
  mimeType: string;
  width?: number;
  height?: number;
  sizeBytes?: number;
  tags?: string[];
  altText?: string;
  uploadedAt: string;
  uploadedBy?: string;
}

