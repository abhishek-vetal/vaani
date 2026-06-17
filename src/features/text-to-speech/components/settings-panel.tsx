import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History, Settings } from "lucide-react";
import { SettingsPanelSettings } from "@/features/text-to-speech/components/settings-panel-settings";
import { SettingsPanelHistory } from "@/features/text-to-speech/components/settings-panel-history";

export function SettingPanel() {
  const tabTriggerClassName = "gap-2 bg-transparent rounded-none border-x-0 border-t-0 border-b-px border-b-transparent shadow-none data-[state=active]:border-b-foreground group-data-[variant=default]/tabs-list:data-[state=active]:shadow-none";

  return (
    <div className="hidden min-h-0 w-100 border-l lg:flex flex-col">
      <Tabs defaultValue="settings" className="flex h-full min-h-0 flex-col">
        <TabsList className="rounded-none w-full bg-transparent border-b h-12 p-0 group-data-[orientation=horizontal]/tabs:h-12">
          <TabsTrigger value="settings" className={tabTriggerClassName}>
            <Settings className="size-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="history" className={tabTriggerClassName}>
            <History className="size-4" />
            History
          </TabsTrigger>
        </TabsList>
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