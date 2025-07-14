import { requireAdmin } from "@/actions/checkadmin";
import { AppSidebar } from "@/components/sidebar/admin";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default async function AdminDashBoard({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return (
    <div className="flex min-h-screen ">
      <SidebarProvider>
        <AppSidebar />
        {/* Main content */}
        <SidebarTrigger />
        <main className="flex-1 w-full p-4 overflow-auto">{children}</main>
      </SidebarProvider>
    </div>
  );
}
