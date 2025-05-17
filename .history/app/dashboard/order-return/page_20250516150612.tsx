import { getShopOrders } from "@/actions/order-management";

const OrderReturn = async () => {
  const orders = await getShopOrders();
  console.log(orders);
  return <div>OrderReturn</div>;
};
export default OrderReturn;
