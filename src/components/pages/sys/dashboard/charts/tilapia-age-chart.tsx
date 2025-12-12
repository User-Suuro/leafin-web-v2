"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface TilapiaAgeChartProps {
  labels: string[];
  data: number[];
}

export default function TilapiaAgeChart({
  labels,
  data,
}: TilapiaAgeChartProps) {
  return (
    <Card className="h-80">
      <CardContent className="p-5 h-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Tilapia Age Distribution
        </h2>
        <div className="h-full">
          <Pie
            data={{
              labels,
              datasets: [
                {
                  data,
                  backgroundColor: ["#93C5FD", "#60A5FA", "#1D4ED8", "#1E40AF"],
                },
              ],
            }}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
