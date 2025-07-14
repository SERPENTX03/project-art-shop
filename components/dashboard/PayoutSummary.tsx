"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { getDateRange, RANGE_OPTIONS, RangeOption } from "@/utils/GetDateRange";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Payout } from "@prisma/client";
import { ShopProps } from "@/types/shop";
import SettingShopBank from "./SettingShopBank";

type OrderWithItems = {
  items: {
    paidToShop: boolean;
  }[];
};

interface Props {
  payouts: Payout[];
  artist: ShopProps | null;
  orders: OrderWithItems[];
}

export default function PayoutSummary({ payouts, artist, orders }: Props) {
  const [selectedRange, setSelectedRange] = useState<RangeOption>("All time");
  const [customOpen, setCustomOpen] = useState(false);
  const [customFrom, setCustomFrom] = useState<Date | null>(null);
  const [customTo, setCustomTo] = useState<Date | null>(null);

  const { from, to } = useMemo(() => {
    if (selectedRange === "Custom" && customFrom && customTo) {
      return getDateRange(selectedRange) ?? { from: undefined, to: undefined };
    }
    return getDateRange(selectedRange) || {};
  }, [selectedRange, customFrom, customTo]);

  const filteredPayouts = useMemo(() => {
    return payouts.filter((p) => {
      const created = new Date(p.createdAt);
      if (from && created < from) return false;
      if (to && created > to) return false;
      return true;
    });
  }, [payouts, from, to]);

  console.log(filteredPayouts)

  const unpaidCount = useMemo(() => {
    return orders.flatMap((o) => o.items).filter((item) => !item.paidToShop)
      .length;
  }, [orders]);

  const total = filteredPayouts.reduce((sum, p) => sum + p.amount, 0);

  // แก้ไขการนับ Paid Orders
  const paidOrdersCount = useMemo(() => {
    // หากต้องการนับจากสถานะ PAID
    return filteredPayouts.filter((p) => p.status === 'PAID').length;
    

  }, [filteredPayouts]);

  return (
    <div className="space-y-4 mt-10">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold tracking-tight">💸 Payout Summary</h2>
        <SettingShopBank artist={artist} />
      </div>

      {/* Select + Date Range Label */}
      <div className="flex items-center gap-4">
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
            📅 {format(from, "yyyy-MM-dd")} to {format(to, "yyyy-MM-dd")}
          </p>
        )}
      </div>

      {/* Modal Date Picker */}
      <Dialog open={customOpen} onOpenChange={setCustomOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Custom Date Range</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm">From Date</label>
              <input
                type="date"
                className="border p-2 rounded w-full"
                value={customFrom ? format(customFrom, "yyyy-MM-dd") : ""}
                onChange={(e) => setCustomFrom(new Date(e.target.value))}
              />
            </div>
            <div>
              <label className="text-sm">To Date</label>
              <input
                type="date"
                className="border p-2 rounded w-full"
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
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              disabled={!customFrom || !customTo}
              onClick={() => {
                setCustomOpen(false);
                setSelectedRange("Custom");
              }}
            >
              Apply
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border border-primary/50 py-4 rounded-2xl">
        <div className="p-4">
          <p className="text-lg text-muted-foreground">Total Payout</p>
          <h2 className="text-2xl font-bold ">{total.toLocaleString()}฿</h2>
        </div>

        <div className="border-l border-primary/50 p-4">
          <p className="text-lg text-muted-foreground">Unpaid Items</p>
          <h2 className="text-2xl font-bold ">{unpaidCount}</h2>
        </div>

        <div className="border-l border-primary/50 p-4">
          <p className="text-lg text-muted-foreground">Paid Orders</p>
          <h2 className="text-2xl font-bold ">{paidOrdersCount}</h2>
        </div>
      </div>
    </div>
  );
}