import { PageHeader } from "@/components/page-header";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { HeroWavyBackground } from "@/features/dashboard/components/hero-wavy-background";
import { TextInputPanel } from "@/features/dashboard/components/text-input-panel";
import { QuickActionPanel } from '@/features/dashboard/components/quick-action-panel';

export default function DashboardPage() {
  return (
    <div className="relative">
      <PageHeader title="Dashboard" className="lg:hidden" />
      <HeroWavyBackground />
      <div className="relative space-y-8 p-4 lg:p-16">
        <DashboardHeader />
        <TextInputPanel />
        <QuickActionPanel />
      </div>
    </div>
  )
}
