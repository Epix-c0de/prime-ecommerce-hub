import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Palette, Type, Sparkles, Download, Upload, Eye, Save, Ruler, Check } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeSync } from '@/contexts/RealtimeSyncContext';

interface DesignToken {
  name: string;
  value: string;
  category: 'colors' | 'typography' | 'spacing' | 'shadows' | 'animations';
}

interface ThemePresetDef {
  id: string;
  name: string;
  description: string;
  preview: string;
  tokens: { name: string; value: string; category: string }[];
}

const themePresets: ThemePresetDef[] = [
  {
    id: 'modern-dark',
    name: 'Modern Dark',
    description: 'Sleek dark interface with subtle contrast',
    preview: 'bg-gradient-to-br from-gray-900 to-gray-800',
    tokens: [
      { name: 'primary', value: '210 40% 98%', category: 'colors' },
      { name: 'secondary', value: '217.2 32.6% 17.5%', category: 'colors' },
      { name: 'accent', value: '217.2 32.6% 17.5%', category: 'colors' },
      { name: 'background', value: '222.2 84% 4.9%', category: 'colors' },
      { name: 'foreground', value: '210 40% 98%', category: 'colors' },
      { name: 'card', value: '222.2 84% 6.9%', category: 'colors' },
      { name: 'border', value: '217.2 32.6% 17.5%', category: 'colors' },
    ]
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Bold purple-to-pink gradient energy',
    preview: 'bg-gradient-to-br from-purple-500 to-pink-500',
    tokens: [
      { name: 'primary', value: '280 70% 55%', category: 'colors' },
      { name: 'secondary', value: '330 80% 60%', category: 'colors' },
      { name: 'accent', value: '45 93% 47%', category: 'colors' },
      { name: 'background', value: '0 0% 100%', category: 'colors' },
      { name: 'foreground', value: '222.2 84% 4.9%', category: 'colors' },
      { name: 'card', value: '0 0% 100%', category: 'colors' },
      { name: 'border', value: '280 30% 85%', category: 'colors' },
    ]
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and understated elegance',
    preview: 'bg-gradient-to-br from-gray-50 to-gray-100',
    tokens: [
      { name: 'primary', value: '0 0% 20%', category: 'colors' },
      { name: 'secondary', value: '0 0% 95%', category: 'colors' },
      { name: 'accent', value: '0 0% 60%', category: 'colors' },
      { name: 'background', value: '0 0% 100%', category: 'colors' },
      { name: 'foreground', value: '0 0% 10%', category: 'colors' },
      { name: 'card', value: '0 0% 100%', category: 'colors' },
      { name: 'border', value: '0 0% 90%', category: 'colors' },
    ]
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    description: 'Cool and calming aquatic palette',
    preview: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    tokens: [
      { name: 'primary', value: '210 100% 50%', category: 'colors' },
      { name: 'secondary', value: '190 90% 50%', category: 'colors' },
      { name: 'accent', value: '180 80% 45%', category: 'colors' },
      { name: 'background', value: '200 20% 98%', category: 'colors' },
      { name: 'foreground', value: '210 50% 10%', category: 'colors' },
      { name: 'card', value: '0 0% 100%', category: 'colors' },
      { name: 'border', value: '210 30% 85%', category: 'colors' },
    ]
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm orange-to-red gradients',
    preview: 'bg-gradient-to-br from-orange-500 to-red-500',
    tokens: [
      { name: 'primary', value: '28 92% 54%', category: 'colors' },
      { name: 'secondary', value: '0 72% 51%', category: 'colors' },
      { name: 'accent', value: '43 96% 56%', category: 'colors' },
      { name: 'background', value: '30 20% 98%', category: 'colors' },
      { name: 'foreground', value: '20 50% 10%', category: 'colors' },
      { name: 'card', value: '0 0% 100%', category: 'colors' },
      { name: 'border', value: '28 30% 85%', category: 'colors' },
    ]
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Natural green tones inspired by nature',
    preview: 'bg-gradient-to-br from-green-600 to-emerald-500',
    tokens: [
      { name: 'primary', value: '142 71% 35%', category: 'colors' },
      { name: 'secondary', value: '160 60% 45%', category: 'colors' },
      { name: 'accent', value: '80 60% 50%', category: 'colors' },
      { name: 'background', value: '120 10% 98%', category: 'colors' },
      { name: 'foreground', value: '140 40% 10%', category: 'colors' },
      { name: 'card', value: '0 0% 100%', category: 'colors' },
      { name: 'border', value: '142 20% 85%', category: 'colors' },
    ]
  },
];

