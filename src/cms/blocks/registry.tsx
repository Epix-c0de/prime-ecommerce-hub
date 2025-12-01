import { ReactNode } from "react";
import type { BlockInstance } from "../types/common";
import type { BlockDefinition } from "./types";
import { HeroBlockDefinition } from "./types/HeroBlock";
import { RichTextBlockDefinition } from "./types/RichTextBlock";
import { ImageBlockDefinition } from "./types/ImageBlock";
import { GalleryBlockDefinition } from "./types/GalleryBlock";
import { CTABlockDefinition } from "./types/CTABlock";
import { ProductGridBlockDefinition } from "./types/ProductGridBlock";
import { VideoBlockDefinition } from "./types/VideoBlock";

export const BLOCK_DEFINITIONS: BlockDefinition<any>[] = [
  HeroBlockDefinition,
  RichTextBlockDefinition,
  ImageBlockDefinition,
  GalleryBlockDefinition,
  CTABlockDefinition,
  ProductGridBlockDefinition,
  VideoBlockDefinition,
];

export const blockMap = BLOCK_DEFINITIONS.reduce<Record<string, BlockDefinition<any>>>(
  (map, block) => {
    map[block.type] = block;
    return map;
  },
  {}
);

export function renderBlock(block: BlockInstance): ReactNode {
  const definition = blockMap[block.type];
  if (!definition) {
    return (
      <div className="rounded-lg border border-dashed border-red-300 bg-red-50 p-4 text-sm text-red-600">
        Unknown block: {block.type}
      </div>
    );
  }
  const Component = definition.component;
  return <Component {...block.props} />;
}

