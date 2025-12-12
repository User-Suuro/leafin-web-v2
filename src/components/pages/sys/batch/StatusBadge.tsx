"use client";

import { cn } from "@/lib/utils";

type BatchStatus = "growing" | "ready" | "harvested" | "discarded";

export default function StatusBadge({ status }: { status: BatchStatus }) {
  const colors: Record<BatchStatus, string> = {
    growing: "bg-green-100 text-green-700",
    ready: "bg-blue-100 text-blue-700",
    harvested: "bg-gray-200 text-gray-700",
    discarded: "bg-red-100 text-red-700",
  };

  return (
    <span className={cn("px-2 py-1 rounded-full text-xs font-medium", colors[status])}>
      {status}
    </span>
  );
}
