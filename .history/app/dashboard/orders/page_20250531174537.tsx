import { fetchOrderByShop } from "@/actions/order";
import { auth } from "@clerk/nextjs/server";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import OrderChart from "@/components/order-shop/OrderChart";
import OrderHistoryModal from "@/components/order-shop/OrderHistoryModal";
import { fetchShopInfoByUserId } from "@/actions/artist";

const OrderDashboard = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not found");

  const orders = await fetchOrderByShop(userId);
  console.log(orders);

  const chartData = orders.map((order) => ({
    name: new Date(order.createdAt).toLocaleDateString(),
    total: order.total,
  }));

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  const shop = await fetchShopInfoByUserId(userId);

  return (
    <div className="py-10 px-6 space-y-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">📦 รายงานร้านค้าของคุณ</h1>
        <OrderHistoryModal orders={orders} />
      </div>

      <Separator />

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              จำนวนคำสั่งซื้อทั้งหมด
            </p>
            <h2 className="text-xl font-bold">{orders.length}</h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">รายได้รวม</p>
            <h2 className="text-xl font-bold text-blue-600">
              {totalRevenue.toFixed(2)} ฿
            </h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">ออเดอร์ล่าสุด</p>
            <h2 className="text-md font-semibold">
              {orders[0]?.createdAt
                ? new Date(orders[0].createdAt).toLocaleString()
                : "-"}
            </h2>
          </CardContent>
        </Card>
      </div>

      {/* Bank Info */}
      {shop && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-2">
            🏦 บัญชีธนาคารของร้านค้า
          </h2>
          <div className="bg-gray-50 border p-4 rounded-md space-y-1 text-sm">
            <p>
              ธนาคาร: <span className="font-semibold">{shop.bankName}</span>
            </p>
            <p>
              ชื่อบัญชี:{" "}
              <span className="font-semibold">{shop.accountName}</span>
            </p>
            <p>
              เลขบัญชี:{" "}
              <span className="font-semibold">{shop.accountNumber}</span>
            </p>
            {shop.promptpayId && (
              <p>
                PromptPay:{" "}
                <span className="font-semibold">{shop.promptpayId}</span>
              </p>
            )}
          </div>
        </div>
      )}
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
