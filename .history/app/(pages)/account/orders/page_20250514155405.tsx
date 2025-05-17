import { fetchOrderById } from "@/actions/order";
import OrderMain from "@/components/orderuser/OrderMain";
import { auth } from "@clerk/nextjs/server";

const OrderByAccout = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User ID is null. Unable to fetch order.");
  }

  const order = await fetchOrderById(userId);
  console.log(order);
  return <OrderMain orders={order} />;
};
export default OrderByAccout;
