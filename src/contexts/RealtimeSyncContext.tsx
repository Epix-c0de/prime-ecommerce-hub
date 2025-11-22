import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SyncEvent {
  id: string;
  event_type: string;
  store_type: string | null;
  payload: any;
  broadcast_to: string[];
  created_at: string;
}

interface RealtimeSyncContextType {
  isConnected: boolean;
  lastSync: Date | null;
  broadcastUpdate: (eventType: string, payload: any, storeType?: string) => Promise<void>;
  subscribeToEvent: (eventType: string, callback: (payload: any) => void) => () => void;
}

const RealtimeSyncContext = createContext<RealtimeSyncContextType | undefined>(undefined);

export function RealtimeSyncProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [eventCallbacks] = useState<Map<string, Set<(payload: any) => void>>>(new Map());

  useEffect(() => {
    // Subscribe to sync_events table for real-time updates
    const channel = supabase
      .channel('sync-events')
      .on(
        'postgres_changes' as any,
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sync_events'
        } as any,
        (payload: any) => {
          const event = payload.new as SyncEvent;
          setLastSync(new Date());
          
          // Call registered callbacks for this event type
          const callbacks = eventCallbacks.get(event.event_type);
          if (callbacks) {
            callbacks.forEach(cb => cb(event.payload));
          }
          
          // Show toast notification
          const eventNames: Record<string, string> = {
            theme_update: 'Theme Updated',
            product_update: 'Product Updated',
            category_update: 'Category Updated',
            layout_update: 'Layout Updated',
            settings_update: 'Settings Updated'
          };
          
          toast.success(eventNames[event.event_type] || 'System Updated', {
            description: 'Changes synced in real-time'
          });
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventCallbacks]);

  const broadcastUpdate = async (eventType: string, payload: any, storeType?: string) => {
    try {
      const { error } = await supabase
        .from('sync_events' as any)
        .insert({
          event_type: eventType,
          store_type: storeType || null,
          payload,
          broadcast_to: ['all']
        });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to broadcast update:', error);
      toast.error('Failed to sync changes');
    }
  };

  const subscribeToEvent = (eventType: string, callback: (payload: any) => void) => {
    if (!eventCallbacks.has(eventType)) {
      eventCallbacks.set(eventType, new Set());
    }
    eventCallbacks.get(eventType)!.add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = eventCallbacks.get(eventType);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          eventCallbacks.delete(eventType);
        }
      }
    };
  };

  return (
    <RealtimeSyncContext.Provider
      value={{
        isConnected,
        lastSync,
        broadcastUpdate,
        subscribeToEvent
      }}
    >
      {children}
    </RealtimeSyncContext.Provider>
  );
}

export function useRealtimeSync() {
  const context = useContext(RealtimeSyncContext);
  if (!context) {
    throw new Error('useRealtimeSync must be used within RealtimeSyncProvider');
  }
  return context;
}
