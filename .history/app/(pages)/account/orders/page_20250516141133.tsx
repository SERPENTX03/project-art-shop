import { fetchUserOrderItems } from "@/actions/order";
import OrderMain from "@/components/order-user/OrderMain";
import { auth } from "@clerk/nextjs/server";

const OrderByAccout = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User ID is null. Unable to fetch order.");
  }

  const items = await fetchUserOrderItems(userId);
  return <OrderMain items={items} />;
};
export default OrderByAccout;
