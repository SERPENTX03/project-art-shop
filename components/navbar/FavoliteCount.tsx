"use client";

import { useEffect } from "react";
import Link from "next/link";
import { GrFavorite } from "react-icons/gr";
import { useFavoriteStore } from "@/store/favoriteStore";
import { getMyFavoriteCount } from "@/actions/favorite";

const FavoliteCount = () => {
  const { count, setCount } = useFavoriteStore();

  useEffect(() => {
    getMyFavoriteCount()
      .then(setCount)
      .catch((err) => console.error("Failed to fetch favorite count", err));
  }, [setCount]);

  return (
    <Link
      href="/favorites"
      className="relative p-2 hover:bg-gray-200 cursor-pointer rounded-full transition-colors"
    >
      <GrFavorite size={25} className="text-gray-700" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary h-5 w-5 rounded-full text-white flex items-center justify-center text-xs font-medium">
          {count}
        </span>
      )}
    </Link>
  );
};

export default FavoliteCount;
