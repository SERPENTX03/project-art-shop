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

interface OrderItem {
  id: string;
  orderId: string;
  quantity: number;
  order: {
    id: string;
    createdAt: string;
  };
}

interface ShopInfo {
  id: string;
  name: string;
  phone: string;
  bankName?: string | null;
  accountName?: string | null;
  accountNumber?: string | null;
}

interface GalleryItem {
  id: string;
  title: string;
  soldCount: number;
  price: number;
  shop?: ShopInfo | null;
  orderItems?: OrderItem[];
}

interface Props {
  galleries: GalleryItem[];
  pageSize?: number;
}

export default function AdminSoldGallery({ galleries, pageSize = 6 }: Props) {
  const [page, setPage] = useState(1);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  const [paidIds, setPaidIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPaidIds = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/payout/history");
        const data = await res.json();
        if (Array.isArray(data)) {
          const ids = data.map((p: { galleryId: string }) => p.galleryId);
          setPaidIds(ids);
        } else {
          console.error("Unexpected payout history format:", data);
        }
      } catch (err) {
        console.error("Error loading payout history", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaidIds();
  }, []);

  const unpaidGalleries = galleries; // ทดสอบชั่วคราว

  const totalPage = Math.max(Math.ceil(unpaidGalleries.length / pageSize), 1);
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          galleryIds: [galleryId],
          shopId,
          amount,
          note: "ยืนยันการโอนแล้ว",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPaidIds((prev) => [...prev, galleryId]);
      } else {
        console.error("Payout failed:", data.message);
      }
    } catch (err) {
      console.error("Payout request failed", err);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== galleryId));
    }
  };
  console.log("Galleries:", galleries);
  console.log("Paid IDs:", paidIds);
  console.log("Unpaid galleries:", unpaidGalleries);
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

      {isLoading ? (
        <div className="text-center py-8">
          <p>กำลังโหลดข้อมูล...</p>
        </div>
      ) : unpaidGalleries.length === 0 ? (
        <div className="text-center py-8">
          <p>ไม่มีรายการที่ต้องจ่ายเงิน หรือ จ่ายเงินครบทุกรายการแล้ว</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pageItems.map((gallery) => {
              const shop = gallery.shop;
              const isLoadingItem = loadingIds.includes(gallery.id);
              const isPaid = paidIds.includes(gallery.id);
              const totalAmount = gallery.soldCount * gallery.price;

              return (
                <Card key={gallery.id}>
                  <CardContent className="p-4 space-y-2">
                    <h2 className="font-semibold text-lg">{gallery.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      🧾 ขายแล้ว {gallery.soldCount} ชิ้น
                    </p>
                    <p className="text-sm text-muted-foreground">
                      💰 รวม {totalAmount.toLocaleString()} บาท
                    </p>

                    {gallery.orderItems?.length > 0 && (
                      <>
                        <Separator />
                        <div className="text-sm mt-2">
                          <p className="font-medium">📦 รายการ Order ที่ขาย:</p>
                          <ul className="list-disc list-inside text-muted-foreground">
                            {gallery.orderItems.map((item) => (
                              <li key={item.id}>
                                Order #{item.orderId} • จำนวน {item.quantity} •
                                วันที่{" "}
                                {new Date(
                                  item.order.createdAt
                                ).toLocaleDateString("th-TH")}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}

                    <Separator />
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>🏪 ร้าน: {shop?.name || "-"}</p>
                      <p>📞 {shop?.phone || "-"}</p>
                      <p>🏦 {shop?.bankName || "-"}</p>
                      <p>ชื่อบัญชี: {shop?.accountName || "-"}</p>
                      <p>เลขบัญชี: {shop?.accountNumber || "-"}</p>
                    </div>

                    <Separator />

                    <Button
                      disabled={isLoadingItem || isPaid || !shop}
                      onClick={() =>
                        handlePayout(gallery.id, shop!.id, totalAmount)
                      }
                      className="w-full"
                      variant={isPaid ? "secondary" : "default"}
                    >
                      {isPaid
                        ? "✅ โอนแล้ว"
                        : isLoadingItem
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
        </>
      )}
    </div>
  );
}
