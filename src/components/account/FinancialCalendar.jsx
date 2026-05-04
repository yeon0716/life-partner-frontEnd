import { useState, useMemo } from 'react'

const DAYS = ['일', '월', '화', '수', '목', '금', '토']

export default function FinancialCalendar({ 
  accounts, 
  selectedDate, 
  onDateSelect, 
  currentMonth, 
  onMonthChange 
}) {
  const [hoveredDate, setHoveredDate] = useState(null)

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPadding = firstDay.getDay()
    const days = []

    // Previous month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startPadding - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false
      })
    }

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      })
    }

    // Next month padding
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      })
    }

    return days
  }, [year, month])

  const getDateStr = (date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  const getDayData = (date) => {
    const dateStr = getDateStr(date)

    const dayAccounts = accounts.filter(a => a.date === dateStr)

    const income = dayAccounts
      .filter(a => a.type === 'INCOME')
      .reduce((s, a) => s + a.amount, 0)

    const expense = dayAccounts
      .filter(a => a.type === 'EXPENSE')
      .reduce((s, a) => s + a.amount, 0)

    const count = dayAccounts.length

    let density = 'none'
    if (count >= 3) density = 'high'
    else if (count >= 2) density = 'medium'
    else if (count >= 1) density = 'low'

    return { income, expense, count, density, transactions: dayAccounts }
  }

  const formatMonth = (date) => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월`
  }

  const goToPrevMonth = () => {
    onMonthChange(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    onMonthChange(new Date(year, month + 1, 1))
  }

  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString()
  }

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <button
          onClick={goToPrevMonth}
          className="p-2 rounded-full hover:bg-secondary transition-colors"
        >
          <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold text-foreground">{formatMonth(currentMonth)}</h2>
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-full hover:bg-secondary transition-colors"
        >
          <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {DAYS.map((day, i) => (
          <div
            key={day}
            className={`py-3 text-center text-sm font-medium ${
              i === 0 ? 'text-destructive' : i === 6 ? 'text-blue-500' : 'text-muted-foreground'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, idx) => {
          const data = getDayData(day.date)
          const dayOfWeek = day.date.getDay()

          return (
            <div
              key={idx}
              className="relative group"
              onMouseEnter={() => setHoveredDate(day.date)}
              onMouseLeave={() => setHoveredDate(null)}
            >
              <button
                onClick={() => onDateSelect(day.date)}
                className={`
                  w-full aspect-square p-1 flex flex-col items-center justify-start
                  transition-all duration-200 border-b border-r border-border/50
                  ${!day.isCurrentMonth ? 'opacity-40' : ''}
                  ${isSelected(day.date) ? 'bg-primary/10 ring-2 ring-primary ring-inset' : 'hover:bg-secondary/50'}
                `}
              >
                <span
                  className={`
                    text-sm font-medium mb-1
                    ${isToday(day.date) ? 'w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center' : ''}
                    ${!isToday(day.date) && dayOfWeek === 0 ? 'text-destructive' : ''}
                    ${!isToday(day.date) && dayOfWeek === 6 ? 'text-blue-500' : ''}
                    ${!isToday(day.date) && dayOfWeek !== 0 && dayOfWeek !== 6 ? 'text-foreground' : ''}
                  `}
                >
                  {day.date.getDate()}
                </span>

                {/* Transaction Density Indicator */}
                {data.density !== 'none' && day.isCurrentMonth && (
                  <div className="flex gap-0.5 mt-auto mb-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      data.density === 'high' ? 'bg-destructive' :
                      data.density === 'medium' ? 'bg-accent' : 'bg-muted-foreground'
                    }`} />
                    {data.density !== 'low' && (
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        data.density === 'high' ? 'bg-destructive' : 'bg-accent'
                      }`} />
                    )}
                    {data.density === 'high' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                    )}
                  </div>
                )}

                {/* Mini amounts */}
                {day.isCurrentMonth && (data.income > 0 || data.expense > 0) && (
                  <div className="hidden sm:flex flex-col items-center gap-0.5 text-[10px] leading-tight">
                    {data.income > 0 && (
                      <span className="text-primary font-medium">+{(data.income / 10000).toFixed(0)}만</span>
                    )}
                    {data.expense > 0 && (
                      <span className="text-destructive font-medium">-{(data.expense / 10000).toFixed(0)}만</span>
                    )}
                  </div>
                )}
              </button>

              {/* Hover Tooltip */}
              {hoveredDate && hoveredDate.toDateString() === day.date.toDateString() && data.count > 0 && (
                <div className="absolute z-50 left-1/2 -translate-x-1/2 top-full mt-1 bg-popover border border-border rounded-lg shadow-lg p-3 min-w-[160px] pointer-events-none">
                  <p className="text-xs font-medium text-foreground mb-2">
                    {day.date.getMonth() + 1}월 {day.date.getDate()}일
                  </p>
                  {data.income > 0 && (
                    <p className="text-xs text-primary">수입 +{data.income.toLocaleString()}원</p>
                  )}
                  {data.expense > 0 && (
                    <p className="text-xs text-destructive">지출 -{data.expense.toLocaleString()}원</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">{data.count}건의 거래</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
