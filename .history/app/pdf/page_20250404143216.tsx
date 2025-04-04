import dynamic from "next/dynamic";

// Dynamic import แบบ client-only
const PDFClient = dynamic(() => import("@/components/checkout/ReceiptPDF"), {
  ssr: false,
});

export default function PDFPage() {
  return (
    <div className="max-w-xl mx-auto mt-10">
      <PDFClient />
    </div>
  );
}
