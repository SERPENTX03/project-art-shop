"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Gallery, Order, OrderItem } from "@prisma/client";
import Image from "next/image";
import { useState, useTransition } from "react";
import { progressReturnStatus, rejectReturnWithNote } from "@/actions/return";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface ReturnOrderItem extends OrderItem {
  gallery: Gallery;
  order: Order;
}

interface ReturnProps {
  orders: ReturnOrderItem[];
}

const statusLabels: Record<string, string> = {
  REQUESTED: "รอการอนุมัติ",
  APPROVED: "ร้านอนุมัติแล้ว",
  RECEIVED: "ร้านได้รับสินค้าแล้ว",
  REFUNDED: "คืนเงินแล้ว",
  REJECTED: "ถูกปฏิเสธ",
};

const ReturnOrderTable = ({ orders }: ReturnProps) => {
  const [note, setNote] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleApprove = (id: string) => {
    startTransition(() => {
      progressReturnStatus(id)
        .then(() => {
          toast.success("สถานะได้ถูกอัปเดตขั้นถัดไปแล้ว");
          router.refresh();
        })
        .catch(() => toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่"));
    });
  };

  const handleReject = (id: string) => {
    if (!note[id]?.trim()) {
      toast.warning("กรุณาระบุหมายเหตุในการปฏิเสธ");
      return;
    }

    startTransition(() => {
      rejectReturnWithNote(id, note[id])
        .then(() => {
          toast.success("ปฏิเสธการคืนสินค้าเรียบร้อยแล้ว");
          router.refresh();
        })
        .catch(() => toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่"));
    });
  };

  const visibleReturns = orders.filter(
    (item) =>
      item.returnStatus &&
      item.returnStatus !== "REFUNDED" &&
      item.returnStatus !== "REJECTED"
  );

  if (visibleReturns.length === 0) {
    return <p className="text-muted-foreground">ไม่มีรายการขอคืนสินค้า</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>สินค้า</TableHead>
            <TableHead>เหตุผล</TableHead>
            <TableHead>สถานะ</TableHead>
            <TableHead>แนบรูป</TableHead>
            <TableHead>ดำเนินการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visibleReturns.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.gallery.title}</TableCell>
              <TableCell>{item.returnReason}</TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {statusLabels[item.returnStatus ?? "REQUESTED"]}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {item.returnImages.map((url, i) => (
                    <Image
                      key={i}
                      src={url}
                      alt={`img-${i}`}
                      width={60}
                      height={60}
                      className="rounded border object-cover"
                    />
                  ))}
                </div>
              </TableCell>
              <TableCell className="space-y-2">
                <div className="space-y-1">
                  <Textarea
                    placeholder="หมายเหตุถ้าปฏิเสธ"
                    value={note[item.id] || ""}
                    onChange={(e) =>
                      setNote((prev) => ({
                        ...prev,
                        [item.id]: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    disabled={isPending}
                    onClick={() => handleReject(item.id)}
                  >
                    ปฏิเสธ
                  </Button>
                  <Button
                    disabled={isPending}
                    onClick={() => handleApprove(item.id)}
                  >
                    ขั้นถัดไป
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReturnOrderTable;
