import { ChatStats } from '@/services/ChatsServices'

export type DashboardCardData = {
  title: string
  id: string
  total: string
  bottomTitle: string
  bottomSub: string
}

export const createDashboardCardsData = (stats: ChatStats, loading: boolean): DashboardCardData[] => [
  {
    title: "Total Chats",
    id: "1",
    total: loading ? "..." : stats.totalChats.toLocaleString(),
    bottomTitle: "Total Conversations",
    bottomSub: "All chats recorded so far",
  },
  {
    title: "Chat Total Token",
    id: "2",
    total: loading ? "..." : stats.promptTokens.toLocaleString(),
    bottomTitle: "User Prompt Tokens",
    bottomSub: "Tokens used when sending messages",
  },
  {
    title: "Respond Token",
    id: "3",
    total: loading ? "..." : stats.completionTokens.toLocaleString(),
    bottomTitle: "AI Response Tokens",
    bottomSub: "Tokens generated from AI replies",
  },

  {
    title: "Total Token Used",
    id: "4",
    total: loading ? "..." : stats.totalTokens.toLocaleString(),
    bottomTitle: "Overall Token Usage",
    bottomSub: "Sum of prompt and response tokens",
  },

]
