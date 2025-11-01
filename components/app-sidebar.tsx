"use client"

import React, { useEffect, useState } from "react"
import {
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
  const { getChatsHistory } = useChatStore()
  const [chats, setChats] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Fetch chats when component mounts
  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true)
      const data = await getChatsHistory()
      if (data)
        setChats(data)
      setLoading(false)
    }
    fetchChats()
  }, [getChatsHistory])

  // Sidebar nav items
  const navMain = [
    { title: "Search", url: "#", icon: Search },
    { title: "Generate Questions", url: "#", icon: Sparkles },
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, badge: "10" },
    { title: "New Chat", url: "/", icon: Edit },
  ]

  // Convert chats from Supabase into ChatHistory format
  const chatGroups = [
    {
      chats: chats.map((chat: any) => ({
        id: chat.id,
        title: chat.title || chat.chats?.[chat.chats.length - 1]?.userChat,
        url: `/${chat.id}`,
        timestamp: chat.created_at || "Recently",
        archived: chat.archived,
      })),
    },
  ]

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <NavMain items={navMain} />
      </SidebarHeader>
      <SidebarContent>
        <ChatHistory groups={chatGroups} loading={loading} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
