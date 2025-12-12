"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";

interface HarvestBatchModalProps {
  open: boolean;
  onClose: () => void;
  type: "fish" | "plant";
  batchId: number;
  onSubmit: (data: {
    customerName: string;
    totalAmount: number;
    notes: string;
  }) => void;
}

export default function HarvestBatchModal({
  open,
  onClose,
  type,
  onSubmit,
}: HarvestBatchModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [totalAmount, setTotalAmount] = useState(""); // start empty
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    const numericAmount = Number(totalAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert("Total amount must be greater than 0");
      return;
    }

    onSubmit({ customerName, totalAmount: numericAmount, notes });

    // reset fields
    setCustomerName("");
    setTotalAmount("");
    setNotes("");
  };

  return (
    <Modal open={open} onOpenChange={onClose}>
      <ModalContent className="sm:max-w-lg">
        <ModalHeader>
          <h2 className="text-lg font-bold">Harvest {type} Batch</h2>
        </ModalHeader>

        <ModalBody className="space-y-4">
          <div className="flex flex-col gap-2">
            <label>Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="input"
            />

            <label>Total Sale Amount</label>
            <input
              type="text"
              value={totalAmount}
              onChange={(e) => {
                // allow only digits
                if (/^\d*$/.test(e.target.value))
                  setTotalAmount(e.target.value);
              }}
              placeholder="Enter total amount"
              className="input"
            />

            <label>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input"
            />
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
