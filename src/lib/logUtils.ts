import { db } from "@/lib/db/drizzle";
import { logs } from "@/lib/db/schema/logs";

type LogParams = {
    notes: string;
    taskId?: number;
    relatedFishSaleId?: number;
    relatedPlantSaleId?: number;
    relatedExpenseId?: number;
    fishBatchId?: number;
    plantBatchId?: number;
};

export async function logActivity(params: LogParams) {
    try {
        await db.insert(logs).values({
            notes: params.notes,
            taskId: params.taskId,
            relatedFishSaleId: params.relatedFishSaleId,
            relatedPlantSaleId: params.relatedPlantSaleId,
            relatedExpenseId: params.relatedExpenseId,
            fishBatchId: params.fishBatchId,
            plantBatchId: params.plantBatchId,
        });
    } catch (error) {
        console.error("Failed to log activity:", error);
        // We don't throw here to avoid failing the main action if logging fails
    }
}
