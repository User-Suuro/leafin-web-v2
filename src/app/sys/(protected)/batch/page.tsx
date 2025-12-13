"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import BatchTable from "@/components/pages/sys/batch/batchTable";
import AddBatchModal from "@/components/pages/sys/modal/add-batch-modal";
import EditBatchModal from "@/components/pages/sys/modal/EditBatchModal";
import HarvestBatchModal from "@/components/pages/sys/modal/HarvestBatchModal";
import ConfirmModal from "@/components/pages/sys/modal/ConfirmModal";

import { useBatches } from "../../../hooks/useBatches";
import { useBatchActions } from "../../../hooks/useBatchActions";
import { FishBatch, PlantBatch } from "@/components/pages/sys/batch/types/batchTypes";

export default function BatchPage() {
    const { fishBatches, plantBatches, loading, mutate } = useBatches();

    const { handleEdit, handleHarvest, handleDelete, handleDiscard, openHarvestModal, harvestModalOpen, setHarvestModalOpen, harvestBatchId, selectedType, setSelectedType
    } = useBatchActions(mutate);

    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingBatch, setEditingBatch] = useState<FishBatch | PlantBatch | null>(null);

    // Confirmation Modal State
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmTitle, setConfirmTitle] = useState("");
    const [confirmDescription, setConfirmDescription] = useState("");
    const [confirmAction, setConfirmAction] = useState<() => void>(() => { });
    const [confirmVariant, setConfirmVariant] = useState<"default" | "destructive">("default");


    const openConfirm = (
        title: string,
        description: string,
        onConfirm: () => void,
        variant: "default" | "destructive" = "default"
    ) => {
        setConfirmTitle(title);
        setConfirmDescription(description);
        setConfirmAction(() => onConfirm);
        setConfirmVariant(variant);
        setConfirmOpen(true);
    };

    const handleBatchAction = (action: string, batchId: number, type: "fish" | "plant") => {
        if (action === "harvest") {
            openHarvestModal(batchId, type);
        }

        if (action === "edit") {
            if (type === "fish") {
                const batch = fishBatches.find(b => b.fishBatchId === batchId);
                if (batch) {
                    setEditingBatch(batch);
                    setSelectedType("fish");
                    setEditModalOpen(true);
                }
            } else {
                const batch = plantBatches.find(b => b.plantBatchId === batchId);
                if (batch) {
                    setEditingBatch(batch);
                    setSelectedType("plant");
                    setEditModalOpen(true);
                }
            }
        }

        if (action === "delete") {
            openConfirm(
                "Delete Batch",
                "Are you sure you want to delete this batch? This action cannot be undone.",
                () => {
                    handleDelete(batchId, type);
                    setConfirmOpen(false);
                },
                "destructive"
            );
        }

        if (action === "discard") {
            openConfirm(
                "Discard Batch",
                "Are you sure you want to discard this batch? Status will be set to 'Discarded'.",
                () => {
                    handleDiscard(batchId, type);
                    setConfirmOpen(false);
                },
                "destructive"
            );
        }
    };

    return (
        <div className="flex flex-col p-5 space-y-6 min-h-screen">
            <header>
                <h1 className="text-2xl font-bold">Batch Management</h1>
                <Separator className="mt-1" />
            </header>

            <div className="flex gap-2">
                <Button
                    onClick={() => {
                        setSelectedType("fish");
                        setModalOpen(true);
                    }}
                >
                    <Plus className="w-4 h-4" /> Add Fish Batch
                </Button>
                <Button
                    onClick={() => {
                        setSelectedType("plant");
                        setModalOpen(true);
                    }}
                >
                    <Plus className="w-4 h-4" /> Add Plant Batch
                </Button>
            </div>

            {loading ? (
                <p>Loading batches...</p>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* FISH BATCH TABLE */}
                    <BatchTable
                        data={fishBatches}
                        type="fish"
                        onAction={(action, batchId) => handleBatchAction(action, batchId, "fish")}
                    />

                    {/* PLANT BATCH TABLE */}
                    <BatchTable
                        data={plantBatches}
                        type="plant"
                        onAction={(action, batchId) => handleBatchAction(action, batchId, "plant")}
                    />

                    {/* EDIT BATCH MODAL */}
                    {editingBatch && selectedType && (
                        <EditBatchModal
                            open={editModalOpen}
                            onClose={() => setEditModalOpen(false)}
                            type={selectedType}
                            batch={editingBatch}
                            onSave={(updates) => {
                                if (!editingBatch) return;
                                if (selectedType === "fish" && "fishBatchId" in editingBatch) {
                                    handleEdit("fish", editingBatch.fishBatchId, {
                                        fishQuantity: updates.batchQuantity ?? editingBatch.fishQuantity,
                                    });
                                } else if (selectedType === "plant" && "plantBatchId" in editingBatch) {
                                    handleEdit("plant", editingBatch.plantBatchId, {
                                        plantQuantity: updates.batchQuantity ?? editingBatch.plantQuantity,
                                    });
                                }
                                setEditingBatch(null);
                                setEditModalOpen(false);
                            }}
                        />
                    )}

                    {/* HARVEST BATCH MODAL */}
                    {harvestBatchId && selectedType && (
                        <HarvestBatchModal
                            open={harvestModalOpen}
                            onClose={() => setHarvestModalOpen(false)}
                            type={selectedType}
                            batchId={harvestBatchId}
                            onSubmit={handleHarvest}
                        />
                    )}

                    {/* ADD BATCH MODAL */}
                    <AddBatchModal
                        open={modalOpen}
                        onClose={() => setModalOpen(false)}
                        type={selectedType}
                        onSuccess={() => mutate()}
                    />

                    {/* CONFIRM MODAL */}
                    <ConfirmModal
                        open={confirmOpen}
                        onClose={() => setConfirmOpen(false)}
                        onConfirm={confirmAction || (() => { })}
                        title={confirmTitle}
                        description={confirmDescription}
                        variant={confirmVariant}
                    />
                </div>
            )}
        </div>
    );
}
