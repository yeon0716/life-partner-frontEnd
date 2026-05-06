import { useEffect } from 'react'

export default function TransactionDrawer({ 
  isOpen, 
  onClose, 
  date, 
  transactions = [],
  onEdit,
  onDelete,
  isAdmin
}) {

  // 🔒 스크롤 잠금
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

  // 📊 합계
  const income = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((s, t) => s + (t.amount || 0), 0)

  const expense = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((s, t) => s + (t.amount || 0), 0)

  const formatDate = (d) => {
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
  }

  return (
    <>
      {/* 🔳 Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 📦 Drawer */}
      <div className={`
        fixed top-0 right-0 h-full w-full sm:w-[420px] bg-background z-50
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        shadow-2xl flex flex-col
      `}>

        {/* =========================
            📌 Header
        ========================= */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {formatDate(date)}
            </h2>
            <p className="text-sm text-muted-foreground">
              {transactions.length}건의 거래
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-secondary transition"
          >
            ✕
          </button>
        </div>

        {/* =========================
            📊 Summary
        ========================= */}
        <div className="p-4 border-b border-border bg-secondary/30">
          <div className="flex gap-3">
            
            {/* 수입 */}
            <div className="flex-1 p-3 rounded-xl bg-primary/10">
              <p className="text-xs text-muted-foreground mb-1">수입</p>
              <p className="text-lg font-bold text-primary">
                +{income.toLocaleString()}원
              </p>
            </div>

            {/* 지출 */}
            <div className="flex-1 p-3 rounded-xl bg-destructive/10">
              <p className="text-xs text-muted-foreground mb-1">지출</p>
              <p className="text-lg font-bold text-destructive">
                -{expense.toLocaleString()}원
              </p>
            </div>
          </div>
        </div>

        {/* =========================
            📋 List
        ========================= */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {transactions.length > 0 ? (
            transactions.map(item => {
              const isIncome = item.type === 'INCOME'

              return (
                <div
                  key={item.accountId}
                  className="p-4 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all"
                >
                  {/* 상단 */}
                  <div className="flex justify-between items-start mb-2">
                    
                    <div className="flex items-center gap-2">
                      {/* 카테고리 */}
                      <div className={`
                        px-3 py-1.5 text-sm font-semibold rounded-full
                        tracking-wide
                        ${isIncome 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-destructive/20 text-destructive'}
                      `}>
                        {item.categoryName || '기타'}
                      </div>

                      {/* 제목 */}
                      {item.content && (
                        <span className="text-sm font-medium text-foreground">
                          {item.content}
                        </span>
                      )}
                    </div>

                    {/* 금액 */}
                    <div className={`text-xl font-bold ${
                      isIncome ? 'text-primary' : 'text-destructive'
                    }`}>
                      {isIncome ? '+' : '-'}
                      {(item.amount || 0).toLocaleString()}
                    </div>
                  </div>

                  {/* 버튼 */}
                  {isAdmin && (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => onEdit(item)}
                        className="flex-1 py-2 text-sm font-medium rounded-lg bg-secondary hover:bg-secondary/70 transition"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="flex-1 py-2 text-sm font-medium text-destructive rounded-lg hover:bg-destructive/10 transition"
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-sm font-medium text-foreground mb-1">
                거래 내역이 없어요
              </p>
              <p className="text-xs text-muted-foreground">
                첫 거래를 추가해보세요
              </p>
            </div>
          )}

        </div>
      </div>
    </>
  )
}