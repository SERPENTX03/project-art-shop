import { fetchUserOrderItems } from "@/actions/order";
import OrderMain from "@/components/orderuser/OrderMain";
import { auth } from "@clerk/nextjs/server";

const OrderByAccout = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User ID is null. Unable to fetch order.");
  }

  const items = await fetchUserOrderItems(userId);
  console.log(items);
  // return <OrderMain items={items} />;
};
export default OrderByAccout;
