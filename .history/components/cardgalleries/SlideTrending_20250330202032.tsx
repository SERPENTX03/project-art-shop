"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

type Gallery = {
  id: string;
  title: string;
  description: string | null;
  images: string[];
  price: number;
};

type Props = {
  galleries: Gallery[];
};

const SlideTrending = ({ galleries }: Props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    slidesToScroll: "auto",
  });

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
    <div className="embla w-full">
      {/* ปุ่ม Prev/Next */}
      <div className="flex justify-end gap-3 mb-4">
        <button
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!canScrollPrev}
          className="button-custom px-4 disabled:opacity-40"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          disabled={!canScrollNext}
          className="button-custom px-4 disabled:opacity-40"
        >
          <ChevronRight />
        </button>
      </div>
      <div className="embla__viewport overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">
          {galleries.map((art) => (
            <div
              key={art.id}
              className="embla__slide basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 shrink-0 grow-0 px-3"
            >
              <div className="h-80 gap-6">
                <Image
                  src={art.images[0]}
                  alt={art.title}
                  width={500}
                  height={200}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <div className="flex flex-col h-34 justify-between">
                  <div className="text-center">
                    <h1 className="mt-2 font-semibold text-sm md:text-base">
                      {art.title}
                    </h1>
                    <div className=" flex flex-col justify-center items-center ">
                      <div className="w-full max-w-[200px]">
                        <p className="text-sm text-muted-foreground break-words">
                          {art.description?.slice(0, 50)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-right text-2xl">{art.price}</p>
                    <Link
                      href={`/gallery/${art.id}`}
                      className="button-custom py-1 px-3 mt-2 text-sm"
                    >
                      View more
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default SlideTrending;
