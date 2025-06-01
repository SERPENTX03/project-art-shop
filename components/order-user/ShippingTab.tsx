"use client";

import { OrderItemWithRelation } from "@/types/order";
import TimelineStatus from "./TimelineStatus";

interface ShippingTabProps {
  items: OrderItemWithRelation[];
}

const ShippingTab = ({ items }: ShippingTabProps) => {
  const shippingItems = items.filter((item) =>
    ["PROCESSING", "SHIPPED"].includes(item.deliveryStatus)
  );

  if (shippingItems.length === 0) {
    return <p className="text-muted-foreground">No items are being shipped.</p>;
  }

  return (
    <div className="space-y-6">
      {shippingItems.map((item) => (
        <div
          key={item.id}
          className="border p-4 rounded-xl space-y-3 bg-white shadow-sm"
        >
          <TimelineStatus
            current={item.deliveryStatus}
            galleryTitle={item.gallery.title}
            imageUrl={item.gallery.images[0]}
          />

          {item.trackingNumber && (
            <div className="text-sm">
              <span className="font-medium">Tracking Number:</span>{" "}
              <span className="text-blue-600">{item.trackingNumber}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ShippingTab;
