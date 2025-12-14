"use client";

import React, { useEffect, useState } from "react";
import { SensorCard } from "./sensor-card";
import { SensorData } from "@/types/sensor-values";
import { Thermometer, Droplets, Activity, Wind } from "lucide-react";

import { AllSensorsChart } from "./all-sensors-chart";

export function SensorsSection() {
    const [data, setData] = useState<SensorData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/send-data", { cache: "no-store" });
                if (!res.ok) throw new Error("Failed to fetch sensor data");
                const json: SensorData = await res.json();
                setData(json);
            } catch (err) {
                console.error("Error fetching sensor data:", err);
                // data remains null or stale
            } finally {
                setLoading(false);
            }
        };


        fetchData(); // Initial fetch
        const interval = setInterval(fetchData, 2000); // Poll every 2 seconds

        return () => clearInterval(interval);
    }, []);

    // Default values if data is missing/loading
    const sensorValues = {
        water_temp: data?.water_temp?.toString() || "Loading...",
        ph: data?.ph?.toString() || "Loading...",
        tds: data?.tds?.toString() || "Loading...",
        nitrogen: data?.nitrogen?.toString() || "Loading...",
        phosphorus: data?.phosphorus?.toString() || "Loading...",
        potassium: data?.potassium?.toString() || "Loading...",
        water_level: data?.water_level?.toString() || "Loading...",
        connected: data?.connected ?? false,
        history: data?.history || [],
    };

    // If loading for the first time
    if (loading && !data) {
        return (
            <div className="flex overflow-x-auto gap-4 pb-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="min-w-[250px] h-32 rounded-xl border bg-card text-card-foreground shadow animate-pulse" />
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Scrollable Container */}
            <div className="flex flex-nowrap overflow-x-auto gap-4 pb-4 snap-x snap-mandatory w-full max-w-[85vw] md:max-w-[calc(100vw-18rem)]">
                <div className="min-w-[300px] snap-center">
                    <SensorCard
                        name="Water Temp"
                        value={sensorValues.connected ? `${sensorValues.water_temp} °C` : "N/A"}
                        icon={<Thermometer className="h-4 w-4" />}
                        history={sensorValues.history}
                        dataKey="water_temp"
                        unit="°C"
                    />
                </div>
                <div className="min-w-[300px] snap-center">
                    <SensorCard
                        name="pH Level"
                        value={sensorValues.connected ? sensorValues.ph : "N/A"}
                        icon={<Droplets className="h-4 w-4" />}
                        history={sensorValues.history}
                        dataKey="ph"
                        unit=""
                    />
                </div>
                <div className="min-w-[300px] snap-center">
                    <SensorCard
                        name="TDS"
                        value={sensorValues.connected ? `${sensorValues.tds} ppm` : "N/A"}
                        icon={<Activity className="h-4 w-4" />}
                        history={sensorValues.history}
                        dataKey="tds"
                        unit="ppm"
                    />
                </div>
                <div className="min-w-[300px] snap-center">
                    <SensorCard
                        name="Nitrogen"
                        value={sensorValues.connected ? `${sensorValues.nitrogen} mg/L` : "N/A"}
                        icon={<Wind className="h-4 w-4" />}
                        history={sensorValues.history}
                        dataKey="nitrogen"
                        unit="mg/L"
                    />
                </div>
                <div className="min-w-[300px] snap-center">
                    <SensorCard
                        name="Phosphorus"
                        value={sensorValues.connected ? `${sensorValues.phosphorus} mg/L` : "N/A"}
                        icon={<Wind className="h-4 w-4" />}
                        history={sensorValues.history}
                        dataKey="phosphorus"
                        unit="mg/L"
                    />
                </div>
                <div className="min-w-[300px] snap-center">
                    <SensorCard
                        name="Potassium"
                        value={sensorValues.connected ? `${sensorValues.potassium} mg/L` : "N/A"}
                        icon={<Wind className="h-4 w-4" />}
                        history={sensorValues.history}
                        dataKey="potassium"
                        unit="mg/L"
                    />
                </div>
                <div className="min-w-[300px] snap-center">
                    <SensorCard
                        name="Water Level"
                        value={sensorValues.connected ? sensorValues.water_level : "N/A"}
                        icon={<Droplets className="h-4 w-4" />}
                        history={sensorValues.history}
                        dataKey="water_level"
                        unit=""
                    />
                </div>
            </div>

            {/* Combined Chart */}
            <div className="mt-8">
                <AllSensorsChart history={sensorValues.history} />
            </div>
        </div>
    );
}
