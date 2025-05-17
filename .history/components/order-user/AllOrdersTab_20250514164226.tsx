// components/orderuser/tabs/AllOrdersTab.tsx

import { OrderItemWithRelation } from "@/types/order";
import TimelineStatus from "./TimelineStatus";

interface AllOrdersTabProps {
  items: OrderItemWithRelation[];
}

const AllOrdersTab = ({ items }: AllOrdersTabProps) => {
  if (items.length === 0) {
    return <p className="text-muted-foreground">You have no orders.</p>;
  }

  return (
    <div className="space-y-6">
      {items.map((item) => (
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

export default AllOrdersTab;
