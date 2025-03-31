"use client";

import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createShop, FormState } from "@/actions/create-shop-action";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";

export default function CreateShopForm() {
  const initialState: FormState = { success: false };
  const [state, formAction] = useActionState(createShop, initialState);
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    if (state.message) {
      state.success ? toast.success(state.message) : toast.error(state.message);
    }
  }, [state]);

  return (
    <form
      action={formAction}
      className="max-w-xl mx-auto p-6 bg-white shadow-xl rounded-xl space-y-6"
    >
      <h2 className="text-2xl font-bold text-center">Create Your Shop</h2>
      <Separator />

      {/* Shop Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Shop Name</Label>
        <Input
          id="name"
          placeholder="Enter your shop name"
          {...register("name")}
          required
        />
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          placeholder="08XXXXXXXX"
          type="tel"
          {...register("phone")}
          required
        />
      </div>

      <button type="submit" className="button-custom w-full py-3 mt-4">
        Create Shop
      </button>
    </form>
  );
}
