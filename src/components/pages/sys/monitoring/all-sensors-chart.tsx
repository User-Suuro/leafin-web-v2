"use client";

import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SensorData } from "@/types/sensor-values";

interface AllSensorsChartProps {
    history: SensorData[];
}

export function AllSensorsChart({ history }: AllSensorsChartProps) {
    // Reverse history to show oldest to newest (left to right) if needed,
    // typically charts read better chronologically.
    // Assuming history[0] is newest.
    const data = [...history]
        .reverse()
        .map((item) => ({
            time: new Date(item.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            }),
            water_temp: Number(item.water_temp),
            ph: Number(item.ph),
            tds: Number(item.tds),
            nh3_gas: Number(item.nh3_gas),
            turbid: Number(item.turbid),
        }));

    if (history.length === 0) {
        return null;
    }

    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-4 mt-6">
            <CardHeader>
                <CardTitle>Combined Sensor History</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="w-full h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="time" />

                            {/* Left Axis for small values: pH, Temp, Ammonia, Turbidity */}
                            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />

                            {/* Right Axis for large values: TDS */}
                            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />

                            <Tooltip
                                contentStyle={{ borderRadius: '8px' }}
                                cursor={{ fill: 'transparent' }}
                            />
                            <Legend />

                            <Bar yAxisId="left" dataKey="water_temp" name="Water Temp (°C)" fill="#3b82f6" />
                            <Bar yAxisId="left" dataKey="ph" name="pH" fill="#a855f7" />
                            <Bar yAxisId="left" dataKey="nh3_gas" name="Ammonia (ppm)" fill="#f97316" />
                            <Bar yAxisId="left" dataKey="turbid" name="Turbidity (NTU)" fill="#64748b" />

                            <Bar yAxisId="right" dataKey="tds" name="TDS (ppm)" fill="#22c55e" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
