"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Check, X, Trash, Edit } from "lucide-react";

export default function TableActions({
  onAction,
  batchId,
  status,
}: {
  onAction?: (
    action: "harvest" | "discard" | "delete" | "edit",
    batchId: number
  ) => void;
  batchType: "fish" | "plant";
  batchId: number;
  status: "growing" | "ready" | "harvested" | "discarded";
}) {
  return (
    <TooltipProvider>
      {/* Show harvest & discard only if NOT harvested/discarded */}
      {status !== "harvested" && status !== "discarded" && (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onAction?.("harvest", batchId)}
              >
                <Check className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Harvest</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onAction?.("discard", batchId)}
              >
                <X className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Discard</TooltipContent>
          </Tooltip>
        </>
      )}

      {/* Edit (allowed kahit discarded or harvested) */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onAction?.("edit", batchId)}
          >
            <Edit className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Edit</TooltipContent>
      </Tooltip>

      {/* Delete (always visible) */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onAction?.("delete", batchId)}
          >
            <Trash className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
