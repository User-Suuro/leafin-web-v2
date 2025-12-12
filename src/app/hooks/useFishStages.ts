"use client";

import { useEffect, useState } from "react";

export function useFishStages() {
  const [fishStageData, setFishStageData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/fish-batch/fish-batch-stages")
      .then((res) => res.json())
      .then((data) => setFishStageData(data || {}))
      .catch(() => setFishStageData({}))
      .finally(() => setLoading(false));
  }, []);

  return { fishStageData, loading };
}
