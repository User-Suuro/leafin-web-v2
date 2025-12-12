"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Trash, Plus } from "lucide-react";
import ConfirmModal from "@/components/pages/sys/modal/ConfirmModal";

import { useExpenses, Expense } from "../../../hooks/useExpenses";
import { useBatches } from "../../../hooks/useBatches";

export default function MyExpensesPage() {
  const { expenses, setExpenses, loading, refetchExpenses } = useExpenses();
  const { fishBatches } = useBatches();

  const [category, setCategory] = useState<Expense["category"]>("feed");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [fishBatch, setFishBatch] = useState<number | "">("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<number | null>(null);

  const handleAdd = async () => {
    if (!category || !description || !amount) return;

    const newExpense: Partial<Expense> = {
      category,
      description,
      amount: Number(amount),
      relatedFishBatchId: category === "feed" ? Number(fishBatch) : null,
      relatedPlantBatchId: null,
    };

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExpense),
      });

      if (!res.ok) throw new Error("Failed to add expense");

      refetchExpenses();
      setDescription("");
      setAmount("");
      setFishBatch("");
    } catch (err) {
      console.error("Error adding expense:", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete expense");

      refetchExpenses();
    } catch (err) {
      console.error("Error deleting expense:", err);
    } finally {
      setConfirmOpen(false);
      setExpenseToDelete(null);
    }
  };

  const confirmDelete = (id: number) => {
    setExpenseToDelete(id);
    setConfirmOpen(true);
  };

  return (
    <div className="flex flex-col p-5 space-y-6 min-h-screen min-w-screen pr-30">
      <header>
        <h1 className="text-2xl font-bold">My Expenses</h1>
        <Separator className="mt-1" />
      </header>

      {/* Add Expense Form */}
      <section className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
        <div className="flex flex-col">
          <Label>Category</Label>
          <Select
            value={category}
            onValueChange={(val) => setCategory(val as Expense["category"])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="feed">Feed</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {category === "feed" && (
          <div className="flex flex-col">
            <Label>Related Fish Batch</Label>
            <Select
              value={String(fishBatch)}
              onValueChange={(val) => setFishBatch(Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Batch" />
              </SelectTrigger>
              <SelectContent>
                {fishBatches.map((batch) => (
                  <SelectItem key={batch.fishBatchId} value={String(batch.fishBatchId)}>
                    Batch #{batch.fishBatchId} ({batch.dateAdded})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}


        <div className="flex flex-col">
          <Label>Description</Label>
          <Input
            placeholder="e.g. Purchased tilapia feed"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <Label>Amount</Label>
          <Input
            type="number"
            placeholder="e.g. 500"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>

        <Button
          className="h-10 w-full flex items-center gap-2"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4" /> Add
        </Button>
      </section>

      {/* Expense Table */}
      <section>
        {loading ? (
          <p>Loading expenses...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((exp) => (
                <TableRow key={exp.expenseId}>
                  <TableCell>{exp.expenseId}</TableCell>
                  <TableCell>{exp.expenseDate}</TableCell>
                  <TableCell>{exp.category}</TableCell>
                  <TableCell>{exp.description}</TableCell>
                  <TableCell>₱ {Number(exp.amount).toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => confirmDelete(exp.expenseId)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {expenses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No expenses added yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </section>

      {/* Confirm Modal */}
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => expenseToDelete && handleDelete(expenseToDelete)}
        title="Delete Expense"
        description="Are you sure you want to delete this expense? This action cannot be undone."
        variant="destructive"
      />
    </div>
  );
}
