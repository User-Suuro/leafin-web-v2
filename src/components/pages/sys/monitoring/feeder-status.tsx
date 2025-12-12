"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, Clock, Pencil, Loader2 } from "lucide-react";
import { FeedQuantityModal } from "./modals/feed-quantity-modal";
import { FeedScheduleModal } from "./modals/feed-schedule-modal";

interface FeederData {
  id: number;
  isActive: boolean;
  frequencyPerDay: number;
  schedules: string; // JSON string
  feedQuantity: number;
  lastFeedTime?: string;
  nextFeedTime?: string; // Derived or fetched
}

export default function FishFeederSection() {
  const [data, setData] = useState<FeederData | null>(null);
  const [loading, setLoading] = useState(true);

  const [quantityModalOpen, setQuantityModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/feeder-settings");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to fetch feeder settings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateSettings = async (updates: Partial<FeederData>) => {
    if (!data) return;
    const newData = { ...data, ...updates };

    // Optimistic update
    setData(newData);

    try {
      await fetch("/api/feeder-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "update_settings",
          data: {
            isActive: newData.isActive,
            frequencyPerDay: newData.frequencyPerDay,
            feedQuantity: newData.feedQuantity,
            schedules: newData.schedules
          },
        }),
      });
      // Optionally refetch to ensure sync
    } catch (err) {
      console.error("Failed to update settings", err);
      // Revert needs previous state tracking or refetch
      fetchData();
    }
  };

  const handleManualFeed = async () => {
    try {
      await fetch("/api/feeder-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "manual_feed" }),
      });
      // Just update last feed time locally for immediate feedback
      if (data) {
        setData({ ...data, lastFeedTime: new Date().toISOString() });
      }
    } catch (err) {
      console.error("Failed to manual feed", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) return <div>Failed to load feeder data.</div>;

  const schedulesList: string[] = JSON.parse(data.schedules || "[]");

  // Format dates
  const lastFeedDisplay = data.lastFeedTime
    ? new Date(data.lastFeedTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : "N/A";

  const nextFeedDisplay = "Calculated soon..."; // You could calculate this based on schedules

  return (
    <div className="space-y-10">
      {/* ================= Fish Feeder Card ================= */}
      <Card className={`border-2 rounded-2xl p-6 shadow-sm ${data.isActive ? 'border-green-400' : 'border-gray-200'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* LEFT */}
          <div className="flex gap-4">
            <div className={`h-16 w-16 flex items-center justify-center rounded-xl bg-blue-100 ${!data.isActive && 'grayscale opacity-50'}`}>
              <span className="text-3xl">🐟</span>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Fish Feeder
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Status:{" "}
                <span className={`font-medium ${data.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                  {data.isActive ? "Active" : "Inactive"}
                </span>
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className={`space-y-4 ${!data.isActive ? 'opacity-50 pointer-events-none' : ''}`}>
            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoBox label="Last Feed">
                {lastFeedDisplay}
              </InfoBox>
              <InfoBox label="Next Feed">
                {nextFeedDisplay}
              </InfoBox>
            </div>

            {/* Schedule & Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EditableBox
                label="Feeding Schedule"
                onClick={() => data.isActive && setScheduleModalOpen(true)}
              >
                ⏰ {data.frequencyPerDay}x/day
              </EditableBox>
              <EditableBox
                label="Quantity"
                onClick={() => data.isActive && setQuantityModalOpen(true)}
              >
                {data.feedQuantity} grams
              </EditableBox>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 pointer-events-auto">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  Manual Feeding:
                </span>
                <Button
                  className="bg-green-500 hover:bg-green-600"
                  disabled={!data.isActive}
                  onClick={handleManualFeed}
                >
                  Feed Now
                </Button>
              </div>

              <div className="pointer-events-auto">
                <Button
                  variant={data.isActive ? "destructive" : "default"}
                  onClick={() => updateSettings({ isActive: !data.isActive })}
                >
                  {data.isActive ? "Disable Feeder" : "Enable Feeder"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ================= Automatic Feeder Status ================= */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Automatic Feeder Status
        </h2>

        <Card className="rounded-2xl border border-gray-200 shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="py-4 px-6 text-sm font-medium text-gray-600">
                    Time
                  </TableHead>
                  <TableHead className="py-4 px-6 text-sm font-medium text-gray-600">
                    Amount
                  </TableHead>
                  <TableHead className="py-4 px-6 text-sm font-medium text-gray-600">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {schedulesList.map((time, idx) => (
                  <TableRow key={idx} className="border-b last:border-b-0">
                    <TableCell className="py-4 px-6 font-medium">
                      {time}
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      {data.feedQuantity}g
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <Badge className="flex w-fit items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-blue-700">
                        <Clock className="h-3.5 w-3.5" />
                        Scheduled
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {schedulesList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                      No scheduled feeds.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {data && (
        <>
          <FeedQuantityModal
            open={quantityModalOpen}
            onOpenChange={setQuantityModalOpen}
            currentQuantity={data.feedQuantity}
            onSave={async (qty) => {
              await updateSettings({ feedQuantity: qty });
            }}
          />
          <FeedScheduleModal
            open={scheduleModalOpen}
            onOpenChange={setScheduleModalOpen}
            currentFrequency={data.frequencyPerDay}
            currentSchedules={schedulesList}
            onSave={async (freq, scheds) => {
              await updateSettings({
                frequencyPerDay: freq,
                schedules: JSON.stringify(scheds)
              });
            }}
          />
        </>
      )}
    </div>
  );
}

/* ================= Reusable UI Blocks ================= */

function InfoBox({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border rounded-lg px-4 py-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-800">
        {children}
      </p>
    </div>
  );
}

function EditableBox({
  label,
  children,
  onClick
}: {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      className={`border rounded-lg px-4 py-3 flex items-center justify-between ${onClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
      onClick={onClick}
    >
      <div>
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-medium text-gray-800">
          {children}
        </p>
      </div>
      {onClick && <Pencil className="h-4 w-4 text-gray-400" />}
    </div>
  );
}
