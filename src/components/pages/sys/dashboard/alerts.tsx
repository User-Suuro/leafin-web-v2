import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { SensorData } from "@/types/sensor-values";
import { AlertTriangle, CheckCircle, Thermometer, Droplets, Activity, Wind, Waves, FlaskConical, Zap } from "lucide-react";

export const Alerts: React.FC = () => {
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
        // keep data null or previous state
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Define sensors to monitor
  const sensors = [
    { key: "water_temp", label: "Water Temp", icon: <Thermometer className="w-4 h-4" />, unit: "°C" },
    { key: "ph", label: "pH Level", icon: <Droplets className="w-4 h-4" />, unit: "" },
    { key: "tds", label: "TDS", icon: <Activity className="w-4 h-4" />, unit: "ppm" },
    { key: "nitrogen", label: "Nitrogen", icon: <Wind className="w-4 h-4" />, unit: "mg/L" },
    { key: "phosphorus", label: "Phosphorus", icon: <FlaskConical className="w-4 h-4" />, unit: "mg/L" },
    { key: "potassium", label: "Potassium", icon: <Zap className="w-4 h-4" />, unit: "mg/L" },
    { key: "turbid", label: "Turbidity", icon: <Waves className="w-4 h-4" />, unit: "NTU" },
  ];

  /* 
     Global connection status from the board. 
     If connected is true, we assume all sensors are "Fine".
     If connected is false, we flag them all as "Offline".
  */
  const isConnected = data?.connected ?? false;

  return (
    <Card className={`border-t-4 flex flex-col ${isConnected ? "border-green-500" : "border-red-500"}`}>
      <CardContent className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Sensor Status</h2>
          {loading && <span className="text-xs text-muted-foreground">Syncing...</span>}
        </div>

        <ul className="space-y-3 text-sm overflow-y-auto max-h-60 pr-1">
          {sensors.map((sensor) => {
            // Get the value for this specific sensor
            // We coerce to string/number safely, assuming SensorData keys match
            const val = data ? data[sensor.key as keyof SensorData] : undefined;
            const displayVal = val !== undefined && val !== null ? `${val} ${sensor.unit}` : "N/A";

            return (
              <li
                key={sensor.key}
                className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">{sensor.icon}</span>
                  <span className="font-medium">{sensor.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  {isConnected ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Good Ping
                    </Badge>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                        {displayVal}
                      </span>
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Offline
                      </Badge>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
};
