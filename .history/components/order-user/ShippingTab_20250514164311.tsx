// components/orderuser/tabs/ShippingTab.tsx

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
        <TimelineStatus
          key={item.id}
          current={item.deliveryStatus}
          galleryTitle={item.gallery.title}
          imageUrl={item.gallery.images[0]}
        />
      ))}
    </div>
  );
};

export default ShippingTab;
