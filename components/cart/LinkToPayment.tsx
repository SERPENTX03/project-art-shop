import Link from "next/link";
import { CartItem } from "@/types/cart";
import { useUserAddress } from "@/hooks/useUserAddress";
import { provinceRegion } from "@/data/provinceRegion";

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

  const handleClick = () => {
    if (!buyerProvince) return;

    // กลุ่มสินค้าแยกตามศิลปิน
    const ordersByArtist = selectedItems.reduce((acc, item) => {
      const artistId = item.gallery.userId || "unknown";
      if (!acc[artistId]) acc[artistId] = [];
      acc[artistId].push(item);
      return acc;
    }, {} as Record<string, CartItem[]>);

    const orders = Object.entries(ordersByArtist).map(([artistId, items]) => {
      const sellerProvince = items[0]?.gallery?.artist?.addressProvince || "";
      const shippingFee = calcShipping(buyerProvince, sellerProvince);

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
          <Link
            href={`/cart/checkout`}
            className="text-lg px-4 py-2 button-custom"
            onClick={handleClick}
          >
            สั่งสินค้า
          </Link>
        </div>
      )}
    </>
  );
};

export default LinkToPayment;
