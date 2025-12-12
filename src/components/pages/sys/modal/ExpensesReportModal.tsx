"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast-provider";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Period = "daily" | "weekly" | "monthly";

type ExpenseRow = {
  day?: string;
  week?: string;
  month?: string;
  period?: string;
  total: number;
};

export default function ExpensesReportModal({
  open,
  onClose,
  period = "daily",
}: {
  open: boolean;
  onClose: () => void;
  period?: Period;
}) {
  const { toast } = useToast();
  const [data, setData] = useState<ExpenseRow[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch expenses API
  useEffect(() => {
    if (!open) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/expenses/${period}`);
        if (!res.ok) throw new Error("Failed to fetch expenses report");
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
        toast({
          title: "❌ Error",
          description: "Unable to fetch expenses data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [open, period, toast]);

  // ✅ Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Expenses Report (${period})`, 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["Period", "Expenses (₱)"]],
      body: data.map((row) => [
        row.day || row.week || row.month || row.period || "N/A",
        row.total?.toLocaleString() || 0,
      ]),
    });

    doc.save(`Expenses_Report_${period}.pdf`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>💸 Expenses Report ({period})</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : (
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-2 border">Period</th>
                    <th className="p-2 border">Expenses</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="text-center p-3 text-gray-400">
                        No data available
                      </td>
                    </tr>
                  ) : (
                    data.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="p-2 border">
                          {row.day || row.week || row.month || "N/A"}
                        </td>
                        <td className="p-2 border font-semibold">
                          {row.total?.toLocaleString() || 0}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button onClick={exportPDF}>📄 Export PDF</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
