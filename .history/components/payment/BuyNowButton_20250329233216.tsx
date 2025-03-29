"use client";

import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type Props = {
  product: {
    title: string;
    description?: string;
    price: number;
  };
};

export default function BuyNowButton({ product }: Props) {
  const handleBuyNow = async () => {
    const stripe = await stripePromise;

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product }),
    });

    const data = await res.json();

    if (!res.ok || !data.sessionId) {
      toast.error("Failed to start checkout");
      return;
    }

    const result = await stripe?.redirectToCheckout({
      sessionId: data.sessionId,
    });

    if (result?.error) {
      toast.error(result.error.message || "Redirect failed");
    }
  };

  return (
    <button onClick={handleBuyNow} className="button-custom py-2">
      Buy Now
    </button>
  );
}
