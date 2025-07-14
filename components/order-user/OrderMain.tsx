// components/orderuser/OrderMain.tsx

"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OrderItemWithRelation } from "@/types/order";
import AllOrdersTab from "./AllOrdersTab";
import ShippingTab from "./ShippingTab";
import DeliveredTab from "./DeliveredTab";
import ReturnedTab from "./ReturnedTab";

interface OrderMainProps {
  items: OrderItemWithRelation[];
}

const OrderMain = ({ items }: OrderMainProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Orders</h2>
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="returned">Returned</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <AllOrdersTab items={items} />
        </TabsContent>

        <TabsContent value="shipping">
          <ShippingTab items={items} />
        </TabsContent>

        <TabsContent value="delivered">
          <DeliveredTab items={items} />
        </TabsContent>

        <TabsContent value="returned">
          <ReturnedTab items={items} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderMain;
