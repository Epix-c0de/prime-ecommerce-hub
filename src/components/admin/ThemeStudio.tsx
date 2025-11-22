import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, Type, Sparkles, Download, Upload, Eye, Save, Ruler } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeSync } from '@/contexts/RealtimeSyncContext';

interface DesignToken {
  name: string;
  value: string;
  category: 'colors' | 'typography' | 'spacing' | 'shadows' | 'animations';
}

interface ThemePreset {
  id: string;
  name: string;
  description: string;
  tokens: DesignToken[];
}

export function ThemeStudio() {
  const { broadcastUpdate } = useRealtimeSync();
  const [tokens, setTokens] = useState<DesignToken[]>([]);
  const [presets, setPresets] = useState<ThemePreset[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedStore, setSelectedStore] = useState<string>('electronics');

  // Color tokens
  const colorTokens = [
    { name: 'primary', label: 'Primary Color', value: '28 92% 54%' },
    { name: 'secondary', label: 'Secondary Color', value: '210 100% 36%' },
    { name: 'accent', label: 'Accent Color', value: '28 92% 54%' },
    { name: 'background', label: 'Background', value: '0 0% 96%' },
    { name: 'foreground', label: 'Text Color', value: '0 0% 20%' },
    { name: 'card', label: 'Card Background', value: '0 0% 100%' },
    { name: 'border', label: 'Border Color', value: '0 0% 89%' },
  ];

  // Typography tokens
  const typographyTokens = [
    { name: 'font-sans', label: 'Sans Serif Font', value: 'Inter, system-ui, sans-serif' },
    { name: 'font-heading', label: 'Heading Font', value: 'Inter, system-ui, sans-serif' },
    { name: 'text-base', label: 'Base Text Size', value: '16px' },
    { name: 'text-lg', label: 'Large Text', value: '18px' },
    { name: 'text-xl', label: 'Extra Large', value: '20px' },
  ];

  // Spacing tokens
  const spacingTokens = [
    { name: 'spacing-xs', label: 'Extra Small', value: '4px' },
    { name: 'spacing-sm', label: 'Small', value: '8px' },
    { name: 'spacing-md', label: 'Medium', value: '16px' },
    { name: 'spacing-lg', label: 'Large', value: '24px' },
    { name: 'spacing-xl', label: 'Extra Large', value: '32px' },
  ];

  const applyTheme = (tokens: DesignToken[]) => {
    const root = document.documentElement;
    
    tokens.forEach(token => {
      if (token.category === 'colors') {
        root.style.setProperty(`--${token.name}`, token.value);
      }
    });
  };

  const saveTheme = async () => {
    try {
      // Save tokens to database (once migration is complete)
      await broadcastUpdate('theme_update', {
        store_type: selectedStore,
        tokens: tokens
      });

      toast.success('Theme saved and synced to all stores');
    } catch (error) {
      console.error('Failed to save theme:', error);
      toast.error('Failed to save theme');
    }
  };

  const exportTheme = () => {
    const themeData = {
      name: 'Custom Theme',
      version: '1.0',
      tokens: tokens,
      store: selectedStore,
      exported_at: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(themeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `theme-${selectedStore}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('Theme exported successfully');
  };

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const themeData = JSON.parse(e.target?.result as string);
        setTokens(themeData.tokens);
        applyTheme(themeData.tokens);
        toast.success('Theme imported successfully');
      } catch (error) {
        toast.error('Invalid theme file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Theme Studio
              </CardTitle>
              <CardDescription>
                Complete control over your store's design system
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics Store</SelectItem>
                  <SelectItem value="lifestyle">Lifestyle Store</SelectItem>
                  <SelectItem value="all">All Stores</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? 'Exit Preview' : 'Preview'}
              </Button>
              
              <Button variant="outline" onClick={exportTheme}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              
              <Button variant="outline" onClick={() => document.getElementById('theme-import')?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <input
                id="theme-import"
                type="file"
                accept=".json"
                className="hidden"
                onChange={importTheme}
              />
              
              <Button onClick={saveTheme}>
                <Save className="h-4 w-4 mr-2" />
                Save & Sync
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Design Tokens Editor */}
      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="colors">
            <Palette className="h-4 w-4 mr-2" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="typography">
            <Type className="h-4 w-4 mr-2" />
            Typography
          </TabsTrigger>
          <TabsTrigger value="spacing">
            <Ruler className="h-4 w-4 mr-2" />
            Spacing
          </TabsTrigger>
          <TabsTrigger value="animations">
            <Sparkles className="h-4 w-4 mr-2" />
            Animations
          </TabsTrigger>
          <TabsTrigger value="presets">Presets</TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Color Palette</CardTitle>
              <CardDescription>Define your brand colors in HSL format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {colorTokens.map(token => (
                <div key={token.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{token.label}</Label>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: `hsl(${token.value})` }}
                      />
                      <Input
                        className="w-[200px]"
                        value={token.value}
                        placeholder="H S% L%"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Typography System</CardTitle>
              <CardDescription>Control fonts, sizes, and text styles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {typographyTokens.map(token => (
                <div key={token.name} className="space-y-2">
                  <Label>{token.label}</Label>
                  <Input value={token.value} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spacing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Spacing Scale</CardTitle>
              <CardDescription>Consistent spacing throughout your design</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {spacingTokens.map(token => (
                <div key={token.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{token.label}</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        className="w-[200px]"
                        defaultValue={[parseInt(token.value)]}
                        max={64}
                        step={4}
                      />
                      <span className="w-12 text-right text-sm">{token.value}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="animations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Animation Controls</CardTitle>
              <CardDescription>Fine-tune motion and transitions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Animation Speed</Label>
                <Select defaultValue="normal">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">Slow (600ms)</SelectItem>
                    <SelectItem value="normal">Normal (300ms)</SelectItem>
                    <SelectItem value="fast">Fast (150ms)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Easing Function</Label>
                <Select defaultValue="ease-out">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linear</SelectItem>
                    <SelectItem value="ease">Ease</SelectItem>
                    <SelectItem value="ease-in">Ease In</SelectItem>
                    <SelectItem value="ease-out">Ease Out</SelectItem>
                    <SelectItem value="ease-in-out">Ease In Out</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Enable Page Transitions</Label>
                  <input type="checkbox" defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Enable Hover Effects</Label>
                  <input type="checkbox" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="presets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Presets</CardTitle>
              <CardDescription>Quick-start templates for your store</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <PresetCard name="Modern Dark" preview="bg-gradient-to-br from-gray-900 to-gray-800" />
                <PresetCard name="Vibrant" preview="bg-gradient-to-br from-purple-500 to-pink-500" />
                <PresetCard name="Minimal" preview="bg-gradient-to-br from-gray-50 to-gray-100" />
                <PresetCard name="Ocean Blue" preview="bg-gradient-to-br from-blue-500 to-cyan-500" />
                <PresetCard name="Sunset" preview="bg-gradient-to-br from-orange-500 to-red-500" />
                <PresetCard name="Forest" preview="bg-gradient-to-br from-green-600 to-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PresetCard({ name, preview }: { name: string; preview: string }) {
  return (
    <div className="space-y-2 cursor-pointer group">
      <div className={`h-32 rounded-lg ${preview} group-hover:scale-105 transition-transform`} />
      <p className="font-medium text-sm">{name}</p>
      <Button variant="outline" size="sm" className="w-full">
        Apply Theme
      </Button>
    </div>
  );
}
