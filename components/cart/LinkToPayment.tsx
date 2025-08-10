"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CartItem } from "@/types/cart";
import { useUserAddress } from "@/hooks/useUserAddress";
import { provinceRegion } from "@/data/provinceRegion";
import NewAddressDialog from "@/components/cart/checkout/NewAddressUser";

type LinkToPaymentProps = {
  total: number;
  quantityTotal: number;
  selectedItems: CartItem[];
};

// หา region จากจังหวัด
function getRegion(province: string): string {
  return provinceRegion[province] || "unknown";
}

// คำนวณค่าส่ง
function calcShipping(buyerProvince: string, sellerProvince: string) {
  return getRegion(buyerProvince) === getRegion(sellerProvince) ? 0 : 50;
}

const LinkToPayment = ({
  total,
  quantityTotal,
  selectedItems,
}: LinkToPaymentProps) => {
  const { buyerProvince } = useUserAddress();
  const router = useRouter();
  const [openAddressModal, setOpenAddressModal] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!buyerProvince) {
      setOpenAddressModal(true); // เปิด modal ให้กรอกที่อยู่
      return;
    }

    saveOrders();
    router.push("/cart/checkout");
  };

  const handleAddressSaved = () => {
    setOpenAddressModal(false);
    saveOrders();
    router.push("/cart/checkout");
  };

  const saveOrders = () => {
    // กลุ่มสินค้าแยกตามศิลปิน
    const ordersByArtist = selectedItems.reduce((acc, item) => {
      const artistId = item.gallery.userId || "unknown";
      if (!acc[artistId]) acc[artistId] = [];
      acc[artistId].push(item);
      return acc;
    }, {} as Record<string, CartItem[]>);

    const orders = Object.entries(ordersByArtist).map(([artistId, items]) => {
      const sellerProvince = items[0]?.gallery?.artist?.addressProvince || "";
      const shippingFee = calcShipping(buyerProvince || "", sellerProvince);

      return {
        artistId,
        items,
        subtotal: items.reduce(
          (sum, i) => sum + i.gallery.price * i.quantity,
          0
        ),
        shippingFee,
        total:
          items.reduce((sum, i) => sum + i.gallery.price * i.quantity, 0) +
          shippingFee,
      };
    });

    localStorage.setItem("checkoutOrders", JSON.stringify(orders));
  };

  return (
    <>
      {selectedItems.length > 0 && (
        <div className="w-full bg-white border-t px-8 py-6 flex justify-end gap-4 items-center rounded shadow">
          <p className="text-gray-600">สินค้า {quantityTotal} ชิ้น</p>
          <p className="text-2xl font-semibold">{total} ฿</p>
          <button
            className="text-lg px-4 py-2 button-custom"
            onClick={handleClick}
          >
            สั่งสินค้า
          </button>
        </div>
      )}

      {openAddressModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded p-6 w-[400px]">
            <h2 className="text-xl font-semibold mb-4">กรอกที่อยู่จัดส่ง</h2>
            <NewAddressDialog onSuccess={handleAddressSaved} />
          </div>
        </div>
      )}
    </>
  );
};

export default LinkToPayment;
