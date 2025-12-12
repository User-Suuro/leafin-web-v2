// /hooks/useExpenses.ts
"use client";
import { useState, useEffect } from "react";

// 👇 define Expense type inside the hook file
export type Expense = {
  expenseId: number;
  expenseDate: string;
  category: "feed" | "maintenance" | "labor" | "utilities" | "other";
  description: string | null;
  amount: number;
  relatedFishBatchId?: number | null;
  relatedPlantBatchId?: number | null;
};

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      const res = await fetch("/api/expenses");
      if (!res.ok) throw new Error("Failed to fetch expenses");
      const data = await res.json();
      setExpenses(data || []);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return { expenses, setExpenses, loading, refetchExpenses: fetchExpenses };
}
