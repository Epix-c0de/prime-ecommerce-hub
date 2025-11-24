import { renderBlock } from "../blocks/registry";
import type { BlockInstance } from "../types/common";

interface DynamicPageRendererProps {
  blocks: BlockInstance[];
  themeOverrides?: Record<string, string>;
}

export const DynamicPageRenderer = ({ blocks, themeOverrides }: DynamicPageRendererProps) => {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
        No blocks yet. Add some content in the CMS builder.
      </div>
    );
  }

  const style = themeOverrides
    ? Object.entries(themeOverrides).reduce<Record<string, string>>((acc, [key, value]) => {
        acc[`--cms-${key}`] = String(value);
        return acc;
      }, {})
    : undefined;

  return (
    <div className="space-y-10">
      <div className="space-y-10" style={style}>
        {blocks.map((block) => (
          <div key={block.id}>{renderBlock(block)}</div>
        ))}
      </div>
    </div>
  );
};

