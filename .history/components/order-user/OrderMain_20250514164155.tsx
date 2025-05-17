import { OrderItemWithRelation } from "@/types/order";
import TimelineStatus from "./TimelineStatus";

interface OrderProps {
  items: OrderItemWithRelation[];
}

const OrderMain = ({ items }: OrderProps) => {
  return (
    <div className="space-y-6 mt-10">
      {items.map((item) => (
        <div key={item.id} className="border rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-lg">{item.gallery.title}</h3>
          <p className="text-sm text-muted-foreground">
            Quantity: {item.quantity}
          </p>

          {/* 🕒 Timeline */}
          <TimelineStatus
            current={item.deliveryStatus}
            galleryTitle={item.gallery.title}
            imageUrl={item.gallery.images[0]}
          />
        </div>
      ))}
    </div>
  );
};

export default OrderMain;
