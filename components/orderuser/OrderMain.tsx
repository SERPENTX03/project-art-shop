// components/order/OrderMain.tsx
"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import ViewHistory from "./ViewHistory";
import OrderList from "./OrderList";
import Pagination from "./Pagination";

interface OrderItem {
  gallery: {
    id: string;
    title: string;
    images: string[];
  };
  quantity: number;
  unitPrice: number;
}

export interface OrderProps {
  id: string;
  createdAt: string | Date;
  total: number;
  status: string;
  items: OrderItem[];
}

interface OrderListClientProps {
  orders: OrderProps[];
}

export default function OrderMain({ orders }: OrderListClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const totalPages = Math.ceil(orders.length / pageSize);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">\ud83d\udce6 Your Orders</h1>
        <ViewHistory orders={orders} />
      </div>

      <Separator />

      <OrderList orders={paginatedOrders} />

      {orders.length > pageSize && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
