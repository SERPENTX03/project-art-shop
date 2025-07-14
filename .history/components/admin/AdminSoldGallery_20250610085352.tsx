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
  orderItems?: OrderItem[];
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

export default function AdminSoldGallery({ galleries, pageSize = 6 }: Props) {
  const [page, setPage] = useState(1);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  const router = useRouter();

  // 🔁 กรองเฉพาะ gallery ที่มี orderItem ยังไม่จ่าย
  const unpaidGalleries = galleries.filter((g) =>
    g.orderItems?.some((item) => item.paidToShop === false)
  );

  const totalPage = Math.ceil(unpaidGalleries.length / pageSize);
  const pageItems = unpaidGalleries.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

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
      setLoadingIds((prev) => [...prev, galleryId]);

      const res = await fetch("/api/payout", {
        method: "POST",
        body: JSON.stringify({
          galleryIds: [galleryId],
          shopId,
          amount,
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
      setLoadingIds((prev) => prev.filter((id) => id !== galleryId));
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
          รวมทั้งหมด: {unpaidGalleries.length} รายการ
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pageItems.map((gallery) => {
          const artist = gallery.artist;
          const isLoading = loadingIds.includes(gallery.id);
          const unpaidOrderItems =
            gallery.orderItems?.filter((i) => !i.paidToShop) || [];
          const totalAmount = unpaidOrderItems.length * gallery.price;

          const latestUnpaid = unpaidOrderItems[0];
          return (
            <Card className="bg-white border p-4 shadow" key={gallery.id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between">
                  <h2 className="font-semibold text-lg">{gallery.title}</h2>
                  <div className="text-sm text-muted-foreground">
                    {gallery.orderItems?.[0]?.deliveryStatus && (
                      <span>
                        🚚 สถานะ:{" "}
                        {deliveryStatusLabel[latestUnpaid.deliveryStatus]}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  🧾 ขายแล้ว {gallery.soldCount} ชิ้น
                </p>
                <p className="text-sm text-muted-foreground">
                  💰 รอโอน {unpaidOrderItems.length} ชิ้น = {totalAmount} บาท
                </p>
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
                  disabled={isLoading || !artist || !unpaidOrderItems.length}
                  onClick={() =>
                    handlePayout(
                      gallery.id,
                      artist!.id,
                      totalAmount,
                      unpaidOrderItems.map((i) => i.id),
                      unpaidOrderItems
                    )
                  }
                  className="w-full"
                >
                  {isLoading ? "⏳ กำลังโอน..." : "ยืนยันว่าโอนแล้ว"}
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
