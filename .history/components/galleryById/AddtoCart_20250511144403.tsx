"use client";

import { useState } from "react";
import { addtoCart } from "@/actions/cart";
import { toast } from "react-toastify";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { SlPlus, SlMinus } from "react-icons/sl";

interface AddToCartProps {
  galleryId: string;
  maxQuantity: number;
}

const AddToCart = ({ galleryId, maxQuantity }: AddToCartProps) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const remainingQuantity = maxQuantity - quantity;

  const handleAddToCart = async () => {
    if (quantity > maxQuantity) {
      toast.error(`สินค้ามีเพียง ${maxQuantity} ชิ้นเท่านั้น`);
      return;
    }

    setLoading(true);
    try {
      await addtoCart(galleryId, quantity);
      useCartStore.getState().increment(quantity);
      router.refresh();
      toast.success("เพิ่มสินค้าลงในตะกร้าแล้ว");
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  const incrementQuantity = () => {
    if (quantity >= maxQuantity) {
      toast.warning(`สินค้ามีเพียง ${maxQuantity} ชิ้นเท่านั้น`);
      return;
    }
    setQuantity((q) => q + 1);
  };

  const decrementQuantity = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-gray-500">
          สินค้าคงเหลือ: {maxQuantity} ชิ้น
        </div>
        <div className="text-sm text-gray-500">
          เหลือหลังเพิ่ม: {Math.max(0, remainingQuantity)} ชิ้น
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center border rounded-md">
          <button
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <SlMinus size={16} />
          </button>
          <div className="px-3 min-w-[40px] text-center">{quantity}</div>
          <button
            onClick={incrementQuantity}
            disabled={quantity >= maxQuantity}
            className="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <SlPlus size={16} />
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={loading || quantity > maxQuantity}
          className="button-custom h-[50px] flex-1 px-2 flex items-center justify-center"
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
              กำลังเพิ่ม...
            </span>
          ) : (
            "เพิ่มลงตะกร้า"
          )}
        </button>
      </div>
    </div>
  );
};

export default AddToCart;
