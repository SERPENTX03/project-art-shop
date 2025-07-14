"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { Pencil } from "lucide-react";
import { uploadArtistAvatar } from "@/actions/artist";

const ProfileArtist = ({ initialAvatar }: { initialAvatar: string | null }) => {
  const [avatarUrl, setAvatarUrl] = useState(
    initialAvatar || "/images/default-avatar.png"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClickEdit = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const url = await uploadArtistAvatar(formData);
      setAvatarUrl(url);
      toast.success("อัปโหลดสำเร็จแล้ว");
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาดในการอัปโหลด");
    }
  };

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-16 h-16">
        <Image
          src={avatarUrl}
          alt="Artist Avatar"
          fill
          className="object-cover rounded-full border"
        />

        {/* 🔘 ปุ่ม Edit icon ที่มุมขวาล่าง */}
        <button
          type="button"
          onClick={handleClickEdit}
          className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow hover:bg-gray-100 transition"
        >
          <div className="group relative">
            <Pencil size={14} className="text-gray-600" />
            <p
              className="whitespace-nowrap absolute left-full bg-primary text-gray-100 p-1 text-[10px] rounded-2xl
              opacity-0 group-hover:opacity-100 duration-500 transition-all ease-in-out"
            >
              Edit Profile
            </p>
          </div>
        </button>

        {/* 👇 input ซ่อน */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default ProfileArtist;
