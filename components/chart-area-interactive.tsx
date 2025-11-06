"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import React, { useState, useEffect, useMemo } from "react"
import { useIsMobile } from '@/hooks/use-mobile'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group'
export const description = "An interactive area chart"
import { useChatStore } from '../services/ChatsServices'
type ChartPoint = {
  date: string
  prompt: number // prompt tokens
  completion: number // completion tokens
}

const chartConfig = {
  visitors: {
    label: "Tokens",
  },
  prompt: {
    label: "Prompt Tokens",
    color: "var(--primary)",
  },
  completion: {
    label: "Completion Tokens",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const { getChatsHistory } = useChatStore()
  const [timeRange, setTimeRange] = useState("90d")
  const [data, setData] = useState<ChartPoint[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])



  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const chats = await getChatsHistory()
        const dayToTotals = new Map<string, { prompt: number; completion: number }>()

        chats.forEach((convo) => {
          convo.chats.forEach((message) => {
            const day = new Date(message.created_at).toISOString().slice(0, 10)
            const current = dayToTotals.get(day) || { prompt: 0, completion: 0 }
            current.prompt += message.botResponse.promptTokens
            current.completion += message.botResponse.completionTokens
            dayToTotals.set(day, current)
          })
        })

        const series: ChartPoint[] = Array.from(dayToTotals.entries())
          .map(([day, totals]) => ({ date: day, prompt: totals.prompt, completion: totals.completion }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        setData(series)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [getChatsHistory])

  const { filteredData, timeRangeLabel } = useMemo(() => {
    let daysToSubtract = 90
    let label = "3 months"
    
    if (timeRange === "30d") {
      daysToSubtract = 30
      label = "30 days"
    } else if (timeRange === "7d") {
      daysToSubtract = 7
      label = "7 days"
    }
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysToSubtract)
    startDate.setHours(0, 0, 0, 0) // Start of the day
    
    const filtered = data.filter((item) => {
      const itemDate = new Date(item.date)
      itemDate.setHours(0, 0, 0, 0)
      return itemDate >= startDate
    })
    
    return { filteredData: filtered, timeRangeLabel: label }
  }, [data, timeRange])

  return (
    <Card className="@container/card w-full">
      <CardHeader>
        <CardTitle>Token Usage</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {timeRange === '7d' ? 'Weekly' : timeRange === '30d' ? 'Monthly' : 'Quarterly'} overview
          </span>
          <span className="@[540px]/card:hidden">Last {timeRangeLabel}</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-[250px] w-full" />
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillPrompt" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-prompt)"
                    stopOpacity={1.0}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-prompt)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillCompletion" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-completion)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-completion)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={timeRange === '7d' ? 0 : 16}
                interval={timeRange === '7d' ? 0 : 'preserveEnd'}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="completion"
                type="natural"
                fill="url(#fillCompletion)"
                stroke="var(--color-completion)"
                stackId="a"
              />
              <Area
                dataKey="prompt"
                type="natural"
                fill="url(#fillPrompt)"
                stroke="var(--color-prompt)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
