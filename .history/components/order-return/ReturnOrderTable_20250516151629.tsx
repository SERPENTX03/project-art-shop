import { Gallery, Order, OrderItem } from "@prisma/client";

export interface ReturnOrderItem extends OrderItem {
  gallery: Gallery;
  order: Order;
}

interface ReturnProps {
  orders: ReturnOrderItem[];
}

const ReturnOrderTable = ({ orders }: ReturnProps) => {
  console.log(orders);
  return <div>ReturnOrderTable</div>;
};
export default ReturnOrderTable;
