"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Landing from "@/assets/landing.png";
import FadeIn from "@/components/animations/FadeIn";
import ScaleFade from "@/components/animations/ScaleFade";

export default function Home() {
  return (
    <main className="flex flex-row min-w-screen min-h-screen overflow-hidden items-center justify-center bg-white gap-16 px-8">
      
      {/* TEXT SECTION */}

      <div className="flex flex-col items-start justify-start">
        <FadeIn delay={0.2}>
        <h1 className="text-4xl font-bold mb-4 text-green-800">
          LeaFin Things
        </h1>
        </FadeIn>

        <FadeIn delay={0.3}>
        <p className="text-lg text-gray-600 max-w-md">
          An innovative and sustainable Aquaponics System
        </p>
        </FadeIn>

        <FadeIn delay={0.3}>
        <Button
          variant="default"
          className="mt-6" >
          <Link href="./about">Explore</Link>
        </Button>
        </FadeIn>
      </div>

      {/* IMAGE SECTION */}
      <ScaleFade>
      <div className="rounded-2xl shadow-xl overflow-hidden border border-gray-200">
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
