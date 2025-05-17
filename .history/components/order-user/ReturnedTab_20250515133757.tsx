"use client";

import { OrderItemWithRelation } from "@/types/order";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TimelineStatus from "./TimelineStatus";
import { formatDistanceToNow, differenceInDays } from "date-fns";
import { requestReturn } from "@/actions/return";
import { toast } from "react-toastify";
import { useState } from "react";

interface ReturnedTabProps {
  items: OrderItemWithRelation[];
}

const ReturnedTab = ({ items }: ReturnedTabProps) => {
  const now = new Date();

  const returnableItems = items.filter(
    (item) =>
      item.deliveryStatus === "DELIVERED" &&
      item.deliveredAt &&
      differenceInDays(now, new Date(item.deliveredAt)) <= 7
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

  if (returnableItems.length === 0) {
    return (
      <p className="text-muted-foreground">
        No returnable items (within 7 days).
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {returnableItems.map((item) => {
        const shopPhone = item.gallery.shop?.phone;

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
      })}
    </div>
  );
};

export default ReturnedTab;
