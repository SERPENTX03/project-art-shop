import { fetchOrderById } from "@/actions/order";
import { auth } from "@clerk/nextjs/server";

const OrderByAccout = async () => {
  const { userId } = await auth();
  const orderUser = await fetchOrderById(userId);
  return <div>OrderByAccout</div>;
};
export default OrderByAccout;
