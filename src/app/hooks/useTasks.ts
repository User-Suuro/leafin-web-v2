"use client";

import { useEffect, useState } from "react";
import { Task, Batch } from "@/components/pages/sys/batch/types/taskTypes";

type TaskData = {
  tasks: Task[];
  batches: Batch[];
};

export function useTasks() {
  const [data, setData] = useState<TaskData>({
    tasks: [],
    batches: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch all tasks
  async function fetchTasks() {
    try {
      setLoading(true);
      const res = await fetch("/api/task-management");
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const tasks = await res.json();
      setData((prev) => ({ ...prev, tasks: tasks || [] }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  // ✅ Fetch batches depending on type
  async function fetchBatches(type: "fish" | "plant") {
    try {
      const url =
        type === "fish"
          ? "/api/fish-batch/batches-fish"
          : "/api/plant-batch/batches-plant";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch batches");
      const batches = await res.json();
      setData((prev) => ({ ...prev, batches: batches || [] }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  // ✅ Add a new task
  async function addTask(task: Partial<Task>) {
    try {
      const res = await fetch("/api/task-management", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      if (!res.ok) throw new Error("Failed to add task");

      await fetchTasks(); // refresh after add
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks: data.tasks,
    batches: data.batches,
    loading,
    error,
    fetchTasks,
    fetchBatches,
    addTask,
  };
}
