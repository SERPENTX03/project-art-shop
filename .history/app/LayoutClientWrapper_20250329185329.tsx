"use client";

import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export function LayoutClientWrapper({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function ContentWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isAdminPage = pathname.startsWith("/admin");
  return (
    <div className="max-w-[1600px] mx-auto px-10">
      {!isAdminPage && <Navbar />}
      {children}
    </div>
  );
}
