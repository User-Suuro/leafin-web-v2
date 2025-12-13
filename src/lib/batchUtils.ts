export type BatchStatus = "growing" | "ready" | "harvested" | "discarded";

export function calculateFishStage(dateAdded: Date | string) {
    const now = new Date();
    const added = new Date(dateAdded);
    const ageDays = Math.floor(
        (now.getTime() - added.getTime()) / (1000 * 60 * 60 * 24)
    );

    let stage = "Larval Stage";
    let status: BatchStatus = "growing";

    if (ageDays > 14 && ageDays <= 60) stage = "Juvenile Stage";
    else if (ageDays > 60 && ageDays <= 120) stage = "Grow-Out Stage";
    else if (ageDays > 120) {
        stage = "Ready to Harvest";
        status = "ready";
    }

    return { stage, status, ageDays };
}

export function calculatePlantStage(dateAdded: Date | string) {
    const now = new Date();
    const added = new Date(dateAdded);
    const ageDays = Math.floor(
        (now.getTime() - added.getTime()) / (1000 * 60 * 60 * 24)
    );

    let stage = "Seedling Stage";
    let status: BatchStatus = "growing";

    if (ageDays > 14 && ageDays <= 35) stage = "Vegetative Growth";
    else if (ageDays > 35 && ageDays <= 50) {
        stage = "Harvest Ready";
        status = "ready";
    } else if (ageDays > 50) {
        stage = "Bolting & Seeding";
        status = "ready";
    }

    return { stage, status, ageDays };
}

export function calculateBatchStats(batches: any[]) { // Using any[] here as generic batch
    const now = new Date();
    let totalAge = 0;
    const stageCounts: Record<string, number> = {};

    batches.forEach((b) => {
        if (b.dateAdded) {
            const added = new Date(b.dateAdded);
            const diffTime = Math.abs(now.getTime() - added.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            totalAge += diffDays;
        }
        const stage = b.condition || "Unknown";
        stageCounts[stage] = (stageCounts[stage] || 0) + 1;
    });

    const avgAge = batches.length > 0 ? totalAge / batches.length : 0;

    let majorityStage = "N/A";
    let maxCount = 0;
    for (const [stage, count] of Object.entries(stageCounts)) {
        if (count > maxCount) {
            maxCount = count;
            majorityStage = stage;
        }
    }

    return { avgAge, majorityStage };
}
