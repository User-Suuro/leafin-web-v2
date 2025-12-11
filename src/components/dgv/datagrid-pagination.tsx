"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface DatagridPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

export function DatagridPagination({
  currentPage,
  totalPages,
  pageSize,

  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 30, 50],
}: DatagridPaginationProps) {
  return (
    <div className="flex items-center justify-between py-4">
      {onPageSizeChange && (
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8 justify-between">
                Show {pageSize} Results
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top">
              {pageSizeOptions.map((size) => (
                <DropdownMenuItem
                  key={size}
                  onClick={() => onPageSizeChange(size)}
                >
                  {size}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <div className="text-sm text-muted-foreground">
        Page {currentPage} out of {totalPages}
      </div>

      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-24 flex items-center"
            onClick={() => {
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            className="h-8 w-24 flex items-center"
            onClick={() => {
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className=" h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
