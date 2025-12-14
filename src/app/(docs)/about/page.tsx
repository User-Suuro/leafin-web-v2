"use client";

import Image from "next/image";
import { Card, CardContent} from "@/components/ui/card";
import { motion, useScroll, useTransform } from "framer-motion";

import SlideFade from "@/components/animations/SlideFade";
import FadeIn from "@/components/animations/FadeIn";
import SlideFromLeft from "@/components/animations/SlideLeft";

import Lettuce from "@/assets/about-img/Lettuce.png";
import Tilapia from "@/assets/about-img/Tilapia.png";

import { Leaf, Fish, MonitorCloud } from "lucide-react";
import One from "@/assets/about-img/one.png";
import Two from "@/assets/about-img/two.png";
import Three from "@/assets/about-img/three.png";

import Gab from "@/assets/team/gab.png";
import Master from "@/assets/team/master.png";
import Jub from "@/assets/team/jub.png";
import Neko from "@/assets/team/neko.png";
import Josh from "@/assets/team/josh.png";
import Azied from "@/assets/team/azied.png";
import Ajan from "@/assets/team/ajan.png";
import Mikay from "@/assets/team/mikay.png";
import Divine from "@/assets/team/divine.png";
import Renz from "@/assets/team/doms.png";
import Johann from "@/assets/team/johann.png";

const profiles1 = [
  Gab,
  Master,
  Jub,
  Neko,
  Josh,
  Azied,
]

const cardBase =
  "bg-[#DCFFEA] shadow-md w-[200px] h-[260px] flex items-center justify-center";

const imageBase =
  "object-cover rounded-md transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer";


const profiles2 = [
  Ajan,
  Mikay,
  Divine,
  Renz,
  Johann,
]

export default function About() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);
  const y = useTransform(scrollY, [0, 200], [0, -80]);

  return (
    <main className="w-full min-h-screen bg-gray-50">

      {/* HERO SECTION (NO CARD) */}
      <motion.div
        style={{ opacity, y }}
        className="relative z-0 w-full h-[90vh] flex flex-col justify-center items-center  overflow-hidden"
      >
        <Image
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          src={require("@/assets/about-img/hero-background-img.jpg")}
          alt="Hero Background"
          fill
          priority
          className="absolute inset-0 object-cover brightness-50 -z-10"
        />

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl md:text-7xl font-bold text-white text-center"
        >
          Here is about our website
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-6 text-xl md:text-2xl text-white text-center max-w-2xl"
        >
          Learn about our aquaponics system.
        </motion.p>
      </motion.div>

    {/* LETTUCE SECTION */}
      <div className="flex items-center max-w-6xl mx-auto gap-12 mb-24">
        <SlideFade>
          <Image
            src={Lettuce}
            alt="Lettuce"
            width={400}
            height={400}
            className="object-contain"
          />
        </SlideFade>

        <FadeIn delay={0.3}>
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-8">
              <h1 className="text-5xl font-bold text-green-700 mb-4">
                LETTUCE
              </h1>
              <p className="mb-4">
                Lettuce is one of the most popular crops for aquaponics due to its
                fast growth and low maintenance needs.
              </p>
              <p>
                It benefits from fish waste nutrients and reaches harvest in
                30–45 days while helping maintain system balance.
              </p>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

 {/* TILAPIA SECTION */}
      <div className="flex items-center max-w-6xl mx-auto gap-12 mb-24">
        <FadeIn>
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-8">
              <h1 className="text-5xl font-bold text-green-700 mb-4">
                TILAPIA
              </h1>
              <p className="mb-4">
                Tilapia is widely used in aquaponics due to its resilience and
                fast growth rate.
              </p>
              <p>
                Fish waste is converted into nutrients, creating a balanced
                ecosystem for plant growth.
              </p>
            </CardContent>
          </Card>
        </FadeIn>

        <SlideFade delay={0.2}>
          <Image
            src={Tilapia}
            alt="Tilapia"
            width={400}
            height={400}
            className="object-contain"
          />
        </SlideFade>
      </div>


{/* INFO SECTION */}
      <div className="max-w-6xl mx-auto flex flex-col gap-10 mb-24">
        {[
          {
            icon: <Leaf className="w-16 h-16 text-green-700" />,
            number: One,
            text:
              "Tilapia is hardy and ideal for aquaponics. Sensors monitor pH, temperature, and oxygen with automated feeding."
          },
          {
            icon: <Fish className="w-16 h-16 text-green-700" />,
            number: Two,
            text:
              "Lettuce grows efficiently by absorbing nutrients from fish waste, supported by water quality sensors."
          },
          {
            icon: <MonitorCloud className="w-16 h-16 text-green-700" />,
            number: Three,
            text:
              "The aquaponics system automates monitoring and feeding to ensure sustainable, balanced growth."
          }
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="flex items-center justify-center gap-6"
          >
            {item.icon}

            <SlideFade delay={0.3}>
            <Card className="bg-white border border-gray-200 shadow-sm w-full text-center">
              <CardContent className="flex gap-4 p-6">
                <Image
                  src={item.number}
                  alt="Step"
                  width={32}
                  height={32}
                />
                <p className="px-20">{item.text}</p>
              </CardContent>
            </Card>
            </SlideFade>
            
          </motion.div>
        ))}
      </div>
      {/* Meet the Team */}

      <div className="max-w-6xl mx-auto flex flex-col items-center gap-10 mb-32">
        <FadeIn delay={0.2}>
          <h1 className="text-5xl text-center font-bold text-green-700 mb-0">
              Meet the <span className="text-[#1A6641]">Team</span>
          </h1>
        </FadeIn>
        <FadeIn delay={0.3}>
            <p>
              Hardware Support & System Programmer
          </p>
        </FadeIn>

        
        <div className="flex flex-row gap-5">
        {profiles1.map((profile, index) => (
          <SlideFromLeft key={index} delay={index * 0.1}>
            <Card className={cardBase}>
              <CardContent className="flex flex-col items-center justify-center gap-3 p-4">
                <Image
                  src={profile}
                  alt={`Profile ${index + 1}`}
                  width={150}
                  height={150}
                  className={imageBase}
                />
                <h1 className="text-center text-sm font-medium">
                  {[
                    "Gabriel de la Cruz",
                    "Godwin Galvez",
                    "John Mark Pardo",
                    "Levnicolayevich Adlawan",
                    "Joshua Guevarra",
                    "Jaycee Azied R. Delen",
                  ][index]}
                </h1>
              </CardContent>
            </Card>
          </SlideFromLeft>
        ))}
      </div>


      <div className="flex flex-row gap-5">
      {profiles2.map((profile, index) => (
        <SlideFromLeft key={index} delay={index * 0.1}>
          <Card className={cardBase}>
            <CardContent className="flex flex-col items-center justify-center gap-3 p-4">
              <Image
                src={profile}
                alt={`Profile ${index + 1}`}
                width={150}
                height={150}
                className={imageBase}
              />
              <h1 className="text-center text-sm font-medium">
                {[
                  "Ajaniel Tejares",
                  "Mikylla Nañez",
                  "Divine Mae Ponciano",
                  "Renz Dominic Azul",
                  "Johann Chavez",
                ][index]}
              </h1>
            </CardContent>
          </Card>
        </SlideFromLeft>
      ))}
    </div>

      </div>
    </main>
  );
}
