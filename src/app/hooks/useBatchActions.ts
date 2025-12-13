import { useState } from "react";
import { BatchType, BatchUpdate, FishBatch, PlantBatch } from "@/components/pages/sys/batch/types/batchTypes";

export function useBatchActions(
  fishBatches: FishBatch[],
  plantBatches: PlantBatch[],
  setFishBatches: React.Dispatch<React.SetStateAction<FishBatch[]>>,
  setPlantBatches: React.Dispatch<React.SetStateAction<PlantBatch[]>>
) {
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

      if (type === "fish") {
        setFishBatches((prev) =>
          prev.map((b) => (b.fishBatchId === batchId ? { ...b, ...updates } : b))
        );
      } else {
        setPlantBatches((prev) =>
          prev.map((b) => (b.plantBatchId === batchId ? { ...b, ...updates } : b))
        );
      }
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

      // Update local state to remove harvested batch
      if (selectedType === "fish") {
        setFishBatches((prev) =>
          prev.filter((b) => b.fishBatchId !== harvestBatchId)
        );
      } else {
        setPlantBatches((prev) =>
          prev.filter((b) => b.plantBatchId !== harvestBatchId)
        );
      }

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

      // Update local state
      if (type === "fish") {
        setFishBatches((prev) =>
          prev.filter((b) => b.fishBatchId !== batchId)
        );
      } else {
        setPlantBatches((prev) =>
          prev.filter((b) => b.plantBatchId !== batchId)
        );
      }
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

      // Update local state
      if (type === "fish") {
        setFishBatches((prev) =>
          prev.map((b) =>
            b.fishBatchId === batchId ? { ...b, batchStatus: "discarded" } : b
          )
        );
      } else {
        setPlantBatches((prev) =>
          prev.map((b) =>
            b.plantBatchId === batchId ? { ...b, batchStatus: "discarded" } : b
          )
        );
      }
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
