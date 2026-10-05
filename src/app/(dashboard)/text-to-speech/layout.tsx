import { DashboardMobileHeader } from "@/components/dashboard-mobile-header";

export default function TextToSpeechLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col flex-1 h-full min-h-0">
      <DashboardMobileHeader title="Text to Speech" />
      {children}
    </div>
  );
}