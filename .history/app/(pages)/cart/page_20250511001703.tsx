"use client";

import { useEffect, useState } from "react";
import { getUserCart } from "@/actions/getUserCart";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type CartItem = {
  id: string;
  quantity: number;
  gallery: {
    title: string;
    price: number;
    images: string[];
  };
};

const Cart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    getUserCart().then(setItems);
  }, []);

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selected);
    newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
    setSelected(newSelected);
  };

  const toggleAll = () => {
    if (selected.size === items.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(items.map((i) => i.id)));
    }
  };

  const total = [...selected].reduce((sum, id) => {
    const item = items.find((i) => i.id === id);
    return sum + (item?.gallery.price ?? 0) * (item?.quantity ?? 0);
  }, 0);

  return (
    <div className="m-8 pb-32 max-h-[calc(100vh-150px)] overflow-auto">
      <div className="bg-white rounded shadow">
        <Table>
          <TableCaption>รายการสินค้าในตะกร้า</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selected.size === items.length}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead className="w-[400px]">สินค้า</TableHead>
              <TableHead>ราคา</TableHead>
              <TableHead>จำนวน</TableHead>
              <TableHead>ราคารวม</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Checkbox
                    checked={selected.has(item.id)}
                    onCheckedChange={() => toggleSelect(item.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.gallery.images[0]}
                      alt={item.gallery.title}
                      className="h-12 w-12 object-cover rounded"
                    />
                    {item.gallery.title}
                  </div>
                </TableCell>
                <TableCell>{item.gallery.price} ฿</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.gallery.price * item.quantity} ฿</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ✅ แถบด้านล่าง */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md px-8 py-4 flex justify-between items-center border-t">
        <p className="text-xl font-semibold">
          ยอดรวม: <span className="text-primary">{total} ฿</span>
        </p>
        <button
          disabled={selected.size === 0}
          className="bg-primary text-white px-6 py-2 rounded disabled:opacity-50"
          onClick={() => alert("ยังไม่เปิดใช้งานการชำระเงิน")}
        >
          ดำเนินการชำระเงิน
        </button>
      </div>
    </div>
  );
};

export default Cart;
