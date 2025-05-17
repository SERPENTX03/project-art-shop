"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History } from "lucide-react";
import { useState } from "react";

interface OrderHistoryModalProps {
  orders: {
    id: string;
    total: number;
    status: string;
    createdAt: Date;
    items: {
      id: string;
      quantity: number;
      unitPrice: number;
      gallery: {
        title: string;
      };
    }[];
  }[];
}

export default function OrderHistoryModal({ orders }: OrderHistoryModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex cursor-pointer p-2 hover:bg-gray-200 rounded-2xl items-center gap-2">
          <p>Order History</p>
          <History size={20} />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>🧾 Order History</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-2">
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  Order ID: {order.id}
                </p>
                <p className="text-sm">
                  Status: <span className="font-medium">{order.status}</span>
                </p>
                <p className="text-sm">
                  Total:
                  <span className="text-blue-500 font-semibold">
                    {order.total}฿
                  </span>
                </p>
                <p className="text-sm">
                  Date: {new Date(order.createdAt).toLocaleString()}
                </p>
                <div className="mt-2 space-y-1">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="text-sm text-muted-foreground"
                    >
                      Name {item.gallery.title} x{item.quantity} ={" "}
                      {item.unitPrice * item.quantity}฿
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
