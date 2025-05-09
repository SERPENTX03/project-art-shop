"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { ShopProps } from "@/types/shop";

interface Payout {
  amount: number;
  createdAt: string;
}

interface Props {
  payout: Payout[];
  shop: ShopProps | null;
}

function getFirstDayOfMonth(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export default function PayoutSummary({ payout, shop }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [fromDate, setFromDate] = useState(
    searchParams.get("from") || getFirstDayOfMonth()
  );
  const [toDate, setToDate] = useState(searchParams.get("to") || getToday());

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (fromDate) params.set("from", fromDate);
    if (toDate) params.set("to", toDate);
    router.replace(`?${params.toString()}`);
  };

  const total = useMemo(() => {
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate
      ? new Date(new Date(toDate).setHours(23, 59, 59, 999))
      : null;
    return payout
      .filter((p) => {
        const created = new Date(p.createdAt);
        return (!from || created >= from) && (!to || created <= to);
      })
      .reduce((sum, p) => sum + p.amount, 0);
  }, [payout, fromDate, toDate]);

  console.log(total);
  return (
    <div className="space-y-6 mt-10">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold tracking-tight">
          💸 สรุปยอดการโอนเงินที่ได้
        </h2>
      </div>

      <div className="bg-muted p-4 rounded-xl shadow-sm space-y-4">
        <div className="flex items-center justify-between  gap-4">
          <div className="flex gap-2">
            <div className="flex flex-col gap-2">
              <Label>จากวันที่</Label>
              <Input
                className="w-fit"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>ถึงวันที่</Label>
              <Input
                className="w-fit"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleFilter} className="w-fit px-10 cursor-pointer">
            🔍 ค้นหา
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 text-center text-xl font-semibold text-green-600">
          ✅ ยอดรวมทั้งหมด: {total.toLocaleString()} บาท
        </CardContent>
      </Card>
    </div>
  );
}
