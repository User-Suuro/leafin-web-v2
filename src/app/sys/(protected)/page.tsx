"use client";

import { Session } from "@/lib/auth-utils/auth-types";
import { redirect } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import AddBatchModal from "@/components/pages/sys/modal/add-batch-modal";
import { OverviewCard } from "@/components/pages/sys/dashboard/overview-card";
import LettuceStageChart from "@/components/pages/sys/dashboard/charts/lettuce-stage-chart";
import TilapiaAgeChart from "@/components/pages/sys/dashboard/charts/tilapia-age-chart";
import { Leaf, Fish } from "lucide-react";
import { Alerts } from "@/components/pages/sys/dashboard/alerts";

// ✅ hooks
import { useFishStages } from "../../hooks/useFishStages";
import { usePlantStages } from "../../hooks/usePlantStages";
import { useFishBatches } from "../../hooks/useFishBatches";
import { usePlantBatches } from "../../hooks/usePlantBatches";
import { useState } from "react";

const TILAPIA_STAGE_ORDER = [
  "Larval Stage",
  "Juvenile Stage",
  "Grow-Out Stage",
  "Harvest Ready",
];

const LETTUCE_STAGE_ORDER = [
  "Seedling Stage",
  "Vegetative Growth",
  "Harvest Ready",
  "Bolting & Seeding",
];

export default function SystemDashboard({
  session,
}: {
  session: Session | null;
}) {

  if (!session) {
    //return redirect("/sys/sign-in");
  }

  const { lettuceData } = usePlantBatches();
  const { tilapiaData } = useFishBatches();
  const { fishStageData } = useFishStages();
  const { plantStageData } = usePlantStages();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedType] = useState<"plant" | "fish" | "">("");

  /** Chart data */
  const fishChartData = TILAPIA_STAGE_ORDER.map(
    (stage) => fishStageData[stage] || 0
  );
  const plantChartData = LETTUCE_STAGE_ORDER.map(
    (stage) => plantStageData[stage] || 0
  );


  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-5 overflow-y-auto space-y-6">
        <header>
          <h1 className="text-2xl font-bold">Growth Overview</h1>
          <Separator className="mt-1" />
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Lettuce Overview */}
          <OverviewCard
            type="plant"
            title={
              <span className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-500" />
                Lettuce
              </span>
            }
            borderColor="border-green-500"
            batches={lettuceData.map((b, idx) => ({
              id: b.plantBatchId ?? idx + 1,
              quantity: b.plantQuantity ?? b.plant_quantity ?? 0,
              days: b.plantDays ?? 0,
              condition: b.condition ?? "Unknown",
            }))}
          />

          {/* Tilapia Overview */}
          <OverviewCard
            type="fish"
            title={
              <span className="flex items-center gap-2">
                <Fish className="w-5 h-5 text-blue-500" />
                Tilapia
              </span>
            }
            borderColor="border-blue-500"
            batches={tilapiaData.map((b, idx) => ({
              id: b.fishBatchId ?? idx + 1,
              quantity: b.fishQuantity ?? b.fish_quantity ?? 0,
              days: b.fishDays ?? 0,
              condition: b.condition ?? "Unknown",
            }))}
          />

          {/* Alerts */}
          <Alerts />
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <LettuceStageChart
            labels={LETTUCE_STAGE_ORDER}
            data={plantChartData}
          />
          <TilapiaAgeChart labels={TILAPIA_STAGE_ORDER} data={fishChartData} />
        </section>

        <AddBatchModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          type={selectedType}
        />
      </div>
    </div>
  );
}
