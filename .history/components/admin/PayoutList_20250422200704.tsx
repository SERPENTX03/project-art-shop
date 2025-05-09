import { useEffect, useState } from "react";

interface Payout {
  id: string;
  amount: number;
  status: string;
  transferredAt: Date;
  note: string;
  shop: {
    name: string;
  };
  gallery: {
    title: string;
  };
}

export default function PayoutList() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  console.log(payouts);

  useEffect(() => {
    fetch("/api/payout/all")
      .then((res) => res.json())
      .then((data) => setPayouts(data.payouts || []))
      .catch(() => setPayouts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>⏳ กำลังโหลด...</p>;

  if (!payouts.length)
    return <p className="text-muted-foreground">ยังไม่มีประวัติการโอน</p>;

  return (
    <div className="space-y-3">
      {payouts.map((payout) => (
        <div
          key={payout.id}
          className="border p-4 rounded-xl shadow-sm bg-white space-y-1"
        >
          <p className="text-lg font-semibold text-green-700">
            💸 {payout.amount.toLocaleString()} บาท
          </p>
          <p className="text-sm text-muted-foreground">
            📅 วันที่โอน:{" "}
            {payout.transferredAt
              ? new Date(payout.transferredAt).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "ยังไม่ระบุ"}
          </p>
          {payout.shop?.name && (
            <p className="text-sm">💼 ร้าน: {payout.shop.name}</p>
          )}
          {payout.gallery?.title && (
            <p className="text-sm">🖼️ ผลงาน: {payout.gallery.title}</p>
          )}
          {payout.note && (
            <p className="text-sm text-muted-foreground">
              📝 หมายเหตุ: {payout.note}
            </p>
          )}
          <p className="text-sm">
            ✅ สถานะ:{" "}
            <span
              className={
                payout.status === "PAID"
                  ? "text-green-600 font-medium"
                  : payout.status === "PENDING"
                  ? "text-yellow-600 font-medium"
                  : "text-red-600 font-medium"
              }
            >
              {payout.status}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}
