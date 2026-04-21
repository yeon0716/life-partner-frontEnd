import { useEffect, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus } from 'lucide-react'

import { recipeAPI } from '../../api/recipe/recipeApi'
import RecipeCard from '../../components/recipe/RecipeCard'
import FloatingActionButton from '../../components/common/FloatingActionButton'
import EmptyState from '../../components/common/EmptyState'
import { SkeletonCard } from '../../components/common/Skeleton'
import { useToast } from '../../components/common/Toast'

function getMemberIdFromToken() {
  const token = localStorage.getItem("token")
  if (!token) return null

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.memberId || null
  } catch {
    return null
  }
}

export default function RecipeList() {
  const navigate = useNavigate()
  const { addToast } = useToast()

  const memberId = getMemberIdFromToken()

  const PAGE_SIZE = 20

  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState([])
  const [recipes, setRecipes] = useState([])
  const [categoryId, setCategoryId] = useState(null)

  const [loading, setLoading] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  /* =========================
     FETCH
  ========================= */
  useEffect(() => {
    fetchRecipes()
    fetchCategories()
  }, [search, categoryId])

  const fetchRecipes = async () => {
    setLoading(true)

    try {
      const res = await recipeAPI.list(1, 1000, search, categoryId)
      const data = res.data || []

      const safe = data.map(r => ({
        ...r,
        likeCount: r.likeCount ?? 0,
        liked: r.liked === 1,
        bookmarked: r.bookmarked === 1,
      }))

      setRecipes(safe)
      setVisibleCount(PAGE_SIZE)

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await recipeAPI.getCategories()

      setCategories([
        { categoryId: null, categoryName: '전체' },
        ...(res.data || [])
      ])
    } catch (err) {
      console.error(err)
    }
  }

  /* =========================
     MORE
  ========================= */
  const visibleRecipes = useMemo(
    () => recipes.slice(0, visibleCount),
    [recipes, visibleCount]
  )

  const hasMore = visibleCount < recipes.length

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + PAGE_SIZE)
  }

  /* =========================
     LIKE
  ========================= */
  const toggleLike = useCallback(async (recipeId) => {
    if (!memberId) return alert("로그인 필요")

    setRecipes(prev =>
      prev.map(r =>
        r.recipeId === recipeId
          ? {
              ...r,
              liked: !r.liked,
              likeCount: r.liked ? r.likeCount - 1 : r.likeCount + 1
            }
          : r
      )
    )

    try {
      await recipeAPI.like(recipeId)
    } catch (err) {
      console.error(err)
    }
  }, [memberId])

  /* =========================
     UI
  ========================= */
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">레시피</h1>

        {/* SEARCH */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            className="w-full h-11 pl-10 pr-4 border rounded-lg text-sm"
            placeholder="레시피 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* CATEGORY */}
        <div className="flex gap-2 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat.categoryId ?? 'all'}
              onClick={() => setCategoryId(cat.categoryId)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap
                ${categoryId === cat.categoryId
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600'}`}
            >
              {cat.categoryName}
            </button>
          ))}
        </div>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <EmptyState
          title="레시피 없음"
          description="조건에 맞는 레시피가 없습니다"
          action={() => navigate('/recipe/edit')}
          actionLabel="등록하기"
        />
      ) : (
        <div className="relative">

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleRecipes.map(recipe => (
              <RecipeCard
                key={recipe.recipeId}
                recipe={recipe}
                onLike={() => toggleLike(recipe.recipeId)}
                onClick={() => navigate(`/recipe/${recipe.recipeId}`)}
              />
            ))}
          </div>

          {/* FADE + MORE BUTTON */}
          {hasMore && (
            <div className="absolute bottom-0 left-0 w-full h-44
              bg-gradient-to-t from-white via-white/80 to-transparent
              flex items-end justify-center"
            >
              <button
                onClick={handleLoadMore}
                className="mb-6 px-6 py-2 bg-black text-white rounded-lg shadow"
              >
                더보기 ({recipes.length - visibleCount}개 남음)
              </button>
            </div>
          )}

        </div>
      )}

      {/* FAB */}
      <FloatingActionButton
        onClick={() => navigate('/recipe/edit')}
        icon={Plus}
        label="레시피 등록"
      />
    </div>
  )
}