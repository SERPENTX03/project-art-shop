"use client";

import { ReceiptPDF } from "./ReceiptPDF";

export type ReceiptSession = {
  id: string;
  customer_email: string | null;
  payment_status: string;
  amount_total: number | null;
  currency: string | null;
};

export default function ReceiptPDFWrapper({
  session,
}: {
  session: ReceiptSession;
}) {
  return <ReceiptPDF session={session} />;
}
