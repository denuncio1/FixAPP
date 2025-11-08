"use client";

import React from "react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { WifiOff, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null; // Não mostra nada se estiver online
  }

  return (
    <Badge
      className={cn(
        "fixed bottom-4 right-4 z-50 flex items-center gap-1 px-3 py-2 text-sm font-medium",
        "bg-red-600 text-white shadow-lg animate-pulse"
      )}
    >
      <WifiOff className="h-4 w-4" />
      Offline
    </Badge>
  );
};

export default OfflineIndicator;