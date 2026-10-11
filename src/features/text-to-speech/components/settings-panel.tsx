import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History, Settings } from "lucide-react";
import { SettingsPanelSettings } from "@/features/text-to-speech/components/settings-panel-settings";
import { SettingsPanelHistory } from "@/features/text-to-speech/components/settings-panel-history";

// right side panel of the text-to-speech UI page
export function SettingsPanel() {
  const tabTriggerClass =
    "group flex-1 flex h-7 items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-all select-none " +
    "border-0 border-transparent shadow-none outline-none ring-0 " +
    "text-slate-500 " +
    "data-[state=inactive]:hover:bg-slate-200/50 data-[state=inactive]:hover:text-slate-800 " +
    "data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:font-semibold data-[state=active]:shadow-xs " +
    "data-[state=active]:border-0 data-[state=active]:border-transparent data-[state=active]:ring-0 " +
    "data-active:bg-white data-active:text-slate-900 data-active:shadow-xs data-active:border-0 data-active:ring-0 " +
    "[&[data-state=active]_svg]:text-brand " +
    "after:hidden data-[state=active]:after:hidden " +
    "focus:outline-none focus:ring-0 " +
    "focus-visible:outline-none focus-visible:outline-0 focus-visible:outline-transparent focus-visible:border-transparent " +
    "focus-visible:ring-2 focus-visible:ring-rose-500/35 focus-visible:ring-offset-1";

  return (
    <div className="hidden min-h-0 w-96 border-l border-slate-200/80 bg-white lg:flex flex-col">
      <Tabs defaultValue="settings" className="flex h-full min-h-0 flex-col">
        <div className="border-b border-slate-100 bg-white px-3 py-2">
          <TabsList className="grid h-8 w-full grid-cols-2 rounded-lg bg-slate-100 p-0.5 border-0 shadow-none">
            <TabsTrigger value="settings" className={tabTriggerClass}>
              <Settings className="size-3.5 shrink-0 transition-colors text-slate-400 group-data-[state=active]:text-brand group-data-[state=inactive]:group-hover:text-slate-600" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="history" className={tabTriggerClass}>
              <History className="size-3.5 shrink-0 transition-colors text-slate-400 group-data-[state=active]:text-brand group-data-[state=inactive]:group-hover:text-slate-600" />
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
  );
}