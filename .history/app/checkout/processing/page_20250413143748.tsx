"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const ProcessingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!orderId) return;

    const interval = setInterval(async () => {
      const res = await fetch(`/api/order/status?orderId=${orderId}`);
      const data = await res.json();

      if (data.status === "PAID") {
        clearInterval(interval);
        router.push(`/checkout/success?session_id=${data.sessionId}`);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [orderId, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold mb-4">กำลังรอการชำระเงิน...</h2>
      <p className="text-gray-500 text-sm">
        หากคุณชำระเงินสำเร็จ ระบบจะพาไปยังหน้าสำเร็จโดยอัตโนมัติ
      </p>
    </div>
  );
};

export default ProcessingPage;
