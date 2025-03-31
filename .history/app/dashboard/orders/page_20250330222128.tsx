import { fetchOrderById } from "@/actions/order";
import { auth } from "@clerk/nextjs/server";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import OrderChart from "@/components/order/OrderChart";

const OrderDashboard = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not found");

  const orders = await fetchOrderById(userId);

  const chartData = orders.map((order) => ({
    name: new Date(order.createdAt).toLocaleDateString(),
    total: order.total,
  }));

  return <div></div>;
};

export default OrderDashboard;
