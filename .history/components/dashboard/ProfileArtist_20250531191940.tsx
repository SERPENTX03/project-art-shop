"use client";

import { uploadArtistAvatar } from "@/actions/artist";
import { Edit } from "lucide-react";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";

const ProfileArtist = ({ initialAvatar }: { initialAvatar: string | null }) => {
  const [avatarUrl, setAvatarUrl] = useState(
    initialAvatar || "/default-avatar.png"
  );

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

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-32 h-32 rounded-full overflow-hidden border">
        <Image
          src={avatarUrl}
          alt="Artist Avatar"
          fill
          className="object-cover"
        />
      </div>

      <form onSubmit={handleUpload} className="flex flex-col gap-2">
        <input type="file" name="avatar" accept="image/*" required />
        <button type="submit" className="cursor-pointer">
          <Edit />
        </button>
      </form>
    </div>
  );
};

export default ProfileArtist;
