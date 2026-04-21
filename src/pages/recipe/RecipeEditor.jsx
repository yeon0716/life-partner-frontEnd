import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { DIFFICULTY_OPTIONS } from '../../mock/data'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Button from '../../components/common/Button'
import IngredientEditor from '../../components/recipe/IngredientEditor'
import BlockEditor from '../../components/recipe/BlockEditor'
import { useToast } from '../../components/common/Toast'
import { recipeAPI } from '../../api/recipe/recipeApi'

const initialRecipe = {
  title: '',
  description: '',
  cookingTime: '',
  servings: '',
  difficulty: '',
  category: null,   // 🔥 이거 중요
  thumbnail: '',
  ingredients: [],
  blockList: []
}

export default function RecipeEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const isEdit = Boolean(id)
  const [recipe, setRecipe] = useState(initialRecipe)
  const [errors, setErrors] = useState({})
  const [categories, setCategories] = useState([]);

  // 수정 루트일 때 api출력
  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const res = await recipeAPI.detail(id);
        const data = res.data;

        setRecipe({
          title: data.title || '',
          description: data.description || '',
          category: data.categoryId || null,
          difficulty: data.difficulty || '쉬움',
          cookingTime: data.cookingTime || '10분',
          servings: data.servings || '1인분',

          ingredients: (data.ingredientList || []).map(i => ({
            id: crypto.randomUUID(),
            name: i.name,
            amount: i.amount || ''
          })),

          blockList: (data.blockList || []).map(b => ({
            id: b.blockId || crypto.randomUUID(),
            type: b.blockType,
            content: b.content
          }))
        });

      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [id]);
  

  // 카테고리 불러오기
  useEffect(() => {
    recipeAPI.getCategories().then((res) => {
      setCategories([
        { categoryId: null, categoryName: "전체" },
        ...(res.data || [])
      ]);
    });
  }, []);

  // 값 업데이트
  const updateField = (field, value) => {
    setRecipe((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  // validate 확인
  const validate = () => {
    const newErrors = {}
    if (!recipe.title.trim()) newErrors.title = '제목을 입력해주세요'
    if (!recipe.category) newErrors.category = '카테고리를 선택해주세요'
    if (!recipe.difficulty) newErrors.difficulty = '난이도를 선택해주세요'
    if (recipe.ingredients.length === 0) newErrors.ingredients = '재료를 추가해주세요'
    if (recipe.blockList.length === 0) newErrors.blockList = '조리 순서를 추가해주세요'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 등록 & 수정 submit
  const handleSubmit = async (e) => {
    e.preventDefault()

      const token = localStorage.getItem("token")

      if (!token) {
        addToast({ type: 'error', message: "로그인 후 이용하실 수 있습니다."})
        return
      }

    if (!validate()) {
      addToast({ type: 'error', message: '필수 항목을 모두 입력해주세요' })
      return
    }
    try {
      const processedBlocks = await Promise.all(
        recipe.blockList.map(async (b, i) => {
          // 이미지 파일 업로드
          if (b.type === 'IMAGE' && b.file) {
            const res = await recipeAPI.uploadImage(b.file)
            return {
              blockType: 'IMAGE',
              content: res.data,
              sortOrder: i + 1
            }
          }
          return {
            blockType: b.type,
            content: b.content,
            sortOrder: i + 1
          }
        })
      )
      const payload = {
        title: recipe.title,
        description: recipe.description,
        categoryId: recipe.category,
        difficulty: recipe.difficulty,
        cookingTime: recipe.cookingTime,
        servings: recipe.servings,

        ingredientList: recipe.ingredients.map((i, idx) => ({
          name: i.name || i,
          amount: i.amount || '',
          sortOrder: idx + 1
        })),

        blockList: processedBlocks
      }

      if (isEdit) {
        await recipeAPI.update(id, payload)
      } else {
        await recipeAPI.create(payload)
      }
      addToast({
        type: 'success',
        message: isEdit ? '레시피 수정 완료' : '레시피 등록 완료'
      })
      navigate('/recipe')

    } catch (err) {
      console.error(err)
      addToast({
        type: 'error',
        message: '저장 실패'
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-foreground">
          {isEdit ? '레시피 수정' : '새 레시피 등록'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card rounded-xl border p-4 space-y-4">
          <h2 className="font-semibold">기본 정보</h2>
          
          <Input
            label="제목"
            value={recipe.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="레시피 제목을 입력하세요"
            error={errors.title}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">설명</label>
            <textarea
              value={recipe.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="레시피에 대한 간단한 설명"
              className="min-h-[80px] p-3 rounded-lg border border-input bg-background text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {/* <Input
            label="썸네일 URL"
            value={recipe.thumbnail}
            onChange={(e) => updateField('thumbnail', e.target.value)}
            placeholder="이미지 URL을 입력하세요"
          /> */}

          {recipe.thumbnail && (
            <img
              src={recipe.thumbnail}
              alt="Thumbnail preview"
              className="w-full max-w-xs h-40 object-cover rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="카테고리"
              value={recipe.category ?? ''}
              onChange={(e) => updateField('category', Number(e.target.value))}
              options={categories
                .filter(c => c.categoryId !== null) // "전체" 제외
                .map(c => ({
                  label: c.categoryName,
                  value: c.categoryId
                }))
              }
              error={errors.category}
            />
            <Select
              label="난이도"
              value={recipe.difficulty}
              onChange={(e) => updateField('difficulty', e.target.value)}
              options={DIFFICULTY_OPTIONS}
              error={errors.difficulty}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="조리 시간"
              value={recipe.cookingTime}
              onChange={(e) => updateField('cookingTime', e.target.value)}
              placeholder="예: 20분"
            />
            <Input
              label="인분"
              value={recipe.servings}
              onChange={(e) => updateField('servings', e.target.value)}
              placeholder="예: 2인분"
            />
          </div>
        </div>

        <div className="bg-card rounded-xl border p-4">
          <IngredientEditor
            ingredients={recipe.ingredients}
            onChange={(ingredients) => updateField('ingredients', ingredients)}
          />
          {errors.ingredients && (
            <p className="text-sm text-destructive mt-2">{errors.ingredients}</p>
          )}
        </div>

        <div className="bg-card rounded-xl border p-4">
          <BlockEditor
            blocks={recipe.blockList}
            onChange={(blockList) => updateField('blockList', blockList)}
          />
          {errors.blockList && (
            <p className="text-sm text-destructive mt-2">{errors.blockList}</p>
          )}
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            취소
          </Button>
          <Button type="submit">
            <Save className="w-4 h-4" />
            {isEdit ? '수정하기' : '등록하기'}
          </Button>
        </div>
      </form>
    </div>
  )
}
