import "./globals.css";
import type { Metadata } from "next";
import logo from "@/assets/branding/favicon.svg";
import { Poppins } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";

const bodyFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
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
        className={`${bodyFont.variable} scrollbar-gutter-stable scroll-smooth`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
