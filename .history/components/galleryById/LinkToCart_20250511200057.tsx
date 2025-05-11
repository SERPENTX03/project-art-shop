"use client";
import Link from "next/link";

const LinkToCart = ({ id }: { id: string }) => {
  return (
    <Link
      className="button-custom h-[50px] w-full flex items-center justify-center"
      onClick={() => localStorage.setItem("selectedCartItemId", id)}
      href="/cart"
    >
      สั่งสินค้า
    </Link>
  );
};
export default LinkToCart;
