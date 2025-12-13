"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import Landing from "@/assets/landing.png";
import  ScaleFade  from "@/components/animations/ScaleFade";
import FadeIn from "@/components/animations/FadeIn";
import { ScanEye } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-row min-w-screen min-h-screen overflow-hidden items-center justify-center bg-white gap-16 px-8">
      
      {/* TEXT SECTION */}
      <div className="flex flex-col items-start justify-start">
        <FadeIn delay={0.2}>
          <h1 className="text-5xl font-bold mb-4 text-green-800">
            LeaFin Things
          </h1>
        </FadeIn>
        
        <FadeIn delay={0.3}>
        <p className="text-lg text-gray-600 max-w-md">
          An innovative and sustainable Aquaponics System
        </p>
        </FadeIn>
        <Button
          variant="default"
          className="mt-6 cursor-pointer"

        >
          <Link
            href="./about"
            className="flex items-center gap-2"
          >
             Explore
          </Link>
         
        </Button>
      </div>

      {/* IMAGE SECTION */}
      <ScaleFade>
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
      </ScaleFade>


    </main>
  );
}
