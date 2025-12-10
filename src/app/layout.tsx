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

const luckiestGuy = Luckiest_Guy({
  subsets: ["latin"],
  weight: "400", // only available weight
  variable: "--font-luckiest",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"], // semibold
  variable: "--font-cormorant",
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
        className={`${bodyFont.variable} 
                        ${luckiestGuy.variable} 
                        ${cormorant.variable} 
                        scrollbar-gutter-stable scroll-smooth`}
      >
        {children}
      </body>
    </html>
  );
}
