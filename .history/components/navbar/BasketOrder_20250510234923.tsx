"use client";

import { useEffect, useState } from "react";
import { SlBasket } from "react-icons/sl";
import { getCartItemCount } from "@/actions/card";
import Link from "next/link";

const BasketOrder = () => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const fetchCount = async () => {
      const total = await getCartItemCount();
      setCount(total);
    };
    fetchCount();
  }, []);

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
