"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface LettuceStageChartProps {
  labels: string[];
  data: number[];
}

export default function LettuceStageChart({
  labels,
  data,
}: LettuceStageChartProps) {
  return (
    <Card className="h-80">
      <CardContent className="p-5 h-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Lettuce Stage Distribution
        </h2>
        <div className="h-full">
          <Pie
            data={{
              labels,
              datasets: [
                {
                  data,
                  backgroundColor: ["#FACC15", "#16A34A", "#4ADE80", "#A7F3D0"],
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
