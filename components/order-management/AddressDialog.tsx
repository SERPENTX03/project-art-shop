"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Order } from "@prisma/client";

interface Props {
  order: Order;
}

export function CustomerAddressDialog({ order }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">ดูที่อยู่</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ที่อยู่ลูกค้า</DialogTitle>
        </DialogHeader>
        <div className="space-y-1 text-sm">
          <p>
            <strong>ชื่อ:</strong> {order.shippingFullName}
          </p>
          <p>
            <strong>เบอร์โทร:</strong> {order.shippingPhone}
          </p>
          <p>
            <strong>ที่อยู่:</strong> {order.shippingAddressLine},{" "}
            {order.shippingSubDistrict}, {order.shippingDistrict},{" "}
            {order.shippingProvince}, {order.shippingPostalCode}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
