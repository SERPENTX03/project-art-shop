"use client";

import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { createGallery, FormState } from "@/actions/gallery";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { selectCategories } from "@/utils/selectCrerateCategory";

export default function CreateGalleryForm() {
  const initialState: FormState = { success: false };
  const [state, formAction] = useActionState(createGallery, initialState);
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    if (state.message) {
      state.success ? toast.success(state.message) : toast.error(state.message);
    }
  }, [state]);

  return (
    <form
      action={formAction}
      className="space-y-6 p-6 max-w-xl mx-auto bg-white rounded-xl shadow"
    >
      <h2 className="text-2xl font-semibold">Create New Gallery</h2>
      <Separator />

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register("title")} required />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" {...register("description")} />
      </div>

      {/* Price */}
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

      {/* Quantity */}
      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <div className="border p-2 rounded w-full">
          <div id="quantity">
            <Select {...register("quantity")}>
              {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <Label htmlFor="categoryIds">Categories</Label>
        <Select {...register("categoryIds")}>
          <SelectTrigger
            id="categoryIds"
            className="border p-2 rounded w-full h-32"
          >
            <SelectValue placeholder="Select categories" />
          </SelectTrigger>
          <SelectContent>
            {selectCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Hold <kbd>Ctrl</kbd> or <kbd>Cmd</kbd> to select multiple
        </p>
      </div>

      {/* Images */}
      <div className="space-y-2">
        <Label htmlFor="images">Upload Images</Label>
        <Input
          type="file"
          id="images"
          {...register("images")}
          multiple
          accept="image/*"
        />
      </div>

      <button type="submit" className="button-custom w-full">
        Create Gallery
      </button>
    </form>
  );
}
