import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="relative flex-1 w-full bg-white overflow-x-hidden">
        {/* Content */}
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}