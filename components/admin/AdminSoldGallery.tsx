"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import PayoutList from "./PayoutList";
import { OrderItem } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface GalleryItem {
  id: string;
  title: string;
  soldCount: number;
  price: number;
  artist?: {
    id: string;
    name: string;
    phone: string;
    bankName?: string | null;
    accountName?: string | null;
    accountNumber?: string | null;
  } | null;
  orderItems?: (OrderItem & { deliveryStatus?: string })[];
}

interface Props {
  galleries: GalleryItem[];
  pageSize?: number;
}

const deliveryStatusLabel: Record<string, string> = {
  PENDING: "รอจัดส่ง",
  PROCESSING: "กำลังจัดส่ง",
  SHIPPED: "ส่งออกแล้ว",
  DELIVERED: "จัดส่งสำเร็จ",
  CANCELLED: "ยกเลิก",
};

const COMMISSION_RATE = 0.07; // 7%

export default function AdminSoldGallery({ galleries, pageSize = 6 }: Props) {
  const [page, setPage] = useState(1);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  const router = useRouter();

  const unpaidOrderItems = galleries.flatMap((gallery) =>
    (gallery.orderItems || [])
      .filter((item) => !item.paidToShop)
      .map((item) => ({ ...item, gallery }))
  );

  const totalPage = Math.ceil(unpaidOrderItems.length / pageSize);
  const pageItems = unpaidOrderItems.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const calculatePayout = (totalAmount: number) => {
    const commission = totalAmount * COMMISSION_RATE;
    const artistPayout = totalAmount - commission;
    return {
      totalAmount,
      commission,
      artistPayout,
    };
  };

  const handlePayout = async (
    galleryId: string,
    shopId: string,
    amount: number,
    orderItemIds: string[],
    orderItems: { id: string; deliveryStatus?: string }[]
  ) => {
    if (!orderItemIds.length) return;

    const notDelivered = orderItems.filter(
      (item) => item.deliveryStatus !== "DELIVERED"
    );

    if (notDelivered.length > 0) {
      alert(
        `ไม่สามารถยืนยันการโอนได้ เนื่องจากยังมีรายการที่ยังจัดส่งไม่สำเร็จ (${notDelivered.length} รายการ)`
      );
      return;
    }

    try {
      setLoadingIds((prev) => [...prev, orderItemIds[0]]);

      const { artistPayout } = calculatePayout(amount);

      const res = await fetch("/api/payout", {
        method: "POST",
        body: JSON.stringify({
          galleryIds: [galleryId],
          shopId,
          amount: artistPayout, // ส่งยอดที่หัก commission แล้ว
          orderItemIds,
          note: "ยืนยันว่าโอนแล้ว",
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (data.success) {
        toast("ยืนยันการโอนสำเร็จ");
        router.refresh();
      } else {
        alert(data.error || "เกิดข้อผิดพลาดในการยืนยัน");
      }
    } catch (err) {
      console.error("Payout failed", err);
      alert("เกิดข้อผิดพลาด");
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== orderItemIds[0]));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">ดูประวัติการโอนทั้งหมด</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>ประวัติการโอนเงินทั้งหมด</DialogTitle>
            </DialogHeader>
            <PayoutList />
          </DialogContent>
        </Dialog>

        <div className="text-muted-foreground text-sm">
          รวมทั้งหมด: {unpaidOrderItems.length} รายการ
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pageItems.map((item) => {
          const gallery = item.gallery;
          const artist = gallery.artist;
          const isLoading = loadingIds.includes(item.id);
          const totalAmount = gallery.price * item.quantity;
          const { commission, artistPayout } = calculatePayout(totalAmount);

          return (
            <Card key={item.id} className="bg-white border p-4 shadow">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between">
                  <h2 className="font-semibold text-lg">{gallery.title}</h2>
                  <span className="text-sm text-muted-foreground">
                    🚚 สถานะ:{" "}
                    {deliveryStatusLabel[item.deliveryStatus || "PENDING"]}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground">
                  จำนวน: {item.quantity} ชิ้น / ราคาต่อชิ้น: {gallery.price} บาท
                </p>

                <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>💰 ยอดรวม:</span>
                    <span className="font-medium">{totalAmount.toLocaleString()} บาท</span>
                  </div>
                  <div className="flex justify-between text-sm text-red-600">
                    <span>🏪 ค่าคอมมิชชั่น (7%):</span>
                    <span>-{commission.toLocaleString()} บาท</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm font-semibold text-green-600">
                    <span>💸 ยอดที่จะโอนให้ศิลปิน:</span>
                    <span>{artistPayout.toLocaleString()} บาท</span>
                  </div>
                </div>

                <Separator />

                <div className="text-sm text-muted-foreground space-y-1">
                  <p>🏪 ร้าน: {artist?.name}</p>
                  <p>📞 {artist?.phone}</p>
                  <p>🏦 {artist?.bankName}</p>
                  <p>ชื่อบัญชี: {artist?.accountName}</p>
                  <p>เลขบัญชี: {artist?.accountNumber}</p>
                </div>

                <Separator />

                <Button
                  disabled={
                    isLoading || !artist || item.deliveryStatus !== "DELIVERED"
                  }
                  onClick={() =>
                    handlePayout(
                      gallery.id,
                      artist!.id,
                      totalAmount,
                      [item.id],
                      [item]
                    )
                  }
                  className="w-full"
                >
                  {isLoading ? "⏳ กำลังโอน..." : `ยืนยันโอน ${artistPayout.toLocaleString()} บาท`}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {totalPage > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
          >
            ก่อนหน้า
          </Button>
          <span className="text-sm">
            หน้า {page} / {totalPage}
          </span>
          <Button
            variant="outline"
            disabled={page === totalPage}
            onClick={() => setPage((p) => Math.min(p + 1, totalPage))}
          >
            ถัดไป
          </Button>
        </div>
      )}
    </div>
  );
}