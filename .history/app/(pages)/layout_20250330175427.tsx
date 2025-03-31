import Navbar from "@/components/navbar/Navbar";
import { QueryParamProvider } from "nuqs";
import { cookies } from "next/headers";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <QueryParamProvider adapter={{ cookies }}>
        <main className="max-w-[1600px] mx-auto px-10">
          <Navbar />
          {children}
        </main>
      </QueryParamProvider>
    </>
  );
}
