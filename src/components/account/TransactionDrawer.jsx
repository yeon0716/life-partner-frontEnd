import { useEffect } from 'react'

export default function TransactionDrawer({ 
  isOpen, 
  onClose, 
  date, 
  transactions,
  onEdit,
  onDelete,
  isAdmin
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen || !date) return null

  const income = transactions.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0)
  const expense = transactions.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0)

  const formatDate = (d) => {
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`
        fixed top-0 right-0 h-full w-full sm:w-[400px] bg-background z-50
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        shadow-2xl
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{formatDate(date)}</h2>
            <p className="text-sm text-muted-foreground">{transactions.length}건의 거래</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Summary */}
        <div className="p-4 border-b border-border bg-secondary/30">
          <div className="flex gap-4">
            <div className="flex-1 p-3 bg-primary/10 rounded-xl">
              <p className="text-xs text-muted-foreground mb-1">수입</p>
              <p className="text-lg font-bold text-primary">+{income.toLocaleString()}원</p>
            </div>
            <div className="flex-1 p-3 bg-destructive/10 rounded-xl">
              <p className="text-xs text-muted-foreground mb-1">지출</p>
              <p className="text-lg font-bold text-destructive">-{expense.toLocaleString()}원</p>
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {transactions.length > 0 ? (
            transactions.map(item => (
              <div
                key={item.id}
                className="p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`
                        px-2 py-0.5 text-xs font-medium rounded-full
                        ${item.type === 'INCOME'
                          ? 'bg-primary/15 text-primary'
                          : 'bg-destructive/15 text-destructive'
                        }
                      `}>
                        {item.category}
                      </span>
                    </div>
                    {item.memo && (
                      <p className="text-sm text-foreground">{item.memo}</p>
                    )}
                  </div>
                  <span className={`text-lg font-semibold ${
                    item.type === 'INCOME' ? 'text-primary' : 'text-destructive'
                  }`}>
                    {item.type === 'INCOME' ? '+' : '-'}{item.amount.toLocaleString()}원
                  </span>
                </div>
                {isAdmin && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                    <button
                      onClick={() => onEdit(item)}
                      className="flex-1 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-secondary rounded-lg transition-colors"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      className="flex-1 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-muted-foreground">거래 내역이 없습니다</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
