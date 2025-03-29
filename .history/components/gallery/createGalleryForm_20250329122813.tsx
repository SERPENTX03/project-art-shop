"use client";

import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { createGallery, FormState } from "@/actions/gallery";
import { toast } from "react-toastify";
import { useEffect } from "react";

export default function CreateGalleryForm() {
  const initialState: FormState = { success: false };
  const [state, formAction] = useActionState(createGallery, initialState);
  const { register, handleSubmit } = useForm();

  // แสดง toast เมื่อ state เปลี่ยน
  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          {...register("title")}
          placeholder="Title"
          required
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <input
          id="description"
          {...register("description")}
          placeholder="Description"
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label htmlFor="price">Price</label>
        <input
          id="price"
          {...register("price")}
          placeholder="Price"
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label htmlFor="images">Images (JSON)</label>
        <input
          id="images"
          {...register("images")}
          placeholder='e.g. ["url1", "url2"]'
          required
          className="border p-2 w-full"
        />
      </div>
      <button type="submit" className="button-custom p-2 mt-2">
        Create Gallery
      </button>
    </form>
  );
}
