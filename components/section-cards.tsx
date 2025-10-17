"use client"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useChatStore, ChatStats } from '@/services/ChatsServices'
import { useEffect, useState } from 'react'
import { createDashboardCardsData } from '@/constants/dashboard-cards'

export function SectionCards() {
  const { getChatStats } = useChatStore()
  const [stats, setStats] = useState<ChatStats>({
    totalChats: 0,
    totalTokens: 0,
    promptTokens: 0,
    completionTokens: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const chatStats = await getChatStats()
        setStats(chatStats)
      } catch (error) {
        console.error('Error fetching chat stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [getChatStats])

  const data = createDashboardCardsData(stats, loading)


  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {data.map((i) => (
        <div key={i.id} >
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>{i.title}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {i.total}
              </CardTitle>
              {/* <CardAction>
                <Badge variant="outline">
                  <TrendingUp />
                  +12.5%
                </Badge>
              </CardAction> */}
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {i.bottomTitle}
              </div>
              <div className="text-muted-foreground">
                {i.bottomSub}
              </div>
            </CardFooter>
          </Card>
        </div>
      ))}


    </div>
  )
}
