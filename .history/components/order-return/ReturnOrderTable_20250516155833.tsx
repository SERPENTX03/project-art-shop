"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

const ReturnOrderTable = ({ orders }: ReturnProps) => {
  const [selectedItem, setSelectedItem] = useState<ReturnOrderItem | null>(
    null
  );
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleApprove = (id: string) => {
    startTransition(() => {
      progressReturnStatus(id)
        .then(() => {
          toast.success("สถานะได้ถูกอัปเดตขั้นถัดไปแล้ว");
          router.refresh();
          setOpen(false);
        })
        .catch(() => toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่"));
    });
  };

  const handleReject = (id: string) => {
    if (!note.trim()) {
      toast.warning("กรุณาระบุหมายเหตุในการปฏิเสธ");
      return;
    }

    startTransition(() => {
      rejectReturnWithNote(id, note)
        .then(() => {
          toast.success("ปฏิเสธการคืนสินค้าเรียบร้อยแล้ว");
          router.refresh();
          setNote("");
          setOpen(false);
        })
        .catch(() => toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่"));
    });
  };

  const returnRequested = orders.filter(
    (item) => item.returnStatus === "REQUESTED"
  );

  if (returnRequested.length === 0) {
    return <p className="text-muted-foreground">ไม่มีรายการขอคืนสินค้า</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>สินค้า</TableHead>
            <TableHead>เหตุผล</TableHead>
            <TableHead>วันที่สั่ง</TableHead>
            <TableHead className="text-center">รูปภาพ</TableHead>
            <TableHead className="text-center">จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {returnRequested.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.gallery.title}</TableCell>
              <TableCell>{item.returnReason}</TableCell>
              <TableCell>
                {new Date(item.order.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-center">
                {item.returnImages.length === 0 ? (
                  <span className="text-xs text-muted-foreground">
                    ไม่มีรูป
                  </span>
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">ดูรูปภาพ</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>รูปภาพที่แนบมา</DialogTitle>
                      {item.returnImages.map((url, i) => (
                        <Image
                          key={i}
                          className="object-cover border rounded"
                          src={url}
                          alt={`img-${i}`}
                          height={300}
                          width={300}
                        />
                      ))}
                    </DialogContent>
                  </Dialog>
                )}
              </TableCell>
              <TableCell className="text-center">
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedItem(item);
                        setNote("");
                      }}
                    >
                      ดูรายละเอียด
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>รายละเอียดการขอคืนสินค้า</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                      <p>
                        <strong>สินค้า:</strong> {selectedItem?.gallery.title}
                      </p>
                      <p>
                        <strong>หมายเหตุลูกค้า:</strong>{" "}
                        {selectedItem?.returnReason || "-"}
                      </p>
                      <p>
                        <strong>หมายเหตุผู้ดูแล (สำหรับปฏิเสธ):</strong>
                      </p>
                      <Textarea
                        placeholder="ระบุเหตุผลในการปฏิเสธ"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        {selectedItem?.returnImages.map((url, index) => (
                          <Image
                            key={index}
                            src={url}
                            alt={`return-full-${index}`}
                            width={250}
                            height={250}
                            className="object-cover rounded border"
                          />
                        ))}
                      </div>
                    </div>
                    <DialogFooter className="mt-4 gap-2">
                      <Button
                        variant="destructive"
                        disabled={isPending}
                        onClick={() => handleReject(selectedItem!.id)}
                      >
                        ปฏิเสธ
                      </Button>
                      <Button
                        disabled={isPending}
                        onClick={() => handleApprove(selectedItem!.id)}
                      >
                        ดำเนินการขั้นถัดไป
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReturnOrderTable;
