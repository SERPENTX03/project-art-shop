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
        <button className="p-2 border rounded">🛒</button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">เพิ่มสินค้าลงในตระกร้า</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default AddBacket;
