import useSWR from "swr";
import { FishBatch, PlantBatch } from "@/components/pages/sys/batch/types/batchTypes";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useBatches() {
  const { data, error, isLoading, mutate } = useSWR("/api/batches", fetcher, {
    refreshInterval: 5000, // Poll every 5 seconds
    revalidateOnFocus: true,
  });

  return {
    fishBatches: (data?.fish as FishBatch[]) || [],
    plantBatches: (data?.plant as PlantBatch[]) || [],
    loading: isLoading,
    isError: error,
    mutate,
  };
}
