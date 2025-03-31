import Navbar from "@/components/navbar/Navbar";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NuqsAdapter>
        <main className="max-w-[1600px] mx-auto px-10">
          <Navbar />
          {children}
        </main>
      </NuqsAdapter>
    </>
  );
}
