import dynamic from "next/dynamic";

// Import แบบ client-only เพื่อให้ PDFDownloadLink ทำงานได้จริง
const ReceiptPDFClient = dynamic(
  () => import("@/components/checkout/ReceiptPDF"),
  {
    ssr: false,
  }
);

export default function PDFPage() {
  return (
    <div className="max-w-xl mx-auto mt-10">
      <ReceiptPDFClient />
    </div>
  );
}
