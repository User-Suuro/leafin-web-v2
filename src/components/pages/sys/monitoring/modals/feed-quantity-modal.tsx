"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FeedQuantityModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentQuantity: number;
    onSave: (newQuantity: number) => Promise<void>;
}

export function FeedQuantityModal({
    open,
    onOpenChange,
    currentQuantity,
    onSave,
}: FeedQuantityModalProps) {
    const [value, setValue] = useState(currentQuantity);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setValue(currentQuantity);
    }, [currentQuantity, open]);

    const handleSave = async () => {
        setSaving(true);
        await onSave(value);
        setSaving(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Feed Quantity</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <Label htmlFor="quantity">Quantity (grams)</Label>
                    <Input
                        id="quantity"
                        type="number"
                        value={value}
                        onChange={(e) => setValue(Number(e.target.value))}
                        className="mt-2"
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
