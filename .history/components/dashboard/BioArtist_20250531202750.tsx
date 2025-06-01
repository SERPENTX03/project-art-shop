"use client";

import { useState } from "react";
import { updateArtistBio } from "@/actions/artist";
import { toast } from "react-toastify";
import { Edit2 } from "lucide-react";

const BioEditor = ({ initialBio }: { initialBio?: string | null }) => {
  const [bio, setBio] = useState(initialBio || "");
  const [isEditing, setIsEditing] = useState(!initialBio); // เริ่มแก้ไขทันทีถ้ายังไม่มี bio

  const handleSave = async () => {
    try {
      await updateArtistBio(bio);
      toast.success("บันทึก Bio สำเร็จแล้ว");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          className="w-full border p-2 rounded"
          placeholder="แนะนำตัว หรือเขียน Bio ที่นี่..."
        />
        <button
          onClick={handleSave}
          className="bg-primary text-white px-4 py-1 rounded"
        >
          Save
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2 group:">
      <p className="text-gray-800 whitespace-pre-line">{bio}</p>
      <button
        onClick={() => setIsEditing(true)}
        className="text-sm text-primary underline"
      >
        <Edit2 />
      </button>
    </div>
  );
};

export default BioEditor;
