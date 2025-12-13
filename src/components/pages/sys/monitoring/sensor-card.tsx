"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { SensorData } from "@/types/sensor-values";

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
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{name} History</DialogTitle>
                <DialogDescription>
                  Last 5 readings for {name}.
                </DialogDescription>
              </DialogHeader>
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
            </DialogContent>
          </Dialog>
        ) : null}
      </CardContent>
    </Card>
  );
}
