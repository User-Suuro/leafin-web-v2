"use client";

import React from "react";
import { DatagridToolbar } from "./datagrid-toolbar";
import { DatagridTable, DatagridColumn } from "./datagrid-table";
import { DatagridPagination } from "./datagrid-pagination";

interface DatagridViewProps<T> {
  // Data props
  data: T[];
  columns: DatagridColumn<T>[];
  totalItems: number;
  loading?: boolean;
  emptyState?: React.ReactNode;

  // Pagination props
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];

  // Toolbar props
  onSearch?: (query: string) => void;
  onReload?: () => void;
  action?: React.ReactNode;
  additionalControls?: React.ReactNode;
}

export function DatagridView<T>({
  data,
  columns,
  totalItems,
  loading,
  emptyState,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions,
  onSearch,
  onReload,
  action,
  additionalControls,
}: DatagridViewProps<T>) {
  // Calculate total pages
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="space-y-4">
      <DatagridToolbar
        onSearch={onSearch}
        onReload={onReload}
        action={action}
        additionalControls={additionalControls}
      />
      <DatagridTable
        data={data}
        columns={columns}
        loading={loading}
        emptyState={emptyState}
      />
      <DatagridPagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        pageSizeOptions={pageSizeOptions}
      />
    </div>
  );
}

// Re-export types for usage
export type { DatagridColumn };
