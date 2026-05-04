import { useState, useMemo } from 'react'
import { mockAccounts, ACCOUNT_CATEGORIES } from '../../mock/data'
import DonutChart from '../../components/account/DonutChart'
import AccountModal from '../../components/account/AccountModal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import FloatingActionButton from '../../components/common/FloatingActionButton'
import EmptyState from '../../components/common/EmptyState'
import { useToast } from '../../components/common/Toast'
import { useApp } from '../../context/AppContext'

const FILTERS = ['오늘', '이번 달', '전체']

export default function AccountPage() {
  const [accounts, setAccounts] = useState(mockAccounts)
  const [filter, setFilter] = useState('이번 달')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const { showToast } = useToast()
  const { isAdmin } = useApp()

  const today = new Date().toISOString().split('T')[0]
  const currentMonth = today.slice(0, 7)

  const filteredAccounts = useMemo(() => {
    switch (filter) {
      case '오늘':
        return accounts.filter(a => a.date === today)
      case '이번 달':
        return accounts.filter(a => a.date.startsWith(currentMonth))
      default:
        return accounts
    }
  }, [accounts, filter, today, currentMonth])

  const { totalIncome, totalExpense, expenseByCategory } = useMemo(() => {
    const income = filteredAccounts
      .filter(a => a.type === 'INCOME')
      .reduce((sum, a) => sum + a.amount, 0)
    
    const expense = filteredAccounts
      .filter(a => a.type === 'EXPENSE')
      .reduce((sum, a) => sum + a.amount, 0)

    const byCategory = filteredAccounts
      .filter(a => a.type === 'EXPENSE')
      .reduce((acc, a) => {
        acc[a.category] = (acc[a.category] || 0) + a.amount
        return acc
      }, {})

    const chartData = Object.entries(byCategory).map(([label, value]) => ({
      label,
      value
    }))

    return { totalIncome: income, totalExpense: expense, expenseByCategory: chartData }
  }, [filteredAccounts])

  const handleSave = (data) => {
    if (editingItem) {
      setAccounts(prev => prev.map(item =>
        item.id === editingItem.id ? { ...item, ...data } : item
      ))
      showToast('내역이 수정되었습니다.', 'success')
    } else {
      const newItem = {
        ...data,
        id: `a${Date.now()}`
      }
      setAccounts(prev => [newItem, ...prev])
      showToast('내역이 추가되었습니다.', 'success')
    }
    setEditingItem(null)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setModalOpen(true)
  }

  const handleDelete = (item) => {
    setItemToDelete(item)
    setConfirmOpen(true)
  }

  const confirmDelete = () => {
    if (itemToDelete) {
      setAccounts(prev => prev.filter(item => item.id !== itemToDelete.id))
      showToast('내역이 삭제되었습니다.', 'success')
    }
    setItemToDelete(null)
    setConfirmOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">가계부</h1>
        <p className="text-muted-foreground mt-1">수입과 지출을 관리하세요</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${filter === f
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }
            `}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <span className="text-sm text-muted-foreground">수입</span>
          <p className="text-xl font-bold text-primary mt-1">
            +{totalIncome.toLocaleString()}원
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <span className="text-sm text-muted-foreground">지출</span>
          <p className="text-xl font-bold text-destructive mt-1">
            -{totalExpense.toLocaleString()}원
          </p>
        </div>
      </div>

      {/* Balance */}
      <div className="bg-card rounded-xl border border-border p-4">
        <span className="text-sm text-muted-foreground">잔액</span>
        <p className={`text-2xl font-bold mt-1 ${totalIncome - totalExpense >= 0 ? 'text-primary' : 'text-destructive'}`}>
          {(totalIncome - totalExpense).toLocaleString()}원
        </p>
      </div>

      {/* Chart */}
      {expenseByCategory.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 text-center">
            지출 분석
          </h2>
          <DonutChart
            data={expenseByCategory}
            total={totalExpense}
            centerLabel="총 지출"
          />
        </div>
      )}

      {/* Transaction List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">내역</h2>
        {filteredAccounts.length > 0 ? (
          filteredAccounts.map(item => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-card rounded-xl border border-border"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`
                    px-2 py-0.5 text-xs font-medium rounded
                    ${item.type === 'INCOME'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-destructive/10 text-destructive'
                    }
                  `}>
                    {item.category}
                  </span>
                  <span className="text-sm text-muted-foreground">{item.date}</span>
                </div>
                {item.memo && (
                  <p className="text-sm text-muted-foreground mt-1">{item.memo}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className={`font-semibold ${item.type === 'INCOME' ? 'text-primary' : 'text-destructive'}`}>
                  {item.type === 'INCOME' ? '+' : '-'}{item.amount.toLocaleString()}원
                </span>
                {isAdmin && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title="내역이 없습니다"
            description="수입 또는 지출을 추가해보세요"
          />
        )}
      </div>

      <FloatingActionButton onClick={() => {
        setEditingItem(null)
        setModalOpen(true)
      }} />

      <AccountModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingItem(null)
        }}
        onSave={handleSave}
        initialData={editingItem}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="내역 삭제"
        message="이 내역을 삭제하시겠습니까?"
      />
    </div>
  )
}
