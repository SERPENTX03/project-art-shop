"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AddressUser from "@/components/cart/checkout/AddressUser";
import PaymentTabs from "@/components/cart/checkout/PaymentTabs";
import { getUserAddresses } from "@/actions/address";
import { fetchArtist } from "@/actions/artist"; // <- import action
import { useAddressStore } from "@/store/addressStore";
import { CartItem } from "@/types/cart";

type CheckoutOrder = {
  artistId: string;
  artistName?: string; 
  items: CartItem[];
  subtotal: number;
  shippingFee: number; 
  total: number;
};

const Checkout = () => {
  const [orders, setOrders] = useState<CheckoutOrder[]>([]);

  // คำนวณค่าส่งตามขนาดภาพ
  const calculateSizeShipping = (sizeCm: number): number => {
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
    const ordersData = localStorage.getItem("checkoutOrders");
    if (ordersData) {
      const parsedOrders = JSON.parse(ordersData) as CheckoutOrder[];

      // ดึงชื่อศิลปินทีละคน
      Promise.all(
        parsedOrders.map(async (order) => {
          const artist = await fetchArtist(order.artistId);
          return {
            ...order,
            artistName: artist?.name ?? order.artistId, // ถ้าไม่มี name จะ fallback เป็น id
          };
        })
      ).then((ordersWithNames) => {
        setOrders(ordersWithNames);
      });
    }
  }, []);

  // คำนวณราคารวมทั้งหมด
  const productTotal = orders.reduce((sum, order) => sum + order.subtotal, 0);
  const shippingTotal = orders.reduce((sum, order) => {
    const sizeShipping = order.items.reduce(
      (s, item) => s + calculateSizeShipping(item.gallery.imageSize ?? 0) * item.quantity,
      0
    );
    return sum + sizeShipping + order.shippingFee;
  }, 0);
  const grandTotal = productTotal + shippingTotal;

  return (
    <section className="m-8 p-8 bg-white">
      <AddressUser />

      <div className="mt-8 space-y-8">
        {orders.map((order, idx) => (
          <div key={idx} className="border rounded p-4">
            <h3 className="text-lg font-semibold mb-4">
              ออเดอร์จากศิลปิน {order.artistName}
            </h3>
            {order.items.map((item) => {
              const sizeFee = calculateSizeShipping(item.gallery.imageSize ?? 0);
              return (
                <div
                  key={item.id}
                  className="border p-4 mb-4 rounded flex justify-between items-center"
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
                      <p className="text-sm text-gray-500">จำนวน: {item.quantity}</p>
                      <p className="text-sm text-gray-500">
                        ขนาดภาพ: {item.gallery.imageSize ?? "-"} cm
                      </p>
                      <p className="text-sm text-gray-500">
                        ค่าส่งตามขนาด: {sizeFee} ฿
                      </p>
                      {order.shippingFee > 0 && (
                        <p className="text-sm text-red-500">
                          ค่าส่งทางไกล: {order.shippingFee} ฿
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="font-semibold">
                    {item.quantity * item.gallery.price} ฿
                  </p>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* สรุปทั้งหมด */}
      <div className="mt-8 border-t pt-4 text-right space-y-2">
        <p className="text-lg">
          รวมราคาสินค้า: <span className="font-semibold">{productTotal} ฿</span>
        </p>
        <p className="text-sm text-gray-500">
          ค่าส่งทั้งหมด: {shippingTotal} ฿
        </p>
        <p className="text-xl font-bold">
          ยอดรวมทั้งหมด:{" "}
          <span className="text-primary-600">{grandTotal} ฿</span>
        </p>
      </div>

      {/* ปุ่มจ่ายเงิน */}
      <PaymentTabs
        items={orders.flatMap((o) => o.items)}
        total={grandTotal}
      />    </section>
  );
};

export default Checkout;
