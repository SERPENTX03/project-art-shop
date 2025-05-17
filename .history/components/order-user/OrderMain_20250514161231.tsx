import { OrderItem } from "@prisma/client";
import TimelineStatus from "./TimelineStatus";

interface OrderItemWithRelation extends OrderItem {
  gallery: {
    title: string;
    images: string[];
  };
  order: {
    createdAt: string;
  };
}

interface OrderProps {
  items: OrderItemWithRelation[];
}

const OrderMain = ({ items }: OrderProps) => {
  return (
    <div className="space-y-6">
      {items.map((item) => (
        <div key={item.id} className="border rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-lg">{item.gallery.title}</h3>
          <p className="text-sm text-muted-foreground">
            Quantity: {item.quantity}
          </p>

          {/* 🕒 Timeline */}
          <TimelineStatus current={item.deliveryStatus} />
        </div>
      ))}
    </div>
  );
};

export default OrderMain;
