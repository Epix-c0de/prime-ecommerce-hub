import { useEffect, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SyncStatusProps {
  isConnected: boolean;
  lastUpdate?: number;
  className?: string;
}

export const SyncStatus = ({ isConnected, className }: SyncStatusProps) => {
  const [status, setStatus] = useState<"connected" | "disconnected">("connected");

  useEffect(() => {
    if (!isConnected) {
      setStatus("disconnected");
      return;
    }

    setStatus("connected");
  }, [isConnected]);

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
