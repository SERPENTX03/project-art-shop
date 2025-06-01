"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import ViewMoreButton from "./PendingButton";
import AddBacket from "./AddBacket";
import { Gallery } from "@/types/gallery";
import { SlBasket } from "react-icons/sl";
import { GrFavorite } from "react-icons/gr";

import { SignUpButton } from "@clerk/nextjs";
import ToggleFavorite from "./ToggleFavorite";

type Props = {
  galleries: Gallery[];
  userId: string | null;
};

const SlideTrending = ({ galleries, userId }: Props) => {
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
              <div className="h-80 relative">
                <Image
                  src={art.images[0]}
                  alt={art.title}
                  width={500}
                  height={200}
                  className="w-full h-40  object-cover rounded-lg"
                />
                {userId ? (
                  <>
                    <div className="absolute top-2 right-2">
                      <div className="flex gap-2">
                        <AddBacket gallery={art} />
                        <ToggleFavorite galleryId={art.id} />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="absolute top-2 right-2  ">
                    <div className="flex gap-2">
                      <SignUpButton mode="modal">
                        <SlBasket
                          size={35}
                          className="border cursor-pointer p-1 rounded-xl bg-white/40 hover:bg-white/80 transition-colors duration-300 ease-in-out"
                        />
                      </SignUpButton>
                      <SignUpButton mode="modal">
                        <GrFavorite
                          size={35}
                          className=" border cursor-pointer p-1 rounded-xl bg-white/40 hover:bg-white/80 transition-colors duration-300 ease-in-out"
                        />
                      </SignUpButton>
                    </div>
                  </div>
                )}

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
                  <div className="flex justify-between items-center px-2">
                    <p className="text-right text-xl text-[#123458]">
                      {art.price} ฿
                    </p>
                    <ViewMoreButton id={art.id} />
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
