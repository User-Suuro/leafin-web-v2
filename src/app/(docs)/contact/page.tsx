"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import ScaleFade from "@/components/animations/ScaleFade";
import FadeIn from "@/components/animations/FadeIn";

export default function Contact() {
  return (
    <main className="w-full min-h-screen bg-gray-50 flex flex-col items-center py-20">

      <ScaleFade>
        <h1 className="text-4xl font-semibold mb-10">
          Contact Us
        </h1>
      </ScaleFade>

        <Card className="w-full max-w-3xl bg-[#DCFFEA] shadow-lg rounded-2xl">
          <CardContent className="p-10 flex flex-col gap-6">
            <FadeIn>
            <h2 className="text-lg font-medium mb-3">Send a message</h2>

            <Input placeholder="Enter your Full name" className="h-12 bg-white mb-3" />
            <Input type="email" placeholder="Enter your email" className="h-12 bg-white mb-3" />

            <Textarea
              placeholder="Type your message..."
              className="min-h-[150px] resize-none bg-white mb-3"
            />
      
            <Button className="h-12 bg-green-600 hover:bg-green-700 text-white text-lg rounded-xl cursor-pointer">
              Submit
            </Button>
            </FadeIn>
          </CardContent>
        </Card>

    </main>

  );
}
