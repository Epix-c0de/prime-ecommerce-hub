import { useConfig } from '@/contexts/ConfigContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SeasonalMode, seasonalPresets } from '@/config/seasonalConfig';
import { toast } from 'sonner';
import { Snowflake, Heart, Sparkles, ShoppingBag, PartyPopper, Rabbit, Ghost, Lamp } from 'lucide-react';

const seasonalIcons: Record<SeasonalMode, any> = {
  normal: null,
  christmas: Snowflake,
  eid: Lamp,
  valentine: Heart,
  'black-friday': ShoppingBag,
  'new-year': PartyPopper,
  easter: Rabbit,
  halloween: Ghost,
  diwali: Sparkles,
};

export function SeasonalModeControl() {
  const { seasonalMode, setSeasonalMode, seasonal } = useConfig();

  const handleModeChange = (mode: SeasonalMode) => {
    setSeasonalMode(mode);
    toast.success(
      mode === 'normal' 
        ? 'Seasonal mode disabled' 
        : `${seasonalPresets[mode].name} mode activated!`
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Active Seasonal Mode</CardTitle>
          <CardDescription>
            Current mode: <Badge variant="secondary">{seasonal.name}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {seasonalMode !== 'normal' && seasonal.theme.banner && (
            <div
              className="p-4 rounded-lg text-center font-medium mb-4"
              style={{
                backgroundColor: seasonal.theme.banner.backgroundColor,
                color: seasonal.theme.banner.textColor,
              }}
            >
              {seasonal.theme.banner.text}
            </div>
          )}

          {seasonalMode !== 'normal' && seasonal.messaging.heroTitle && (
            <div className="space-y-2 mb-4 p-4 bg-muted rounded-lg">
              <h3 className="font-bold text-lg">{seasonal.messaging.heroTitle}</h3>
              <p className="text-sm text-muted-foreground">
                {seasonal.messaging.heroSubtitle}
              </p>
              {seasonal.messaging.ctaText && (
                <Button size="sm">{seasonal.messaging.ctaText}</Button>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {seasonal.theme.colors && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Colors:</span>
                  <div
                    className="w-8 h-8 rounded border"
                    style={{ background: `hsl(${seasonal.theme.colors.primary})` }}
                  />
                  <div
                    className="w-8 h-8 rounded border"
                    style={{ background: `hsl(${seasonal.theme.colors.secondary})` }}
                  />
                  <div
                    className="w-8 h-8 rounded border"
                    style={{ background: `hsl(${seasonal.theme.colors.accent})` }}
                  />
                </div>
              </>
            )}
          </div>

          {seasonal.theme.effects?.particles && (
            <div className="mt-4">
              <Badge variant="outline">
                Effect: {seasonal.theme.effects.particles}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Seasonal Modes</CardTitle>
          <CardDescription>
            Click to activate a seasonal theme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(seasonalPresets).map(([key, preset]) => {
              const Icon = seasonalIcons[key as SeasonalMode];
              const isActive = seasonalMode === key;

              return (
                <Button
                  key={key}
                  variant={isActive ? 'default' : 'outline'}
                  onClick={() => handleModeChange(key as SeasonalMode)}
                  className="h-24 flex flex-col gap-2"
                >
                  {Icon && <Icon className="h-6 w-6" />}
                  <span className="text-sm font-medium">{preset.name}</span>
                  {isActive && <Badge variant="secondary" className="text-xs">Active</Badge>}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleModeChange('normal')}
            disabled={seasonalMode === 'normal'}
          >
            Reset to Normal
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const modes = Object.keys(seasonalPresets).filter(m => m !== 'normal') as SeasonalMode[];
              const randomMode = modes[Math.floor(Math.random() * modes.length)];
              handleModeChange(randomMode);
            }}
          >
            Random Theme
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
