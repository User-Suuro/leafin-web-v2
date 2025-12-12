"use client";

import { useEffect, useState } from "react";

type FishBatch = {
  fishBatchId?: number;
  fishQuantity?: number;
  fish_quantity?: number;
  fishDays?: number;
  condition?: string;
};

type ApiResponse = {
  batches?: FishBatch[];
};

export function useFishBatches() {
  const [tilapiaData, setTilapiaData] = useState<FishBatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/fish-batch")
      .then((res) => res.json() as Promise<ApiResponse>)
      .then((data) => setTilapiaData(data?.batches ?? []))
      .catch(() => setTilapiaData([]))
      .finally(() => setLoading(false));
  }, []);

  return { tilapiaData, loading };
}
