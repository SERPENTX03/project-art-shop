import { AppSidebar } from "@/components/sidebar/dashboard";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <SidebarProvider>
        <AppSidebar />
        {/* Main content */}
        <SidebarTrigger />
        <main className="flex-1 w-full p-4 overflow-auto">{children}</main>
      </SidebarProvider>
    </div>
  );
}
