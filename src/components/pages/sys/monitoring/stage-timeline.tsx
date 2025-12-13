///components/monitoring/StageTimeline.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Droplets, HeartPulse, ArrowLeft, ArrowRight } from "lucide-react";
import { getColorForId } from "@/lib/utils";

interface NormalizedBatch {
  id?: number | string;
  dateISO?: string;
  days?: number;
  qty?: number;
  condition?: string;
  rawEvent?: string;
}

export interface TimelineEvent {
  date?: string;
  event?: string;
  status?: "Completed" | "Upcoming" | string;
  fishBatchId?: number;
  fishQuantity?: number;
  fishDays?: number;
  condition?: string;
}

export interface RawBatch extends Record<string, unknown> {
  fishBatchId?: number;
  date?: string;
  dateAdded?: string | Date;
  fishDays?: number;
  fishQuantity?: number;
  condition?: string;
  event?: string;
  status?: string;
}

export const TILAPIA_STAGES = [{ name: "Larval Stage", maxDays: 14 }, { name: "Juvenile Stage", maxDays: 60 },
{ name: "Grow-Out Stage", maxDays: 120 }, { name: "Harvest", maxDays: Infinity },];

export const LETTUCE_STAGES = [{ name: "Seedling Stage", maxDays: 14 }, { name: "Vegetative Growth", maxDays: 35 },
{ name: "Harvest Ready", maxDays: 50 }, { name: "Bolting & Seeding", maxDays: Infinity },];

// // Utility: format date to YYYY-MM-DD
// function toISODateString(d: Date) {
//   return d.toISOString().split("T")[0];
// }

// Timeline bar type
interface TimelineBar {
  id?: string | number;
  label: string;
  startDay: number;
  endDay: number;
  type: string;
  stageIndex: number;
  raw?: unknown;
}

export interface RawBatch extends Record<string, unknown> {
  fishBatchId?: number;
  date?: string;
  dateAdded?: string | Date;
  fishDays?: number;
  plantDays?: number;
  fishQuantity?: number;
  plantQuantity?: number;
  condition?: string;
  event?: string;
  status?: string;
}

export interface TimelineEvent extends RawBatch {
  status?: "Completed" | "Upcoming" | string;
}

function normalizeBatch(input: RawBatch): NormalizedBatch {
  if (!input) return {};

  const getNumberProp = (obj: unknown, prop: string): number | undefined => {
    if (obj && typeof obj === "object" && prop in obj) {
      const val = (obj as Record<string, unknown>)[prop];
      if (typeof val === "number") return val;
      if (typeof val === "string" && !isNaN(Number(val))) return Number(val);
    }
    return undefined;
  };

  const getStringProp = (obj: unknown, prop: string): string | undefined => {
    if (obj && typeof obj === "object" && prop in obj) {
      const val = (obj as Record<string, unknown>)[prop];
      if (typeof val === "string") return val;
      if (val != null) return String(val);
    }
    return undefined;
  };

  const maybeDate = input.date
    ? input.date
    : typeof input.event === "string" && /\d{4}-\d{2}-\d{2}/.test(input.event)
      ? input.event.match(/\d{4}-\d{2}-\d{2}/)?.[0]
      : undefined;

  return {
    id: input.fishBatchId ?? getNumberProp(input, "id"),
    dateISO: input.date ?? getStringProp(input, "dateAdded") ?? maybeDate,
    days: input.fishDays ?? input.plantDays ?? getNumberProp(input, "days"),
    qty:
      input.fishQuantity ?? input.plantQuantity ?? getNumberProp(input, "qty"),
    condition: input.condition,
    rawEvent: input.event,
  };
}

// Determine stage index given age in days and stage definition
function determineStageIndex(
  days: number | undefined,
  stageDef: { name: string; maxDays: number }[]
) {
  if (days === undefined || days === null || isNaN(days)) return 0;
  for (let i = 0; i < stageDef.length; i++) {
    if (days <= stageDef[i].maxDays) return i;
  }
  return stageDef.length - 1;
}

