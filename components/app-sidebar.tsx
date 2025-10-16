"use client"

import * as React from "react"
import {
  Home,
  LayoutDashboard,
  Search,
  Sparkles,
  Edit
} from "lucide-react"
import { NavMain } from "@/components/nav-main"
import ChatHistory from "@/components/chat-history"
import { useChatStore } from "@/services/ChatsServices"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { getChats } = useChatStore()
  const [chats, setChats] = React.useState<any[]>([])

  // Fetch chats when component mounts
  React.useEffect(() => {
    const fetchChats = async () => {
      const data = await getChats()
      if (data) setChats(data)
        console.log("chats in sidebar: ", data);
    }
    fetchChats()
  }, [getChats])

  // Sidebar nav items
  const navMain = [
    { title: "Search", url: "#", icon: Search },
    { title: "Ask AI", url: "#", icon: Sparkles },
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, badge: "10" },
    { title: "New Chat", url: "/", icon: Edit },
  ]

  // Convert chats from Supabase into ChatHistory format
  const chatGroups = [
    {
      chats: chats.map((chat: any) => ({
        id: chat.id,
        title:
          chat.chats?.[chat.chats.length - 1]?.userChat || "New Chat",
        url: `/${chat.id}`,
        timestamp: chat.created_at || "Recently",
        isActive: false,
      })),
    },
  ]

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <NavMain items={navMain} />
      </SidebarHeader>
      <SidebarContent>
        <ChatHistory groups={chatGroups} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
