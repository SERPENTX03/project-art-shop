"use client";

import { useEffect, useState } from "react";
import { getUserAllCart } from "@/actions/cart";
import { CartItem } from "@/types/cart";
import CartTable from "@/components/cart/CartTable";
import LinkToPayment from "@/components/cart/LinkToPayment";

const Cart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    getUserAllCart().then(setItems);
  }, []);

  

  useEffect(() => {
    const selectedId = localStorage.getItem("selectedCartItemId");

    if (selectedId && items.length > 0) {
      const found = items.find(
        (item) => item.gallery.id === selectedId || item.id === selectedId
      );
      if (found) {
        setSelected((prev) => new Set([...prev, found.id]));
        localStorage.removeItem("selectedCartItemId");
      }
    }
  }, [items]);

  const selectedItems = items.filter((item) => selected.has(item.id));

  const quantityTotal = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  const total = selectedItems.reduce(
    (sum, item) => sum + item.quantity * item.gallery.price,
    0
  );

  return (
    <div className="m-8 pb-32 max-h-[calc(100vh-150px)] overflow-auto">
      <CartTable
        selected={selected}
        setSelected={setSelected}
        items={items}
        setItems={setItems}
      />

      <LinkToPayment
        quantityTotal={quantityTotal}
        total={total}
        selectedItems={selectedItems}
      />
    </div>
  );
};

export default Cart;
