"use client";

import { useEffect, useState } from "react";
import { CartItem } from "@/types/cart";
import AddressUser from "@/components/cart/checkout/AddressUser";
import Image from "next/image";
import PaymentTabs from "@/components/cart/checkout/PaymentTabs";
import { getUserAddresses } from "@/actions/address";
import { useAddressStore } from "@/store/addressStore";

const Checkout = () => {
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);

  // คำนวณค่าส่งตามขนาด
  const calculateShippingFee = (sizeCm: number): number => {
    if (sizeCm < 100) return 100;
    else if (sizeCm <= 150) return 300;
    else if (sizeCm <= 200) return 500;
    else if (sizeCm <= 300) return 1000;
    return 0;
  };

  useEffect(() => {
    const { setAddress, setLoading } = useAddressStore.getState();

    getUserAddresses().then((res) => {
      const addresses = res.addresses ?? [];
      if (res.success && addresses.length > 0) {
        setAddress(addresses[0]);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const selectedData = localStorage.getItem("selectedCartItems");
    if (selectedData) {
      const parsed = JSON.parse(selectedData) as CartItem[];
      setSelectedItems(parsed);
    }
  }, []);

  // รวมราคาสินค้า
  const productTotal = selectedItems.reduce(
    (sum, item) => sum + item.quantity * item.gallery.price,
    0
  );

  // รวมค่าส่งทั้งหมด
  const shippingTotal = selectedItems.reduce(
    (sum, item) =>
      sum + calculateShippingFee(Number(item.gallery.imageSize ?? 0)) * item.quantity,
    0
  );
  
  const grandTotal = productTotal + shippingTotal;

  return (
    <section className="m-8 p-8 bg-white">
      <AddressUser />

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">รายการสินค้า</h3>
        <div className="space-y-4">
          {selectedItems.map((item) => {
            const shippingFee = calculateShippingFee(
              Number(item.gallery.imageSize ?? 0)
            );

            return (
              <div
                key={item.id}
                className="border p-4 rounded flex justify-between items-center"
              >
                <div className="flex gap-4">
                  <Image
                    width={100}
                    height={100}
                    src={item.gallery.images[0]}
                    alt={item.gallery.title}
                  />
                  <div>
                    <p className="font-medium">{item.gallery.title}</p>
                    <p className="text-sm text-gray-500">
                      จำนวน: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-500">
                      ขนาดภาพ: {item.gallery.imageSize ?? "-"} cm
                    </p>
                    <p className="text-sm text-gray-500">
                      ค่าส่ง: {shippingFee} ฿
                    </p>
                  </div>
                </div>
                <p className="font-semibold">
                  {item.quantity * item.gallery.price} ฿
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* สรุปราคา */}
      <div className="mt-8 border-t pt-4 text-right space-y-2">
        <p className="text-lg">
          รวมราคาสินค้า: <span className="font-semibold">{productTotal} ฿</span>
        </p>
        <p className="text-sm text-gray-500">
          ค่าส่ง: {shippingTotal} ฿
        </p>

        <p className="text-xl font-bold">
          ยอดรวมทั้งหมด: <span className="text-primary-600">{grandTotal} ฿</span>
        </p>
      </div>

      <PaymentTabs items={selectedItems} total={grandTotal} />
    </section>
  );
};

export default Checkout;
