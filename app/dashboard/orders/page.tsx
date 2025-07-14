import { fetchOrderByShop, fetchUnpaidOrderItemsForArtist } from "@/actions/order";
import { auth } from "@clerk/nextjs/server";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import OrderChart from "@/components/order-shop/OrderChart";
import OrderHistoryModal from "@/components/order-shop/OrderHistoryModal";
import { fetchArtist } from "@/actions/artist";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";

const OrderDashboard = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not found");

  const orders = await fetchOrderByShop(userId);
  const payoutPending = await fetchUnpaidOrderItemsForArtist(userId);
  const chartData = orders.map((order) => ({
    name: new Date(order.createdAt).toLocaleDateString(),
    total: order.total,
  }));

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  const artist = await fetchArtist(userId);

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


{/* Payout pending */}
<div className="mt-10">
  <h2 className="text-lg font-semibold mb-2">
    💰 รายการชำระเงินที่รอการชำระ
  </h2>
  {/* table shadcn/ui */}
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>รูปภาพ</TableHead>
        <TableHead>ชื่อสินค้า</TableHead>
        <TableHead>จำนวนเงิน</TableHead>
        <TableHead>จำนวนชิ้น</TableHead>
        <TableHead>ราคารวม</TableHead>
        <TableHead>วันที่ชำระ</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
  {payoutPending.map((item) => (
    <TableRow key={item.id}>
      <TableCell>
        <Image
          src={item.gallery?.images[0] || "/placeholder.jpg"}
          alt={item.gallery?.title || "no image"}
          width={100}
          height={100}
          className="rounded"
        />
      </TableCell>
      <TableCell>{item.gallery?.title || "-"}</TableCell>
      <TableCell>{item.unitPrice} บาท</TableCell>
      <TableCell>{item.quantity} ชิ้น</TableCell>
      <TableCell>{item.unitPrice * item.quantity} บาท</TableCell>
      <TableCell>
        {item.order?.createdAt
          ? new Date(item.order.createdAt).toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "-"}
      </TableCell>
    </TableRow>
  ))}
</TableBody>

  </Table>
</div>
      {/* Bank Info */}
      {artist && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-2">
            🏦 บัญชีธนาคารของร้านค้า
          </h2>
          <div className="bg-gray-50 border p-4 rounded-md space-y-1 text-sm">
            <p>
              ธนาคาร: <span className="font-semibold">{artist.bankName}</span>
            </p>
            <p>
              ชื่อบัญชี:{" "}
              <span className="font-semibold">{artist.accountName}</span>
            </p>
            <p>
              เลขบัญชี:{" "}
              <span className="font-semibold">{artist.accountNumber}</span>
            </p>
            {artist.promptpayId && (
              <p>
                PromptPay:{" "}
                <span className="font-semibold">{artist.promptpayId}</span>
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
