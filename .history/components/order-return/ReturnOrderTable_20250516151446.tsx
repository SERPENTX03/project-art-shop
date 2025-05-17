import { Gallery, Order, OrderItem } from "@prisma/client";

interface ReturnProps {
  orders: OrderItem & { gallery: Gallery; order: Order };
}

const ReturnOrderTable = ({ orders }: ReturnProps) => {
  console.log(orders);
  return <div>ReturnOrderTable</div>;
};
export default ReturnOrderTable;
