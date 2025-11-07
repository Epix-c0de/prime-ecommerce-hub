import { useConfig } from '@/contexts/ConfigContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ThemeMode, themePresets } from '@/config/themeConfig';
import { toast } from 'sonner';

export function ThemeControls() {
  const { theme, themeMode, setThemeMode, applyTheme } = useConfig();

  const handleColorChange = (key: keyof typeof theme.colors, value: string) => {
    applyTheme({
      colors: {
        ...theme.colors,
        [key]: value,
      },
    });
    toast.success(`${key} color updated`);
  };

  const handlePresetChange = (preset: ThemeMode) => {
    setThemeMode(preset);
    toast.success(`Theme changed to ${preset}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme Presets</CardTitle>
          <CardDescription>
            Choose from predefined theme styles or customize below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Select Preset</Label>
              <Select value={themeMode} onValueChange={handlePresetChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(themePresets).map((preset) => (
                    <SelectItem key={preset} value={preset}>
                      {preset.charAt(0).toUpperCase() + preset.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(themePresets).map(([key, preset]) => (
                <Button
                  key={key}
                  variant={themeMode === key ? 'default' : 'outline'}
                  onClick={() => handlePresetChange(key as ThemeMode)}
                  className="h-20 flex flex-col gap-1"
                >
                  <div className="flex gap-1">
                    {preset.colors && (
                      <>
                        <div
                          className="w-4 h-4 rounded"
                          style={{ background: `hsl(${preset.colors.primary})` }}
                        />
                        <div
                          className="w-4 h-4 rounded"
                          style={{ background: `hsl(${preset.colors.secondary})` }}
                        />
                        <div
                          className="w-4 h-4 rounded"
                          style={{ background: `hsl(${preset.colors.accent})` }}
                        />
                      </>
                    )}
                  </div>
                  <span className="text-xs">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom Colors</CardTitle>
          <CardDescription>
            Fine-tune individual color values (HSL format)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {Object.entries(theme.colors).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key} className="capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </Label>
                <div className="flex gap-2">
                  <div
                    className="w-10 h-10 rounded border"
                    style={{ background: `hsl(${value})` }}
                  />
                  <Input
                    id={key}
                    value={value}
                    onChange={(e) => handleColorChange(key as keyof typeof theme.colors, e.target.value)}
                    placeholder="222.2 47.4% 11.2%"
                    className="flex-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
          <CardDescription>Configure font families</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="heading-font">Heading Font</Label>
              <Input
                id="heading-font"
                value={theme.fonts.heading}
                onChange={(e) =>
                  applyTheme({
                    fonts: { ...theme.fonts, heading: e.target.value },
                  })
                }
                placeholder="Inter, system-ui, sans-serif"
              />
            </div>
            <div>
              <Label htmlFor="body-font">Body Font</Label>
              <Input
                id="body-font"
                value={theme.fonts.body}
                onChange={(e) =>
                  applyTheme({
                    fonts: { ...theme.fonts, body: e.target.value },
                  })
                }
                placeholder="Inter, system-ui, sans-serif"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
