"use client";

import { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { StageTimeline, TILAPIA_STAGES, LETTUCE_STAGES, } from "@/components/pages/sys/monitoring/stage-timeline";
import FeederStatus from "@/components/pages/sys/monitoring/feeder-status";
import WaterQuality from "@/components/pages/sys/monitoring/water-quality";
import { useMonitoring } from "../../../hooks/useMonitoring";

const DEFAULT_FISH_API = "/api/fish-batch/timeline";
const DEFAULT_LETTUCE_API = "/api/plant-batch/timeline";

export default function Monitoring() {
  const { tilapiaBatches, lettuceBatches, loadingTilapia, loadingLettuce, timelineError, } = useMonitoring();

  const tabs = useMemo(
    () => [{ id: "timeline", label: "Timeline" }, { id: "water-quality", label: "Water Quality" },
    { id: "feeder", label: "Feeder" }, { id: "sensors", label: "Sensors" },],
    []
  );

  return (
    <div className="flex min-h-screen min-w-screen">
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Monitoring</h1>
          <p className="text-muted-foreground">
            Monitor your aquaponics system in real-time
          </p>
        </div>

        <Separator className="mb-6" />

        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="text-sm">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="timeline" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Timeline (Lettuce & Tilapia)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StageTimeline
                  title="Lettuce"
                  stageDef={LETTUCE_STAGES}
                  apiUrl={DEFAULT_LETTUCE_API}
                  typeKey="lettuce"
                  batchesProp={
                    lettuceBatches.length ? lettuceBatches : undefined
                  }
                />

                <StageTimeline
                  title="Tilapia"
                  stageDef={TILAPIA_STAGES}
                  apiUrl={DEFAULT_FISH_API}
                  typeKey="tilapia"
                  batchesProp={
                    tilapiaBatches.length ? tilapiaBatches : undefined
                  }
                />
              </div>

              <div className="mt-2 text-sm text-muted-foreground">
                {loadingTilapia || loadingLettuce ? (
                  <span>Loading timelines…</span>
                ) : null}
                {timelineError ? (
                  <span className="text-red-600 ml-2">{timelineError}</span>
                ) : null}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="water-quality" className="space-y-6">
            <WaterQuality />
          </TabsContent>

          <TabsContent value="feeder" className="space-y-6">
            <FeederStatus />
          </TabsContent>

          <TabsContent value="sensors" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">System Sensors</h2>
              <div className="mb-4 font-medium">Device Status: </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
