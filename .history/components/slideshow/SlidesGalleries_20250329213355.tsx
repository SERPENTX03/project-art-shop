"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type Props = {
  images: string[];
};

export default function GalleryCarousel({ images }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ axis: "x" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  return (
    <div className="flex w-full gap-6">
      {/* Thumbnails (left) */}
      <div className="flex flex-col gap-2 overflow-y-auto max-h-[500px]">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`border-2 rounded-lg overflow-hidden ${
              selectedIndex === i
                ? "border-black"
                : "border-transparent opacity-60"
            }`}
          >
            <Image
              src={img}
              alt={`thumbnail-${i}`}
              width={80}
              height={80}
              className="object-cover w-20 h-20"
            />
          </button>
        ))}
      </div>

      {/* Main Image (right) */}
      <div className="w-[60%] overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((img, i) => (
            <div key={i} className="flex-[0_0_100%]">
              <Image
                src={img}
                alt={`image-${i}`}
                width={600}
                height={600}
                className="w-full h-[500px] object-cover rounded-2xl"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
