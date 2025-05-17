// components/orderuser/tabs/ReturnedTab.tsx

"use client";

import { OrderItemWithRelation } from "@/types/order";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import TimelineStatus from "./TimelineStatus";

interface ReturnedTabProps {
  items: OrderItemWithRelation[];
}

const ReturnedTab = ({ items }: ReturnedTabProps) => {
  const returnableItems = items.filter((item) =>
    ["RETURNED", "RETURN_REQUESTED"].includes(item.deliveryStatus)
  );

  const [reasons, setReasons] = useState<Record<string, string>>({});

  const handleRequestReturn = (id: string) => {
    const reason = reasons[id];
    if (!reason) return alert("Please provide a reason for return.");

    // TODO: send return request to backend
    alert(`Return requested for item ${id}: ${reason}`);
  };

  if (returnableItems.length === 0) {
    return (
      <p className="text-muted-foreground">No returned or returnable items.</p>
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Reason for return</label>
            <Textarea
              placeholder="e.g., Damaged item, wrong product, etc."
              value={reasons[item.id] || ""}
              onChange={(e) =>
                setReasons((prev) => ({ ...prev, [item.id]: e.target.value }))
              }
            />
            <Button onClick={() => handleRequestReturn(item.id)}>
              Submit Return Request
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReturnedTab;
