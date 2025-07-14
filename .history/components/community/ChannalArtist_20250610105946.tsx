"use client";
import { ArtistProfile } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SlArrowDown } from "react-icons/sl";

interface ArtistsProps {
  artists: ArtistProfile[];
}

const ChannalArtist = ({ artists }: ArtistsProps) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e?.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="absolute right-0 top-0 h-full" ref={dropdownRef}>
      <div
        onClick={handleOpen}
        className="relative  h-full w-[80px] rounded-full flex justify-center items-center text-2xl border border-slate-500"
      >
        <span className="mr-1">CM</span>
        <SlArrowDown size={18} />
      </div>

      <div
        className={`absolute right-0 top-full border border-primary
           p-2 w-[200px] bg-white rounded-xl z-50  transition-all duration-500 ease-in-out
           ${isOpen ? "opacity-100" : "opacity-0"}`}
      >
        <h2 className="text-lg text-center font-semibold text-primary/70 border-b border-primary/80">
          ช่องอื่นๆ
        </h2>
        <ul className="p-2 overflow-y-auto h-50">
          {artists.map((art) => (
            <Link
              href={`/community/${art.id}`}
              key={art.id}
              className="cursor-pointer text-sm flex items-center justify-between py-2 hover:bg-primary/20 px-2 rounded-2xl transition-colors duration-300 ease-in-out"
            >
              {art.name}
              <Image
                src={art.avatar || "/images/default-avatar.png"}
                className="object-cover rounded-full"
                alt="avatar-artist"
                width={40}
                height={40}
                priority
              />
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default ChannalArtist;
