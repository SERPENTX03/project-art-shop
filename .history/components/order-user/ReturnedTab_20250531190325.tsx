"use client";

import { OrderItemWithRelation } from "@/types/order";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TimelineStatus from "./TimelineStatus";
import { formatDistanceToNow, differenceInDays } from "date-fns";
import { requestReturn } from "@/actions/return-order";
import { toast } from "react-toastify";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface ReturnedTabProps {
  items: OrderItemWithRelation[];
}

const statusLabels: Record<string, string> = {
  REQUESTED: "รอการอนุมัติ",
  APPROVED: "ร้านอนุมัติแล้ว",
  RECEIVED: "ร้านได้รับสินค้าแล้ว",
  REFUNDED: "คืนเงินแล้ว",
  REJECTED: "ถูกปฏิเสธ",
};

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

const ReturnedTab = ({ items }: ReturnedTabProps) => {
  const now = new Date();

  const returnableItems = items.filter(
    (item) =>
      item.deliveryStatus === "DELIVERED" &&
      item.deliveredAt &&
      differenceInDays(now, new Date(item.deliveredAt)) <= 7 &&
      item.returnStatus !== "REFUNDED" &&
      item.returnStatus !== "REJECTED"
  );

  const historyItems = items.filter(
    (item) =>
      item.returnStatus === "REFUNDED" || item.returnStatus === "REJECTED"
  );

  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [files, setFiles] = useState<Record<string, File[]>>({});

  const handleRequestReturn = async (id: string) => {
    const reason = reasons[id];
    const selectedFiles = files[id] || [];

    if (!reason) {
      toast.warning("Please provide a reason for return.");
      return;
    }

    setLoadingId(id);

    try {
      const formData = new FormData();
      formData.append("reason", reason);
      selectedFiles.forEach((file) => formData.append("images", file));

      await requestReturn(id, formData);
      toast.success("Return request submitted successfully.");
      setReasons((prev) => ({ ...prev, [id]: "" }));
      setFiles((prev) => ({ ...prev, [id]: [] }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit return request. Try again.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* ปุ่มแสดงประวัติ */}
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">ประวัติการคืนเงิน/ปฏิเสธ</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogTitle>ประวัติการคืนสินค้า</DialogTitle>
            <div className="space-y-4 max-h-[60vh] overflow-auto">
              {historyItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">ไม่มีประวัติ</p>
              ) : (
                historyItems.map((item) => (
                  <div
                    key={item.id}
                    className="border p-4 rounded-md bg-white shadow-sm"
                  >
                    <div className="font-medium">{item.gallery.title}</div>
                    <div className="text-sm text-muted-foreground">
                      หมายเหตุ: {item.returnReason}
                    </div>
                    {item.returnStatus === "REJECTED" ? (
                      <p>สาเหตุที่ปฏิเสธ: {item.returnNote}</p>
                    ) : null}
                    <div className="mt-2 flex justify-between">
                      <Badge className={getStatusColor(item.returnStatus!)}>
                        {statusLabels[item.returnStatus!]}
                      </Badge>
                      {item.returnStatus === "REJECTED" ? (
                        <p>
                          เบอร์ร้าน:{" "}
                          <span className="text-blue-500">
                            {" "}
                            {item.gallery.artist?.phone}
                          </span>
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {returnableItems.length === 0 ? (
        <p className="text-muted-foreground">
          No returnable items (within 7 days).
        </p>
      ) : (
        returnableItems.map((item) => {
          const shopPhone = item.gallery.artist?.phone;

          return (
            <div
              key={item.id}
              className="border p-4 rounded-xl space-y-4 bg-white shadow-sm"
            >
              {/* Timeline Status */}
              <TimelineStatus
                mode="return"
                current={item.returnStatus ?? "REQUESTED"}
                galleryTitle={item.gallery.title}
                imageUrl={item.gallery.images[0]}
              />

              {/* Info */}
              <div className="text-sm text-muted-foreground">
                Delivered {formatDistanceToNow(new Date(item.deliveredAt!))} ago
                {shopPhone && (
                  <>
                    {" • "}
                    ติดต่อร้าน:{" "}
                    <a
                      href={`tel:${shopPhone}`}
                      className="text-blue-600 underline"
                    >
                      {shopPhone}
                    </a>
                  </>
                )}
              </div>

              {/* Return Form */}
              {item.returnStatus ? null : (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    แนบรูปภาพประกอบ (ถ้ามี)
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        setFiles((prev) => ({
                          ...prev,
                          [item.id]: Array.from(e.target.files as FileList),
                        }));
                      }
                    }}
                    className="text-sm w-fit"
                  />

                  <label className="text-sm font-medium">
                    เหตุผลในการคืนสินค้า
                  </label>
                  <Textarea
                    placeholder="e.g., ได้สินค้าผิด หรือสินค้าชำรุด"
                    value={reasons[item.id] || ""}
                    onChange={(e) =>
                      setReasons((prev) => ({
                        ...prev,
                        [item.id]: e.target.value,
                      }))
                    }
                  />

                  <Button
                    disabled={loadingId === item.id}
                    onClick={() => handleRequestReturn(item.id)}
                  >
                    {loadingId === item.id
                      ? "Submitting..."
                      : "Submit Return Request"}
                  </Button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default ReturnedTab;
