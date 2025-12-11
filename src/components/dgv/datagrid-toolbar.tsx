"use client";

import { Input } from "@/components/ui/input";
import React from "react";

interface DatagridToolbarProps {
  onSearch?: (query: string) => void;
  action?: React.ReactNode;
  additionalControls?: React.ReactNode;
}

export function DatagridToolbar({
  onSearch,
  action,
  additionalControls,
}: DatagridToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex flex-1 items-center space-x-2">
        {onSearch && (
          <Input
            placeholder="Search..."
            className="h-9 w-[150px] lg:w-[250px]"
            onChange={(event) => onSearch(event.target.value)}
          />
        )}
        {additionalControls}
      </div>
      <div className="flex items-center space-x-2">{action}</div>
    </div>
  );
}
