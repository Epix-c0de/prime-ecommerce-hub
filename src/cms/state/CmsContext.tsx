import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Page } from "../types/page";
import type { Menu } from "../types/navigation";
import type { Media } from "../types/media";
import type { Theme } from "../types/theme";
import type { BlockInstance, PageStatus } from "../types/common";
import { cmsMockService } from "../services/mockCmsService";
import { fetchBlockDefinitions } from "../services/blockDefinitionService";
import type { BlockDefinition } from "../blocks/types";

interface CMSContextValue {
  pages: Page[];
  menus: Menu[];
  media: Media[];
  themes: Theme[];
  blockDefinitions: BlockDefinition[];
  refresh: () => Promise<void>;
  savePage: (input: Partial<Page> & { title: string; slug: string }) => Promise<void>;
  updateStatus: (pageId: string, status: PageStatus) => Promise<void>;
  createBlock: (type: string) => BlockInstance;
}

const CMSContext = createContext<CMSContextValue | undefined>(undefined);

export const CMSProvider = ({ children }: { children: React.ReactNode }) => {
  const [pages, setPages] = useState<Page[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [blockDefinitions, setBlockDefinitions] = useState<BlockDefinition[]>([]);

  useEffect(() => {
    const unsubscribe = cmsMockService.subscribe(setPages);
    cmsMockService.listMenus().then(setMenus);
    cmsMockService.listMedia().then(setMedia);
    cmsMockService.listThemes().then(setThemes);
    fetchBlockDefinitions().then(setBlockDefinitions);
    return unsubscribe;
  }, []);

  const refresh = async () => {
    const [freshPages, freshMenus, freshMedia, freshThemes] = await Promise.all([
      cmsMockService.listPages(),
      cmsMockService.listMenus(),
      cmsMockService.listMedia(),
      cmsMockService.listThemes(),
    ]);
    setPages(freshPages);
    setMenus(freshMenus);
    setMedia(freshMedia);
    setThemes(freshThemes);
  };

  const value = useMemo<CMSContextValue>(
    () => ({
      pages,
      menus,
      media,
      themes,
      blockDefinitions,
      refresh,
      savePage: async (input) => {
        await cmsMockService.savePage(input);
        await refresh();
      },
      updateStatus: async (pageId, status) => {
        await cmsMockService.updateStatus(pageId, status);
        await refresh();
      },
      createBlock: (type: string) => ({
        id: crypto.randomUUID(),
        type,
        props: blockDefinitions.find((def) => def.type === type)?.defaultProps ?? {},
      }),
    }),
    [blockDefinitions, media, menus, pages, themes]
  );

  return <CMSContext.Provider value={value}>{children}</CMSContext.Provider>;
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) throw new Error("useCMS must be used inside CMSProvider");
  return context;
};

