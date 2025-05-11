"use client";

import { useEffect, useState } from "react";
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
import Image from "next/image";
import { getUserAllCart } from "@/actions/card";
import { CartItem } from "@/types/cart";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const Cart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  console.log(items);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    getUserAllCart().then(setItems);
  }, []);

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const toggleAll = () => {
    if (selected.size === items.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(items.map((i) => i.id)));
    }
  };

  const handleQuantityChange = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setSelected((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
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
              <TableHead>Action</TableHead>
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
                    <Image
                      width={200}
                      height={200}
                      src={item.gallery.images[0]}
                      alt={item.gallery.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                    {item.gallery.title}
                  </div>
                </TableCell>
                <TableCell>{item.gallery.price} ฿</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(item.id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      +
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{item.gallery.price * item.quantity} ฿</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(item.id)}
                  >
                    ลบสินค้า
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* แถบด้านล่าง */}
      <div className="bg-white shadow-md px-8 py-4 flex justify-end items-center border-t gap-4">
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
