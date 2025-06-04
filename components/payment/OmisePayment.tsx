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
  const [orderId, setOrderId] = useState("");
  const [orderStatus, setOrderStatus] = useState("PENDING");
  const [open, setOpen] = useState(false);
  const [countdown, setCountdown] = useState(600); // 10 นาที
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

      if (!res.ok || !data.qr) {
        throw new Error(data.error || "ไม่สามารถสร้าง QR ได้");
      }

      setQrUrl(data.qr);
      setOrderId(data.orderId);
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

  // Poll order status
  useEffect(() => {
    if (!orderId || orderStatus === "PAID") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/order/status?orderId=${orderId}`);
        const data = await res.json();

        if (data.status?.toLowerCase?.() === "successful") {
          setOrderStatus("PAID");
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Failed to fetch order status:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId, orderStatus]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const sec = (seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  useEffect(() => {
    if (orderStatus === "PAID") {
      toast.success("✅ ชำระเงินสำเร็จ");
      router.push("/checkout/success/omise");
    }
  }, [orderStatus, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* ลบ DialogTrigger ออก */}
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
            <p className="text-lg font-semibold text-center">
              💰 ยอดชำระ: {total.toFixed(2)} บาท
            </p>
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
