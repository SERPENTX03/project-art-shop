"use client";

import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const PreviewImageAdmin = () => {
  const { setValue } = useFormContext();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    const updatedFiles = [...selectedFiles, ...newFiles];
    const updatedPreviews = [...imagePreviews, ...newPreviews];

    setSelectedFiles(updatedFiles);
    setImagePreviews(updatedPreviews);

    // ตั้งค่าลง hidden input
    if (inputRef.current) {
      const dataTransfer = new DataTransfer();
      updatedFiles.forEach((file) => dataTransfer.items.add(file));
      inputRef.current.files = dataTransfer.files;
    }

    setValue("imageAdmin", updatedFiles);
  };

  const handleRemoveImage = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);

    setSelectedFiles(updatedFiles);
    setImagePreviews(updatedPreviews);

    if (inputRef.current) {
      const dataTransfer = new DataTransfer();
      updatedFiles.forEach((file) => dataTransfer.items.add(file));
      inputRef.current.files = dataTransfer.files;
    }

    setValue("imageAdmin", updatedFiles); // ✅ อัปเดต form
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="imageAdmin" className="text-sm font-medium">
        รูปภาพสำหรับ Preview (แสดงในฝั่งแอดมิน)
      </Label>
      <Input
        type="file"
        id="imageAdmin"
        multiple
        accept="image/*"
        onChange={handleImageChange}
      />
      <input ref={inputRef} type="file" name="imageAdmin" multiple hidden />

      {imagePreviews.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {imagePreviews.map((src, index) => (
            <div className="relative" key={index}>
              <Image
                width={100}
                height={100}
                src={src}
                alt={`admin-preview-${index}`}
                className="w-24 h-24 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PreviewImageAdmin;
