
import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { fishBatch } from "@/lib/db/schema/fishBatch";
import { plantBatch } from "@/lib/db/schema/plantBatch";
import { eq, not } from "drizzle-orm";
import { calculateBatchStats } from "@/lib/batchUtils";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const [fishBatches, plantBatches] = await Promise.all([
            db.select().from(fishBatch),
            db.select().from(plantBatch),
        ]);

        const totalFishBatches = fishBatches.length;
        const totalFish = fishBatches.reduce((sum, b) => sum + (b.fishQuantity || 0), 0);

        const { avgAge: avgFishAge, majorityStage: majorityFishStage } = calculateBatchStats(fishBatches);

        const fishSummary = {
            id: 1,
            batchName: "All Batches",
            totalFish,
            averageWeight: 0,
            mortalityRate: 0,
            totalBatches: totalFishBatches,
            avgAge: avgFishAge,
            majorityStage: majorityFishStage,
        };

        const totalPlantBatches = plantBatches.length;
        const totalPlants = plantBatches.reduce((sum, b) => sum + (b.plantQuantity || 0), 0);

        const { avgAge: avgPlantAge, majorityStage: majorityPlantStage } = calculateBatchStats(plantBatches);

        const plantSummary = {
            id: 1,
            batchName: "All Batches",
            totalPlants,
            growthStage: majorityPlantStage,
            healthScore: 100,
            totalBatches: totalPlantBatches,
            avgAge: avgPlantAge,
            majorityStage: majorityPlantStage,
        };

        return NextResponse.json({
            fish: [fishSummary],
            plant: [plantSummary],
        });
    } catch (error) {
        console.error("Error fetching report summaries:", error);
        return NextResponse.json(
            { error: "Failed to fetch reports" },
            { status: 500 }
        );
    }
}
