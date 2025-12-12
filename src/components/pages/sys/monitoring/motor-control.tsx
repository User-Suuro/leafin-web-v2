"use client";

import { useEffect, useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

export function MotorControl() {
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const [state, setState] = useState({
        main_pump: false,
        mini_pump: false,
    });

    useEffect(() => {
        fetch("/api/motor")
            .then((res) => res.json())
            .then((data) => {
                if (data && !data.error) {
                    setState({
                        main_pump: data.main_pump,
                        mini_pump: data.mini_pump,
                    });
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch motor status", err);
                setLoading(false);
            });
    }, []);

    const handleToggle = (key: "main_pump" | "mini_pump", checked: boolean) => {
        // Optimistic update
        setState((prev) => ({ ...prev, [key]: checked }));

        startTransition(async () => {
            try {
                const res = await fetch("/api/motor", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type: key, status: checked }),
                });
                const result = await res.json();

                if (!result.success) {
                    throw new Error("Failed to update");
                }
            } catch (error) {
                // Revert if failed
                setState((prev) => ({ ...prev, [key]: !checked }));
                console.error("Failed to update motor status", error);
            }
        });
    };

    if (loading) {
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
