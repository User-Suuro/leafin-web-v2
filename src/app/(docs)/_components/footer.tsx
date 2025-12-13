"use client";

import Image from "next/image";
import { LeafyGreen, Phone, MapPin } from "lucide-react";
import Logo from "@/assets/branding/favicon.svg";

export default function Footer() {
  return (
    <footer className="w-full bg-[#DCFFEA] text-gray-800 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">

        {/* LEFT: LOGO */}
        <div className="flex items-center gap-3">
          <Image
            src={Logo}
            alt="LeaFin Things Logo"
            width={50}
            height={50}
            className="object-contain"
          />
          <h2 className="text-xl font-semibold text-green-800">
            LeaFin Things
          </h2>
        </div>

        {/* RIGHT: INFO */}
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-2">
            <LeafyGreen className="w-4 h-4 text-green-700" />
            <span>Sustainable Aquaponics System</span>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-green-700" />
            <span>+63 XXX XXX XXXX</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-green-700" />
            <span>Brgy. Cobangbang, Daet, Camarines Norte</span>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="text-center text-xs text-gray-600 mt-8">
        &copy; {new Date().getFullYear()} LeaFin. All rights reserved.
      </div>
    </footer>
  );
}
