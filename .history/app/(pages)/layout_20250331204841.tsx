import Navbar from "@/components/navbar/Navbar";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";

function LoadingSkeleton() {
  return (
    <div className="max-w-[1600px] mx-auto px-10">
      <div className="h-16 bg-gray-200 animate-pulse" />{" "}
      {/* Skeleton สำหรับ Navbar */}
      <div className="mt-4 h-64 bg-gray-200 animate-pulse" />{" "}
      {/* Skeleton สำหรับ content */}
    </div>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<LoadingSkeleton />}>
        {" "}
        <NuqsAdapter>
          <main className="max-w-[1600px] mx-auto px-10">
            <Navbar />
            {children}
          </main>
        </NuqsAdapter>
      </Suspense>
    </>
  );
}
