import { getShopOrders } from "@/actions/order-management";
import ReturnOrderTable from "@/components/order-return/ReturnOrderTable";
import { Separator } from "@/components/ui/separator";

const OrderReturn = async () => {
  const orders = await getShopOrders();
  const order = orders.flatMap((order) =>
    order.items.map((item) => ({ ...item, order }))
  );
  return (
    <section className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">ขอคืนสินค้า</h1>
        <p className="text-sm text-muted-foreground">จัดการขอคืนสินค้า</p>
      </div>
      <ReturnOrderTable orders={order} />
      <Separator className="my-4" />
    </section>
  );
};
export default OrderReturn;
