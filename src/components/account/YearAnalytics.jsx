import { useMemo } from 'react'

export default function YearAnalytics({ accounts, year }) {
  const analytics = useMemo(() => {
    const monthlyData = Array(12).fill(null).map((_, i) => {
      const monthStr = `${year}-${String(i + 1).padStart(2, '0')}`
      const monthAccounts = accounts.filter(a => a.date.startsWith(monthStr))
      const income = monthAccounts.filter(a => a.type === 'INCOME').reduce((s, a) => s + a.amount, 0)
      const expense = monthAccounts.filter(a => a.type === 'EXPENSE').reduce((s, a) => s + a.amount, 0)
      const savings = income - expense
      const savingsRate = income > 0 ? ((income - expense) / income * 100).toFixed(1) : 0
      return { month: i + 1, income, expense, savings, savingsRate }
    })

    const activeMonths = monthlyData.filter(m => m.income > 0 || m.expense > 0)
    
    const bestMonth = activeMonths.length > 0
      ? activeMonths.reduce((best, m) => m.savings > best.savings ? m : best, activeMonths[0])
      : null

    const worstMonth = activeMonths.length > 0
      ? activeMonths.reduce((worst, m) => m.savings < worst.savings ? m : worst, activeMonths[0])
      : null

    const yearExpenseByCategory = accounts
      .filter(a => a.date.startsWith(String(year)) && a.type === 'EXPENSE')
      .reduce((acc, a) => {
        acc[a.category] = (acc[a.category] || 0) + a.amount
        return acc
      }, {})

    const topCategory = Object.entries(yearExpenseByCategory)
      .sort((a, b) => b[1] - a[1])[0]

    const totalIncome = monthlyData.reduce((s, m) => s + m.income, 0)
    const totalExpense = monthlyData.reduce((s, m) => s + m.expense, 0)
    const avgSavingsRate = totalIncome > 0 
      ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1) 
      : 0

    const maxValue = Math.max(...monthlyData.map(m => Math.max(m.income, m.expense)))

    return {
      monthlyData,
      bestMonth,
      worstMonth,
      topCategory,
      totalIncome,
      totalExpense,
      avgSavingsRate,
      maxValue
    }
  }, [accounts, year])

  const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']

  return (
    <div className="space-y-5">
      {/* Year Summary */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <h3 className="text-lg font-semibold text-foreground mb-4">{year}년 요약</h3>
        
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="p-3 bg-primary/10 rounded-xl text-center">
            <p className="text-xs text-muted-foreground mb-1">총 수입</p>
            <p className="text-sm font-bold text-primary">{(analytics.totalIncome / 10000).toFixed(0)}만</p>
          </div>
          <div className="p-3 bg-destructive/10 rounded-xl text-center">
            <p className="text-xs text-muted-foreground mb-1">총 지출</p>
            <p className="text-sm font-bold text-destructive">{(analytics.totalExpense / 10000).toFixed(0)}만</p>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-xl text-center">
            <p className="text-xs text-muted-foreground mb-1">저축률</p>
            <p className="text-sm font-bold text-blue-500">{analytics.avgSavingsRate}%</p>
          </div>
        </div>

        {/* Monthly Trend Chart */}
        <div className="h-48 flex items-end gap-1">
          {analytics.monthlyData.map((month, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col gap-0.5" style={{ height: '140px' }}>
                {/* Income Bar */}
                <div 
                  className="w-full bg-primary/60 rounded-t transition-all"
                  style={{ 
                    height: analytics.maxValue > 0 
                      ? `${(month.income / analytics.maxValue) * 100}%` 
                      : '0%'
                  }}
                />
                {/* Expense Bar */}
                <div 
                  className="w-full bg-destructive/60 rounded-b transition-all"
                  style={{ 
                    height: analytics.maxValue > 0 
                      ? `${(month.expense / analytics.maxValue) * 100}%` 
                      : '0%'
                  }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">{month.month}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-primary/60" />
            <span className="text-xs text-muted-foreground">수입</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-destructive/60" />
            <span className="text-xs text-muted-foreground">지출</span>
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-2 gap-4">
        {analytics.bestMonth && (
          <div className="bg-card rounded-2xl border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
              <span className="text-xs text-muted-foreground">최고의 달</span>
            </div>
            <p className="text-lg font-bold text-foreground">{analytics.bestMonth.month}월</p>
            <p className="text-sm text-primary">+{analytics.bestMonth.savings.toLocaleString()}원</p>
          </div>
        )}

        {analytics.worstMonth && (
          <div className="bg-card rounded-2xl border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-destructive/15 flex items-center justify-center">
                <svg className="w-4 h-4 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              <span className="text-xs text-muted-foreground">지출 많은 달</span>
            </div>
            <p className="text-lg font-bold text-foreground">{analytics.worstMonth.month}월</p>
            <p className="text-sm text-destructive">{analytics.worstMonth.savings.toLocaleString()}원</p>
          </div>
        )}
      </div>

      {/* Top Category */}
      {analytics.topCategory && (
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">연간 최다 지출 카테고리</p>
              <p className="text-lg font-bold text-foreground">{analytics.topCategory[0]}</p>
            </div>
            <p className="text-xl font-bold text-destructive">
              {analytics.topCategory[1].toLocaleString()}원
            </p>
          </div>
        </div>
      )}

      {/* Monthly Savings Rate */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">월별 저축률</h3>
        <div className="space-y-2">
          {analytics.monthlyData.map((month, idx) => (
            (month.income > 0 || month.expense > 0) && (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-sm text-foreground w-8">{MONTHS[idx]}</span>
                <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      Number(month.savingsRate) >= 0 ? 'bg-primary' : 'bg-destructive'
                    }`}
                    style={{ width: `${Math.min(Math.abs(Number(month.savingsRate)), 100)}%` }}
                  />
                </div>
                <span className={`text-xs font-medium w-12 text-right ${
                  Number(month.savingsRate) >= 0 ? 'text-primary' : 'text-destructive'
                }`}>
                  {month.savingsRate}%
                </span>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  )
}
