import type { ComponentType } from "react";
import type { JSONSchema7 } from "json-schema";
import type { BlockInstance } from "../types/common";

export type BlockCategory =
  | "hero"
  | "content"
  | "media"
  | "cta"
  | "commerce"
  | "custom";

export interface BlockDefinition<TProps = Record<string, unknown>> {
  type: string;
  displayName: string;
  category: BlockCategory;
  description: string;
  schema: JSONSchema7;
  defaultProps: TProps;
  component: ComponentType<TProps>;
  preview?: string;
}

export type BlockFormSubmit = (next: BlockInstance) => void;

