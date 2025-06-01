"use client";

import { createPost } from "@/actions/post";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

export default function CreatePostForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    setIsPending(true);

    try {
      const result = await createPost(formData);
      toast.success(result.message);
      formRef.current.reset();
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด");
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <textarea
        name="content"
        placeholder="เขียนโพสต์ของคุณที่นี่..."
        className="w-full border p-2 rounded"
        required
      />
      <input type="file" name="images" accept="image/*" multiple required />
      <button
        type="submit"
        disabled={isPending}
        className="bg-primary text-white px-4 py-2 rounded"
      >
        {isPending ? "กำลังโพสต์..." : "สร้างโพสต์"}
      </button>
    </form>
  );
}
