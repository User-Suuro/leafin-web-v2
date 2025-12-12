"use client";

import { useEffect, useState } from "react";
import { Summary, Transaction, MonthlyData } from "@/components/pages/sys/batch/types/salesTypes";

type SalesData = {
  summary: Summary | null;
  transactions: Transaction[];
  chartData: MonthlyData[];
};

export function useSalesData() {
  const [data, setData] = useState<SalesData>({
    summary: null,
    transactions: [],
    chartData: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch summary
    fetch("/api/sales/summary")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch summary");
        return res.json();
      })
      .then((summaryData) =>
        setData((prev) => ({ ...prev, summary: summaryData }))
      )
      .catch((err) => setError(err.message));

    // Fetch recent transactions
    fetch("/api/sales/recent")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch recent transactions");
        return res.json();
      })
      .then((transactionsData) =>
        setData((prev) => ({ ...prev, transactions: transactionsData }))
      )
      .catch((err) => setError(err.message));

    // Fetch monthly chart data
    fetch("/api/sales/monthly")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch monthly data");
        return res.json();
      })
      .then((monthlyData) =>
        setData((prev) => ({ ...prev, chartData: monthlyData }))
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { ...data, loading, error };
}
