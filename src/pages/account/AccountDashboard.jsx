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
import { accountAPI } from '../../api/account/accountApi'

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
  const handleSave = (data) => {
    if (editingItem) {
      setAccounts(prev =>
        prev.map(item =>
          item.accountId === editingItem.accountId
            ? { ...item, ...data }
            : item
        )
      )
      addToast('수정 완료', 'success')
    } else {
      setAccounts(prev => [
        { ...data, accountId: Date.now() },
        ...prev
      ])
      addToast('추가 완료', 'success')
    }

    setModalOpen(false)
    setEditingItem(null)
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

            <div>
              {monthlyStats.topSpendingDays.map(d => (
                <div key={d.day}>
                  {d.day}일 - {d.amount}
                </div>
              ))}
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