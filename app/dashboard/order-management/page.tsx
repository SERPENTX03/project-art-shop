import { getShopOrders } from "@/actions/order-management";
import { OrderTable } from "@/components/order-management/OrderTable";
import { Separator } from "@/components/ui/separator";

export default async function OrderManagementPage() {
  const orders = await getShopOrders();

  return (
    <section className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">คำสั่งซื้อของร้าน</h1>
        <p className="text-sm text-muted-foreground">
          จัดการคำสั่งซื้อทั้งหมดที่ลูกค้าสั่งซื้อจากร้านของคุณ
        </p>
      </div>
      <Separator className="my-4" />
      <OrderTable
        orders={orders.flatMap((order) =>
          order.items.map((item) => ({
            ...item,
            order,
          }))
        )}
      />{" "}
    </section>
  );
}
