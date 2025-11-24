import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { BlockInstance } from "@/cms/types/common";
import type { BlockDefinition } from "@/cms/blocks/types";

interface CMSBlockInspectorProps {
  block: BlockInstance | null;
  definition: BlockDefinition | null;
  onChange: (props: Record<string, unknown>) => void;
  themeOverrides?: Record<string, string>;
}

export const CMSBlockInspector = ({
  block,
  definition,
  onChange,
  themeOverrides,
}: CMSBlockInspectorProps) => {
  const [localProps, setLocalProps] = useState<Record<string, unknown>>(block?.props ?? {});

  useEffect(() => {
    setLocalProps(block?.props ?? {});
  }, [block?.id]);

  const schemaEntries = useMemo(() => {
    if (!definition) return [];
    return Object.entries(definition.schema.properties ?? {});
  }, [definition]);

  if (!block || !definition) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Inspector</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Select a block from the canvas to edit its content and styling.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleValueChange = (key: string, value: unknown) => {
    const next = { ...localProps, [key]: value };
    setLocalProps(next);
    onChange(next);
  };

  const renderField = (key: string, schema: any, value: unknown) => {
    if (!schema) return null;
    if (schema.enum) {
      return (
        <div className="space-y-2">
          <Label className="capitalize">{key}</Label>
          <select
            className="w-full rounded-md border bg-transparent p-2 text-sm"
            value={(value as string) ?? ""}
            onChange={(event) => handleValueChange(key, event.target.value)}
          >
            <option value="">Select</option>
            {schema.enum.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    }

    switch (schema.type) {
      case "string":
        return (
          <div className="space-y-2">
            <Label className="capitalize">{key}</Label>
            <Input
              value={(value as string) ?? ""}
              onChange={(event) => handleValueChange(key, event.target.value)}
            />
          </div>
        );
      case "number":
      case "integer":
        return (
          <div className="space-y-2">
            <Label className="capitalize">{key}</Label>
            <Input
              type="number"
              value={(value as number) ?? 0}
              onChange={(event) => handleValueChange(key, Number(event.target.value))}
            />
          </div>
        );
      case "boolean":
        return (
          <label className="flex items-center gap-2 text-sm capitalize">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(event) => handleValueChange(key, event.target.checked)}
            />
            {key}
          </label>
        );
      default:
        return (
          <div className="space-y-2">
            <Label className="capitalize">{key} (JSON)</Label>
            <Textarea
              rows={4}
              className="font-mono text-xs"
              value={
                typeof value === "string" ? value : JSON.stringify(value ?? "", null, 2)
              }
              onChange={(event) => {
                try {
                  handleValueChange(key, JSON.parse(event.target.value));
                } catch {
                  handleValueChange(key, event.target.value);
                }
              }}
            />
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inspector — {definition.displayName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {schemaEntries.map(([key, schema]) => (
          <div key={key}>{renderField(key, schema, (localProps as any)[key])}</div>
        ))}
        <div className="space-y-2">
          <Label>Padding</Label>
          <Input
            placeholder="e.g. 2rem"
            value={(localProps.style as any)?.padding ?? ""}
            onChange={(event) =>
              handleValueChange("style", {
                ...(localProps.style as Record<string, unknown>),
                padding: event.target.value,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Text alignment</Label>
          <select
            className="w-full rounded-md border bg-transparent p-2 text-sm"
            value={(localProps.style as any)?.textAlign ?? ""}
            onChange={(event) =>
              handleValueChange("style", {
                ...(localProps.style as Record<string, unknown>),
                textAlign: event.target.value,
              })
            }
          >
            <option value="">Default</option>
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
        {themeOverrides && (
          <p className="text-xs text-muted-foreground">
            Theme overrides active: {Object.keys(themeOverrides).length} tokens
          </p>
        )}
      </CardContent>
    </Card>
  );
};

