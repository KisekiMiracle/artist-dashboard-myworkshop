"use client";

import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";

export default function AuthCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  const slides = [
    <div key={"slide_1"} className="flex flex-col gap-4 py-12 max-w-4xl">
      <h2 className="w-full font-semibold text-6xl">
        Request data from your Client. Organize your Workflow.
      </h2>
      <p className="text-xl">
        Manage your projects or business with an all-in-one platform designed to
        make your onboarding process cohesive and effective.
      </p>
    </div>,
    <div key={"slide_1"} className="flex flex-col gap-4 py-12 max-w-4xl">
      <h2 className="w-full font-semibold text-6xl">
        Request data from your Client. Organize your Workflow.
      </h2>
      <p className="text-xl">
        Manage your projects or business with an all-in-one platform designed to
        make your onboarding process cohesive and effective.
      </p>
    </div>,
  ];

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {Array.from(slides).map((slide, index) => (
          <CarouselItem key={index}>{slide}</CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
