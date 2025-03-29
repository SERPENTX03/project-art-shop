import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";

const pathname = usePathname();
const isAdminPage = pathname?.startsWith("/admin");

export const LayoutClient = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-[1600px] mx-auto px-10">
      {!isAdminPage && <Navbar />}{" "}
      {/* แสดง Navbar เฉพาะเมื่อไม่ใช่หน้า admin */}
      {children}
    </div>
  );
};
