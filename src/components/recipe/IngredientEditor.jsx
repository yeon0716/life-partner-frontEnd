import { Plus, Trash2 } from 'lucide-react'
import Button from '../common/Button'

export default function IngredientEditor({ ingredients, onChange }) {
  const addIngredient = () => {
    const newIngredient = {
      id: `ing-${Date.now()}`,
      name: '',
      amount: ''
    }
    onChange([...ingredients, newIngredient])
  }

  const updateIngredient = (id, field, value) => {
    onChange(
      ingredients.map((ing) =>
        ing.id === id ? { ...ing, [field]: value } : ing
      )
    )
  }

  const deleteIngredient = (id) => {
    onChange(ingredients.filter((ing) => ing.id !== id))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">재료</label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addIngredient}
        >
          <Plus className="w-4 h-4" />
          재료 추가
        </Button>
      </div>

      {ingredients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed rounded-lg text-muted-foreground">
          <p className="text-sm">재료를 추가해주세요</p>
        </div>
      ) : (
        <div className="space-y-2">
          {ingredients.map((ing) => (
            <div key={ing.id} className="flex gap-2 items-center group">
              <input
                type="text"
                value={ing.name}
                onChange={(e) => updateIngredient(ing.id, 'name', e.target.value)}
                placeholder="재료명"
                className="flex-1 h-10 px-3 rounded-lg border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <input
                type="text"
                value={ing.amount}
                onChange={(e) => updateIngredient(ing.id, 'amount', e.target.value)}
                placeholder="양"
                className="w-24 h-10 px-3 rounded-lg border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <button
                type="button"
                onClick={() => deleteIngredient(ing.id)}
                className="p-2 rounded-lg hover:bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
