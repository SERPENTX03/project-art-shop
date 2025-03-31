import { fetchOrderById } from "@/actions/order";
import { auth } from "@clerk/nextjs/server";

const OrderId = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User ID is null");
  }
  const order = await fetchOrderById(userId);
  console.log(order);

  return <div>OrderId</div>;
};
export default OrderId;
