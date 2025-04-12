"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  amount: number;
  description: string;
}

export default function OmiseQrDialog({ amount, description }: Props) {
  const [qrUrl, setQrUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchQR = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payment/qr", {
        method: "POST",
        body: JSON.stringify({ amount, description }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setQrUrl(data.qr);
    } catch (err) {
      console.error("Error loading QR:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="button-custom h-[20px]" onClick={fetchQR}>
          ชำระด้วยพร้อมเพย์
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>QR พร้อมเพย์</DialogTitle>
        </DialogHeader>
        {loading ? (
          <p className="text-center">กำลังโหลด QR...</p>
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
          <p className="text-center text-sm text-gray-500">ยังไม่มี QR</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
