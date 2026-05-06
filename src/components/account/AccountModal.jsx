import { useState, useEffect } from 'react'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { accountCategoryAPI } from '../../api/account/accountApi'
import { useToast } from '../../components/common/Toast'

export default function AccountModal({ isOpen, onClose, onSave, initialData }) {

  const memberId = 1
  const { addToast } = useToast()

  const [categories, setCategories] = useState({
    INCOME: [],
    EXPENSE: []
  })

  const [formData, setFormData] = useState({
    type: 'EXPENSE',
    category: '',
    customCategory: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    memo: ''
  })

  const [isCustomCategory, setIsCustomCategory] = useState(false)

  // 카테고리 조회
  useEffect(() => {
    if (isOpen) fetchCategories()
  }, [isOpen])

  const fetchCategories = async () => {
    try {
      const res = await accountCategoryAPI.getCategoryList(memberId)

      const grouped = { INCOME: [], EXPENSE: [] }

      res.data.forEach(c => {
        if (!grouped[c.type]) grouped[c.type] = []
        grouped[c.type].push({
          id: c.categoryId,
          name: c.categoryName
        })
      })

      setCategories(grouped)

      setFormData(prev => ({
        ...prev,
        category: grouped[prev.type]?.[0]?.name || ''
      }))

    } catch (e) {
      addToast("카테고리 로딩 실패", "error")
    }
  }

  const handleTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      type,
      category: categories[type]?.[0]?.name || '',
      customCategory: ''
    }))
    setIsCustomCategory(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const finalCategory = isCustomCategory
      ? formData.customCategory.trim()
      : formData.category

    if (!formData.amount) {
      addToast("금액 입력하세요", "warning")
      return
    }

    if (!finalCategory) {
      addToast("카테고리 선택하세요", "warning")
      return
    }

    onSave({
      ...formData,
      categoryName: finalCategory,
      amount: Number(formData.amount)
    })

    onClose()
  }

  const currentCategories = categories[formData.type] || []

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="내역 추가">
      <div className="bg-white rounded-2xl p-5">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* 타입 */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
            {['INCOME', 'EXPENSE'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => handleTypeChange(type)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold ${
                  formData.type === type
                    ? 'bg-white shadow text-primary'
                    : 'text-gray-500'
                }`}
              >
                {type === 'INCOME' ? '💰 수입' : '💸 지출'}
              </button>
            ))}
          </div>

          {/* 금액 */}
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            placeholder="금액 입력"
            className="w-full text-3xl text-center font-bold outline-none"
          />

          {/* 카테고리 */}
          <div>
            <p className="text-sm mb-2">카테고리</p>

            {!isCustomCategory ? (
              <div className="flex flex-wrap gap-2">
                {currentCategories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: cat.name }))}
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      formData.category === cat.name
                        ? 'bg-primary text-white'
                        : 'bg-gray-100'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setIsCustomCategory(true)}
                  className="px-3 py-1.5 rounded-full bg-gray-200 text-sm"
                >
                  + 추가
                </button>
              </div>
            ) : (
              <input
                value={formData.customCategory}
                onChange={(e) => setFormData(prev => ({ ...prev, customCategory: e.target.value }))}
                placeholder="카테고리 입력"
                className="w-full border rounded-lg px-3 py-2"
              />
            )}
          </div>

          <Input
            label="날짜"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          />

          <Input
            label="메모"
            value={formData.memo}
            onChange={(e) => setFormData(prev => ({ ...prev, memo: e.target.value }))}
          />

          <div className="flex gap-2">
            <Button type="button" onClick={onClose} className="flex-1">취소</Button>
            <Button type="submit" className="flex-1">저장</Button>
          </div>

        </form>
      </div>
    </Modal>
  )
}