export function ThemeStudio() {
  const { broadcastUpdate } = useRealtimeSync();
  const [tokens, setTokens] = useState<DesignToken[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedStore, setSelectedStore] = useState<string>('electronics');
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [savingPreset, setSavingPreset] = useState(false);

  // Color tokens (editable state)
  const [colorTokens, setColorTokens] = useState([
    { name: 'primary', label: 'Primary Color', value: '28 92% 54%' },
    { name: 'secondary', label: 'Secondary Color', value: '210 100% 36%' },
    { name: 'accent', label: 'Accent Color', value: '28 92% 54%' },
    { name: 'background', label: 'Background', value: '0 0% 96%' },
    { name: 'foreground', label: 'Text Color', value: '0 0% 20%' },
    { name: 'card', label: 'Card Background', value: '0 0% 100%' },
    { name: 'border', label: 'Border Color', value: '0 0% 89%' },
  ]);

  const typographyTokens = [
    { name: 'font-sans', label: 'Sans Serif Font', value: 'Inter, system-ui, sans-serif' },
    { name: 'font-heading', label: 'Heading Font', value: 'Inter, system-ui, sans-serif' },
    { name: 'text-base', label: 'Base Text Size', value: '16px' },
    { name: 'text-lg', label: 'Large Text', value: '18px' },
    { name: 'text-xl', label: 'Extra Large', value: '20px' },
  ];

  const spacingTokens = [
    { name: 'spacing-xs', label: 'Extra Small', value: '4px' },
    { name: 'spacing-sm', label: 'Small', value: '8px' },
    { name: 'spacing-md', label: 'Medium', value: '16px' },
    { name: 'spacing-lg', label: 'Large', value: '24px' },
    { name: 'spacing-xl', label: 'Extra Large', value: '32px' },
  ];

  // Load active theme from DB
  useEffect(() => {
    loadActiveTheme();
  }, [selectedStore]);

  const loadActiveTheme = async () => {
    try {
      const storeType = selectedStore === 'electronics' ? 'tech' : selectedStore;
      const { data } = await supabase
        .from('themes')
        .select('*')
        .eq('store_type', storeType)
        .eq('is_active', true)
        .limit(1)
        .maybeSingle();

      if (data) {
        // Apply loaded colors to the editor
        const updated = colorTokens.map(t => {
          if (t.name === 'primary' && data.primary_color) return { ...t, value: data.primary_color };
          if (t.name === 'secondary' && data.secondary_color) return { ...t, value: data.secondary_color };
          if (t.name === 'background' && data.background_color) return { ...t, value: data.background_color };
          return t;
        });
        setColorTokens(updated);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  const applyThemeToDOM = (presetTokens: { name: string; value: string }[]) => {
    const root = document.documentElement;
    presetTokens.forEach(token => {
      root.style.setProperty(`--${token.name}`, token.value);
    });
  };

  const applyPreset = async (preset: ThemePresetDef) => {
    setSavingPreset(true);
    try {
      // Apply to DOM for preview
      applyThemeToDOM(preset.tokens);
      
      // Update local color state
      setColorTokens(prev => prev.map(ct => {
        const presetToken = preset.tokens.find(pt => pt.name === ct.name);
        return presetToken ? { ...ct, value: presetToken.value } : ct;
      }));

      // Save to DB
      const storeType = selectedStore === 'electronics' ? 'tech' : selectedStore;
      const primaryToken = preset.tokens.find(t => t.name === 'primary');
      const secondaryToken = preset.tokens.find(t => t.name === 'secondary');
      const bgToken = preset.tokens.find(t => t.name === 'background');

      // Deactivate existing themes for this store
      await supabase
        .from('themes')
        .update({ is_active: false })
        .eq('store_type', storeType);

      // Insert new active theme
      await supabase
        .from('themes')
        .insert({
          store_type: storeType,
          primary_color: primaryToken?.value || '',
          secondary_color: secondaryToken?.value || null,
          background_color: bgToken?.value || null,
          animation_style: 'default',
          is_active: true,
        });

      // Broadcast to all clients
      await broadcastUpdate('theme_update', {
        store_type: storeType,
        tokens: preset.tokens
      });

      setActivePresetId(preset.id);
      toast.success(`"${preset.name}" theme applied to ${selectedStore} store`);
    } catch (error) {
      console.error('Failed to apply preset:', error);
      toast.error('Failed to apply theme preset');
    } finally {
      setSavingPreset(false);
    }
  };

  const saveTheme = async () => {
    try {
      const allTokens: DesignToken[] = colorTokens.map(t => ({
        name: t.name,
        value: t.value,
        category: 'colors' as const
      }));

      applyThemeToDOM(allTokens);

      const storeType = selectedStore === 'electronics' ? 'tech' : selectedStore;
      const primaryToken = allTokens.find(t => t.name === 'primary');
      const secondaryToken = allTokens.find(t => t.name === 'secondary');
      const bgToken = allTokens.find(t => t.name === 'background');

      await supabase
        .from('themes')
        .update({ is_active: false })
        .eq('store_type', storeType);

      await supabase
        .from('themes')
        .insert({
          store_type: storeType,
          primary_color: primaryToken?.value || '',
          secondary_color: secondaryToken?.value || null,
          background_color: bgToken?.value || null,
          is_active: true,
        });

      await broadcastUpdate('theme_update', {
        store_type: storeType,
        tokens: allTokens
      });

      setActivePresetId(null);
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
      tokens: colorTokens.map(t => ({ name: t.name, value: t.value, category: 'colors' })),
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
        if (themeData.tokens) {
          setColorTokens(prev => prev.map(ct => {
            const imported = themeData.tokens.find((t: any) => t.name === ct.name);
            return imported ? { ...ct, value: imported.value } : ct;
          }));
          applyThemeToDOM(themeData.tokens);
          toast.success('Theme imported successfully');
        }
      } catch {
        toast.error('Invalid theme file');
      }
    };
    reader.readAsText(file);
  };

  const updateColorToken = (name: string, value: string) => {
    setColorTokens(prev => prev.map(t => t.name === name ? { ...t, value } : t));
    setActivePresetId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Theme Studio
              </CardTitle>
              <CardDescription>
                Complete control over your store's design system
              </CardDescription>
            </div>
            <div className="flex gap-2 flex-wrap">
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
              <input id="theme-import" type="file" accept=".json" className="hidden" onChange={importTheme} />
              
              <Button onClick={saveTheme}>
                <Save className="h-4 w-4 mr-2" />
                Save & Sync
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Design Tokens Editor */}
      <Tabs defaultValue="presets" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="presets">Presets</TabsTrigger>
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
        </TabsList>

        <TabsContent value="presets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Presets</CardTitle>
              <CardDescription>Select a preset to instantly apply it to your store. You can further customize in the Colors tab.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {themePresets.map(preset => (
                  <div 
                    key={preset.id} 
                    className={`relative rounded-lg border-2 overflow-hidden transition-all cursor-pointer group ${
                      activePresetId === preset.id ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => applyPreset(preset)}
                  >
                    <div className={`h-28 ${preset.preview} relative`}>
                      {activePresetId === preset.id && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-primary text-primary-foreground gap-1">
                            <Check className="h-3 w-3" /> Active
                          </Badge>
                        </div>
                      )}
                      {/* Color swatches preview */}
                      <div className="absolute bottom-2 left-2 flex gap-1">
                        {preset.tokens.filter(t => ['primary', 'secondary', 'accent'].includes(t.name)).map(t => (
                          <div
                            key={t.name}
                            className="w-5 h-5 rounded-full border border-white/30 shadow-sm"
                            style={{ backgroundColor: `hsl(${t.value})` }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="font-semibold text-sm">{preset.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{preset.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

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
                        onChange={(e) => updateColorToken(token.name, e.target.value)}
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
                  <Input defaultValue={token.value} />
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
                  <SelectTrigger><SelectValue /></SelectTrigger>
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
                  <SelectTrigger><SelectValue /></SelectTrigger>
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
      </Tabs>
    </div>
  );
}
