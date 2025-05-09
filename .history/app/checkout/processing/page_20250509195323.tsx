"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// เนื้อหาหลักของหน้า
const ProcessingContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!orderId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/order/status?orderId=${orderId}`);
        const data = await res.json();

        if (data.status === "PAID") {
          clearInterval(interval);
          router.push(`/checkout/success?session_id=${data.sessionId}`);
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
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

// หน้าหลักที่ใช้ Suspense
const ProcessingPage = () => {
  return (
    <Suspense fallback={<div>กำลังโหลด...</div>}>
      <ProcessingContent />
    </Suspense>
  );
};

export default ProcessingPage;
