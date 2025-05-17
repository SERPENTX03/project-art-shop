import { fetchOrderById } from "@/actions/order";
import OrderMain from "@/components/orderuser/OrderMain";
import { auth } from "@clerk/nextjs/server";

const OrderByAccout = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User ID is null. Unable to fetch order.");
  }

  const orderUser = await fetchOrderById(userId);
  return <OrderMain orders={orderUser} />;
};
export default OrderByAccout;
