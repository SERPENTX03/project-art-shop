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
import { addtoCart } from "@/actions/card";

interface AddBacketProps {
  gallery: Gallery;
}

const AddBacket = ({ gallery }: AddBacketProps) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  if (!gallery) return null;

  const total = gallery.price * quantity;

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await addtoCart(gallery.id, quantity);
      alert("เพิ่มสินค้าลงในตระกร้าแล้ว");
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาก");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer absolute top-2 right-2 border p-1 rounded-2xl bg-white/40 hover:bg-white/80 transition-colors duration-300 ease-in-out ">
          <SlBasket size={30} className="" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            เพิ่มลงตะกร้า
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            disabled={quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-1 border rounded"
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="px-3 py-1 border rounded"
          >
            +
          </button>
        </div>
        <div className="mt-4 text-lg">ยอดรวม: {total} ฿</div>
        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="mt-4 button-custom py-3"
        >
          {loading ? "กำลังเพิ่ม..." : "เพิ่มสินค้าลงในตระกล้า"}
        </button>
      </DialogContent>
    </Dialog>
  );
};
export default AddBacket;
