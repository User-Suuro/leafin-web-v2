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
