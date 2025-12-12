"use client";

import { useEffect, useState } from "react";

export function usePlantStages() {
  const [plantStageData, setPlantStageData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/plant-batch/plant-batch-stages")
      .then((res) => res.json())
      .then((data) => setPlantStageData(data || {}))
      .catch(() => setPlantStageData({}))
      .finally(() => setLoading(false));
  }, []);

  return { plantStageData, loading };
}
