export type BatchStatus = "growing" | "ready" | "harvested" | "discarded";

export type FishBatch = {
  fishBatchId: number;
  fishQuantity: number;
  dateAdded: string;
  expectedHarvestDate?: string;
  condition?: string;
  batchStatus: BatchStatus;
};

export type PlantBatch = {
  plantBatchId: number;
  plantQuantity: number;
  dateAdded: string;
  expectedHarvestDate?: string;
  condition?: string;
  batchStatus: BatchStatus;
};

export type BatchType = "fish" | "plant";

export type BatchUpdate<T extends BatchType> = T extends "fish"
  ? Partial<{
      fishBatchId: number;
      fishQuantity: number;
      batchStatus: BatchStatus;
    }>
  : Partial<{
      plantBatchId: number;
      plantQuantity: number;
      batchStatus: BatchStatus;
    }>;
