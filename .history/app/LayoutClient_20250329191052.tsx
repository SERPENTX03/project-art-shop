const pathname = usePathname();
const isAdminPage = pathname?.startsWith("/admin");

export const LayoutConnentClient = () => {
  return (
    <div className="max-w-[1600px] mx-auto px-10">
      {!isAdminPage && <Navbar />}{" "}
      {/* แสดง Navbar เฉพาะเมื่อไม่ใช่หน้า admin */}
      {children}
    </div>
  );
};
