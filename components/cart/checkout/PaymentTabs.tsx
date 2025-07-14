"use client";

import OmisePaymentButton from "@/components/payment/OmisePayment";
import StripePaymentButton from "@/components/payment/StriptPayment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CartItem } from "@/types/cart";

interface Props {
  items: CartItem[];
  total: number;
}

export default function PaymentTabs({ items, total }: Props) {
  return (
    <Tabs defaultValue="stripe" className="w-full mt-8">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="stripe">Credit Card </TabsTrigger>
        <TabsTrigger value="omise">QR PromptPay </TabsTrigger>
      </TabsList>

      <TabsContent value="stripe">
        <StripePaymentButton items={items} total={total} />
      </TabsContent>
      <TabsContent value="omise">
        <OmisePaymentButton items={items} total={total} />
      </TabsContent>
    </Tabs>
  );
}
