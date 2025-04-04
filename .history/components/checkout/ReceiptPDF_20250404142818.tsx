"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 10 },
  title: { fontSize: 20, marginBottom: 10 },
  text: { fontSize: 12 },
});

const ReceiptDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>🧾 Receipt</Text>
        <Text style={styles.text}>Customer: john@example.com</Text>
        <Text style={styles.text}>Status: Paid</Text>
        <Text style={styles.text}>Total: 29.90 THB</Text>
      </View>
    </Page>
  </Document>
);

export default function ReceiptPDFClient() {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-lg font-bold mb-2">Receipt Preview</h1>
      <PDFDownloadLink
        document={<ReceiptDocument />}
        fileName="receipt-demo.pdf"
        className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        📄 Download PDF
      </PDFDownloadLink>
    </div>
  );
}
