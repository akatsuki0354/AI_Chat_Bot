"use client"
import * as React from "react"
import {
  Home,
  LayoutDashboard,
  Search,
  Sparkles,
} from "lucide-react"
import { NavMain } from '@/components/nav-main'

import ChatHistory from '@/components/chat-history'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

// This is sample data.
const data = {

  navMain: [
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Ask AI",
      url: "#",
      icon: Sparkles,
    },
    {
      title: "Home",
      url: "#",
      icon: Home,
      isActive: true,
    },
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboard,
      badge: "10",
    },
  ],

  chat: [
    {
      chats: [
        {
          id: "daily-journal",
          title: "Daily Journal & Reflection",
          url: "#",
          timestamp: "2 hours ago",
          isActive: true,
        },
        {
          id: "health-tracker",
          title: "Health & Wellness Tracker",
          url: "#",
          timestamp: "1 day ago",
        },
        {
          id: "personal-growth",
          title: "Personal Growth & Learning Goals",
          url: "#",
          timestamp: "2 days ago",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <ChatHistory groups={data.chat} />

      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
