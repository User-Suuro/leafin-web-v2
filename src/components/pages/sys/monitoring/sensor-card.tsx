"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SensorCardProps {
  name: string;
  value: string | number;
  icon?: React.ReactNode;
}

export function SensorCard({ name, value, icon }: SensorCardProps) {
  // Consider "N/A", "Loading...", "", or null/undefined as offline
  const isOnline =
    value !== undefined &&
    value !== null &&
    value !== "N/A" &&
    value !== "Loading..." &&
    value !== "";

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-center gap-2">
          {icon}
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="text-lg font-semibold mb-1">Last Reading: {value}</div>
        {isOnline ? (
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 inline-flex items-center justify-center"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
            Online
          </Badge>
        ) : (
          <Badge
            variant="secondary"
            className="bg-red-100 text-red-800 inline-flex items-center justify-center"
          >
            <div className="w-2 h-2 bg-red-500 rounded-full mr-1" />
            Offline
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
