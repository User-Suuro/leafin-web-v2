import type { Metadata } from "next";
import logo from "@/assets/favicon.ico";

import { Cormorant_Garamond } from "next/font/google";
import { Luckiest_Guy } from "next/font/google";
import { Poppins } from "next/font/google";

import "@/styles/globals.css";

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
      </body>
    </html>
  );
}
