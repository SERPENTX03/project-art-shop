import { getShopOrders } from "@/actions/order-management";

const OrderReturn = async () => {
  const orders = await getShopOrders();
  const order = orders.flatMap((order) =>
    order.items.map((item) => ({ ...item, order }))
  );
  console.log(order);
  return <div>OrderTable</div>;
};
export default OrderReturn;
