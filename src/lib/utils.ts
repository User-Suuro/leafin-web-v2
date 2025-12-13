import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 🎨 Color Palette for Batches (Tailwind-ish colors)
export const BATCH_COLORS = [
  "#F87171", // red-400
  "#FB923C", // orange-400
  "#FACC15", // yellow-400
  "#4ADE80", // green-400
  "#34D399", // emerald-400
  "#2DD4BF", // teal-400
  "#22D3EE", // cyan-400
  "#38BDF8", // sky-400
  "#60A5FA", // blue-400
  "#818CF8", // indigo-400
  "#A78BFA", // violet-400
  "#C084FC", // purple-400
  "#E879F9", // fuchsia-400
  "#FB7185", // rose-400
];

// Helper: Hash ID to pick a color
export const getColorForId = (id: string | number | undefined) => {
  if (!id) return "#9CA3AF"; // default grey
  const str = String(id);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % BATCH_COLORS.length;
  return BATCH_COLORS[index];
};
