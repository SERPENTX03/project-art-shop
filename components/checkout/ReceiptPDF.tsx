"use client";

import { useRef } from "react";
import html2pdf from "html2pdf.js";
type ReceiptSession = {
  id: string;
  customer_email: string | null;
  payment_status: string;
  amount_total: number | null;
  currency: string | null;
};

export function ReceiptPDF({ session }: { session: ReceiptSession }) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const element = receiptRef.current;
    if (!element) return;

    const options = {
      filename: `receipt-${session.id}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 3 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf()
      .from(element)
      .set(options)
      .save()
      .catch((err: unknown) => {
        if (err instanceof Error) {
          console.error("PDF download error:", err.message);
        } else {
          console.error("Unknown error occurred during PDF download:", err);
        }
      });
  };
  return (
    <div>
      <div ref={receiptRef} className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-xl font-bold mb-2">Receipt</h1>
        <p>
          <strong>Customer:</strong> {session.customer_email}
        </p>
        <p>
          <strong>Status:</strong> {session.payment_status}
        </p>
        <p>
          <strong>Total:</strong> {session.amount_total! / 100}{" "}
          {session.currency?.toUpperCase()}
        </p>
      </div>

      <button onClick={handleDownload} className="button-custom mt-4 px-4 py-2">
        📄 Download PDF
      </button>
    </div>
  );
}
