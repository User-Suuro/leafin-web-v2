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
    // Reverse history to show oldest to newest (left to right)
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
            turbid: Number(item.turbid),
            nitrogen: Number(item.nitrogen),
            phosphorus: Number(item.phosphorus),
            potassium: Number(item.potassium),
            water_level: item.water_level === "HIGH" ? 1 : 0,
        }));

    if (history.length === 0) {
        return (
            <Card className="col-span-1 md:col-span-2 lg:col-span-4 mt-6">
                <CardHeader>
                    <CardTitle>Combined Sensor History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center w-full h-[400px] text-muted-foreground">
                        No sensor data available
                    </div>
                </CardContent>
            </Card>
        );
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

                            {/* Left Axis for small values: pH, Temp, NPK, Turbidity */}
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
                            <Bar yAxisId="left" dataKey="turbid" name="Turbidity (NTU)" fill="#64748b" />
                            <Bar yAxisId="left" dataKey="nitrogen" name="Nitrogen (mg/L)" fill="#f97316" />
                            <Bar yAxisId="left" dataKey="phosphorus" name="Phosphorus (mg/L)" fill="#f97316" />
                            <Bar yAxisId="left" dataKey="potassium" name="Potassium (mg/L)" fill="#f97316" />
                            <Bar yAxisId="left" dataKey="water_level" name="Water Level (1=HIGH, 0=LOW)" fill="#06b6d4" />

                            <Bar yAxisId="right" dataKey="tds" name="TDS (ppm)" fill="#22c55e" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
