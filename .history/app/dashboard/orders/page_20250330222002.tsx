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

  return (
    <div className="w-full py-10 px-6 space-y-10">
      <h1 className="text-2xl font-bold">📦 Your Order Dashboard</h1>
      <Separator />

      <Card className="w-full">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Total Orders Overview</h2>
          <OrderChart data={chartData} />
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDashboard;
