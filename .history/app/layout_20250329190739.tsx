"use client";
import type { Metadata } from "next";
import { Literata } from "next/font/google";
import "./globals.css";
import { ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";

const literata = Literata({
  subsets: ["latin"],
  weight: "300",
  style: "italic",
  variable: "--literata",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${literata.variable}  antialiased`}>
          <ClerkLoading>
            <div className="flex items-center justify-center h-screen text-2xl">
              LOADING...
            </div>
          </ClerkLoading>
          <LayoutContent>{children}</LayoutContent>
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

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin"); // ตรวจสอบว่าเป็นหน้า admin หรือไม่

  return (
    <div className="max-w-[1600px] mx-auto px-10">
      {!isAdminPage && <Navbar />}{" "}
      {/* แสดง Navbar เฉพาะเมื่อไม่ใช่หน้า admin */}
      {children}
    </div>
  );
}
