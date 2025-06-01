import LoadingSkeleton from "@/components/LoadingSkeleton";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";

export default function CommuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <NuqsAdapter>
        <main className="max-w-[1600px] mx-auto px-10">{children}</main>
      </NuqsAdapter>
    </Suspense>
  );
}
