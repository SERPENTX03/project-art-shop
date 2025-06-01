"use client";

import { useRef, useState } from "react";
import { createPost } from "@/actions/post";
import { toast } from "react-toastify";
import { ImageUpIcon } from "lucide-react";
import { GrEmoji } from "react-icons/gr";

const CreatePostBar = () => {
  const [content, setContent] = useState("");
  const [isPending, setIsPending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!content.trim() && !fileInputRef.current?.files?.length) {
      toast.error("กรุณากรอกข้อความหรือเลือกรูปภาพ");
      return;
    }

    const formData = new FormData();
    formData.append("content", content);
    const files = fileInputRef.current?.files || [];
    for (const file of files) formData.append("images", file);

    try {
      setIsPending(true);
      await createPost(formData);
      toast.success("โพสต์เรียบร้อยแล้ว");
      setContent("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error(err);
      toast.error("โพสต์ไม่สำเร็จ");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4">
      <div className="flex px-6 py-2 relative justify-between border border-slate-500 h-20 rounded-full bg-white shadow">
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          className="hidden"
          ref={fileInputRef}
        />

        <div className="flex items-center border-l border-primary/50 h-full">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="SENT MESSAGE"
            className="ml-3 outline-none bg-transparent text-sm w-full"
          />
        </div>

        <div className="text-primary/50 space-x-4 flex items-center">
          <div className="w-px h-full bg-primary/50"></div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="แนบรูปภาพ"
          >
            <ImageUpIcon size={24} />
          </button>
          <button type="button" title="ใส่อีโมจิ (เร็ว ๆ นี้)">
            <GrEmoji size={24} />
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="ml-2 bg-primary text-white text-sm px-3 py-1 rounded-full hover:bg-primary/80 transition"
          >
            {isPending ? "โพสต์..." : "โพสต์"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostBar;
