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

type ReportType = "revenue" | "sales" | "expenses";
type Period = "daily" | "weekly" | "monthly";

type ReportRow = {
  day?: string;
  week?: string;
  month?: string;
  period?: string;
  fish_sales?: number;
  plant_sales?: number;
  expenses?: number;
};
export default function AddReportModal({
  open,
  onClose,
  type,
  period = "daily",
}: {
  open: boolean;
  onClose: () => void;
  type: ReportType;
  period?: Period;
}) {
  const { toast } = useToast();
  const [data, setData] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch API based on period
  useEffect(() => {
    if (!open) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/sales/${period}`);
        if (!res.ok) throw new Error("Failed to fetch report");
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
        toast({
          title: "❌ Error",
          description: "Unable to fetch report data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [open, period, toast]);

  const title =
    type === "revenue"
      ? "Revenue"
      : type === "sales"
        ? "Product Sales"
        : "Expenses";

  // ✅ Export PDF function
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`${title} Report (${period})`, 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [
        [
          "Period",
          "Fish Sales (₱)",
          "Plant Sales (₱)",
          "Expenses (₱)",
          "Total Revenue (₱)",
        ],
      ],
      body: data.map((row) => [
        row.day || row.week || row.month || row.period || "N/A",
        row.fish_sales?.toLocaleString() || 0,
        row.plant_sales?.toLocaleString() || 0,
        row.expenses?.toLocaleString() || 0,
        (
          (row.fish_sales || 0) +
          (row.plant_sales || 0) -
          (row.expenses || 0)
        ).toLocaleString(),
      ]),
    });

    doc.save(`${title}_Report_${period}.pdf`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            📄 {title} Report ({period})
          </DialogTitle>
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
                    <th className="p-2 border">Fish Sales</th>
                    <th className="p-2 border">Plant Sales</th>
                    <th className="p-2 border">Expenses</th>
                    <th className="p-2 border">Total Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center p-3 text-gray-400">
                        No data available
                      </td>
                    </tr>
                  ) : (
                    data.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="p-2 border">
                          {row.day ||
                            row.week ||
                            row.month ||
                            row.period ||
                            "N/A"}
                        </td>
                        <td className="p-2 border">
                          {row.fish_sales?.toLocaleString() || 0}
                        </td>
                        <td className="p-2 border">
                          {row.plant_sales?.toLocaleString() || 0}
                        </td>
                        <td className="p-2 border">
                          {row.expenses?.toLocaleString() || 0}
                        </td>
                        <td className="p-2 border font-semibold">
                          {(
                            (row.fish_sales || 0) +
                            (row.plant_sales || 0) -
                            (row.expenses || 0)
                          ).toLocaleString()}
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
