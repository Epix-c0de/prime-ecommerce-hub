import type { BlockInstance, PageStatus, SeoMeta, StoreTarget } from "./common";

export interface Page {
  id: string;
  title: string;
  slug: string;
  status: PageStatus;
  storeTarget: StoreTarget;
  locale?: string;
  template?: string;
  blocks: BlockInstance[];
  themeOverrides?: Record<string, unknown>;
  meta: SeoMeta;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  scheduledAt?: string | null;
  createdBy?: string;
  updatedBy?: string;
}

