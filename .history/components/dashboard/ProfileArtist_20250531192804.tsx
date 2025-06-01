"use client";

import Image from "next/image";
import { FormEvent, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Pencil } from "lucide-react";
import { uploadArtistAvatar } from "@/actions/artist";

const ProfileArtist = ({ initialAvatar }: { initialAvatar: string | null }) => {
  const [avatarUrl, setAvatarUrl] = useState(
    initialAvatar || "/images/default-avatar.png"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    try {
      const url = await uploadArtistAvatar(form);
      setAvatarUrl(url);
      toast.success("อัปโหลดสำเร็จแล้ว");
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาดในการอัปโหลด");
    }
  };

  const handleClickEdit = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center gap-6">
      <form onSubmit={handleUpload} className="relative w-16 h-16">
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
          className=" absolute bottom-1 right-1 bg-white p-1 rounded-full shadow hover:bg-gray-100 transition"
        >
          <div className="group relative">
            <Pencil size={14} className="text-gray-600" />
            <p className="whitespace-nowrap absolute left-full bg-black">
              Edit Profile
            </p>
          </div>
        </button>

        {/* 🔘 Input ซ่อน */}
        <input
          ref={fileInputRef}
          type="file"
          name="avatar"
          accept="image/*"
          className="hidden"
          onChange={() => {
            if (fileInputRef.current?.files?.[0]) {
              const formData = new FormData();
              formData.append("avatar", fileInputRef.current.files[0]);
              handleUpload({
                preventDefault: () => {},
                currentTarget: { ...fileInputRef.current.form },
              } as any);
            }
          }}
        />
      </form>
    </div>
  );
};

export default ProfileArtist;
