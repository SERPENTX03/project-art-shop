"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { selectCategories } from "@/utils/selectCrerateCategory";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import SubmitButton from "./SubmitButton";
import Image from "next/image";

type Props = {
  serverState: {
    success: boolean;
    message?: string;
  };
};

export default function CreateGalleryClient({ serverState }: Props) {
  const { register, control, setValue } = useForm();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (serverState.message) {
      serverState.success
        ? toast.success(serverState.message)
        : toast.error(serverState.message);
    }
  }, [serverState]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const previewsUrls = fileArray.map((file) => URL.createObjectURL(file));

    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setValue("images", (prev: File[] = []) => [...prev, ...newFiles]);
  };

  return (
    <>
      <h2 className="text-2xl font-semibold">Create New Gallery</h2>
      <Separator />

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register("title")} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" {...register("description")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          {...register("price")}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Controller
          name="quantity"
          control={control}
          defaultValue="1"
          render={({ field }) => (
            <>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select quantity" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={String(num)}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" name="quantity" value={field.value} />
            </>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryIds">Categories</Label>
        <Select {...register("categoryIds")}>
          <SelectTrigger className="border p-2 rounded w-full h-32">
            <SelectValue placeholder="Select categories" />
          </SelectTrigger>
          <SelectContent>
            {selectCategories.map((cat, index) => (
              <SelectItem key={index} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Hold <kbd>Ctrl</kbd> or <kbd>Cmd</kbd> to select multiple
        </p>
      </div>

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
              <Image
                width={100}
                height={100}
                key={index}
                src={src}
                alt={`preview-${index}`}
                className="w-24 h-24 object-cover rounded border"
              />
            ))}
          </div>
        )}
      </div>

      <SubmitButton />
    </>
  );
}
function setValue(arg0: string, files: FileList) {
  throw new Error("Function not implemented.");
}
