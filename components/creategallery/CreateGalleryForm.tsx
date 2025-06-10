"use client";

import { useActionState } from "react";
import { useTransition, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { createGallery, FormState } from "@/actions/gallery";
import CreateGalleryClient from "./CreateGalleryClient";
import SubmitButton from "./SubmitButton";
import { toast } from "react-toastify";

export default function CreateGalleryForm() {
  const initialState: FormState = { success: false };
  const [state, formAction] = useActionState(createGallery, initialState);
  const methods = useForm();

  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <FormProvider {...methods}>
      <form
        ref={formRef}
        onSubmit={methods.handleSubmit(() => {
          const formData = new FormData(formRef.current!);

          //  ตรวจขนาดรวมของไฟล์ทั้งหมด
          const maxTotalSize = 20 * 1024 * 1024; // 20MB
          let totalSize = 0;

          for (const [, value] of formData.entries()) {
            if (value instanceof File) {
              totalSize += value.size;
            }
          }

          if (totalSize > maxTotalSize) {
            toast.error("ขนาดไฟล์รวมเกิน 20MB กรุณาลดขนาดก่อนอัปโหลด");
            return;
          }

          //  ถ้าไม่เกินค่อยส่ง
          startTransition(() => {
            formAction(formData);
          });
        })}
        className="mt-16 space-y-6 p-6 max-w-xl mx-auto bg-white rounded-xl shadow"
      >
        <CreateGalleryClient serverState={state} />
        <SubmitButton pending={isPending} />
      </form>
    </FormProvider>
  );
}
