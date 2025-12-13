"use client";

import { BarChart, Leaf, Fish, Package, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import AddReportModal from "@/components/pages/sys/modal/AddReportModal";
import ProductSalesSummaryModal from "@/components/pages/sys/modal/ProductSalesSummaryModal";
import ExpensesReportModal from "@/components/pages/sys/modal/ExpensesReportModal";

import { useReports } from "../../../hooks/useReports";

export default function AnalyticsReports() {
  const { modalOpen, reportType, period, plantSummary, fishSummary, openReportModal,
    closeModal,
  } = useReports();

  return (
    <div className="flex min-h-screen min-w-screen pr-30">
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Analytics & Reports
          </h1>
        </div>

        <Separator className="mb-6" />

        {/* Growth Analytics */}
        <div className="space-y-4 mb-10">
          <h2 className="text-lg font-semibold">Growth Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lettuce (Plant) */}
            <Card className="bg-green-600 text-white flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5" />
                  Lettuce
                </CardTitle>
                <CardDescription className="text-white/80"></CardDescription>
              </CardHeader>
              <CardContent className="bg-white text-black rounded-b-xl py-6 min-h-[140px] flex-grow">
                {plantSummary ? (
                  <div className="flex justify-between items-start text-sm">
                    <div>
                      <p>
                        Total Batches:{" "}
                        <span className="font-semibold text-blue-600">
                          {plantSummary.totalBatches}
                        </span>
                      </p>
                      <p>
                        Total Plants:{" "}
                        <span className="font-semibold text-blue-600">
                          {plantSummary.totalPlants}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p>
                        Avg Age:{" "}
                        <span className="font-semibold text-green-600">
                          {Math.round(plantSummary.avgAge)} days
                        </span>
                      </p>
                      <p>
                        Majority Stage:{" "}
                        <span className="font-semibold text-green-600">
                          {plantSummary.majorityStage}
                        </span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Loading...</p>
                )}
              </CardContent>
            </Card>

            {/* Tilapia (Fish) */}
            <Card className="bg-blue-500 text-white flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Fish className="w-5 h-5" />
                  Tilapia
                </CardTitle>
                <CardDescription className="text-white/80"></CardDescription>
              </CardHeader>
              <CardContent className="bg-white text-black rounded-b-xl py-6 min-h-[140px] flex-grow">
                {fishSummary ? (
                  <div className="flex justify-between items-start text-sm">
                    <div>
                      <p>
                        Total Batches:{" "}
                        <span className="font-semibold text-blue-600">
                          {fishSummary.totalBatches}
                        </span>
                      </p>
                      <p>
                        Total Fish:{" "}
                        <span className="font-semibold text-blue-600">
                          {fishSummary.totalFish}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p>
                        Avg Age:{" "}
                        <span className="font-semibold text-blue-600">
                          {Math.round(fishSummary.avgAge)} days
                        </span>
                      </p>
                      <p>
                        Majority Stage:{" "}
                        <span className="font-semibold text-blue-600">
                          {fishSummary.majorityStage}
                        </span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Loading...</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sales & Financial Reports */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Sales and Financial</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ReportCard
              icon={<BarChart className="w-12 h-12 text-blue-500" />}
              title="Revenue Report"
              onGenerate={(p) => openReportModal("revenue", p)}
            />
            <ReportCard
              icon={<Package className="w-12 h-12 text-blue-500" />}
              title="Product Sales Summary"
              onGenerate={(p) => openReportModal("sales", p)}
            />
            <ReportCard
              icon={<DollarSign className="w-12 h-12 text-blue-500" />}
              title="Expenses Report"
              onGenerate={(p) => openReportModal("expenses", p)}
            />
          </div>
        </div>
      </div>

      {/* ✅ Modal Rendering */}
      {reportType === "sales" && (
        <ProductSalesSummaryModal
          open={modalOpen}
          onClose={closeModal}
          period={period ?? undefined}
        />
      )}

      {reportType === "expenses" && (
        <ExpensesReportModal
          open={modalOpen}
          onClose={closeModal}
          period={period ?? undefined}
        />
      )}

      {reportType === "revenue" && (
        <AddReportModal
          open={modalOpen}
          onClose={closeModal}
          type="revenue"
          period={period ?? undefined}
        />
      )}
    </div>
  );
}

function ReportCard({
  title,
  icon,
  onGenerate,
}: {
  title: string;
  icon: React.ReactNode;
  onGenerate: (p: "daily" | "weekly" | "monthly") => void;
}) {
  return (
    <Card className="text-center">
      <CardHeader>
        <div className="flex justify-center">{icon}</div>
      </CardHeader>
      <CardContent className="space-y-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex justify-center gap-2 flex-wrap">
          <Button variant="secondary" onClick={() => onGenerate("daily")}>
            Daily
          </Button>
          <Button variant="secondary" onClick={() => onGenerate("weekly")}>
            Weekly
          </Button>
          <Button variant="secondary" onClick={() => onGenerate("monthly")}>
            Monthly
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
