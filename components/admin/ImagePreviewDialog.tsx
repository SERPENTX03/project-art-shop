"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { VisuallyHidden } from "@/components/ui/VisuallyHidden";
import { Button } from "@/components/ui/button";

type Props = {
  images: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ImageCarouselDialog({
  images,
  open,
  onOpenChange,
}: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect(); // initial
  }, [emblaApi]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full p-4 space-y-4">
        <VisuallyHidden>
          <DialogTitle>ดูรูปภาพทั้งหมด</DialogTitle>
        </VisuallyHidden>
        <div className="overflow-hidden rounded" ref={emblaRef}>
          <div className="flex">
            {images.map((src, index) => (
              <div
                className="min-w-full flex justify-center items-center"
                key={index}
              >
                <Image
                  src={src}
                  alt={`preview-${index}`}
                  width={1000}
                  height={800}
                  className="object-contain max-h-[70vh] w-auto rounded"
                />
              </div>
            ))}
          </div>
          <p className="text-blue-500 text-center mt-2 font-semibold">
            รูปภาพสำหรับพรีวิว
          </p>
        </div>

        {/* Navigation (optional) */}
        <div className="flex justify-center gap-2">
          {images.map((_, index) => (
            <Button
              key={index}
              size="icon"
              variant={index === selectedIndex ? "default" : "outline"}
              onClick={() => scrollTo(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
