import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

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
