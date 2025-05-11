import Link from "next/link";

const LinkToCart = ({ id }: { id: string }) => {
  return (
    <Link
      onClick={() => localStorage.setItem("selectedCartItemId", gallery.id)}
      href="/cart"
    >
      สั่งสินค้า
    </Link>
  );
};
export default LinkToCart;
