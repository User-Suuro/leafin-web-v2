"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DatagridToolbarProps {
  onSearch?: (query: string) => void;
  onReload?: () => void;
  action?: React.ReactNode;
  additionalControls?: React.ReactNode;
}

export function DatagridToolbar({
  onSearch,
  onReload,
  action,
  additionalControls,
}: DatagridToolbarProps) {
  const [searchValue, setSearchValue] = React.useState("");

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex flex-1 items-center space-x-2">
        {onSearch && (
          <>
            <Input
              placeholder="Search..."
              className="h-9 w-[150px] lg:w-[250px]"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button size="sm" onClick={handleSearch} className="h-9 px-3">
              Search
            </Button>
          </>
        )}
        {onReload && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onReload}
                  className="h-9 w-9"
                >
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reload</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {additionalControls}
      </div>
      <div className="flex items-center space-x-2">{action}</div>
    </div>
  );
}
