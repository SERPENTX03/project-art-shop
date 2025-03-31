import { fetchOrderById } from "@/actions/order";
import { auth } from "@clerk/nextjs/server";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
const OrderId = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User ID is null");
  }

  const orders = await fetchOrderById(userId);

  const chartData = orders.map((order) => ({
    name: new Date(order.createdAt).toLocaleDateString(),
    total: order.total,
  }));

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 space-y-10">
      <h1 className="text-2xl font-bold">📦 Your Order Dashboard</h1>
      <Separator />

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Total Orders Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip />
              <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrderId;
