"use client";

import { OrderItem, Gallery, Order } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { updateDeliveryStatus } from "@/actions/order-management";
import { useTransition, useState } from "react";
import { toast } from "react-toastify";
import { CustomerAddressDialog } from "./AddressDialog";

interface Props {
  orders: (OrderItem & { gallery: Gallery; order: Order })[];
}

export function OrderTable({ orders }: Props) {
  const [, startTransition] = useTransition();
  const [filter, setFilter] = useState<
    "ALL" | "PENDING" | "SHIPPED" | "DELIVERED"
  >("ALL");

  const filteredOrders =
    filter === "ALL"
      ? orders
      : orders.filter((o) => o.deliveryStatus === filter);

  const handleStatusChange = (id: string, next: "SHIPPED" | "DELIVERED") => {
    startTransition(async () => {
      try {
        await updateDeliveryStatus(id, next);
        toast.success(`อัปเดตสถานะเป็น ${next} แล้ว`);
        window.location.reload();
      } catch (err) {
        console.error(err);
        toast.error("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
      }
    });
  };

  const renderStatusBadge = (status: string) => {
    const color =
      status === "PENDING"
        ? "bg-yellow-400"
        : status === "SHIPPED"
        ? "bg-blue-500"
        : "bg-green-500";
    return <Badge className={color}>{status}</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label>กรองสถานะ:</label>
        <select
          className="border rounded px-2 py-1"
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
        >
          <option value="ALL">ทั้งหมด</option>
          <option value="PENDING">รอจัดส่ง</option>
          <option value="SHIPPED">จัดส่งแล้ว</option>
          <option value="DELIVERED">ลูกค้าได้รับแล้ว</option>
        </select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>สินค้า</TableHead>
            <TableHead>ลูกค้า</TableHead>
            <TableHead>จำนวน</TableHead>
            <TableHead>รวม</TableHead>
            <TableHead>สถานะจัดส่ง</TableHead>
            <TableHead>สั่งเมื่อ</TableHead>
            <TableHead>ที่อยู่ลูกค้า</TableHead>

            <TableHead>ดำเนินการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.gallery.title}</TableCell>
              <TableCell>{item.order.shippingFullName}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.quantity * item.unitPrice} ฿</TableCell>
              <TableCell>{renderStatusBadge(item.deliveryStatus)}</TableCell>
              <TableCell>
                {format(new Date(item.order.createdAt), "dd/MM/yyyy HH:mm")}
              </TableCell>
              <TableCell>
                <CustomerAddressDialog order={item.order} />
              </TableCell>

              <TableCell>
                {item.deliveryStatus === "PENDING" && (
                  <Button
                    onClick={() => handleStatusChange(item.id, "SHIPPED")}
                  >
                    จัดส่งแล้ว
                  </Button>
                )}
                {item.deliveryStatus === "SHIPPED" && (
                  <Button
                    variant="outline"
                    onClick={() => handleStatusChange(item.id, "DELIVERED")}
                  >
                    ลูกค้าได้รับแล้ว
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
