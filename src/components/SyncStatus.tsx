import { useEffect, useState } from "react";
import { Wifi, WifiOff, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SyncStatusProps {
  isConnected: boolean;
  lastUpdate?: number;
  className?: string;
}

export const SyncStatus = ({ isConnected, lastUpdate, className }: SyncStatusProps) => {
  const [status, setStatus] = useState<"connected" | "pending" | "disconnected">("connected");
  const [timeSinceUpdate, setTimeSinceUpdate] = useState("");

  useEffect(() => {
    if (!isConnected) {
      setStatus("disconnected");
      return;
    }

    if (!lastUpdate) {
      setStatus("connected");
      return;
    }

    const checkStatus = () => {
      const now = Date.now();
      const diff = now - lastUpdate;

      if (diff > 60000) {
        setStatus("pending");
      } else {
        setStatus("connected");
      }

      // Calculate time since last update
      const seconds = Math.floor(diff / 1000);
      if (seconds < 60) {
        setTimeSinceUpdate(`${seconds}s ago`);
      } else {
        const minutes = Math.floor(seconds / 60);
        setTimeSinceUpdate(`${minutes}m ago`);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000);

    return () => clearInterval(interval);
  }, [isConnected, lastUpdate]);

  const getStatusConfig = () => {
    switch (status) {
      case "connected":
        return {
          icon: Wifi,
          color: "text-green-500",
          bgColor: "bg-green-500/10",
          label: "Connected",
          description: "Receiving live updates from Admin Dashboard",
        };
      case "pending":
        return {
          icon: Clock,
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/10",
          label: "Pending",
          description: "Last update received " + timeSinceUpdate,
        };
      case "disconnected":
        return {
          icon: WifiOff,
          color: "text-red-500",
          bgColor: "bg-red-500/10",
          label: "Disconnected",
          description: "Not connected to Admin Dashboard",
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all",
              config.bgColor,
              className
            )}
          >
            <Icon className={cn("h-4 w-4", config.color)} />
            <span className={cn("text-xs font-medium hidden md:inline", config.color)}>
              {config.label}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{config.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
