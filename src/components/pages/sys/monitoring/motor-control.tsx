"use client";

import { useState, useTransition } from "react";
import useSWR from "swr";
const fetcher = (url: string) => fetch(url).then((res) => res.json());
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

export function MotorControl() {
    const { data, isLoading, mutate } = useSWR("/api/motor", fetcher, {
        refreshInterval: 2000,
    });

    // Default state to prevent unauthorized errors if data is undefined
    const state = data || { main_pump: false, mini_pump: false };

    const [isPending, startTransition] = useTransition();

    const handleToggle = async (key: "main_pump" | "mini_pump", checked: boolean) => {
        // 1. Optimistic update
        await mutate({ ...state, [key]: checked }, false);

        startTransition(async () => {
            try {
                const res = await fetch("/api/motor", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type: key, status: checked }),
                });

                if (!res.ok) throw new Error("Failed to update");

                // 2. Revalidate to ensure server consistency
                await mutate();
            } catch (error) {
                console.error("Failed to update motor status", error);
                // 3. Revert on error (re-fetch)
                await mutate();
            }
        });
    };

    if (isLoading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center p-6">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Main Pump</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <Label htmlFor="main-pump-mode">
                        {state.main_pump ? "Running" : "Stopped"}
                    </Label>
                    <Switch
                        id="main-pump-mode"
                        checked={state.main_pump}
                        onCheckedChange={(checked: boolean) => handleToggle("main_pump", checked)}
                        disabled={isPending}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Mini Pump</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <Label htmlFor="mini-pump-mode">
                        {state.mini_pump ? "Running" : "Stopped"}
                    </Label>
                    <Switch
                        id="mini-pump-mode"
                        checked={state.mini_pump}
                        onCheckedChange={(checked: boolean) => handleToggle("mini_pump", checked)}
                        disabled={isPending}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
