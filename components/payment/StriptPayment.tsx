"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { CartItem } from "@/types/cart";
import { toast } from "react-toastify";
import { useAddressStore } from "@/store/addressStore";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

interface Props {
  items: CartItem[];
  total: number;
}

export default function StripePaymentButton({ items, total }: Props) {
  const { address } = useAddressStore();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    if (!address) {
      toast.error("กรุณาเลือกที่อยู่จัดส่งก่อนทำการชำระเงิน");
      setLoading(false);
      return;
    }

    const stripe = await stripePromise;
    if (!stripe) {
      toast.error("Stripe failed to load. Check your public key.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/payment/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, total, address }),
      });

      const data = await res.json();
      if (!res.ok || !data.sessionId) {
        toast.error("ไม่สามารถเริ่มการชำระเงินได้");
        return;
      }

      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (result?.error) {
        toast.error(result.error.message || "เกิดข้อผิดพลาดขณะ redirect");
      }
    } catch (err) {
      console.error("Stripe Checkout Error:", err);
      toast.error("เกิดข้อผิดพลาดขณะดำเนินการ");
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      className="button-custom h-[50px] w-full"
      onClick={handleCheckout}
      disabled={loading}
    >
      {loading ? "กำลังโหลด..." : "ชำระด้วยบัตรเครดิต"}
    </button>
  );
}
