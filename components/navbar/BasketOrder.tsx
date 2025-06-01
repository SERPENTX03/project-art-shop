"use client";

import { useEffect } from "react";
import { SlBasket } from "react-icons/sl";
import { getCartItemCount } from "@/actions/cart";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

const BasketOrder = () => {
  const count = useCartStore((state) => state.count);
  const setCount = useCartStore((state) => state.setCount);

  useEffect(() => {
    const fetchCount = async () => {
      const total = await getCartItemCount();
      setCount(total ?? 0);
    };
    fetchCount();
  }, [setCount]);

  return (
    <Link
      href="/cart"
      className="relative p-2 hover:bg-gray-200 cursor-pointer rounded-full transition-colors"
    >
      <SlBasket size={25} className="text-gray-700" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary h-5 w-5 rounded-full text-white flex items-center justify-center text-xs font-medium">
          {count}
        </span>
      )}
    </Link>
  );
};

export default BasketOrder;
