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
        const interval = setInterval(fetchData, 5000); // Poll every 5 seconds

        return () => clearInterval(interval);
    }, []);

    // Default values if data is missing/loading
    const sensorValues = {
        water_temp: data?.water_temp?.toString() || "Loading...",
        ph: data?.ph?.toString() || "Loading...",
        tds: data?.tds?.toString() || "Loading...",
        nh3_gas: data?.nh3_gas?.toString() || "Loading...",
        connected: data?.connected ?? false,
        history: data?.history || [],
    };

    // If loading for the first time
    if (loading && !data) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 rounded-xl border bg-card text-card-foreground shadow animate-pulse" />
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SensorCard
                    name="Water Temp"
                    value={sensorValues.connected ? `${sensorValues.water_temp} °C` : "N/A"}
                    icon={<Thermometer className="h-4 w-4" />}
                    history={sensorValues.history}
                    dataKey="water_temp"
                    unit="°C"
                />
                <SensorCard
                    name="pH Level"
                    value={sensorValues.connected ? sensorValues.ph : "N/A"}
                    icon={<Droplets className="h-4 w-4" />}
                    history={sensorValues.history}
                    dataKey="ph"
                    unit=""
                />
                <SensorCard
                    name="TDS"
                    value={sensorValues.connected ? `${sensorValues.tds} ppm` : "N/A"}
                    icon={<Activity className="h-4 w-4" />}
                    history={sensorValues.history}
                    dataKey="tds"
                    unit="ppm"
                />
                <SensorCard
                    name="Ammonia"
                    value={sensorValues.connected ? `${sensorValues.nh3_gas} ppm` : "N/A"}
                    icon={<Wind className="h-4 w-4" />}
                    history={sensorValues.history}
                    dataKey="nh3_gas"
                    unit="ppm"
                />
            </div>

            {/* Combined Chart */}
            <AllSensorsChart history={sensorValues.history} />
        </div>
    );
}
