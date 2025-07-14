import { OrderItemWithRelation } from "@/types/order";
import TimelineStatus from "./TimelineStatus";

interface DeliveredTabProps {
  items: OrderItemWithRelation[];
}

const DeliveredTab = ({ items }: DeliveredTabProps) => {
  const deliveredItems = items.filter(
    (item) => item.deliveryStatus === "DELIVERED"
  );

  if (deliveredItems.length === 0) {
    return <p className="text-muted-foreground">No delivered orders.</p>;
  }

  return (
    <div className="space-y-6">
      {deliveredItems.map((item) => (
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

export default DeliveredTab;
