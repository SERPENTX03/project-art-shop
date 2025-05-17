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

  const total = selectedItems.reduce(
    (sum, item) => sum + item.quantity * item.gallery.price,
    0
  );

  return (
    <section className="m-8 p-8 bg-white">
      <AddressUser />

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">รายการสินค้า</h3>
        <div className="space-y-4">
          {selectedItems.map((item) => (
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
                </div>
              </div>
              <p className="font-semibold">
                {item.quantity * item.gallery.price} ฿
              </p>
            </div>
          ))}
        </div>
      </div>

      <PaymentTabs items={selectedItems} total={total} />
    </section>
  );
};

export default Checkout;
