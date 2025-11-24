import type { StoreTarget } from "./common";

export type NavItemType = "page" | "url" | "category";

export interface NavItem {
  id: string;
  label: string;
  type: NavItemType;
  ref?: string;
  url?: string;
  order?: number;
  target?: "_self" | "_blank";
  storeTarget?: StoreTarget;
  visible?: boolean;
}

export interface Menu {
  id: string;
  name: string;
  description?: string;
  items: NavItem[];
  locale?: string;
  storeTarget?: StoreTarget;
}

