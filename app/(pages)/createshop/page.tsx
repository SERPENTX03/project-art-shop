"use client";

import { useActionState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";
import { createShop, FormState } from "@/actions/shop";
import { useRouter } from "next/navigation";

export default function CreateShopForm() {
  const initialState: FormState = { success: false };
  const [state, formAction] = useActionState(createShop, initialState);
  const { register } = useForm();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state.message, state.success]);

  //  redirect เมื่อสร้างสำเร็จ
  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      startTransition(() => {
        router.push("/dashboard");
      });
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  useEffect(() => {
    const fetchShopId = async () => {
      try {
        const res = await fetch("/api/shop");

        const checkShop = res.status;
        if (checkShop !== 404) {
          router.push("/dashboard");
        }
      } catch (error) {
        toast.error(`Failed to load shop info${error instanceof Error}`);
      }
    };

    fetchShopId();
  }, [router]);

  return (
    <form
      action={formAction}
      className="max-w-xl mt-16 mx-auto p-6 bg-white shadow-xl rounded-xl space-y-6"
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
          type="number"
          {...register("phone")}
          required
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="button-custom w-full py-3 mt-4 disabled:opacity-60"
      >
        {isPending ? "Creating..." : "Create Shop"}
      </button>
    </form>
  );
}
