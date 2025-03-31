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

export default function CardTrending({ galleries }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    slidesToScroll: "auto",
    containScroll: "trimSnaps",
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
      <div className="embla__viewport overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">
          {galleries.map((art) => (
            <div
              key={art.id}
              className="embla__slide basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 shrink-0 grow-0 px-3"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden h-80 flex flex-col justify-between transition-all hover:shadow-2xl">
                <Image
                  src={art.images[0]}
                  alt={art.title}
                  width={500}
                  height={200}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 flex flex-col gap-2 flex-1 justify-between">
                  <div>
                    <h1 className="text-base font-semibold text-center line-clamp-1">
                      {art.title}
                    </h1>
                    <p className="text-sm text-muted-foreground text-center line-clamp-2">
                      {art.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-500">
                      {art.price}฿
                    </span>
                    <Link
                      href={`/gallery/${art.id}`}
                      className="button-custom text-sm px-3 py-1 rounded-md"
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

      {/* ปุ่ม Prev/Next */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!canScrollPrev}
          className="button-custom px-4 disabled:opacity-40"
        >
          Prev
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          disabled={!canScrollNext}
          className="button-custom px-4 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
