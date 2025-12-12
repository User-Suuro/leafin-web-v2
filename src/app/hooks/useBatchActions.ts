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

  const openHarvestModal = (batchId: number, type: BatchType) => {
    setHarvestBatchId(batchId);
    setSelectedType(type);
    setHarvestModalOpen(true);
  };

  return {
    handleEdit,
    openHarvestModal,
    harvestModalOpen,
    setHarvestModalOpen,
    harvestBatchId,
    selectedType,
    setSelectedType,
  };
}
