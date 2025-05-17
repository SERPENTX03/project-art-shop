// components/orderuser/tabs/ReturnedTab.tsx

"use client";

import { OrderItemWithRelation } from "@/types/order";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import TimelineStatus from "./TimelineStatus";
import { differenceInDays } from "date-fns";

interface ReturnedTabProps {
  items: OrderItemWithRelation[];
}

const ReturnedTab = ({ items }: ReturnedTabProps) => {
  const returnableItems = items.filter((item) => {
    const deliveredDate = item.deliveredAt ? new Date(item.deliveredAt) : null;
    if (!deliveredDate) return false;

    const daysSinceDelivery = differenceInDays(new Date(), deliveredDate);
    return (
      daysSinceDelivery <= 7 ||
      ["RETURNED", "RETURN_REQUESTED"].includes(item.deliveryStatus)
    );
  });

  const [reasons, setReasons] = useState<Record<string, string>>({});

  const handleRequestReturn = (id: string) => {
    const reason = reasons[id];
    if (!reason) return alert("Please provide a reason for return.");

    // TODO: send return request to backend
    alert(`Return requested for item ${id}: ${reason}`);
  };

  if (returnableItems.length === 0) {
    return (
      <p className="text-muted-foreground">
        No items eligible for return. Return requests must be submitted within 7
        days of delivery.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {returnableItems.map((item) => {
        const deliveredDate = item.deliveredAt
          ? new Date(item.deliveredAt)
          : null;
        const daysSinceDelivery = deliveredDate
          ? differenceInDays(new Date(), deliveredDate)
          : null;

        const isExpired = daysSinceDelivery !== null && daysSinceDelivery > 7;

        return (
          <div key={item.id} className="space-y-4 border p-4 rounded-xl">
            <TimelineStatus
              current={item.deliveryStatus}
              galleryTitle={item.gallery.title}
              imageUrl={item.gallery.images[0]}
            />

            <div className="text-sm text-muted-foreground">
              Delivered on: {deliveredDate?.toLocaleDateString()} (
              {daysSinceDelivery} days ago)
            </div>

            {isExpired ? (
              <p className="text-red-500 text-sm">
                Return period expired. You can only return items within 7 days
                of delivery.
              </p>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium">Reason for return</label>
                <Textarea
                  placeholder="e.g., Damaged item, wrong product, etc."
                  value={reasons[item.id] || ""}
                  onChange={(e) =>
                    setReasons((prev) => ({
                      ...prev,
                      [item.id]: e.target.value,
                    }))
                  }
                />
                <Button onClick={() => handleRequestReturn(item.id)}>
                  Submit Return Request
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
