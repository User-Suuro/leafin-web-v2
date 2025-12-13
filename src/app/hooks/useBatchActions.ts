import { useState } from "react";
import { BatchType, BatchUpdate } from "@/components/pages/sys/batch/types/batchTypes";

export function useBatchActions(mutate: () => Promise<any>) {
  const [harvestModalOpen, setHarvestModalOpen] = useState(false);
  const [harvestBatchId, setHarvestBatchId] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<BatchType | "">("");

  // Edit a batch
  const handleEdit = async <T extends BatchType>(
    type: T,
    batchId: number,
    updates: BatchUpdate<T>
  ) => {
    try {
      const res = await fetch("/api/batches/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, batchId, updates }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to edit batch");

      await mutate();
    } catch (err) {
      console.error(err);
    }
  };

  // Harvest a batch
  const handleHarvest = async (data: {
    customerName: string;
    totalAmount: number;
    notes: string;
  }) => {
    if (!harvestBatchId || !selectedType) return;

    try {
      const res = await fetch("/api/batches/harvest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedType,
          batchId: harvestBatchId,
          ...data,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to harvest");

      await mutate();

      setHarvestModalOpen(false);
      setHarvestBatchId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to harvest batch");
    }
  };

  // Delete a batch
  const handleDelete = async (batchId: number, type: BatchType) => {
    try {
      const res = await fetch("/api/batches/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, batchId }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete");

      await mutate();
    } catch (err) {
      console.error(err);
      alert("Failed to delete batch");
    }
  };

  // Discard a batch
  const handleDiscard = async (batchId: number, type: BatchType) => {
    try {
      const res = await fetch("/api/batches/discard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, batchId }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to discard");

      await mutate();
    } catch (err) {
      console.error(err);
      alert("Failed to discard batch");
    }
  };

  const openHarvestModal = (batchId: number, type: BatchType) => {
    setHarvestBatchId(batchId);
    setSelectedType(type);
    setHarvestModalOpen(true);
  };

  return {
    handleEdit,
    handleHarvest,
    handleDelete,
    handleDiscard,
    openHarvestModal,
    harvestModalOpen,
    setHarvestModalOpen,
    harvestBatchId,
    selectedType,
    setSelectedType,
  };
}
