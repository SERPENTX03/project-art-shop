"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Gallery = {
  id: string;
  title: string;
  description: string;
  images: string[];
};

type Props = {
  galleries: Gallery[];
};
