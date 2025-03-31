"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { DownloadIcon, History } from "lucide-react";
import { addDays, isWithinInterval } from "date-fns";

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
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({ from: addDays(new Date(), -30), to: new Date() });

  const filteredOrders = orders.filter((order) => {
    return isWithinInterval(new Date(order.createdAt), {
      start: dateRange.from,
      end: dateRange.to,
    });
  });

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
              <History className="w-4 h-4 mr-2" /> View History
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogTitle>Order History</DialogTitle>
            <div className="my-4">
              <Label className="mb-2 block">Filter by Date</Label>
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range: any) => {
                  if (range?.from && range?.to) {
                    setDateRange({ from: range.from, to: range.to });
                  }
                }}
                numberOfMonths={2}
              />
            </div>

            {filteredOrders.map((order) => (
              <div key={order.id} className="mb-4 p-4 border rounded">
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
        orders.map((order) => (
          <div
            key={order.id}
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

            {order.items.map((item, index) => (
              <div key={index} className="flex gap-4 items-center">
                <Image
                  src={item.gallery.images[0]}
                  alt={item.gallery.title}
                  width={1200}
                  height={800}
                  className="rounded object-cover w-[80px] h-[80px]"
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
