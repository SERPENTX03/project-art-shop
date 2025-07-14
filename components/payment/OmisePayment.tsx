"use client";

import { useState, useEffect } from "react";
import { CartItem } from "@/types/cart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAddressStore } from "@/store/addressStore";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface Props {
  items: CartItem[];
  total: number;
}

export default function OmisePaymentButton({ items, total }: Props) {
  const { address } = useAddressStore();

  const [qrUrl, setQrUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [chargeId, setChargeId] = useState(""); // ✅ เปลี่ยนจาก orderId เป็น chargeId
  const [orderStatus, setOrderStatus] = useState("PENDING");
  const [open, setOpen] = useState(false);
  const [countdown, setCountdown] = useState(600); // 10 นาที
  const [productTotal, setProductTotal] = useState(0);
  const [shippingTotal, setShippingTotal] = useState(0);

  const router = useRouter();

  const fetchQR = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/payment/omise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items, total, address }),
      });

      const data = await res.json();

      if (!res.ok || !data.qr || !data.chargeId) {
        throw new Error(data.error || "ไม่สามารถสร้าง QR ได้");
      }

      setQrUrl(data.qr);
      setChargeId(data.chargeId); // ✅ set chargeId แทน
      setProductTotal(data.productTotal);
      setShippingTotal(data.shippingTotal);
      setCountdown(600);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer
  useEffect(() => {
    if (!qrUrl || orderStatus === "PAID") return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [qrUrl, orderStatus]);

  // Poll order status via chargeId
  useEffect(() => {
    if (!chargeId || orderStatus === "PAID") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/order/status?chargeId=${chargeId}`);
        const data = await res.json();

        if (data.status?.toUpperCase() === "PAID") {
          setOrderStatus("PAID");
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Failed to fetch order status:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [chargeId, orderStatus]);

  useEffect(() => {
    if (orderStatus === "PAID") {
      toast.success("✅ ชำระเงินสำเร็จ");
      router.push("/checkout/success/omise");
    }
  }, [orderStatus, router]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const sec = (seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        className="button-custom h-[50px] px-2 w-full"
        onClick={() => {
          if (!address) {
            toast.warn("กรุณาเลือกที่อยู่ก่อนชำระเงิน");
            return;
          }

          setOpen(true);
          fetchQR();
        }}
      >
        ชำระด้วย QR พร้อมเพย์
      </button>

      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>QR พร้อมเพย์</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-center">⏳ กำลังโหลด QR...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : qrUrl ? (
          <div className="flex flex-col items-center space-y-4">
            <img
              src={qrUrl}
              alt="QR พร้อมเพย์"
              width={250}
              height={250}
              className="rounded-lg border"
            />
            <div className="text-sm text-center space-y-1">
              <p>
                🖼️ ราคาสินค้า:{" "}
                <span className="font-semibold">
                  {productTotal.toFixed(2)} บาท
                </span>
              </p>
              <p>
                📦 ค่าส่ง:{" "}
                <span className="font-semibold">
                  {shippingTotal.toFixed(2)} บาท
                </span>
              </p>
              <p className="text-lg font-bold mt-2">
                💰 ยอดชำระทั้งหมด: {total.toFixed(2)} บาท
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              โปรดชำระเงินภายใน 10 นาที ({formatTime(countdown)})
            </p>
          </div>
        ) : (
          <p className="text-center text-sm text-gray-500">
            ยังไม่มี QR โปรดกดปุ่มเพื่อสร้าง
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
