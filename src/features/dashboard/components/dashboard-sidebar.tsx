"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { UsageContainer } from "@/features/billing/components/usage-container";
import { VoiceCreateDialog } from "@/features/voices/components/voice-create-dialog";
import { OrganizationSwitcher, useClerk, UserButton } from "@clerk/nextjs";
import { Home, LayoutGrid, AudioLines, Volume2, LucideIcon, Headphones, Settings, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";


interface MenuItem {
  title: string;
  url?: string;
  icon: LucideIcon;
  onClick?: () => void;
}

interface NavSectionProps {
  label?: string;
  items: MenuItem[];
  pathname?: string;
}

function NavSection({ label, items, pathname }: NavSectionProps) {
  return (
    <SidebarGroup>
      {
        label &&
        <SidebarGroupLabel>{label}</SidebarGroupLabel>
      }
      <SidebarGroupContent>
        <SidebarMenu>
          {
            items.map(item => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild={!!item.url}
                  onClick={item.onClick}
                  tooltip={item.title}
                  isActive={!!item.url && (pathname === item.url || pathname?.startsWith(`${item.url}/`))}
                  className="h-10 rounded-xl px-3 py-2 text-[13px] font-medium tracking-tight text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 [&_svg]:text-slate-400 hover:[&_svg]:text-slate-600 data-[active=true]:bg-rose-50/90 data-[active=true]:text-brand data-[active=true]:font-semibold data-[active=true]:shadow-none data-[active=true]:[&_svg]:text-brand data-[active=true]:hover:bg-rose-100/60 data-[active=true]:hover:text-brand data-active:bg-rose-50/90 data-active:text-brand data-active:font-semibold data-active:shadow-none data-active:[&_svg]:text-brand data-active:hover:bg-rose-100/60 data-active:hover:text-brand"
                >
                  {item.url ? (
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  ) : (
                    <>
                      <item.icon />
                      <span>{item.title}</span>
                    </>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          }
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const clerk = useClerk();
  const [voiceDialogOpen, setVoiceDialogOpen] = useState(false);

  const mainMenuItems: MenuItem[] = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Explore voices",
      url: "/voices",
      icon: LayoutGrid,
    },
    {
      title: "Text to speech",
      url: "/text-to-speech",
      icon: AudioLines,
    },
    {
      title: "Voice cloning",
      icon: Volume2,
      onClick: () => setVoiceDialogOpen(true),
    },
  ];

  const othersMenuItems: MenuItem[] = [
    {
      title: "Settings",
      icon: Settings,
      onClick: () => clerk.openOrganizationProfile(),
    },
    {
      title: "Help and support",
      url: "mailto:business@vaani-ai.online",
      icon: Headphones,
    },
    {
      title: "Sign out",
      icon: LogOut,
      onClick: () => clerk.signOut({ redirectUrl: "/" }),
    },
  ];

  return (
    <>
      <VoiceCreateDialog
        open={voiceDialogOpen}
        onOpenChange={(val) => setVoiceDialogOpen(val)}
      />

      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarHeader className="p-3 pb-2.5 gap-2.5">
          <div className="flex items-center gap-2.5 px-1 py-0.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-90 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-rose-500/30 rounded-lg"
            >
              <Image
                src="/logo.png"
                alt="Vaani logo"
                width={38}
                height={38}
                className="size-[38px] shrink-0 select-none"
                priority
              />

              <span className="text-[20px] font-semibold tracking-[-0.03em] text-charcoal leading-none group-data-[collapsible=icon]:hidden">
                Vaani
              </span>
            </Link>

            <SidebarTrigger className="ml-auto lg:hidden" />
          </div>

          <SidebarMenu>
            <SidebarMenuItem>
              <OrganizationSwitcher
                hidePersonal={true}
                fallback={
                  <Skeleton
                    className="h-9 w-full group-data-[collapsible=icon]:size-8 rounded-xl border border-slate-200/80 bg-white"
                  />
                }
                appearance={{
                  elements: {
                    rootBox:
                      "w-full! group-data-[collapsible=icon]:w-auto! group-data-[collapsible=icon]:flex! group-data-[collapsible=icon]:justify-center!",
                    organizationSwitcherTrigger:
                      "w-full! h-9! justify-between! items-center! bg-white! border! border-slate-200/80! hover:border-slate-300! hover:bg-slate-50/70! transition-colors! rounded-xl! px-2! gap-2! shadow-2xs! group-data-[collapsible=icon]:w-auto! group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center!",
                    organizationPreview: "flex! items-center! gap-2! min-w-0!",
                    organizationPreviewAvatarBox:
                      "size-6! shrink-0! rounded-md!",
                    organizationPreviewTextContainer:
                      "min-w-0! text-left! group-data-[collapsible=icon]:hidden!",
                    organizationPreviewMainIdentifier:
                      "truncate! text-[13px]! font-medium! text-slate-800! tracking-tight!",
                    organizationSwitcherTriggerIcon:
                      "size-3.5! text-slate-400! shrink-0! group-data-[collapsible=icon]:hidden!",
                  },
                }}
              />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <div className="border-b border-dotted" />

        <SidebarContent>
          <NavSection
            items={mainMenuItems}
            pathname={pathname}
          />
          <NavSection
            label="OTHERS"
            items={othersMenuItems}
            pathname={pathname}
          />
        </SidebarContent>

        <div className="border-b border-dotted" />

        <SidebarFooter className="p-3 gap-2.5">
          <UsageContainer />

          <SidebarMenu>
            <SidebarMenuItem>
              <UserButton
                showName={true}
                fallback={
                  <Skeleton className="h-8.5 w-full group-data-[collapsible=icon]:size-8 rounded-xl border border-border bg-white" />
                }
                appearance={{
                  elements: {
                    rootBox:
                      "w-full! group-data-[collapsible=icon]:w-auto! group-data-[collapsible=icon]:flex! group-data-[collapsible=icon]:justify-center!",
                    userButtonTrigger:
                      "w-full! justify-between! bg-white! border! border-border! rounded-xl! pl-1! pr-2! py-1! shadow-[0px_1px_1.5px_0px_rgba(44,54,53,0.03)]! group-data-[collapsible=icon]:w-auto! group-data-[collapsible=icon]:p-1! group-data-[collapsible=icon]:after:hidden! [--border:color-mix(in_srgb,transparent,var(--clerk-color-neutral,#000000)_15%)]!",
                    userButtonBox: "flex-row-reverse! gap-2!",
                    userButtonOuterIdentifier:
                      "text-[13px]! tracking-tight! font-medium! text-foreground! pl-0! group-data-[collapsible=icon]:hidden!",
                    userButtonAvatarBox: "size-6!",
                  }
                }}
              />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
    </>
  );
}