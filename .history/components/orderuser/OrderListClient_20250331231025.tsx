"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { DownloadIcon, History } from "lucide-react";

interface OrderItem {
  gallery: {
    id: string;
    title: string;
    images: string[];
  };
  quantity: number;
  unitPrice: number;
}

interface OrderProps {
  id: string;
  createdAt: string | Date;
  total: number;
  status: string;
  items: OrderItem[];
}

interface OrderListClientProps {
  orders: OrderProps[];
}

export default function OrderListClient({ orders }: OrderListClientProps) {
  const downloadImage = async (url: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const objectURL = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectURL;
    link.download = "gallery-image.jpg";
    link.click();
    URL.revokeObjectURL(objectURL);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">📦 Your Orders</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <History className="w-4 h-4 mr-2" /> View Purchase History
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogTitle className="text-lg font-semibold mb-4">
              🧾 All Orders
            </DialogTitle>
            {orders.map((order, i) => (
              <div key={i} className="mb-4 p-4 border rounded">
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>Total:</strong> {order.total}฿
                </p>
                <p>
                  <strong>Status:</strong> {order.status}
                </p>
              </div>
            ))}
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      {orders.length === 0 ? (
        <p className="text-muted-foreground">No orders yet.</p>
      ) : (
        orders.map((order, i) => (
          <div
            key={i}
            className="border p-4 rounded-lg shadow space-y-4 bg-white"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">🧾 Order ID: {order.id}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <p className="font-semibold text-blue-600">{order.total}฿</p>
            </div>

            {order.items.map((item, idx: number) => (
              <div key={idx} className="flex gap-4 items-center">
                <Image
                  src={item.gallery.images[0]}
                  alt={item.gallery.title}
                  width={80}
                  height={80}
                  className="rounded object-cover"
                />
                <div className="flex-1">
                  <p className="font-semibold">{item.gallery.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => downloadImage(item.gallery.images[0])}
                >
                  <DownloadIcon className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
