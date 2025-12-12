"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Toast = {
  id: number;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

type ToastContextType = {
  toast: (toast: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (toastData: Omit<Toast, "id">) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...toastData, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "rounded-md p-4 shadow-lg text-white",
              t.variant === "destructive" ? "bg-red-500" : "bg-gray-900"
            )}
          >
            {t.title && <div className="font-semibold">{t.title}</div>}
            {t.description && (
              <div className="text-sm opacity-90">{t.description}</div>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
