import { DashboardMobileHeader } from "@/components/dashboard-mobile-header";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { TextInputPanel } from "@/features/dashboard/components/text-input-panel";
import { QuickActionPanel } from "@/features/dashboard/components/quick-action-panel";

export default function DashboardPage() {
  return (
    <div className="relative min-h-full bg-[#fbfaf8]">
      <DashboardMobileHeader title="Dashboard" className="lg:hidden" />
      <div className="mx-auto w-full max-w-360 space-y-8 p-4 sm:p-5 lg:p-8 xl:p-10">
        <DashboardHeader />
        <TextInputPanel />
        <div className="pt-1">
          <QuickActionPanel />
        </div>
      </div>
    </div>
  );
}