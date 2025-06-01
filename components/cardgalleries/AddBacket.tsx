"use client";
import { SlBasket } from "react-icons/sl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Gallery } from "@/types/gallery";
import { useState } from "react";
import { addtoCart } from "@/actions/cart";
import { toast } from "react-toastify";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";

interface AddBacketProps {
  gallery: Gallery;
}

const AddBacket = ({ gallery }: AddBacketProps) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const maxQuantity = gallery.quantity;

  if (!gallery) return null;

  const total = gallery.price * quantity;
  const remainingQuantity = maxQuantity - quantity;

  const handleAddToCart = async () => {
    if (quantity > maxQuantity) {
      toast.error(`สินค้ามีเพียง ${maxQuantity} ชิ้นเท่านั้น`);
      return;
    }

    setLoading(true);
    try {
      await addtoCart(gallery.id, quantity);
      useCartStore.getState().increment(quantity);
      router.refresh();
      toast.success("เพิ่มสินค้าลงในตระกร้าแล้ว");
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer border p-1 rounded-2xl bg-white/40 hover:bg-white/80 transition-colors duration-300 ease-in-out">
          <SlBasket size={30} />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            เพิ่มลงตะกร้า
          </DialogTitle>
        </DialogHeader>
        <div className="text-center text-sm text-gray-500 mt-1">
          สินค้าคงเหลือ: {maxQuantity} ชิ้น
        </div>
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            disabled={quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-1 border rounded"
          >
            <span className="text-3xl">-</span>
          </button>
          <span>{quantity}</span>
          <button
            onClick={incrementQuantity}
            className="px-3 py-1 border rounded"
          >
            <span className="text-3xl">+</span>
          </button>
        </div>
        <div className="mt-2 text-sm text-center">
          จำนวนที่เหลือหลังเพิ่มตะกร้า: {Math.max(0, remainingQuantity)} ชิ้น
        </div>
        <div className="mt-4 text-lg">ยอดรวม: {total} ฿</div>

        <button
          onClick={handleAddToCart}
          disabled={loading || quantity > maxQuantity}
          className={`mt-4 button-custom py-3 ${
            quantity > maxQuantity ? "opacity-50" : ""
          }`}
        >
          {loading ? "กำลังเพิ่ม..." : "เพิ่มสินค้าลงในตระกล้า"}
        </button>
      </DialogContent>
    </Dialog>
  );
};
export default AddBacket;
