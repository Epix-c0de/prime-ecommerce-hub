import { BLOCK_DEFINITIONS } from "../blocks/registry";
import type { BlockDefinition } from "../blocks/types";

export async function fetchBlockDefinitions(): Promise<BlockDefinition[]> {
  // In production this can call `/api/cms/blocks`. For now we return static definitions.
  return Promise.resolve(BLOCK_DEFINITIONS);
}

