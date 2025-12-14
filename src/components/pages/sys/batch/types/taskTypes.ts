export type Task = {
  taskId: number;
  title: string;
  description: string | null;
  taskType: string;
  scheduledDate: string | null;
  scheduledTime: string | null;
  status: string;
  relatedFishBatchId: number | null;
  relatedPlantBatchId: number | null;
  assignedTo: string | null;
};

export type Batch = {
  id: number;
  name: string;
}