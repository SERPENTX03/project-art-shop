import { fetchOrderById } from "@/actions/order";
import { auth } from "@clerk/nextjs/server";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import OrderChart from "@/components/order/OrderChart";
import OrderHistoryModal from "@/components/order/OrderHistoryModal";

const OrderDashboard = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not found");

  const orders = await fetchOrderById(userId);

  const chartData = orders.map((order) => ({
    name: new Date(order.createdAt).toLocaleDateString(),
    total: order.total,
  }));

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="py-10 px-6 space-y-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">📦 Your Order Dashboard</h1>
        <OrderHistoryModal orders={orders} />
      </div>

      <Separator />

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <h2 className="text-xl font-bold">{orders.length}</h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <h2 className="text-xl font-bold text-blue-600">
              {totalRevenue.toFixed(2)}฿
            </h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Latest Order</p>
            <h2 className="text-md font-semibold">
              {orders[0]?.createdAt
                ? new Date(orders[0].createdAt).toLocaleString()
                : "-"}
            </h2>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardContent className="p-6 w-full">
          <h2 className="text-lg font-semibold mb-4">Total Orders Overview</h2>
          <OrderChart data={chartData} />
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDashboard;
