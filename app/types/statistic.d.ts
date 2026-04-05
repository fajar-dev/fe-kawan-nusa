export interface Achievement {
    percentage: number
    isUp: boolean
}

export interface StatisticItem {
    value: number
    achievement: Achievement
}

export interface StatisticCount {
    customer: StatisticItem
    customerService: StatisticItem
    point: StatisticItem
}

export interface MonthPointStatistic {
    label: string
    total: number
}

export interface CustomerStatistic {
    label: string
    count: number
}

export interface RedemptionRewardStatistic {
    status: string
    count: number
}
