"use client";
import { SlBasket } from "react-icons/sl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import { addToCart, getCart } from "@/actions/card";

type Gallery = {
  id: string;
  title: string;
  description: string | null;
  images: string[];
  price: number;
};

type Props = {
  galleries: Gallery[];
};

const AddBacket = async ({ galleries }: Props) => {
  const { userId } = await auth();
  if (!userId) {
    notFound();
  }

  const cart = await getCart();
  const itemCount =
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer absolute top-2 right-2 border p-1 rounded-2xl bg-white/40 hover:bg-white/80 transition-colors duration-300 ease-in-out relative">
          <SlBasket size={30} className="" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center">
              {itemCount > 9 ? "9+" : itemCount}
            </span>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">เพิ่มสินค้าลงในตระกร้า</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {galleries.map((gallery) => (
            <GalleryCard
              key={gallery.id}
              gallery={gallery}
              //   userId={userId}
            />
          ))}
        </div>

        {cart?.items.length > 0 && (
          <div className="sticky bottom-0 bg-white p-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-bold">รวมทั้งหมด:</span>
              <span className="font-bold">
                {cart.items
                  .reduce(
                    (sum, item) => sum + item.gallery.price * item.quantity,
                    0
                  )
                  .toLocaleString()}{" "}
                บาท
              </span>
            </div>
            <Button className="w-full mt-2">ดำเนินการชำระเงิน</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const GalleryCard = ({ gallery }: { gallery: Gallery }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    await addToCart(gallery.id, quantity);
  };

  return (
    <div className="border rounded-lg p-4 flex gap-4">
      <div className="relative w-24 h-24">
        <Image
          src={gallery.images[0]}
          alt={gallery.title}
          fill
          className="object-cover rounded"
        />
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{gallery.title}</h3>
        <p className="text-gray-500 text-sm line-clamp-2">
          {gallery.description}
        </p>
        <p className="font-bold mt-1">{gallery.price.toLocaleString()} บาท</p>

        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center border rounded">
            <button
              className="px-2 py-1"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            >
              -
            </button>
            <span className="px-2">{quantity}</span>
            <button
              className="px-2 py-1"
              onClick={() => setQuantity((prev) => prev + 1)}
            >
              +
            </button>
          </div>
          <Button size="sm" onClick={handleAddToCart}>
            เพิ่มลงตะกร้า
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddBacket;
