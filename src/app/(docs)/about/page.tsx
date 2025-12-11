"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

import SlideFade from "@/components/animations/SlideFade";
import FadeIn from "@/components/animations/FadeIn";

import Lettuce from "@/assets/about-img/Lettuce.png";
import Tilapia from "@/assets/about-img/Tilapia.png";


import { Leaf, Fish, MonitorCloud } from 'lucide-react';
import System from "@/assets/about-img/system.png";
import One from "@/assets/about-img/one.png";
import Two from "@/assets/about-img/two.png";
import Three from "@/assets/about-img/three.png";




export default function About() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);
  const y = useTransform(scrollY, [0, 200], [0, -80]);

  return (
    <main className="w-full min-h-screen bg-gray-50">

      <motion.div
        style={{ opacity, y }}
        className="relative z-0 w-full h-[90vh] flex flex-col justify-center items-center mb-32 overflow-hidden"
      >
        {/* BACKGROUND IMAGE */}
        <Image
          src={require('@/assets/about-img/hero-background-img.jpg')}
          alt="Hero Background"
          fill
          priority
          className="absolute top-0 left-0 w-full h-full object-cover z-[-1] brightness-50"
        />

        {/* HERO TEXT */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-6xl md:text-7xl font-bold text-white text-center px-4"
        >
          Here is about our website
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="mt-6 text-xl md:text-2xl text-white text-center max-w-2xl px-4"
        >
          Learn about our aquaponics system and blahblah.
        </motion.p>
      </motion.div>



      {/* LETTUCE */}
      <div className="flex flex-row  items-center justify-between max-w-6xl mx-auto gap-50 mb-75">
        <SlideFade>
          <div className="flex justify-center w-[400px]">
            <Image
              src={Lettuce}
              alt="Lettuce"
              width={400}
              height={400}
              className="object-contain"
            />
          </div>
        </SlideFade>
        <FadeIn delay={0.3}>
          <div className="w-2/3 flex flex-col">
            <h1 className="text-5xl font-bold text-green-700 mb-4">LETTUCE</h1>
            <p className="mb-4">
              Lettuce is one of the most popular and successful crops for aquaponics
              systems due to its fast growth rate, low maintenance requirements, and
              adaptability to hydroponic environments. It is a cool-season leafy
              vegetable that thrives in water-based systems like deep water culture
              (DWC) or nutrient film technique (NFT), where its roots have constant
              access to oxygenated, nutrient-rich water.
            </p>
            <p>
              In an aquaponics setup, lettuce benefits from the natural nutrients
              provided by fish waste, eliminating the need for chemical fertilizers.
              It typically reaches harvest size in 30 to 45 days, depending on the
              variety and environmental conditions. Lettuce also helps maintain water
              balance and offers a visual indicator of system health due to its
              sensitivity to changes in pH and nutrient levels.
            </p>
          </div>
        </FadeIn>
      </div>

      {/* TILAPIA */}
      <div className="flex flex-row items-center justify-between max-w-6xl mx-auto gap-10 mb-75">
        <FadeIn>
          <div className="w-2/3 flex flex-col">
            <h1 className="text-5xl font-bold text-green-700 mb-4">TILAPIA</h1>
            <p className="mb-4">
              Tilapia is one of the most widely used fish species in aquaponics due
              to its resilience, fast growth rate, and ability to thrive in controlled
              environments. Native to Africa, tilapia are freshwater fish that can
              tolerate a wide range of water conditions, including fluctuations in
              temperature, pH, and dissolved oxygen levels. This hardiness makes them
              an excellent choice for beginners and experienced aquaponics
              practitioners alike.
            </p>
            <p>
              In an aquaponics system, tilapia serve as the primary nutrient source
              for the plants. As the fish are fed, they produce waste that is
              converted by beneficial bacteria into nitrates—an essential nutrient
              for plant growth. This natural nutrient cycle supports both the health
              of the fish and the productivity of the plants, creating a balanced,
              symbiotic environment.
            </p>
          </div>
        </FadeIn>

        <SlideFade delay={0.2}>
          <div className="flex justify-center w-[400px]">
            <Image
              src={Tilapia}
              alt="Tilapia"
              width={400}
              height={400}
              className="object-contain"
            />
          </div>
        </SlideFade>
      </div>

      {/* INFO SECTION */}
      <div className="flex flex-col w-full max-w-6xl mx-auto gap-12 mb-32">
        {[
          {
            icon: "Leaf",
            number: One,
            text: `Tilapia (Oreochromis niloticus) is a fast-growing freshwater fish ideal
            for aquaponics. It is hardy, easy to maintain, and thrives in varied water
            conditions. In the system, tilapia will be kept in tanks with sensors for
            pH, temperature, and oxygen, and fed using an automated feeder.`
          },
          {
            icon: "Fish",
            number: Two,
            text: `Lettuce (Lactuca sativa) grows well in aquaponic setups due to its low
            nutrient needs and quick growth. It will be planted in rafts or channels
            where roots absorb nutrients from fish waste. Sensors will help maintain
            water quality for optimal plant health.`
          },
          {
            icon: "MonitorCloud",
            number: Three,
            text: `The Aquaponics System connects fish and plant production in a sustainable
            cycle. Fish provide nutrients for the plants, while plants help filter
            the water. With automated monitoring and feeding, the system ensures
            balanced growth with less manual work.`
          }
        ].map((item, index) => (
          <motion.div
            key={index}
            className="flex flex-row items-start gap-6"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            {/* Icon */}
            <div className="w-1/6 flex justify-center">
              {item.icon === "Leaf" ? (
                <Leaf className="w-20 h-20 text-green-700" />
              ) : item.icon === "Fish" ? (
                <Fish className="w-20 h-20 text-green-700" />
              ) : item.icon === "MonitorCloud" ? (
                <MonitorCloud className="w-20 h-20 text-green-700" />
              ) : (
                <Image
                  src={item.icon}
                  alt="Icon"
                  className="object-contain"
                  width={80}
                  height={80}
                />
              )}
            </div>

            {/* Number + Text */}
            <div className="flex flex-row items-start gap-4 w-5/6">
              <Image
                src={item.number}
                alt="Number"
                className="object-contain"
                width={40}
                height={40}
              />
              <p>{item.text}</p>
            </div>
          </motion.div>
        ))}
      </div>

    </main>
  );
}
