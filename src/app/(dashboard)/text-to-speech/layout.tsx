import { DashboardMobileHeader } from "@/components/dashboard-mobile-header";

export default function TextToSpeechLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardMobileHeader title="Text to Speech" />
      {children}
    </div>
  )
}