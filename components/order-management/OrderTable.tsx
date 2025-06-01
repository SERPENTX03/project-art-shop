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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Props {
  orders: (OrderItem & { gallery: Gallery; order: Order })[];
}

type FilterStatus = "ALL" | "PENDING" | "SHIPPED" | "DELIVERED";

export function OrderTable({ orders }: Props) {
  const [, startTransition] = useTransition();
  const [filter, setFilter] = useState<FilterStatus>("ALL");

  const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  const [tracking, setTracking] = useState<Record<string, string>>({});

  const isValidFilter = (value: string): value is FilterStatus => {
    return ["ALL", "PENDING", "SHIPPED", "DELIVERED"].includes(value);
  };

  const filteredOrders =
    filter === "ALL"
      ? orders
      : orders.filter((o) => o.deliveryStatus === filter);

  const handleStatusChange = (
    id: string,
    next: "SHIPPED" | "DELIVERED",
    trackingNumber?: string
  ) => {
    startTransition(async () => {
      try {
        await updateDeliveryStatus(id, next, trackingNumber);
        toast.success("อัปเดตสถานะสำเร็จ");
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
          onChange={(e) => {
            const value = e.target.value;
            if (isValidFilter(value)) {
              setFilter(value);
            }
          }}
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
                  <Dialog
                    open={openDialogId === item.id}
                    onOpenChange={(open) =>
                      setOpenDialogId(open ? item.id : null)
                    }
                  >
                    <DialogTrigger asChild>
                      <Button>จัดส่งแล้ว</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>กรอกเลขพัสดุ</DialogTitle>
                      <div className="space-y-2 mt-4">
                        <Input
                          placeholder="Tracking Number"
                          value={tracking[item.id] || ""}
                          onChange={(e) =>
                            setTracking((prev) => ({
                              ...prev,
                              [item.id]: e.target.value,
                            }))
                          }
                        />
                        <Button
                          onClick={() => {
                            if (!tracking[item.id]) {
                              toast.warning("กรุณากรอกเลขพัสดุ");
                              return;
                            }
                            handleStatusChange(
                              item.id,
                              "SHIPPED",
                              tracking[item.id]
                            );
                          }}
                        >
                          ยืนยันจัดส่ง
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
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
