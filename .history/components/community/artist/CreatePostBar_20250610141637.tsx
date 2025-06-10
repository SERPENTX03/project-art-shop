"use client";

import { useRef, useState } from "react";
import { createPost } from "@/actions/post";
import { toast } from "react-toastify";
import { ImageUpIcon } from "lucide-react";
import { GrEmoji } from "react-icons/gr";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import CreatePollDialog from "./CreatePollDialog";
import { Button } from "@/components/ui/button";

//  Load Emoji Picker dynamically (เพราะ next/image)
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function CreatePostBar() {
  const [content, setContent] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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
      router.refresh();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error(err);
      toast.error("โพสต์ไม่สำเร็จ");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 w-full max-w-[1600px] z-50 px-10">
      <div className="flex px-6 py-2 relative justify-between border border-slate-500 h-20 rounded-full bg-white shadow">
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          className="hidden"
          ref={fileInputRef}
        />

        <div className="flex w-full items-center border-l border-primary/50 h-full">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="SENT MESSAGE"
            className=" ml-3 outline-none bg-transparent text-xl  h-[80%] w-full"
          />
        </div>

        <div className="text-primary/50 space-x-4 flex items-center">
          <div className="w-px h-full bg-primary/50"></div>

          {/* 📤 Upload image */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="แนบรูปภาพ"
          >
            <ImageUpIcon size={24} />
          </button>

          {/* 😁 Emoji Picker Toggle */}
          <div className="relative">
            <button
              type="button"
              title="ใส่อีโมจิ"
              onClick={() => setShowEmoji((prev) => !prev)}
            >
              <GrEmoji size={24} />
            </button>

            {showEmoji && (
              <div className="absolute bottom-12 right-0 z-50">
                <EmojiPicker
                  onEmojiClick={(e) => {
                    setContent((prev) => prev + e.emoji);
                    setShowEmoji(false);
                  }}
                  height={350}
                  width={300}
                  lazyLoadEmojis
                />
              </div>
            )}
          </div>

          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "โพสต์..." : "โพสต์"}
          </Button>
          <CreatePollDialog />
        </div>
      </div>
    </div>
  );
}