export function StageTimeline({ title, stageDef, apiUrl, typeKey, batchesProp, }: {
  title: string;
  stageDef: { name: string; maxDays: number }[];
  apiUrl?: string;
  typeKey: string;
  batchesProp?: TimelineEvent[];
}) {
  const [month, setMonth] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [bars, setBars] = useState<TimelineBar[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const daysInMonth = useMemo(
    () => new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate(),
    [month]
  );
  const monthLabel = useMemo(
    () =>
      month
        .toLocaleString("en-US", { month: "long", year: "numeric" })
        .toUpperCase(),
    [month]
  );

  const loadForMonth = useCallback(
    async (currentMonth: Date) => {
      setLoading(true);
      setError(null);
      try {
        let rawBatches: RawBatch[] = [];

        if (batchesProp && batchesProp.length > 0) {
          rawBatches = batchesProp;
        } else if (apiUrl) {
          const res = await fetch(
            `${apiUrl}?month=${currentMonth.getMonth() + 1
            }&year=${currentMonth.getFullYear()}`,
            { cache: "no-store" }
          );
          // handle API that returns { success, data } or raw array
          const json = await res.json();
          rawBatches = Array.isArray(json)
            ? json
            : Array.isArray(json?.data)
              ? json.data
              : [];
        }

        const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), daysInMonth);

        const mappedBars: TimelineBar[] = rawBatches.flatMap((b, idx) => {
          const normalized = normalizeBatch(b);

          const rawDate =
            normalized.dateISO ?? normalized.rawEvent ?? b.date ?? b.dateAdded;
          const startDate = rawDate ? new Date(rawDate) : null;
          if (!startDate || isNaN(startDate.getTime())) return [];

          const duration = normalized.days ?? 1; // default to 1 if missing
          const dur = Math.max(1, Math.floor(duration));

          const batchStart = new Date(startDate);
          const batchEnd = new Date(batchStart);
          batchEnd.setDate(batchStart.getDate() + dur - 1);

          if (batchEnd < monthStart || batchStart > monthEnd) return [];

          const intersectionStart = batchStart < monthStart ? monthStart : batchStart;
          const intersectionEnd = batchEnd > monthEnd ? monthEnd : batchEnd;

          const startDay = intersectionStart.getDate();
          const endDay = intersectionEnd.getDate();

          const stageIndex = determineStageIndex(dur, stageDef);

          const label = normalized.id
            ? `#${normalized.id}`
            : normalized.rawEvent ?? b.event ?? `B${idx + 1}`;

          return [
            {
              id: normalized.id ?? label, label, startDay, endDay, type: typeKey, stageIndex, raw: b,
            } as TimelineBar,
          ];
        });

        setBars(mappedBars);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
        setBars([]);
      } finally {
        setLoading(false);
      }
    },
    [apiUrl, batchesProp, daysInMonth, stageDef, typeKey]
  );

  // load when month or batchesProp change
  useEffect(() => {
    loadForMonth(month);
  }, [loadForMonth, month]);

  const changeMonth = (offset: number) => {
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() + offset, 1));
  };

  const leftPercent = (day: number) => ((day - 1) / daysInMonth) * 100;
  const widthPercent = (start: number, end: number) =>
    ((end - start + 1) / daysInMonth) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="grid grid-cols-2 items-center gap-4">
            {/* Left: Icon + Title */}
            <div className="flex items-center gap-2">
              {typeKey === "tilapia" ? (
                <HeartPulse className="w-6 h- text-blue-500" />
              ) : (
                <Droplets className="w-6 h-6 text-green-500" />
              )}
              <span>{title}</span>
            </div>

            {/* Right: Month Controls */}
            <div className="grid grid-cols-3 items-center gap-2 justify-items-center">
              <button
                onClick={() => changeMonth(-1)}
                className="px-2 py-1 border rounded hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 cursor-pointer" />
              </button>

              <div className="font-medium text-sm whitespace-nowrap min-w-[80px] text-center">
                {monthLabel}
              </div>

              <button
                onClick={() => changeMonth(1)}
                className="px-2 py-1 border rounded hover:bg-gray-100"
              >
                <ArrowRight className="w-4 cursor-pointer" />
              </button>
            </div>
          </div>
        </CardTitle>
        <CardDescription>Click arrows to navigate months.</CardDescription>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        <div className="grid grid-cols-[160px_1fr] min-w-[700px]">
          <div className="pr-4 border-r">
            <div className="font-semibold mb-2">Stages</div>
            {stageDef.map((s, idx) => (
              <div key={idx} className="py-3 border-b text-sm">
                {s.name}
              </div>
            ))}
          </div>

          <div className="pl-4">
            <div
              className="flex items-center gap-1 mb-3"
              style={{ minWidth: daysInMonth * 28 }}
            >
              {Array.from({ length: daysInMonth }, (_, i) => (
                <div key={i} className="text-xs text-center w-[28px]">
                  {i + 1}
                </div>
              ))}
            </div>

            {stageDef.map((_, stageIdx) => (
              <div
                key={stageIdx}
                className="relative mb-3"
                style={{ minWidth: daysInMonth * 28, height: 44 }}
              >
                <div className="absolute inset-0 flex">
                  {Array.from({ length: daysInMonth }, (_, i) => (
                    <div
                      key={i}
                      className="h-full border-r border-dotted border-gray-100 w-[28px]"
                    />
                  ))}
                </div>

                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                    Loading...
                  </div>
                )}
                {!loading &&
                  bars.filter((b) => b.stageIndex === stageIdx).length ===
                  0 && (
                    <div className="absolute left-2 top-2 text-xs text-muted-foreground">
                      —
                    </div>
                  )}

                {bars
                  .filter((b) => b.stageIndex === stageIdx)
                  .map((b) => {
                    const left = leftPercent(b.startDay);
                    const width = widthPercent(b.startDay, b.endDay);
                    // Use dynamic color based on ID
                    const bg = getColorForId(b.id);
                    return (
                      <div
                        key={String(b.id) + "-" + b.label}
                        className="absolute top-2 h-[32px] rounded-md text-white flex items-center justify-center text-xs"
                        title={`${b.label} (${b.startDay}—${b.endDay})`}
                        style={{
                          left: `${left}%`,
                          width: `${width}%`,
                          background: bg,
                          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                        }}
                      >
                        <span className="px-2 truncate max-w-full">
                          {b.label}
                        </span>
                      </div>
                    );
                  })}
              </div>
            ))}
            {error && (
              <div className="text-sm text-red-600 mt-2">
                Error loading timeline: {error}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
