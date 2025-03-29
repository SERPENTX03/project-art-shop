"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Image from "next/image";

const PreviewImage = () => {
  const { setValue } = useForm();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setValue("images", (prev: File[] = []) => [...prev, ...newFiles]);
  };

  const handleRemoveImage = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);

    setSelectedFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
    setValue("images", updatedFiles);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="images">Upload Images</Label>
      <Input
        type="file"
        id="images"
        multiple
        accept="image/*"
        onChange={handleImageChange}
      />
      {imagePreviews.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {imagePreviews.map((src, index) => (
            <div>
              <Image
                width={100}
                height={100}
                key={index}
                src={src}
                alt={`preview-${index}`}
                className="w-24 h-24 object-cover rounded border"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default PreviewImage;
