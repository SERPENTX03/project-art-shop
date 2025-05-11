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
import { CartItem } from "@/types/cart";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";

type CartTableProps = {
  selected: Set<string>;
  setSelected: Dispatch<SetStateAction<Set<string>>>;
  items: CartItem[];
  setItems: Dispatch<SetStateAction<CartItem[]>>;
};

const CartTable = (props: CartTableProps) => {
  const { selected, setSelected, items, setItems } = props;

  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);

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
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          const diff = newQty - item.quantity;

          // อัปเดต count ใน store
          if (diff > 0) increment(diff);
          else if (diff < 0) decrement(-diff);

          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const handleRemove = (id: string) => {
    const removedItem = items.find((item) => item.id === id);
    if (removedItem) {
      decrement(removedItem.quantity);
    }

    setItems((prev) => prev.filter((item) => item.id !== id));
    setSelected((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  return (
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
          <TableHead className="text-start w-[400px]">สินค้า</TableHead>
          <TableHead className=" text-center">ราคา</TableHead>
          <TableHead className=" text-center">จำนวน</TableHead>
          <TableHead className=" text-center">ราคารวม</TableHead>
          <TableHead className=" text-center">Action</TableHead>
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
            <TableCell className="text-center">
              {item.gallery.price} ฿
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-center gap-2">
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
            <TableCell className="text-center">
              {item.gallery.price * item.quantity} ฿
            </TableCell>
            <TableCell className="text-center">
              <Button onClick={() => handleRemove(item.id)}>ลบสินค้า</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default CartTable;
