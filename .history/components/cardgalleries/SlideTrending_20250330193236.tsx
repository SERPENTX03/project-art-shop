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
  return <div className="w-full bg-black h-40"></div>;
};
export default SlideTrending;
