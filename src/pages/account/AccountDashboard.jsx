import { useState, useMemo, useEffect } from 'react'
import FinancialCalendar from '../../components/account/FinancialCalendar'
import TransactionDrawer from '../../components/account/TransactionDrawer'
import MonthComparison from '../../components/account/MonthComparison'
import YearAnalytics from '../../components/account/YearAnalytics'
import DonutChart from '../../components/account/DonutChart'
import AccountModal from '../../components/account/AccountModal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import FloatingActionButton from '../../components/common/FloatingActionButton'
import { useToast } from '../../components/common/Toast'
import { useApp } from '../../context/AppContext'
import { accountAPI, accountCategoryAPI } from '../../api/account/accountApi'

export default function AccountDashboard() {
  const [accounts, setAccounts] = useState([])
  const [viewMode, setViewMode] = useState('month')
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3, 1))
  const [selectedDate, setSelectedDate] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  const { addToast } = useToast()
  const { isAdmin } = useApp()

  const memberId = 1

  // =========================
  // 📌 month YYYY-MM
  // =========================
  const currentMonthStr =
    `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`

  // =========================
  // 📌 API 호출
  // =========================
  useEffect(() => {
    fetchAccounts()
  }, [currentMonth])

  const normalizeData = (data) => {
    if (!data) return []

    return Object.entries(data).flatMap(([date, value]) =>
      value.items.map(item => ({
        ...item,
        date // ⭐ 핵심: 문자열 date 강제
      }))
    )
  }

  const fetchAccounts = async () => {
    try {
      const month =
        `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`

      const res = await accountAPI.getCalendar(memberId, month)
      console.log(res);
      const normalized = normalizeData(res.data)

      setAccounts(normalized)
    } catch (err) {
      console.error(err)
      addToast('데이터 로딩 실패', 'error')
    }
  }

  // =========================
  // 📊 월 통계
  // =========================
  const monthlyStats = useMemo(() => {
    const monthAccounts = accounts.filter(a =>
      a.date?.startsWith(currentMonthStr)
    )

    const income = monthAccounts
      .filter(a => a.type === 'INCOME')
      .reduce((s, a) => s + a.amount, 0)

    const expense = monthAccounts
      .filter(a => a.type === 'EXPENSE')
      .reduce((s, a) => s + a.amount, 0)

    const byCategory = monthAccounts
      .filter(a => a.type === 'EXPENSE')
      .reduce((acc, a) => {
        acc[a.categoryName] = (acc[a.categoryName] || 0) + a.amount
        return acc
      }, {})

    const chartData = Object.entries(byCategory).map(([label, value]) => ({
      label,
      value
    }))

    const spendingByDay = monthAccounts
      .filter(a => a.type === 'EXPENSE')
      .reduce((acc, a) => {
        const day = Number(a.date.split('-')[2]) // ⭐ 문자열 기준 안전 파싱
        acc[day] = (acc[day] || 0) + a.amount
        return acc
      }, {})

    const topSpendingDays = Object.entries(spendingByDay)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([day, amount]) => ({
        day: Number(day),
        amount
      }))

    return { income, expense, chartData, topSpendingDays }
  }, [accounts, currentMonthStr])

  // =========================
  // 📌 선택 날짜 거래 (🔥 하루 밀림 방지 핵심)
  // =========================
  const getDateStr = (date) => {
    if (!date) return null
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }

  const selectedDateTransactions = useMemo(() => {
    const dateStr = getDateStr(selectedDate)
    if (!dateStr) return []
    return accounts.filter(a => a.date === dateStr)
  }, [accounts, selectedDate])

  // =========================
  // 📌 날짜 선택
  // =========================
  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setDrawerOpen(true)
  }

  // =========================
  // 📌 저장
  // =========================
const handleSave = async (data) => {
    try {
      const res = await accountCategoryAPI.getCategoryList(memberId)

      const category = res.data.find(
        c => c.categoryName === data.categoryName && c.type === data.type
      )

      if (!category) {
        addToast("카테고리 없음", "error")
        return
      }

      const payload = {
        memberId,
        categoryId: category.categoryId,
        amount: data.amount,
        type: data.type,
        title: data.categoryName,
        content: data.memo
      }

      await accountAPI.insert(payload)

      addToast("저장 완료", "success")

      await fetchAccounts()

    } catch (e) {
      console.error(e)
      addToast("저장 실패", "error")
    }
  }

  // =========================
  // 📌 삭제
  // =========================
  const confirmDelete = () => {
    setAccounts(prev =>
      prev.filter(item => item.accountId !== itemToDelete.accountId)
    )
    setConfirmOpen(false)
    addToast('삭제 완료', 'success')
  }

  // =========================
  // 📌 UI
  // =========================
  return (
    <div className="min-h-screen">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">가계부</h1>
      </div>

      {viewMode === 'month' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Calendar */}
          <div className="lg:col-span-2">
            <FinancialCalendar
              accounts={accounts}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              currentMonth={currentMonth}
              onMonthChange={setCurrentMonth}
            />
          </div>

          {/* Side */}
          <div>

            <div className="p-4 border rounded-xl">
              <div>수입: {monthlyStats.income}</div>
              <div>지출: {monthlyStats.expense}</div>
            </div>

            {monthlyStats.chartData.length > 0 && (
              <DonutChart
                data={monthlyStats.chartData}
                total={monthlyStats.expense}
              />
            )}

          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              📊 지출 많은 날 TOP 3
            </h4>

            {monthlyStats.topSpendingDays.length === 0 ? (
              <div className="text-center py-6 text-sm text-muted-foreground">
                이번 달에는 아직 지출이 없어요 🙂
              </div>
            ) : (
              <div className="space-y-2">
                {monthlyStats.topSpendingDays.map((d, idx) => (
                  <div
                    key={d.day}
                    className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 flex items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                        {idx + 1}
                      </div>
                      <span className="text-sm font-medium">{d.day}일</span>
                    </div>

                    <span className="text-sm font-semibold text-destructive">
                      {d.amount.toLocaleString()}원
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
            <MonthComparison
                memberId={memberId}
                month={currentMonthStr}
            />
          </div>
        </div>
      ) : (
        <YearAnalytics
          accounts={accounts}
          year={currentMonth.getFullYear()}
        />
      )}

      {/* Drawer */}
      <TransactionDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        date={selectedDate}
        transactions={selectedDateTransactions}
      />

      {/* FAB */}
      <FloatingActionButton
        onClick={() => {
          setEditingItem(null)
          setModalOpen(true)
        }}
      />

      {/* Modal */}
      <AccountModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingItem}
      />

      {/* Confirm */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}