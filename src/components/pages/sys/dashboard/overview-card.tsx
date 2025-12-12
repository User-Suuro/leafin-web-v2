"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, } from "@/components/ui/select";

interface Batch {
  id: number;
  quantity: number;
  days: number;
  condition: string;
}

interface OverviewCardProps {
  title: React.ReactNode;
  borderColor: string;
  type?: "fish" | "plant"; // 👈 added
  batches?: Batch[];
  totalBatches?: number;
  avgAge?: number;
  totalCount?: number;
  condition?: string;
  leftLabel?: string;
  onClick?: () => void;
}

export function OverviewCard({
  title,
  borderColor,
  type = "fish", // default fish para backward-compatible
  batches,
  totalBatches,
  avgAge,
  totalCount,
  condition,
  leftLabel,
  onClick,
}: OverviewCardProps) {
  const [selectedId, setSelectedId] = useState<number | null>(
    batches && batches.length > 0 ? batches[0].id : null
  );
  const [batchDetails, setBatchDetails] = useState<Batch | null>(null);

  const handleSelectBatch = async (id: number) => {
    setSelectedId(id);

    try {
      const endpoint =
        type === "plant" ? `/api/plant-batch/${id}` : `/api/fish-batch/${id}`;

      const res = await fetch(endpoint);
      if (!res.ok) throw new Error("Failed to fetch batch");
      const data = await res.json();

      setBatchDetails({
        id: data.plantBatchId ?? data.fishBatchId ?? id,
        quantity: data.plantQuantity ?? data.fishQuantity ?? 0,
        days: data.fishDays ?? data.plantDays ?? 0,
        condition: data.condition ?? "N/A",
      });
    } catch (err) {
      console.error(err);
      setBatchDetails(null);
    }
  };

  const selectedBatch =
    batchDetails ?? batches?.find((b) => b.id === selectedId) ?? null;

  return (
    <Card className={`border-t-4 ${borderColor}`}>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">{title}</h2>
          {onClick && (
            <button
              onClick={onClick}
              className="text-sm text-blue-600 hover:underline"
            >
              + Add
            </button>
          )}
        </div>

        {batches ? (
          <>
            {/* Batch Selector Mode */}
            <Select
              value={selectedId?.toString() ?? ""}
              onValueChange={(val) => handleSelectBatch(Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Batch" />
              </SelectTrigger>
              <SelectContent>
                {batches.map((b) => (
                  <SelectItem key={b.id} value={b.id.toString()}>
                    Batch #{b.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedBatch ? (
              <div className="text-sm space-y-1">
                <p>
                  <strong>Batch:</strong> {selectedBatch.id}
                </p>
                <p>
                  <strong>Quantity:</strong> {selectedBatch.quantity}
                </p>
                <p>
                  <strong>Age:</strong> {selectedBatch.days} days
                </p>
                <p>
                  <strong>Condition:</strong> {selectedBatch.condition}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No batch selected.</p>
            )}
          </>
        ) : (
          <>
            {/* Summary Mode */}
            <div className="text-sm space-y-1">
              <p>
                <strong>Total Batches:</strong> {totalBatches ?? 0}
              </p>
              <p>
                <strong>Avg Age:</strong> {avgAge ?? 0} days
              </p>
              <p>
                <strong>{leftLabel ?? "Total"}:</strong> {totalCount ?? 0}
              </p>
              <p>
                <strong>Condition:</strong> {condition ?? "N/A"}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
