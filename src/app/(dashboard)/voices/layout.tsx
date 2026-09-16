import { DashboardMobileHeader } from "@/components/dashboard-mobile-header";

export default function VoicesLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <DashboardMobileHeader title="Voices" />
      {children}
    </div>
  );
}