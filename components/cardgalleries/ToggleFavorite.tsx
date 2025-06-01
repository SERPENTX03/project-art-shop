"use client";

import { useEffect, useState, useTransition } from "react";
import { toggleFavorite, isFavorited } from "@/actions/favorite";
import { GrFavorite } from "react-icons/gr";
import { FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import { ImSpinner2 } from "react-icons/im";

const ToggleFavorite = ({ galleryId }: { galleryId: string }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    isFavorited(galleryId)
      .then(setIsFavorite)
      .catch((err) => console.error("Load favorite error", err));
  }, [galleryId]);

  const handleFavorite = async () => {
    startTransition(async () => {
      try {
        const result = await toggleFavorite(galleryId);
        setIsFavorite(result.isFavorite);

        if (result.isFavorite) {
          toast.success("ถูกใจแล้ว ❤️");
        } else {
          toast.info("ยกเลิกถูกใจแล้ว 💔");
        }
      } catch (error) {
        toast.error("เกิดข้อผิดพลาด");
        console.error("Error toggling favorite", error);
      }
    });
  };

  return (
    <div
      onClick={handleFavorite}
      className={`cursor-pointer border p-1 rounded-2xl bg-white/40 hover:bg-white/80 transition-colors duration-300 ease-in-out`}
    >
      {isPending ? (
        <ImSpinner2 size={30} className="animate-spin text-gray-600" />
      ) : isFavorite ? (
        <FaHeart size={30} className="text-red-500" />
      ) : (
        <GrFavorite size={30} />
      )}
    </div>
  );
};

export default ToggleFavorite;
