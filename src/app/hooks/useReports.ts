// hooks/useReports.ts
import { useState, useEffect } from "react";
import { FishSummary, PlantSummary } from "@/components/pages/sys/batch/types/reportTypes";

export function useReports() {
  const [fishReports, setFishReports] = useState<FishSummary[]>([]);
  const [plantReports, setPlantReports] = useState<PlantSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ new state for modal handling
  const [modalOpen, setModalOpen] = useState(false);
  const [reportType, setReportType] = useState<
    "sales" | "expenses" | "revenue" | null
  >(null);
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | null>(
    null
  );

  // ✅ fetch reports
  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/reports");
      if (!res.ok) throw new Error("Failed to fetch reports");
      const data = await res.json();
      setFishReports(data.fish || []);
      setPlantReports(data.plant || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // ✅ modal controls
  const openReportModal = (
    type: "sales" | "expenses" | "revenue",
    selectedPeriod: "daily" | "weekly" | "monthly"
  ) => {
    setReportType(type);
    setPeriod(selectedPeriod);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setReportType(null);
    setPeriod(null);
  };

  // ✅ you might want aggregated summaries
  const fishSummary = fishReports[0] || null;
  const plantSummary = plantReports[0] || null;

  return {
    fishReports,
    plantReports,
    loading,
    modalOpen,
    reportType,
    period,
    openReportModal,
    closeModal,
    fishSummary,
    plantSummary,
  };
}
