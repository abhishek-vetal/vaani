import { PageHeader } from "@/components/page-header";

export default function TextToSpeechLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="Text to Speech" />
      {children}
    </div>
  )
}