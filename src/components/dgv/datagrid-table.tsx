"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

export interface DatagridColumn<T> {
  header: React.ReactNode;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

interface DatagridTableProps<T> {
  data: T[];
  columns: DatagridColumn<T>[];
  loading?: boolean;
  emptyState?: React.ReactNode;
}

export function DatagridTable<T>({
  data,
  columns,
  loading,
  emptyState,
}: DatagridTableProps<T>) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col, index) => (
              <TableHead key={index} className={col.className}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {emptyState || "No results."}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((col, colIndex) => {
                  const cellContent = col.cell
                    ? col.cell(item)
                    : col.accessorKey
                    ? (item[col.accessorKey] as React.ReactNode)
                    : null;

                  return (
                    <TableCell key={colIndex} className={col.className}>
                      {cellContent}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
