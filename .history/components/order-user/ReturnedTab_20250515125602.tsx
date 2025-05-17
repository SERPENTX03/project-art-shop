// components/orderuser/tabs/ReturnedTab.tsx

"use client";

import { OrderItemWithRelation } from "@/types/order";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import TimelineStatus from "./TimelineStatus";
import { formatDistanceToNow, differenceInDays } from "date-fns";
import { requestReturn } from "@/actions/return";

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

    if (!reason) return alert("Please provide a reason for return.");

    setLoadingId(id);

    try {
      const formData = new FormData();
      formData.append("reason", reason);
      selectedFiles.forEach((file) => formData.append("images", file));

      await requestReturn(id, formData);
      alert("Your return request has been submitted.");
      setReasons((prev) => ({ ...prev, [id]: "" }));
      setFiles((prev) => ({ ...prev, [id]: [] }));
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
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
      {returnableItems.map((item) => (
        <div key={item.id} className="space-y-4 border p-4 rounded-xl">
          <TimelineStatus
            current={item.deliveryStatus}
            galleryTitle={item.gallery.title}
            imageUrl={item.gallery.images[0]}
          />

          <p className="text-sm text-muted-foreground">
            Delivered {formatDistanceToNow(new Date(item.deliveredAt!))} ago
          </p>

          <div className="space-y-2">
            <label className="text-sm font-medium">Reason for return</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  setFiles((prev) => ({
                    ...prev,
                    [item.id]: Array.from(e.target.files),
                  }));
                }
              }}
              className="text-sm"
            />
            <Textarea
              placeholder="e.g., Damaged item, wrong product, etc."
              value={reasons[item.id] || ""}
              onChange={(e) =>
                setReasons((prev) => ({ ...prev, [item.id]: e.target.value }))
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
        </div>
      ))}
    </div>
  );
};

export default ReturnedTab;
