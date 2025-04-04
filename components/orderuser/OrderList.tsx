"use client";

import Image from "next/image";
import DownloadDropdown from "./DownloadDropdown";

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

interface OrderListProps {
  orders: OrderProps[];
}

export default function OrderList({ orders }: OrderListProps) {
  if (orders.length === 0) {
    return <p className="text-muted-foreground">No orders yet.</p>;
  }

  return (
    <>
      {orders.map((order, i) => (
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

          {order.items.map((item, idx) => (
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
              <DownloadDropdown
                imageUrl={item.gallery.images[0]}
                title={item.gallery.title}
              />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
