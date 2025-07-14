import Footer from "@/components/Footer";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import Navbar from "@/components/navbar/Navbar";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<LoadingSkeleton />}>
        <NuqsAdapter>
          <main className="max-w-[1600px] mx-auto px-10">
            <Navbar />
            {children}
          </main>
          <Footer />
        </NuqsAdapter>
      </Suspense>
    </>
  );
}
