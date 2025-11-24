import { nanoid } from "nanoid";
import dayjs from "dayjs";
import type { BlockInstance, PageStatus, StoreTarget } from "../types/common";
import type { Page } from "../types/page";
import type { Media } from "../types/media";
import type { Menu } from "../types/navigation";
import type { Theme } from "../types/theme";
import { blockMap } from "../blocks/registry";

type Listener = (pages: Page[]) => void;

const heroMedia: Media = {
  id: "media-demo-hero",
  filename: "demo-hero.png",
  url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
  mimeType: "image/png",
  uploadedAt: new Date().toISOString(),
  altText: "Headphones on yellow background",
};

const heroBlock: BlockInstance = {
  id: "block-hero-demo",
  type: "hero",
  props: {
    ...blockMap.hero?.defaultProps,
    title: "Welcome to Prime Enterprises Kimahuri",
    subtitle: "Shop electronics & lifestyle products curated for you.",
    ctas: [
      { label: "Visit Tech Store", href: "/?store=tech", variant: "default" },
      { label: "Explore Lifestyle", href: "/lifestyle", variant: "outline" },
    ],
    media: {
      type: "image",
      url: heroMedia.url,
    },
  },
};

const initialPage: Page = {
  id: "page-demo-landing",
  title: "Demo Landing",
  slug: "demo-landing",
  status: "published",
  storeTarget: "all",
  locale: "en",
  template: "full-width",
  blocks: [heroBlock],
  themeOverrides: undefined,
  meta: {
    title: "Prime Enterprises Demo Landing",
    description: "Experience the future of multi-store ecommerce.",
    ogImageUrl: heroMedia.url,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  publishedAt: new Date().toISOString(),
  scheduledAt: null,
  createdBy: "system",
  updatedBy: "system",
};

let pages: Page[] = [initialPage];
const menus: Menu[] = [
  {
    id: "menu-main",
    name: "Main Navigation",
    items: [
      {
        id: "nav-home",
        label: "Home",
        type: "url",
        url: "/",
        order: 0,
      },
      {
        id: "nav-demo",
        label: "Demo Landing",
        type: "page",
        ref: initialPage.id,
        order: 1,
      },
    ],
  },
];

const themes: Theme[] = [
  {
    id: "theme-default",
    name: "Prime Default",
    tokens: {
      colors: {
        primary: "#16a34a",
        secondary: "#0f172a",
        accent: "#f97316",
        background: "#f8fafc",
        foreground: "#0f172a",
      },
      fonts: {
        heading: "Space Grotesk, sans-serif",
        body: "Inter, sans-serif",
      },
      spacing: {
        md: "1.5rem",
        lg: "2.5rem",
      },
    },
    createdAt: new Date().toISOString(),
  },
];

const mediaLibrary: Media[] = [heroMedia];

const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((listener) => listener([...pages]));
}

export const cmsMockService = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    listener([...pages]);
    return () => listeners.delete(listener);
  },
  async listPages() {
    return [...pages];
  },
  async getPageBySlug(slug: string, includeDraft = false) {
    const page = pages.find((p) => p.slug === slug);
    if (!page) return null;
    if (!includeDraft && page.status !== "published") {
      return null;
    }
    return structuredClone(page);
  },
  async getPageById(id: string) {
    const page = pages.find((p) => p.id === id);
    return page ? structuredClone(page) : null;
  },
  async savePage(data: Partial<Page> & Pick<Page, "title" | "slug">) {
    const now = new Date().toISOString();
    if (data.id) {
      pages = pages.map((page) =>
        page.id === data.id
          ? {
              ...page,
              ...data,
              updatedAt: now,
            }
          : page
      );
    } else {
      const newPage: Page = {
        id: nanoid(),
        title: data.title,
        slug: data.slug,
        status: (data.status as PageStatus) ?? "draft",
        storeTarget: (data.storeTarget as StoreTarget) ?? "all",
        locale: data.locale ?? "en",
        template: data.template ?? "full-width",
        blocks: data.blocks ?? [],
        themeOverrides: data.themeOverrides,
        meta: data.meta ?? {},
        createdAt: now,
        updatedAt: now,
        createdBy: "demo-user",
        updatedBy: "demo-user",
      };
      pages = [newPage, ...pages];
    }
    notify();
    return this.getPageBySlug(data.slug, true);
  },
  async updateStatus(id: string, status: PageStatus) {
    const now = new Date().toISOString();
    pages = pages.map((page) =>
      page.id === id
        ? {
            ...page,
            status,
            publishedAt: status === "published" ? now : page.publishedAt,
            updatedAt: now,
          }
        : page
    );
    notify();
    return this.getPageById(id);
  },
  async schedulePublish(id: string, date: string) {
    pages = pages.map((page) =>
      page.id === id
        ? {
            ...page,
            status: "scheduled",
            scheduledAt: date,
          }
        : page
    );
    notify();
    return this.getPageById(id);
  },
  async listMenus() {
    return structuredClone(menus);
  },
  async listThemes() {
    return structuredClone(themes);
  },
  async listMedia() {
    return structuredClone(mediaLibrary);
  },
  async listBlockDefinitions() {
    return Object.values(blockMap);
  },
  async uploadMedia(file: File) {
    const mockUrl = URL.createObjectURL(file);
    const asset: Media = {
      id: nanoid(),
      filename: file.name,
      url: mockUrl,
      mimeType: file.type,
      sizeBytes: file.size,
      uploadedAt: new Date().toISOString(),
    };
    mediaLibrary.push(asset);
    return asset;
  },
  async issuePreviewToken(pageId: string) {
    // Mock token is base64 string with timestamp
    return btoa(
      JSON.stringify({
        pageId,
        exp: dayjs().add(10, "minute").toISOString(),
      })
    );
  },
  async verifyPreviewToken(token: string) {
    try {
      const payload = JSON.parse(atob(token)) as { pageId: string; exp: string };
      if (dayjs().isAfter(payload.exp)) {
        return null;
      }
      return payload.pageId;
    } catch (error) {
      console.error("Invalid preview token", error);
      return null;
    }
  },
};

