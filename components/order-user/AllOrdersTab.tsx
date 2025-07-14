import { OrderItemWithRelation } from "@/types/order";
import TimelineStatus from "./TimelineStatus";
import { DELIVERY_TIMELINE } from "@/data/DataTimelineStatus";

interface AllOrdersTabProps {
  items: OrderItemWithRelation[];
}

const AllOrdersTab = ({ items }: AllOrdersTabProps) => {
  if (items.length === 0) {
    return <p className="text-muted-foreground">You have no orders.</p>;
  }

  // สร้างลำดับสถานะตาม DELIVERY_TIMELINE
  const deliveryOrder = DELIVERY_TIMELINE.map((step) => step.status);

  // จัดเรียงตามลำดับ status
  const sortedItems = [...items].sort(
    (a, b) =>
      deliveryOrder.indexOf(a.deliveryStatus) -
      deliveryOrder.indexOf(b.deliveryStatus)
  );

  return (
    <div className="space-y-6">
      {sortedItems.map((item) => (
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

export default AllOrdersTab;
