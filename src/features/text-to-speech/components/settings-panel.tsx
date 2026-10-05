import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History, Settings } from "lucide-react";
import { SettingsPanelSettings } from "@/features/text-to-speech/components/settings-panel-settings";
import { SettingsPanelHistory } from "@/features/text-to-speech/components/settings-panel-history";

// right side panel of the text-to-speech UI page
export function SettingsPanel() {
  const tabTriggerClass =
    "flex-1 flex h-7 items-center justify-center gap-1.5 rounded-lg text-xs font-medium transition-colors select-none " +
    "data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 data-[state=active]:font-semibold data-[state=active]:shadow-none " +
    "data-active:bg-slate-100 data-active:text-slate-900 data-active:shadow-none " +
    "data-[state=inactive]:bg-transparent data-[state=inactive]:text-slate-400 hover:text-slate-700 " +
    "border-none shadow-none after:hidden data-[state=active]:after:hidden";

  return (
    <div className="hidden min-h-0 w-96 border-l border-slate-200/80 bg-white lg:flex flex-col">
      <Tabs defaultValue="settings" className="flex h-full min-h-0 flex-col">
        <div className="border-b border-slate-100 bg-white px-3 py-2">
          <TabsList className="flex h-7 w-full items-center gap-1 bg-transparent p-0 border-none shadow-none">
            <TabsTrigger value="settings" className={tabTriggerClass}>
              <Settings className="size-3.5" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="history" className={tabTriggerClass}>
              <History className="size-3.5" />
              History
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent
          value="settings"
          className="mt-0 flex min-h-0 flex-1 flex-col overflow-y-auto"
        >
          <SettingsPanelSettings />
        </TabsContent>
        <TabsContent
          value="history"
          className="mt-0 flex min-h-0 flex-1 flex-col overflow-y-auto"
        >
          <SettingsPanelHistory />
        </TabsContent>
      </Tabs>
    </div>
  )
}