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
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาก");
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
          <DialogTitle className="text-2xl">เพิ่มสินค้าลงในตระกร้า</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default AddBacket;
