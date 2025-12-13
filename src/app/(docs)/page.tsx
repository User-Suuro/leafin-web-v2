"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Landing from "@/assets/landing.png";

export default function Home() {
  return (
    <main className="flex flex-row min-w-screen min-h-screen overflow-hidden items-center justify-center bg-white gap-16 px-8">
      
      {/* TEXT SECTION */}
      <div className="flex flex-col items-start justify-start">
        <h1 className="text-4xl font-bold mb-4 text-green-800">
          LeaFin Things
        </h1>

        <p className="text-lg text-gray-600 max-w-md">
          An innovative and sustainable Aquaponics System
        </p>

        <Button
          variant="default"
          className="mt-6"
          href="./about"
        >
          Explore
        </Button>
      </div>

      {/* IMAGE SECTION */}
      <div className="rounded-2xl shadow-xl overflow-hidden border border-gray-200  ">
        <Image
          src={Landing}
          alt="Landing Image"
          width={500}
          height={300}
          className="object-cover"
          priority
        />
      </div>

    </main>
  );
}
