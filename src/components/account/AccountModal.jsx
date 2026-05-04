import { useState, useEffect } from 'react'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Button from '../../components/common/Button'
import { ACCOUNT_CATEGORIES } from '../../mock/data'

export default function AccountModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    type: 'EXPENSE',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    memo: ''
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type,
        category: initialData.category,
        amount: initialData.amount.toString(),
        date: initialData.date,
        memo: initialData.memo || ''
      })
    } else {
      setFormData({
        type: 'EXPENSE',
        category: ACCOUNT_CATEGORIES.EXPENSE[0],
        amount: '',
        date: new Date().toISOString().split('T')[0],
        memo: ''
      })
    }
  }, [initialData, isOpen])

  const handleTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      type,
      category: ACCOUNT_CATEGORIES[type][0]
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.amount || !formData.category) return

    onSave({
      ...formData,
      amount: parseInt(formData.amount, 10)
    })
    onClose()
  }

  const categories = ACCOUNT_CATEGORIES[formData.type]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? '내역 수정' : '내역 추가'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleTypeChange('INCOME')}
            className={`
              flex-1 py-2.5 rounded-lg font-medium transition-colors
              ${formData.type === 'INCOME'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'
              }
            `}
          >
            수입
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('EXPENSE')}
            className={`
              flex-1 py-2.5 rounded-lg font-medium transition-colors
              ${formData.type === 'EXPENSE'
                ? 'bg-destructive text-destructive-foreground'
                : 'bg-secondary text-secondary-foreground'
              }
            `}
          >
            지출
          </button>
        </div>

        <Select
          label="카테고리"
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          options={categories.map(cat => ({ value: cat, label: cat }))}
        />

        <Input
          label="금액"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
          placeholder="금액을 입력하세요"
          required
        />

        <Input
          label="날짜"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          required
        />

        <Input
          label="메모"
          value={formData.memo}
          onChange={(e) => setFormData(prev => ({ ...prev, memo: e.target.value }))}
          placeholder="메모를 입력하세요 (선택)"
        />

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            취소
          </Button>
          <Button type="submit" className="flex-1">
            {initialData ? '수정' : '추가'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
