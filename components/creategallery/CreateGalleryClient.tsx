"use client";

import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { toast } from "react-toastify";
import { selectCategories } from "@/data/selectCrerateCategory";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import PreviewImage from "./PreviewImage";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PreviewImageAdmin from "./PreviewImageAdmin";

type Props = {
  serverState: {
    success: boolean;
    message?: string;
    statusCode?: number;
  };
};

export default function CreateGalleryClient({ serverState }: Props) {
  const { register, control } = useFormContext();
  const [shopId, setShopId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchShopId = async () => {
      try {
        const res = await fetch("/api/shop");
        const data = await res.json();

        if (res.ok) {
          setShopId(data.id);
        } else if (res.status === 404) {
          router.push("/create-artist");
        } else {
          toast.error("Unexpected error");
        }
      } catch (error) {
        toast.error(
          `Failed to load shop info: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    };

    fetchShopId();
  }, [router]);

  useEffect(() => {
    if (!serverState.message) return;

    if (serverState.statusCode === 413) {
      toast.error("ขนาดไฟล์ใหญ่เกินไป (จำกัด 5MB)");
    } else if (serverState.success) {
      toast.success(serverState.message);
    } else {
      toast.error(serverState.message);
    }
  }, [serverState]);

  return (
    <>
      <h2 className="text-2xl font-semibold">Create New Gallery</h2>
      <Separator />
      {shopId && <input type="hidden" name="shopId" value={shopId} />}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          placeholder="ชื่อสินค้า"
          id="title"
          {...register("title")}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          placeholder="ใส่รายระเอียดของสินค้า"
          id="description"
          {...register("description")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          placeholder="ราคาสินค้า"
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
              <SelectItem className="uppercase" key={index} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
  <Label htmlFor="imageSize">Image Size (cm)</Label>
  <Input
    id="imageSize"
    type="number"
    step="1"
    placeholder="กรอกขนาดของรูปภาพ (หน่วย: ซม)"
    {...register("imageSize", {
      required: "กรุณากรอกขนาดของรูปภาพ",
      min: {
        value: 1,
        message: "ขนาดต้องมากกว่า 0 ซม",
      },
      max: {
        value: 300,
        message: "ขนาดต้องไม่เกิน 300 ซม",
      },
    })}
  />
</div>



      <PreviewImage />
      <PreviewImageAdmin />
    </>
  );
}
