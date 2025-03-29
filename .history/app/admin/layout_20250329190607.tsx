// app/admin/layout.tsx
import type { Metadata } from "next";
import { Literata } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";

const literata = Literata({
  subsets: ["latin"],
  weight: "300",
  style: "italic",
  variable: "--literata",
});

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin panel",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${literata.variable} antialiased`}>
          <div className="max-w-[1600px] mx-auto px-10">{children}</div>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
