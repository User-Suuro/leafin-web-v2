"use client";

import { useState } from "react";
import { CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useTasks } from "../../../hooks/useTasks";

export default function TaskManagement() {
  const { tasks, batches, fetchBatches, addTask, loading } = useTasks();

  const [harvestType, setHarvestType] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    taskType: "",
    scheduledDate: "",
    scheduledTime: "",
    relatedBatchId: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (value: string) => {
    handleChange("taskType", value);

    if (value === "feeding") {
      setHarvestType("");
      fetchBatches("fish");
    } else if (value === "harvest") {
      setHarvestType("");
      handleChange("relatedBatchId", "");
    } else {
      setHarvestType("");
      handleChange("relatedBatchId", "");
    }
  };

  const handleHarvestTypeChange = (type: string) => {
    setHarvestType(type);
    fetchBatches(type as "fish" | "plant");
  };

  const handleAddTask = async () => {
    if (!formData.title || !formData.taskType) {
      alert("Title & category are required!");
      return;
    }

    await addTask({
      title: formData.title,
      description: formData.description || null,
      taskType: formData.taskType,
      scheduledDate: formData.scheduledDate || null,
      scheduledTime: formData.scheduledTime || null,
      status: "pending",
      relatedFishBatchId:
        formData.taskType === "feeding" ||
          (formData.taskType === "harvest" && harvestType === "fish")
          ? Number(formData.relatedBatchId) || null
          : null,
      relatedPlantBatchId:
        formData.taskType === "harvest" && harvestType === "plant"
          ? Number(formData.relatedBatchId) || null
          : null,
    });

    // reset form
    setFormData({
      title: "",
      description: "",
      taskType: "",
      scheduledDate: "",
      scheduledTime: "",
      relatedBatchId: "",
    });
    setHarvestType("");
  };

  return (
    <div className="relative min-h-screen min-w-screen">
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-2">Task Management</h1>
        <Separator className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Add Task Form */}
          <div className="flex-1 max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <CalendarCheck className="text-blue-500 w-6 h-6" />
              <h2 className="text-xl font-semibold">Add New Task</h2>
            </div>

            <div className="border rounded-lg p-6 shadow-sm space-y-4">
              {/* Task Title */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Task Title:
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Enter Task Title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description:
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Enter Description"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-1">Category:</label>
                <Select value={formData.taskType} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="feeding">Feeding</SelectItem>
                    <SelectItem value="harvest">Harvest</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Harvest Type */}
              {formData.taskType === "harvest" && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Harvest Type:
                  </label>
                  <Select value={harvestType} onValueChange={handleHarvestTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Harvest Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fish">Fish</SelectItem>
                      <SelectItem value="plant">Plant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Batch Selector */}
              {batches.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-1">Select Batch:</label>
                  <Select
                    value={formData.relatedBatchId}
                    onValueChange={(value) => handleChange("relatedBatchId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose Batch" />
                    </SelectTrigger>
                    <SelectContent>
                      {batches.map((b) => (
                        <SelectItem key={b.id} value={String(b.id)}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Schedule Date */}
              <div>
                <label className="block text-sm font-medium mb-1">Schedule Date:</label>
                <Input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => handleChange("scheduledDate", e.target.value)}
                />
              </div>

              {/* Schedule Time */}
              <div>
                <label className="block text-sm font-medium mb-1">Schedule Time:</label>
                <Input
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => handleChange("scheduledTime", e.target.value)}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4">
                <Button
                  variant="secondary"
                  onClick={() =>
                    setFormData({
                      title: "",
                      description: "",
                      taskType: "",
                      scheduledDate: "",
                      scheduledTime: "",
                      relatedBatchId: "",
                    })
                  }
                >
                  Clear
                </Button>
                <Button onClick={handleAddTask} disabled={loading}>
                  {loading ? "Adding..." : "Add"}
                </Button>
              </div>
            </div>
          </div>

          {/* Ongoing Tasks */}
          <div className="flex-1 border rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Ongoing</h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <div key={`task-${task.taskId}`} className="rounded-lg p-4 shadow">
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm">{task.description}</p>
                    <p className="text-blue-600 font-medium text-sm mt-1">
                      {task.taskType}
                    </p>
                    <p className="text-xs text-gray-500">
                      {task.scheduledDate || "No date"} {task.scheduledTime || ""}
                    </p>
                    {task.relatedFishBatchId && (
                      <p className="text-xs">Fish Batch: {task.relatedFishBatchId}</p>
                    )}
                    {task.relatedPlantBatchId && (
                      <p className="text-xs">Plant Batch: {task.relatedPlantBatchId}</p>
                    )}
                    <p className="text-xs text-gray-500">Status: {task.status}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No tasks available. Add one above.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
