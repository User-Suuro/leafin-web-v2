import "./globals.css";
import type { Metadata } from "next";
import logo from "@/assets/branding/favicon.svg";
import { Luckiest_Guy, Poppins } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { ToastProvider } from "@/components/ui/toast-provider";

const bodyFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
});

const luckiestGuy = Luckiest_Guy({
  subsets: ["latin"],
  weight: "400", // only available weight
  variable: "--font-luckiest",
});

export const metadata: Metadata = {
  title: "Leafin Things",
  icons: {
    icon: logo.src,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${bodyFont.variable}
          ${luckiestGuy.variable}
          scrollbar-gutter-stable scroll-smooth
          min-h-screen bg-[#faf7f2] text-gray-900
        `}
      >
        <ToastProvider>{children}</ToastProvider>
        <Toaster />
      </body>
    </html>
  );
}
