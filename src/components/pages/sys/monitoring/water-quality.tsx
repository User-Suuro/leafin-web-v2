"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, FlaskConical, Thermometer } from "lucide-react";

interface SensorData {
  ph?: string;
  turbid?: string;
}

export default function WaterQuality({
  sensorData,
}: {
  sensorData?: SensorData | null;
}) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Water Quality Parameters</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ParameterCard
          name="pH Level"
          value={sensorData?.ph ?? "Loading..."}
          status={determinePHStatus(sensorData?.ph)}
          icon={<Droplets />}
        />
        <ParameterCard
          name="Turbidity"
          value={sensorData?.turbid ?? "Loading..."}
          status={determineTurbidityStatus(sensorData?.turbid)}
          icon={<FlaskConical />}
        />
        {/* Example placeholder for Temperature */}
        <ParameterCard
          name="Temperature"
          value="24.5°C"
          status="Normal"
          icon={<Thermometer />}
        />
      </div>
    </div>
  );
}

/* -----------------------
   Smaller UI components
   ----------------------- */
function ParameterCard({
  name,
  value,
  status,
  icon,
}: {
  name: string;
  value: string;
  status: string;
  icon: React.ReactNode;
}) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Normal":
        return "bg-green-100 text-green-800 border-green-200";
      case "Low":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          {name}
          <div className="text-muted-foreground">{icon}</div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-2">{value}</div>
        <Badge variant="outline" className={getStatusVariant(status)}>
          {status}
        </Badge>
      </CardContent>
    </Card>
  );
}

function determinePHStatus(ph?: string): string {
  if (!ph) return "Unknown";
  const pHNum = parseFloat(ph);
  if (isNaN(pHNum)) return "Unknown";
  if (pHNum < 6.5) return "Low";
  if (pHNum > 7.5) return "High";
  return "Normal";
}

function determineTurbidityStatus(turbid?: string): string {
  if (!turbid) return "Unknown";
  const turbidNum = parseFloat(turbid);
  if (isNaN(turbidNum)) return "Unknown";
  if (turbidNum > 5) return "High"; // example threshold
  if (turbidNum < 1) return "Low"; // example threshold
  return "Normal";
}
