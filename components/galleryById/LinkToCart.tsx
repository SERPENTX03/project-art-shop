"use client";
import { addtoCart } from "@/actions/cart";
import { useRouter } from "next/navigation";

const LinkToCart = ({ id }: { id: string }) => {
  const router = useRouter();
  const handleOrder = async () => {
    try {
      await addtoCart(id, 1);
      localStorage.setItem("selectedCartItemId", id);
      router.push("/cart");
    } catch (error) {
      console.error(error);
      alert("ไม่สามารถเพิ่มสินค้าลงในตะกร้าได้");
    }
  };
  return (
    <button
      className="button-custom h-[50px] w-full flex items-center justify-center"
      onClick={handleOrder}
    >
      สั่งสินค้า
    </button>
  );
};
export default LinkToCart;
