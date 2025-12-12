"use client";

import { useEffect, useState } from "react";

type PlantBatch = {
  plantBatchId?: number;
  plantQuantity?: number;
  plant_quantity?: number;
  plantDays?: number;
  condition?: string;
};

export function usePlantBatches() {
  const [lettuceData, setLettuceData] = useState<PlantBatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/plant-batch")
      .then((res) => res.json())
      .then((data) => {
        const batches = Array.isArray(data) ? data : data?.batches ?? [];
        setLettuceData(batches);
      })
      .catch(() => setLettuceData([]))
      .finally(() => setLoading(false));
  }, []);

  return { lettuceData, loading };
}
