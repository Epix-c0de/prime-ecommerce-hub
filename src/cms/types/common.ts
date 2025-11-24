export type StoreTarget = "tech" | "lifestyle" | "all";

export type PageStatus = "draft" | "published" | "scheduled" | "unpublished";

export interface SeoMeta {
  title?: string;
  description?: string;
  ogImageUrl?: string;
  noIndex?: boolean;
}

export interface BlockInstance {
  id: string;
  type: string;
  props: Record<string, unknown>;
}

