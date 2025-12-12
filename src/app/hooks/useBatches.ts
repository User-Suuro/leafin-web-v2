import { useEffect, useState } from "react";
import { FishBatch, PlantBatch } from "@/components/pages/sys/batch/types/batchTypes";

export function useBatches() {
  const [fishBatches, setFishBatches] = useState<FishBatch[]>([]);
  const [plantBatches, setPlantBatches] = useState<PlantBatch[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBatches = async () => {
    try {
      const res = await fetch("/api/batches");
      if (!res.ok) throw new Error("Failed to fetch batches");
      const data = await res.json();

      setFishBatches(data.fish || []);
      setPlantBatches(data.plant || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  return {
    fishBatches,
    plantBatches,
    setFishBatches,
    setPlantBatches,
    loading,
  };
}
