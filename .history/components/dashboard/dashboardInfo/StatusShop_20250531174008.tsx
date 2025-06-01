"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { getDateRange, RANGE_OPTIONS, RangeOption } from "@/utils/GetDateRange";
import { Gallery, Order } from "@prisma/client";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import Link from "next/link";

type OrderWithItems = Order & {
  items: {
    galleryId: string;
    quantity: number;
  }[];
};

type StatusProps = {
  galleries: Gallery[];
  orders: OrderWithItems[];
};

export default function Status({ galleries, orders }: StatusProps) {
  const [selectedRange, setSelectedRange] = useState<RangeOption>("All time");
  const [customOpen, setCustomOpen] = useState(false);
  const [customFrom, setCustomFrom] = useState<Date | null>(null);
  const [customTo, setCustomTo] = useState<Date | null>(null);

  const { from, to } = useMemo(() => {
    if (selectedRange === "Custom" && customFrom && customTo) {
      return { from: customFrom, to: customTo };
    }
    return getDateRange(selectedRange) ?? { from: undefined, to: undefined };
  }, [selectedRange, customFrom, customTo]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const created = new Date(o.createdAt);
      if (from && created < from) return false;
      if (to && created > to) return false;
      return true;
    });
  }, [orders, from, to]);

  const totalStock = galleries.reduce((sum, g) => sum + g.quantity, 0);
  const totalSold = filteredOrders.reduce(
    (sum, o) => sum + (o.items?.reduce((s, i) => s + i.quantity, 0) || 0),
    0
  );
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);
  const pendingCount = galleries.filter((g) => g.status === "PENDING").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <select
          value={selectedRange}
          onChange={(e) => {
            const value = e.target.value as RangeOption;
            setSelectedRange(value);
            if (value === "Custom") setCustomOpen(true);
          }}
          className="border p-2 rounded"
        >
          {RANGE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {selectedRange === "Custom" && from && to && (
          <p className="text-sm text-muted-foreground">
            📅 {format(from, "yyyy-MM-dd")} ถึง {format(to, "yyyy-MM-dd")}
          </p>
        )}

        <Link className="button-custom px-4 py-2" href={"/dashboard/orders"}>
          View All ={">"}
        </Link>
      </div>

      {/* Modal Custom Date Picker */}
      <Dialog open={customOpen} onOpenChange={setCustomOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>เลือกช่วงวันที่</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">จากวันที่</label>
              <input
                type="date"
                className="border p-2 rounded"
                value={customFrom ? format(customFrom, "yyyy-MM-dd") : ""}
                onChange={(e) => setCustomFrom(new Date(e.target.value))}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">ถึงวันที่</label>
              <input
                type="date"
                className="border p-2 rounded"
                value={customTo ? format(customTo, "yyyy-MM-dd") : ""}
                onChange={(e) => setCustomTo(new Date(e.target.value))}
              />
            </div>
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <button
              className="px-4 py-2 bg-gray-200 rounded"
              onClick={() => {
                setCustomOpen(false);
                setSelectedRange("All time");
              }}
            >
              ยกเลิก
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              disabled={!customFrom || !customTo}
              onClick={() => {
                setCustomOpen(false);
                setSelectedRange("Custom");
              }}
            >
              ใช้ช่วงวันที่
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 border border-primary/50 py-4 rounded-2xl">
        <div className="p-4">
          <p className="text-lg text-muted-foreground">Stock</p>
          <h2 className="text-2xl font-bold text-primary">{totalStock}</h2>
        </div>

        <div className="border-l border-primary/50 p-4">
          <p className="text-lg text-muted-foreground">Pending Approvals</p>
          <h2 className="text-2xl font-bold text-primary">{pendingCount}</h2>
        </div>
        <div className="border-l border-primary/50 p-4">
          <p className="text-lg text-muted-foreground">Orders</p>
          <h2 className="text-2xl font-bold text-primary">{totalSold}</h2>
        </div>
        <div className="border-l border-primary/50 p-4">
          <p className="text-lg text-muted-foreground">Revenue</p>
          <h2 className="text-2xl font-bold text-primary">
            {totalRevenue.toLocaleString()}฿
          </h2>
        </div>
      </div>
    </div>
  );
}
