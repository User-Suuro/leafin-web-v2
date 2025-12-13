"use client";

import { LayoutDashboard, Wallet, BarChart, RefreshCcw, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useSalesData } from "../../../hooks/useSalesData";

import { BATCH_COLORS } from "@/lib/utils";

export default function SalesROI() {
  const { summary, transactions, chartData, loading, error } = useSalesData();

  const chartConfig = {
    fish_sales: { label: "Fish Sales", color: BATCH_COLORS[8] }, // Blue
    plant_sales: { label: "Plant Sales", color: BATCH_COLORS[4] }, // Green
    expenses: { label: "Expenses", color: BATCH_COLORS[0] }, // Red
  } satisfies ChartConfig;

  return (
    <div className="flex min-h-screen min-w-screen pr-30">
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Sales & ROI</h1>
        <Separator className="mb-6" />

        {/* Show error if fetch failed */}
        {error && (
          <div className="mb-4 text-red-500">
            Failed to load data: {error}
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            icon={<LayoutDashboard className="w-6 h-6 text-blue-500" />}
            label="Total Revenue"
            value={`₱ ${summary?.revenue?.toFixed(2) ?? "0.00"}`}
          />
          <MetricCard
            icon={<Wallet className="w-6 h-6 text-blue-500" />}
            label="Total Expenses"
            value={`₱ ${summary?.expense?.toFixed(2) ?? "0.00"}`}
          />
          <MetricCard
            icon={<BarChart className="w-6 h-6 text-blue-500" />}
            label="Net Profit"
            value={`₱ ${summary?.netProfit?.toFixed(2) ?? "0.00"}`}
          />
          <MetricCard
            icon={<RefreshCcw className="w-6 h-6 text-blue-500" />}
            label="ROI"
            value={`${summary?.roi?.toFixed(2) ?? "0"} %`}
          />
        </div>

        {/* Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Monthly Revenue vs. Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 && !loading ? (
              <div className="text-center text-muted-foreground py-12">
                No chart data available
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="w-full h-[300px]">
                <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => {
                      const [year, month] = value.split("-");
                      return new Date(Number(year), Number(month) - 1).toLocaleString(
                        "default",
                        { month: "short" }
                      );
                    }}
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Line
                    dataKey="fish_sales"
                    type="linear"
                    stroke={chartConfig.fish_sales.color}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    dataKey="plant_sales"
                    type="linear"
                    stroke={chartConfig.plant_sales.color}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    dataKey="expenses"
                    type="linear"
                    stroke={chartConfig.expenses.color}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            )}
            <div className="text-center mt-4 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 inline-block mr-1" />
              Showing monthly sales vs. expenses trend
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 && !loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground"
                    >
                      No recent transactions
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((t) => (
                    <TableRow key={`${t.product}-${t.id}`}>
                      <TableCell>
                        {new Date(t.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{t.product}</TableCell>
                      <TableCell>{t.customer ?? "N/A"}</TableCell>
                      <TableCell>₱ {Number(t.total).toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Reusable Metric Card
function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="text-sm font-medium">{label}</div>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
