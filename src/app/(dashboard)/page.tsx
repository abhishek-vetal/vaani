import { DashboardMobileHeader } from "@/components/dashboard-mobile-header";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { HeroWavyBackground } from "@/features/dashboard/components/hero-wavy-background";
import { TextInputPanel } from "@/features/dashboard/components/text-input-panel";
import { QuickActionPanel } from '@/features/dashboard/components/quick-action-panel';

export default function DashboardPage() {
  return (
    <div className="relative">
      {/* can be seen only for the sm or md screen width */}
      <DashboardMobileHeader title="Dashboard" className="lg:hidden" />
      {/* <HeroWavyBackground /> */}
      <div className="relative space-y-8 p-4 lg:p-16">
        <DashboardHeader />
        <TextInputPanel />
        <QuickActionPanel />
      </div>
    </div>
  )
}