/**
 * PrimeLinkHub - Real-time communication layer for Prime Enterprises
 * Enables instant synchronization between Admin Dashboard and Store frontends
 */

export type UpdateType = 
  | "UPDATE_THEME"
  | "UPDATE_TEXT"
  | "UPDATE_LAYOUT"
  | "UPDATE_ANIMATION"
  | "UPDATE_CATEGORY"
  | "UPDATE_DISCOUNT"
  | "UPDATE_BANNER"
  | "UPDATE_SEO"
  | "UPDATE_LOCALIZATION"
  | "UPDATE_MAGIC_MODE";

export interface SyncMessage {
  type: UpdateType;
  payload: any;
  timestamp: number;
  storeTarget?: "tech" | "lifestyle" | "both";
}

export interface SyncState {
  theme?: any;
  text?: any;
  layout?: any;
  animation?: any;
  categories?: string[];
  discounts?: any;
  banners?: any;
  seo?: any;
  locale?: string;
  magicMode?: string;
  timestamp: number;
}

class PrimeLinkHubClass {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<(message: SyncMessage) => void> = new Set();
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        this.channel = new BroadcastChannel("PrimeEnterprisesSync");
        this.channel.onmessage = (event) => {
          this.listeners.forEach(handler => handler(event.data));
        };
        this.isInitialized = true;
        console.log("✅ PrimeLinkHub initialized");
      } catch (error) {
        console.error("Failed to initialize PrimeLinkHub:", error);
      }
    }
  }

  send(type: UpdateType, payload: any, storeTarget: "tech" | "lifestyle" | "both" = "both") {
    if (!this.channel) return;

    const message: SyncMessage = {
      type,
      payload,
      timestamp: Date.now(),
      storeTarget,
    };

    try {
      this.channel.postMessage(message);
      
      // Also persist to localStorage for cross-session sync
      const currentState = this.getPersistedState();
      const updatedState = {
        ...currentState,
        [type]: payload,
        timestamp: Date.now(),
      };
      localStorage.setItem("prime_cloud_sync", JSON.stringify(updatedState));
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }

  listen(handler: (message: SyncMessage) => void) {
    this.listeners.add(handler);
    
    return () => {
      this.listeners.delete(handler);
    };
  }

  getPersistedState(): SyncState {
    try {
      const saved = localStorage.getItem("prime_cloud_sync");
      return saved ? JSON.parse(saved) : { timestamp: 0 };
    } catch {
      return { timestamp: 0 };
    }
  }

  setPersistedState(state: Partial<SyncState>) {
    try {
      const current = this.getPersistedState();
      const updated = {
        ...current,
        ...state,
        timestamp: Date.now(),
      };
      localStorage.setItem("prime_cloud_sync", JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to persist state:", error);
    }
  }

  isConnected(): boolean {
    return this.isInitialized && this.channel !== null;
  }

  close() {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
    this.listeners.clear();
    this.isInitialized = false;
  }
}

export const PrimeLinkHub = new PrimeLinkHubClass();
