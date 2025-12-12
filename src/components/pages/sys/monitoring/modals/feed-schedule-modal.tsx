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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus } from "lucide-react";

interface FeedScheduleModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentFrequency: number;
    currentSchedules: string[];
    onSave: (frequency: number, schedules: string[]) => Promise<void>;
}

export function FeedScheduleModal({
    open,
    onOpenChange,
    currentFrequency,
    currentSchedules,
    onSave,
}: FeedScheduleModalProps) {
    const [frequency, setFrequency] = useState(currentFrequency);
    const [schedules, setSchedules] = useState<string[]>(currentSchedules);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setFrequency(currentFrequency);
        setSchedules(currentSchedules);
    }, [currentFrequency, currentSchedules, open]);

    const handleScheduleChange = (index: number, val: string) => {
        const newSchedules = [...schedules];
        newSchedules[index] = val;
        setSchedules(newSchedules);
    };

    const addTime = () => {
        setSchedules([...schedules, "12:00"]);
        setFrequency(frequency + 1);
    };

    const removeTime = (index: number) => {
        const newSchedules = schedules.filter((_, i) => i !== index);
        setSchedules(newSchedules);
        setFrequency(Math.max(0, frequency - 1));
    };

    const handleSave = async () => {
        setSaving(true);
        await onSave(frequency, schedules);
        setSaving(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Update Feeding Schedule</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div>
                        <Label>Frequency per Day</Label>
                        <div className="text-sm text-muted-foreground mb-2">
                            This is calculated based on the number of scheduled times.
                        </div>
                        <Input value={`${frequency}x / day`} disabled />
                    </div>

                    <div>
                        <Label>Schedule Times</Label>
                        <div className="space-y-2 mt-2">
                            {schedules.map((time, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <Input
                                        type="time"
                                        value={time}
                                        onChange={(e) => handleScheduleChange(idx, e.target.value)}
                                    />
                                    <Button variant="ghost" size="icon" onClick={() => removeTime(idx)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button variant="outline" size="sm" onClick={addTime} className="w-full">
                                <Plus className="h-4 w-4 mr-2" /> Add Time
                            </Button>
                        </div>
                    </div>
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
