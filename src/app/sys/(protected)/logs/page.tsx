"use client";

import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs";
import { History, ClipboardList, DollarSign, Activity } from "lucide-react";

// ✅ Matches your API response (/api/logs)
type Log = {
  log_id: number;
  event_time: string;
  notes: string;
  type: "task" | "fish_sale" | "plant_sale" | "expense" | "sensor";
};

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch logs from API
  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch("/api/logs");
        if (!res.ok) throw new Error("Failed to fetch logs");
        const data: Log[] = await res.json();
        setLogs(data);
      } catch (err) {
        console.error("Error loading logs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen min-w-screen pr-30">
        <p className="text-muted-foreground">Loading logs...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen min-w-screen pr-30">
      <div className="flex-1 p-5 overflow-y-auto space-y-6">
        {/* Header */}
        <header>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <History className="w-6 h-6" />
            System Logs
          </h1>
          <Separator className="mt-1" />
        </header>

        {/* Quick Overview */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-blue-500" />
                Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {logs.filter((l) => l.type === "task").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-500" />
                Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {
                  logs.filter((l) =>
                    ["fish_sale", "plant_sale"].includes(l.type)
                  ).length
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-orange-500" />
                Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {logs.filter((l) => l.type === "expense").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{logs.length}</p>
            </CardContent>
          </Card>
        </section>

        {/* Logs List */}
        <section>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="task">Tasks</TabsTrigger>
              <TabsTrigger value="sale">Sales</TabsTrigger>
              <TabsTrigger value="expense">Expenses</TabsTrigger>
            </TabsList>

            {/* All logs */}
            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Logs</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.map((log) => (
                        <TableRow key={log.log_id}>
                          <TableCell>{log.event_time}</TableCell>
                          <TableCell>{log.type}</TableCell>
                          <TableCell>{log.notes}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Task logs */}
            <TabsContent value="task">
              <Card>
                <CardHeader>
                  <CardTitle>Task Logs</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {logs
                      .filter((log) => log.type === "task")
                      .map((log) => (
                        <li
                          key={log.log_id}
                          className="p-3 rounded border bg-muted/30"
                        >
                          <p className="text-sm">{log.notes}</p>
                          <p className="text-xs text-muted-foreground">
                            {log.event_time}
                          </p>
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Expense logs */}
            <TabsContent value="expense">
              <Card>
                <CardHeader>
                  <CardTitle>Expense Logs</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {logs
                      .filter((log) => log.type === "expense")
                      .map((log) => (
                        <li
                          key={log.log_id}
                          className="p-3 rounded border bg-muted/30"
                        >
                          <p className="text-sm">{log.notes}</p>
                          <p className="text-xs text-muted-foreground">
                            {log.event_time}
                          </p>
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  );
}
