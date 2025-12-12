// components/batch/batchTable.tsx
"use client";

import React, { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead, } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, } from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";
import StatusBadge from "./StatusBadge";
import TableActions from "./TableActions";

type BatchStatus = "growing" | "ready" | "harvested" | "discarded";

type FishBatch = {
  fishBatchId: number;
  fishQuantity: number;
  dateAdded: string;
  expectedHarvestDate?: string;
  condition?: string;
  batchStatus: BatchStatus;
};

type PlantBatch = {
  plantBatchId: number;
  plantQuantity: number;
  dateAdded: string;
  expectedHarvestDate?: string;
  condition?: string;
  batchStatus: BatchStatus;
};

type BatchAction = "harvest" | "discard" | "delete" | "edit";

type BatchTableProps<T> = {
  data: T[];
  type: "fish" | "plant";
  onAction?: (action: BatchAction, batchId: number) => void;
};

export default function BatchTable<T extends FishBatch | PlantBatch>({
  data,
  type,
  onAction,
}: BatchTableProps<T>) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<BatchStatus | "all">("all");
  const [sortKey, setSortKey] = useState<
    "id" | "quantity" | "dateAdded" | "expectedHarvestDate"
  >("dateAdded");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // Type-safe getters
  const getId = (b: T) =>
    type === "fish"
      ? (b as FishBatch).fishBatchId
      : (b as PlantBatch).plantBatchId;
  const getQuantity = (b: T) =>
    type === "fish"
      ? (b as FishBatch).fishQuantity
      : (b as PlantBatch).plantQuantity;

  // Filtered
  const filtered = data.filter((b) => {
    const matchesSearch = Object.values(b)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter = filter === "all" || b.batchStatus === filter;
    return matchesSearch && matchesFilter;
  });

  // Sorted
  const sorted = [...filtered].sort((a, b) => {
    let aValue: string | number = "";
    let bValue: string | number = "";

    switch (sortKey) {
      case "id":
        aValue = getId(a);
        bValue = getId(b);
        break;
      case "quantity":
        aValue = getQuantity(a);
        bValue = getQuantity(b);
        break;
      case "dateAdded":
        aValue = a.dateAdded;
        bValue = b.dateAdded;
        break;
      case "expectedHarvestDate":
        aValue = a.expectedHarvestDate || "";
        bValue = b.expectedHarvestDate || "";
        break;
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const start = (page - 1) * rowsPerPage;
  const paginated = sorted.slice(start, start + rowsPerPage);
  const totalPages = Math.ceil(sorted.length / rowsPerPage);

  const toggleSort = (
    key: "id" | "quantity" | "dateAdded" | "expectedHarvestDate"
  ) => {
    if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <section className="border rounded-xl p-4 shadow-sm bg-white flex flex-col">
      <h2 className="text-xl font-semibold mb-3">
        {type === "fish" ? "Fish Batches" : "Plant Batches"}
      </h2>

      {/* Search + Filter */}
      <div className="flex gap-2 mb-3">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select
          value={filter}
          onValueChange={(val: BatchStatus | "all") => setFilter(val)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="growing">Growing</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="harvested">Harvested</SelectItem>
            <SelectItem value="discarded">Discarded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-y-auto max-h-[400px] rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => toggleSort("id")}>
                # <ArrowUpDown className="inline w-3 h-3 ml-1" />
              </TableHead>
              <TableHead onClick={() => toggleSort("quantity")}>
                Quantity <ArrowUpDown className="inline w-3 h-3 ml-1" />
              </TableHead>
              <TableHead onClick={() => toggleSort("dateAdded")}>
                Date Added <ArrowUpDown className="inline w-3 h-3 ml-1" />
              </TableHead>
              <TableHead>Condition</TableHead>
              <TableHead onClick={() => toggleSort("expectedHarvestDate")}>
                Expected Harvest <ArrowUpDown className="inline w-3 h-3 ml-1" />
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((b) => (
              <TableRow key={getId(b)}>
                <TableCell>{getId(b)}</TableCell>
                <TableCell>{getQuantity(b)}</TableCell>
                <TableCell>{b.dateAdded}</TableCell>
                <TableCell>{b.condition}</TableCell>
                <TableCell>{b.expectedHarvestDate || "-"}</TableCell>
                <TableCell>
                  <StatusBadge status={b.batchStatus} />
                </TableCell>
                <TableCell>
                  <TableActions
                    batchType={type}
                    batchId={getId(b)}
                    status={b.batchStatus}
                    onAction={
                      onAction
                        ? (action: BatchAction) => onAction(action, getId(b))
                        : undefined
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-2 mt-2">
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </button>
        <span>
          Page {page} of {totalPages || 1}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
}
