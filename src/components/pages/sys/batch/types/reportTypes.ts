export type FishSummary = {
  id: number;
  batchName: string;
  totalFish: number;
  averageWeight: number;
  mortalityRate: number;
  totalBatches: number;
  avgAge: number;
  majorityStage: string;
};

export type PlantSummary = {
  id: number;
  batchName: string;
  totalPlants: number;
  growthStage: string;
  healthScore: number;
  totalBatches: number;
  avgAge: number;
  majorityStage: string;
};