"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  amount: number;
  description: string;
  userId: string;
  galleryId: string;
}

export default function OmiseQrDialog({
  amount,
  description,
  userId,
  galleryId,
}: Props) {
  const [qrUrl, setQrUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchQR = async () => {
    if (!userId || !galleryId) {
      setError("ข้อมูลไม่ครบ ไม่สามารถสร้าง QR ได้");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payment/qr", {
        method: "POST",
        body: JSON.stringify({ amount, description, userId, galleryId }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "เกิดข้อผิดพลาดขณะสร้าง QR");
      }

      const data = await res.json();
      setQrUrl(data.qr);
    } catch (err: unknown) {
      console.error("Error loading QR:", err);
      setError(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="button-custom h-[50px] px-2 w-full"
          onClick={fetchQR}
        >
          QR PromptPay
        </button>
      </DialogTrigger>

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
            <p className="text-sm text-muted-foreground">
              โปรดชำระเงินภายใน 10 นาที
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
