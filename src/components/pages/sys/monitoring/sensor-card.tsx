"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { SensorData } from "@/types/sensor-values";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export interface SensorCardProps {
  name: string;
  value: string | number;
  icon?: React.ReactNode;
  history?: SensorData[];
  dataKey?: keyof SensorData;
  unit?: string;
}

export function SensorCard({ name, value, icon, history = [], dataKey, unit = "" }: SensorCardProps) {
  // Consider "N/A", "Loading...", "", or null/undefined as offline
  const isOnline =
    value !== undefined &&
    value !== null &&
    value !== "N/A" &&
    value !== "Loading..." &&
    value !== "";

  // Prepare chart data (reverse to show oldest to newest left to right)
  const chartData = [...history].reverse().map(item => ({
    time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    value: dataKey ? (item[dataKey] as number) : 0,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-center gap-2">
          {icon}
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="text-lg font-semibold mb-1">
          Last Reading: {value}
        </div>
        <div className="mb-4">
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
        </div>

        {history.length > 0 && dataKey ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                View History
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{name} History</DialogTitle>
                <DialogDescription>
                  Last 20 readings for {name}.
                </DialogDescription>
              </DialogHeader>

              <div className="w-full h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis
                      dataKey="time"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      unit={unit}
                    />
                    <Tooltip
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? "#22c55e" : "#94a3b8"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="max-h-60 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {new Date(record.created_at).toLocaleTimeString()}
                        </TableCell>
                        <TableCell>
                          {record[dataKey] as string | number} {unit}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>
        ) : null}
      </CardContent>
    </Card>
  );
}
