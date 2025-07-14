"use client";

import { useState } from "react";
import { addtoCart } from "@/actions/cart";
import { toast } from "react-toastify";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { SlBasket } from "react-icons/sl";
import { Gallery } from "@/types/gallery";

interface AddToCartProps {
  gallery: Gallery;
}

const AddToCart = ({ gallery }: AddToCartProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const maxQuantity = gallery.quantity;

  const handleAddToCart = async () => {
    // ตรวจสอบถ้าสินค้าหมด
    if (maxQuantity <= 0) {
      toast.error("ขออภัย สินค้าหมด");
      return;
    }

    // ป้องกันการกดซ้ำ
    if (loading) return;

    setLoading(true);
    try {
      // เพิ่มสินค้า 1 ชิ้นเสมอ
      await addtoCart(gallery.id, 1);
      useCartStore.getState().increment(1);
      router.refresh();
      toast.success("เพิ่มสินค้าลงในตะกร้าแล้ว");
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      // รอสักครู่ก่อนที่จะให้กดปุ่มได้อีกครั้ง เพื่อป้องกันการกดซ้ำ
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading || maxQuantity <= 0}
      className={`button-custom h-[50px] w-full flex items-center justify-center gap-2 ${
        maxQuantity <= 0 ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </span>
      ) : (
        <>
          <SlBasket size={18} />
          <span>เพิ่มลงตะกร้า</span>
        </>
      )}
    </button>
  );
};

export default AddToCart;
