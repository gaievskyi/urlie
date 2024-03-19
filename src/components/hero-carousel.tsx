"use client"

import { GitHubLogoIcon, RocketIcon } from "@radix-ui/react-icons"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { Icons } from "./ui/icons"

const cards = [
  {
    title: "Full-featured",
    description: "Shorten and manage your URLs.",
    icon: <RocketIcon className="size-8" />,
  },
  {
    title: "Customizable",
    description: "Enhance links with custom settings.",
    icon: <Icons.Palette className="size-8" />,
  },
  {
    title: "Free and Open Source",
    description: "Source code is available on GitHub.",
    icon: <GitHubLogoIcon className="size-8" />,
  },
]

export const HeroCarousel = () => (
  <Carousel
    plugins={[
      Autoplay({
        delay: 5000,
      }),
    ]}
    opts={{
      align: "start",
    }}
    orientation="vertical"
    className="m-auto w-full"
  >
    <CarouselContent className="-mt-1 h-[200px]">
      {cards.map((card, index) => (
        <CarouselItem key={index} className="p-1 md:basis-1/2">
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-2 p-8">
              {card.icon}
              <p className="scroll-m-20 text-lg font-medium tracking-tight lg:text-xl">
                {card.title}
              </p>
              <p className="text-pretty text-sm">{card.description}</p>
            </CardContent>
          </Card>
        </CarouselItem>
      ))}
    </CarouselContent>
  </Carousel>
)
