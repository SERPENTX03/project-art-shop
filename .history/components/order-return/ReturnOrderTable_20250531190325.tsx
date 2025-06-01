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
import {
  progressReturnStatus,
  rejectReturnWithNote,
} from "@/actions/return-order";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "REQUESTED":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-blue-100 text-blue-800";
      case "RECEIVED":
        return "bg-purple-100 text-purple-800";
      case "REFUNDED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>สินค้า</TableHead>
            <TableHead>เหตุผล</TableHead>
            <TableHead className="text-center">สถานะ</TableHead>
            <TableHead className="text-center">แนบรูป</TableHead>
            <TableHead>ดำเนินการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visibleReturns.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.gallery.title}</TableCell>
              <TableCell>{item.returnReason}</TableCell>
              <TableCell className="text-center">
                <Badge
                  className={getStatusColor(item.returnStatus ?? "REQUESTED")}
                >
                  {statusLabels[item.returnStatus ?? "REQUESTED"]}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">ดูรูปภาพ</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>รูปภาพที่แนบมา</DialogTitle>

                    <Image
                      key={item.id}
                      className="object-cover border rounded"
                      src={item.returnImages[0]}
                      alt={item.gallery.title}
                      height={500}
                      width={500}
                    />
                  </DialogContent>
                </Dialog>
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
                    ดำเนินการ
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
