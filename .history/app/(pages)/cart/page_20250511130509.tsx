"use client";

import { useEffect, useState } from "react";

import { getUserAllCart } from "@/actions/cart";
import { CartItem } from "@/types/cart";
import { Button } from "@/components/ui/button";
import CartTable from "@/components/cart/CartTable";

const Cart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    getUserAllCart().then(setItems);
  }, []);

  const total = items
    .filter((item) => selected.has(item.id))
    .reduce((sum, item) => sum + item.quantity * item.gallery.price, 0);

  return (
    <div className="m-8 pb-32 max-h-[calc(100vh-150px)] overflow-auto">
      <div className="bg-white rounded shadow">
        <CartTable
          selected={selected}
          setSelected={setSelected}
          items={items}
          setItems={setItems}
        />
      </div>

      {selected.size > 0 && (
        <div className="w-full  bg-white border-t px-8 py-6 mt-4 flex justify-end gap-4 items-center rounded shadow">
          <p className="text-2xl font-semibold"> {total} ฿</p>
          <button className="text-lg px-4 py-2 button-custom">
            สั่งสินค้า{" "}
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
