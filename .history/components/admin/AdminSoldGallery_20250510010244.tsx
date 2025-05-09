"use client";
import { useEffect, useState } from "react";
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

interface GalleryItem {
  id: string;
  title: string;
  soldCount: number;
  price: number;
  shop?: {
    id: string;
    name: string;
    phone: string;
    bankName?: string | null;
    accountName?: string | null;
    accountNumber?: string | null;
  } | null;
}

interface Props {
  galleries: GalleryItem[];
  pageSize?: number;
}

export default function AdminSoldGallery({ galleries, pageSize = 6 }: Props) {
  const [page, setPage] = useState(1);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  const [paidIds, setPaidIds] = useState<string[]>([]);
  const [paidLoaded, setPaidLoaded] = useState(false);

  // Reset page ถ้า unpaidGalleries เปลี่ยนจน page ไม่ valid
  useEffect(() => {
    const unpaidCount = galleries.filter((g) => !paidIds.includes(g.id)).length;
    const newTotalPage = Math.ceil(unpaidCount / pageSize);
    if (page > newTotalPage && newTotalPage > 0) {
      setPage(1);
    }
  }, [paidIds, galleries, page, pageSize]);

  useEffect(() => {
    // โหลดประวัติการโอน
    const fetchPaidIds = async () => {
      try {
        const res = await fetch("/api/payout/history");
        const data = await res.json();
        const ids: string[] = data.map(
          (p: { galleryId: string }) => p.galleryId
        );
        setPaidIds(ids);
      } catch (err) {
        console.error("Error loading payout history", err);
      } finally {
        setPaidLoaded(true);
      }
    };
    fetchPaidIds();
  }, []);

  const unpaidGalleries = galleries.filter((g) => !paidIds.includes(g.id));
  const totalPage = Math.ceil(unpaidGalleries.length / pageSize);
  const pageItems = unpaidGalleries.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    if (page > totalPage && totalPage > 0) setPage(1);
  }, [totalPage, page]);

  const handlePayout = async (
    galleryId: string,
    shopId: string,
    amount: number
  ) => {
    if (paidIds.includes(galleryId)) return;

    try {
      setLoadingIds((prev) => [...prev, galleryId]);

      const res = await fetch("/api/payout", {
        method: "POST",
        body: JSON.stringify({
          galleryIds: [galleryId],
          shopId,
          amount,
          note: "ยืนยันการโอนแล้ว",
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (data.success) {
        setPaidIds((prev) => [...prev, galleryId]);
      }
    } catch (err) {
      console.error("Payout failed", err);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== galleryId));
    }
  };

  console.log(pageItems);

  // 🔒 ยังโหลด paidIds ไม่เสร็จ
  if (!paidLoaded) {
    return (
      <p className="text-center text-muted-foreground">⏳ กำลังโหลดข้อมูล...</p>
    );
  }

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
          const shop = gallery.shop;
          const isLoading = loadingIds.includes(gallery.id);
          const isPaid = paidIds.includes(gallery.id);

          return (
            <Card className="bg-white border p-4 shadow" key={gallery.id}>
              <CardContent className="p-4 space-y-2">
                <h2 className="font-semibold text-lg">{gallery.title}</h2>
                <p className="text-sm text-muted-foreground">
                  🧾 ขายแล้ว {gallery.soldCount} ชิ้น
                </p>
                <p className="text-sm text-muted-foreground">
                  💰 รวม {gallery.soldCount * gallery.price} บาท
                </p>
                <Separator />
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>🏪 ร้าน: {shop?.name}</p>
                  <p>📞 {shop?.phone}</p>
                  <p>🏦 {shop?.bankName}</p>
                  <p>ชื่อบัญชี: {shop?.accountName}</p>
                  <p>เลขบัญชี: {shop?.accountNumber}</p>
                </div>

                <Separator />

                <Button
                  disabled={isLoading || isPaid || !shop}
                  onClick={() =>
                    handlePayout(
                      gallery.id,
                      shop!.id,
                      gallery.soldCount * gallery.price
                    )
                  }
                  className="w-full"
                  variant={isPaid ? "secondary" : "default"}
                >
                  {isPaid
                    ? "✅ โอนแล้ว"
                    : isLoading
                    ? "⏳ กำลังโอน..."
                    : "ยืนยันว่าโอนแล้ว"}
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
