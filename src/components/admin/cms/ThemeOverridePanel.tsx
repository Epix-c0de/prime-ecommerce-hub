import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCMS } from "@/cms/state/CmsContext";

interface ThemeOverridePanelProps {
  value: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
  autosaveStatus?: string;
}

const fields = [
  { key: "color-primary", label: "Primary color" },
  { key: "color-secondary", label: "Secondary color" },
  { key: "color-background", label: "Background color" },
  { key: "font-heading", label: "Heading font" },
  { key: "font-body", label: "Body font" },
];

export const ThemeOverridePanel = ({ value, onChange, autosaveStatus }: ThemeOverridePanelProps) => {
  const { themes } = useCMS();
  const fallbackTheme = themes[0];

  const handleChange = (key: string, nextValue: string) => {
    onChange({
      ...value,
      [key]: nextValue,
    });
  };

  const baseThemeOptions = useMemo(
    () =>
      themes.map((theme) => (
        <SelectItem key={theme.id} value={theme.id}>
          {theme.name}
        </SelectItem>
      )),
    [themes]
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Theme overrides</CardTitle>
        <p className="text-xs text-muted-foreground">{autosaveStatus}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Base theme</Label>
          <Select
            defaultValue={fallbackTheme?.id}
            onValueChange={(id) => {
              const selected = themes.find((theme) => theme.id === id);
              if (selected) {
                const { colors = {}, fonts = {} } = selected.tokens;
                onChange({
                  ...value,
                  "color-primary": colors.primary,
                  "color-secondary": colors.secondary,
                  "color-background": colors.background,
                  "font-heading": fonts.heading ?? "",
                  "font-body": fonts.body ?? "",
                });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select base theme" />
            </SelectTrigger>
            <SelectContent>{baseThemeOptions}</SelectContent>
          </Select>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map(({ key, label }) => (
            <div className="space-y-2" key={key}>
              <Label>{label}</Label>
              <Input
                type={key.startsWith("color") ? "color" : "text"}
                value={value[key] ?? ""}
                onChange={(event) => handleChange(key, event.target.value)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

