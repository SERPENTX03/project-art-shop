// app/dashboard/page.tsx
"use client";

import { useState, useEffect, useTransition } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTotalSalesAllShops } from "@/actions/getTotalSale";

export default function DashboardPage() {
  const [data, setData] = useState<any[]>([]);
  const [filter, setFilter] = useState("today");
  const [customRange, setCustomRange] = useState<[Date | null, Date | null]>([null, null]);
  const [isPending, startTransition] = useTransition();

  const totalShops = data.length;
  const totalSales = data.reduce((sum, shop) => sum + shop.totalSales, 0);
  const averageSales = totalShops > 0 ? totalSales / totalShops : 0;

  useEffect(() => {
    startTransition(async () => {
      let startDate: Date | undefined;
      let endDate: Date | undefined = new Date();
      const now = new Date();

      if (filter === "today") {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (filter === "month") {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else if (filter === "year") {
        startDate = new Date(now.getFullYear(), 0, 1);
      } else if (filter === "custom" && customRange[0] && customRange[1]) {
        startDate = customRange[0];
        endDate = customRange[1];
      }

      const result = await getTotalSalesAllShops(startDate, endDate);
      setData(result);
    });
  }, [filter, customRange]);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold">📊 Sales Dashboard</h1>

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-4">
        <Select value={filter} onValueChange={(v) => setFilter(v)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="เลือกช่วงเวลา" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">วันนี้</SelectItem>
            <SelectItem value="month">เดือนนี้</SelectItem>
            <SelectItem value="year">ปีนี้</SelectItem>
            <SelectItem value="custom">กำหนดเอง</SelectItem>
          </SelectContent>
        </Select>

        {filter === "custom" && (
          <div className="flex items-center gap-2">
            <DatePicker
              selected={customRange[0]}
              onChange={(dates) => setCustomRange(dates as [Date, Date])}
              startDate={customRange[0]}
              endDate={customRange[1]}
              selectsRange
              className="border rounded px-3 py-1"
              dateFormat="yyyy-MM-dd"
            />
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-md flex flex-col items-center">
          <p className="text-sm text-gray-500">จำนวนร้านทั้งหมด</p>
          <p className="text-2xl font-bold">{totalShops}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md flex flex-col items-center">
          <p className="text-sm text-gray-500">ยอดขายรวม</p>
          <p className="text-2xl font-bold">
            {totalSales.toLocaleString()} ฿
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md flex flex-col items-center">
          <p className="text-sm text-gray-500">ยอดขายเฉลี่ยต่อร้าน</p>
          <p className="text-2xl font-bold">
            {averageSales.toLocaleString(undefined, { maximumFractionDigits: 2 })} ฿
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded-xl shadow-md h-[500px]">
        {isPending ? (
          <p>Loading...</p>
        ) : data.length === 0 ? (
          <p className="text-center text-gray-500">ไม่มีข้อมูล</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="shopName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalSales" fill="#4F46E5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
