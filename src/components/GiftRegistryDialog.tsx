import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useGiftRegistry } from '@/hooks/useGiftRegistry';
import { Gift } from 'lucide-react';

interface GiftRegistryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId?: string;
}

export function GiftRegistryDialog({ open, onOpenChange, productId }: GiftRegistryDialogProps) {
  const { registries, createRegistry } = useGiftRegistry();
  const isProductMode = !!productId;
  const [selectedRegistry, setSelectedRegistry] = useState<string>('');
  const [showNewRegistry, setShowNewRegistry] = useState(false);
  const [newRegistry, setNewRegistry] = useState({
    name: '',
    event_type: '',
    event_date: '',
    description: '',
  });

  const handleAddToRegistry = async () => {
    if (!selectedRegistry && !showNewRegistry) {
      return;
    }

    if (showNewRegistry) {
      // Create new registry first
      createRegistry(newRegistry);
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            {isProductMode ? 'Add to Gift Registry' : 'Create Gift Registry'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!showNewRegistry && isProductMode ? (
            <>
              {registries.length > 0 && (
                <div className="space-y-2">
                  <Label>Select Registry</Label>
                  <Select value={selectedRegistry} onValueChange={setSelectedRegistry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a registry" />
                    </SelectTrigger>
                    <SelectContent>
                      {registries.map((registry) => (
                        <SelectItem key={registry.id} value={registry.id}>
                          {registry.name} ({registry.event_type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowNewRegistry(true)}
              >
                Create New Registry
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Registry Name *</Label>
                <Input
                  id="name"
                  placeholder="Our Wedding Registry"
                  value={newRegistry.name}
                  onChange={(e) => setNewRegistry({ ...newRegistry, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event_type">Event Type *</Label>
                <Select
                  value={newRegistry.event_type}
                  onValueChange={(value) => setNewRegistry({ ...newRegistry, event_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wedding">Wedding</SelectItem>
                    <SelectItem value="birthday">Birthday</SelectItem>
                    <SelectItem value="baby_shower">Baby Shower</SelectItem>
                    <SelectItem value="housewarming">Housewarming</SelectItem>
                    <SelectItem value="anniversary">Anniversary</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event_date">Event Date</Label>
                <Input
                  id="event_date"
                  type="date"
                  value={newRegistry.event_date}
                  onChange={(e) => setNewRegistry({ ...newRegistry, event_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Tell guests about your special event..."
                  value={newRegistry.description}
                  onChange={(e) => setNewRegistry({ ...newRegistry, description: e.target.value })}
                  rows={3}
                />
              </div>

              {isProductMode && (
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setShowNewRegistry(false)}
                >
                  Back to Selection
                </Button>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleAddToRegistry}
              disabled={isProductMode ? (!selectedRegistry && !showNewRegistry) : (!newRegistry.name || !newRegistry.event_type)}
            >
              {isProductMode ? 'Add to Registry' : 'Create Registry'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}