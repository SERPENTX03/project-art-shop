import { CartItem } from "@/types/cart";
import Link from "next/link";

type LinkToPaymentProps = {
  selected: Set<string>;
  total: number;
  quantityTotal: number;
  items: CartItem[];
};

const LinkToPayment = ({
  selected,
  total,
  quantityTotal,
  items,
}: LinkToPaymentProps) => {
  const handleClick = () => {
    const selectedItems = items.filter((item) => selected.has(item.id));
    localStorage.setItem("selectedCartItems", JSON.stringify(selectedItems));
  };
  return (
    <>
      {selected.size > 0 && (
        <div className="w-full  bg-white border-t px-8 py-6 flex justify-end gap-4 items-center rounded shadow">
          <p className="text-gray-600">สินค้า {quantityTotal} ชิ้น</p>
          <p className="text-2xl font-semibold"> {total} ฿</p>
          <Link
            href={`/cart/checkout`}
            className="text-lg px-4 py-2 button-custom"
            onClick={handleClick}
          >
            สั่งสินค้า{" "}
          </Link>
        </div>
      )}
    </>
  );
};
export default LinkToPayment;
