"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gallery, Order, OrderItem, ReturnStatus } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";

interface ReturnOrderItem extends OrderItem {
  gallery: Gallery;
  order: Order;
}

interface ReturnProps {
  orders: ReturnOrderItem[];
}

const ReturnOrderTable = ({ orders }: ReturnProps) => {
  const [selectedItem, setSelectedItem] = useState<ReturnOrderItem | null>(
    null
  );

  const handleApprove = (id: string) => {
    console.log("✅ APPROVED", id);
    // TODO: call server action to set returnStatus = APPROVED
  };

  const handleReject = (id: string) => {
    console.log("❌ REJECTED", id);
    // TODO: call server action to set returnStatus = REJECTED
  };

  const returnRequested = orders.filter(
    (item) => item.returnStatus === "REQUESTED"
  );

  if (returnRequested.length === 0) {
    return <p className="text-muted-foreground">ไม่มีรายการขอคืนสินค้า</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-muted text-left">
            <th className="p-2">สินค้า</th>
            <th className="p-2">เหตุผล</th>
            <th className="p-2">วันที่สั่ง</th>
            <th className="p-2">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {returnRequested.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-2">{item.gallery.title}</td>
              <td className="p-2">{item.returnReason}</td>
              <td className="p-2">
                {new Date(item.order.createdAt).toLocaleDateString()}
              </td>
              <td className="p-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedItem(item)}
                    >
                      ดูรายละเอียด
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl">
                    <DialogHeader>
                      <DialogTitle>รายละเอียดการขอคืน</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-2">
                      <p>
                        <strong>สินค้า:</strong> {selectedItem?.gallery.title}
                      </p>
                      <p>
                        <strong>หมายเหตุ:</strong>{" "}
                        {selectedItem?.returnNote || "-"}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedItem?.returnImages.map((url, index) => (
                          <Image
                            key={index}
                            src={url}
                            alt={`return image ${index}`}
                            width={100}
                            height={100}
                            className="object-cover rounded border"
                          />
                        ))}
                      </div>
                    </div>

                    <DialogFooter className="mt-4">
                      <Button
                        variant="destructive"
                        onClick={() => handleReject(selectedItem!.id)}
                      >
                        ปฏิเสธ
                      </Button>
                      <Button onClick={() => handleApprove(selectedItem!.id)}>
                        อนุมัติ
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReturnOrderTable;
