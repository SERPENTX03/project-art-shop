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

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="py-10 px-6 space-y-10 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold">📦 Your Order Dashboard</h1>
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

      {/* Detailed Order List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                Order ID: {order.id}
              </p>
              <p className="text-sm">
                Status: <span className="font-medium">{order.status}</span>
              </p>
              <p className="text-sm">
                Total:{" "}
                <span className="text-blue-500 font-semibold">
                  {order.total}฿
                </span>
              </p>
              <p className="text-sm">
                Date: {new Date(order.createdAt).toLocaleString()}
              </p>
              <div className="mt-2 space-y-1">
                {order.items.map((item) => (
                  <div key={item.id} className="text-sm text-muted-foreground">
                    • {item.gallery.title} x{item.quantity} ={" "}
                    {item.unitPrice * item.quantity}฿
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrderDashboard;
