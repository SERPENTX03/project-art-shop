"use client";

import { useActionState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";
import { createShop, FormState } from "@/actions/artist";
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
      className="max-w-xl mt-16 mx-auto p-6 bg-white shadow-xl rounded-xl space-y-6 border"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">
        New Your Artist
      </h2>
      <Separator />

      {/* Shop Info */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Shop Name</Label>
          <Input
            id="name"
            placeholder="Enter your shop name"
            {...register("name")}
            required
          />
        </div>

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
      </div>

      {/* Bank Info */}
      <div className="pt-4 space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">
          🏦 Bank Information
        </h3>

        <div className="space-y-2">
          <Label htmlFor="bankName">Bank Name</Label>
          <Input
            id="bankName"
            placeholder="เช่น SCB / KBank"
            {...register("bankName")}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountName">Account Name</Label>
          <Input
            id="accountName"
            placeholder="ชื่อบัญชี (ภาษาไทย)"
            {...register("accountName")}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountNumber">Account Number</Label>
          <Input
            id="accountNumber"
            placeholder="เลขบัญชี"
            type="text"
            {...register("accountNumber")}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="promptpayId">PromptPay (optional)</Label>
          <Input
            id="promptpayId"
            placeholder="เบอร์โทรศัพท์ หรือเลขบัตรประชาชน"
            type="text"
            {...register("promptpayId")}
          />
        </div>
      </div>

      <Separator />

      {/* Submit */}
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
