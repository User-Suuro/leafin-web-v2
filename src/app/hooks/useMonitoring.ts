"use client";

import { useCallback, useEffect, useState } from "react";
import { TimelineEvent } from "@/components/pages/sys/monitoring/stage-timeline";

const DEFAULT_FISH_API = "/api/fish-batch/timeline";
const DEFAULT_LETTUCE_API = "/api/plant-batch/timeline";

export function useMonitoring() {
  const [tilapiaBatches, setTilapiaBatches] = useState<TimelineEvent[]>([]);
  const [lettuceBatches, setLettuceBatches] = useState<TimelineEvent[]>([]);

  const [loadingTilapia, setLoadingTilapia] = useState(false);
  const [loadingLettuce, setLoadingLettuce] = useState(false);
  const [timelineError, setTimelineError] = useState<string | null>(null);

  const fetchTimelines = useCallback(async () => {
    setLoadingTilapia(true);
    setLoadingLettuce(true);
    setTimelineError(null);

    try {
      const [tilapiaRes, lettuceRes] = await Promise.allSettled([
        fetch(DEFAULT_FISH_API, { cache: "no-store" }),
        fetch(DEFAULT_LETTUCE_API, { cache: "no-store" }).catch(() => null),
      ]);

      // tilapia
      if (tilapiaRes.status === "fulfilled") {
        try {
          const data = await tilapiaRes.value.json();
          setTilapiaBatches(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Tilapia parse error:", err);
          setTimelineError("Failed to parse tilapia timeline data");
          setTilapiaBatches([]);
        }
      } else {
        console.error("Tilapia fetch failed:", tilapiaRes.reason);
        setTimelineError((prev) => prev ?? "Failed to fetch tilapia timeline");
        setTilapiaBatches([]);
      }

      // lettuce
      if (lettuceRes && lettuceRes.status === "fulfilled" && lettuceRes.value) {
        try {
          const json = await lettuceRes.value.json();
          setLettuceBatches(Array.isArray(json.data) ? json.data : []);
        } catch (err) {
          console.warn("Lettuce parse error:", err);
          setLettuceBatches([]);
        }
      } else {
        setLettuceBatches([]);
      }
    } finally {
      setLoadingTilapia(false);
      setLoadingLettuce(false);
    }
  }, []);

  useEffect(() => {
    fetchTimelines();
  }, [fetchTimelines]);

  return {
    tilapiaBatches,
    lettuceBatches,
    loadingTilapia,
    loadingLettuce,
    timelineError,
    fetchTimelines,
  };
}
