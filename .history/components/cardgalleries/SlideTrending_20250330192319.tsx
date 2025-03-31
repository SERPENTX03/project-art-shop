"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Gallery = {
  id: string;
  title: string;
  description: string | null;
  images: string[];
};

type Props = {
  galleries: Gallery[];
};

const SlideTrending = ({ galleries }: Props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel();

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);
  return (
    <div className="relative ">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {galleries.map((art) => (
            <div className="w-full px-2 h-80" key={art.id}>
              <div className="flex flex-col h-full justify-between bg-white rounded-xl shadow-md p-2">
                <Image
                  className="w-full h-40 rounded-2xl object-cover"
                  src={art.images[0]}
                  alt={art.title}
                  width={200}
                  height={200}
                />
                <div className="text-center">
                  <h1 className="mt-2 font-semibold">{art.title}</h1>
                  <p className="text-sm text-muted-foreground">
                    {art.description}
                  </p>
                </div>
                <div className="flex justify-center">
                  <Link
                    href={`/gallery/${art.id}`}
                    className="button-custom py-1 px-3 mt-2"
                  >
                    View more
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prev / Next Buttons */}
      <div className="absolute -top-10 right-0 flex gap-2">
        <button
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!canScrollPrev}
          className="button-custom px-3 disabled:opacity-30"
        >
          Prev
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          disabled={!canScrollNext}
          className="button-custom px-3 disabled:opacity-30"
        >
          Next
        </button>
      </div>
    </div>
  );
};
export default SlideTrending;
