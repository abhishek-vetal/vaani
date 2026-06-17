import { PageHeader } from "@/components/page-header";

export default function TextToSpeechLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <PageHeader title="Text to Speech" />
      {children}
    </div>
  )
}