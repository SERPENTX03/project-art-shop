import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        {/* Main content */}
        <SidebarTrigger />
        <main className="flex-1 w-full border p-4 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
