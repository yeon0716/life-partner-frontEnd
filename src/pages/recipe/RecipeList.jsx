import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { UtensilsCrossed, Search } from 'lucide-react'
import { recipeAPI } from '../../api/recipe/recipeApi'

function RecipeList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categories, setCategories] = useState([])
  const [recipes, setRecipes] = useState([])

  const [categoryId, setCategoryId] = useState(null) // 🔥 추가

  const [page, setPage] = useState(1)
  const [size] = useState(6)

  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  /* =========================
     레시피 조회
  ========================= */
  useEffect(() => {
    fetchRecipes()
  }, [page, categoryId, searchTerm]) // 🔥 추가

  const fetchRecipes = async () => {
    setLoading(true)

    try {
      const res = await recipeAPI.list(
        page,
        size,
        searchTerm,
        categoryId // 🔥 수정
      )

      const newData = res.data || []

      if (page === 1) {
        setRecipes(newData)
      } else {
        setRecipes(prev => [...prev, ...newData])
      }

      if (newData.length < size) {
        setHasMore(false)
      }

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  /* =========================
     카테고리 조회
  ========================= */
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await recipeAPI.getCategories()

      setCategories([
        { categoryId: null, categoryName: '전체' },
        ...(res.data || []),
      ])
    } catch (err) {
      console.error(err)
    }
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          <UtensilsCrossed size={24} />
          레시피 리스트
        </h1>
      </div>

      {/* 검색 */}
      <div className="search-bar">
        <Search size={20} />
        <input
          type="text"
          placeholder="레시피 검색"
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value)
            setRecipes([])
            setPage(1)      // 🔥 0 → 1 수정
            setHasMore(true)
          }}
        />
      </div>

      {/* 카테고리 */}
      <div className="filter-tabs">
        {categories.map(cat => (
          <button
            key={cat.categoryId ?? 'all'}
            className={`filter-tab ${
              categoryId === cat.categoryId ? 'active' : ''
            }`}
            onClick={() => {
              setCategoryId(cat.categoryId)
              setRecipes([])
              setPage(1)
              setHasMore(true)
            }}
          >
            {cat.categoryName}
          </button>
        ))}
      </div>

      {/* 리스트 */}
      <div className="recipe-grid">
        {recipes.map(recipe => (  // 🔥 filteredRecipes 제거
          <Link
            key={recipe.recipeId}
            to={`/recipe/${recipe.recipeId}`}
            className="recipe-card"
          >
            <img
              src={`${process.env.REACT_APP_API_BASE_URL}${recipe.thumbnailUrl}`}
              alt={recipe.title}
            />
            <h3>{recipe.title}</h3>
          </Link>
        ))}
      </div>

      {/* 로딩 */}
      {loading && <div>로딩중...</div>}

      {/* 더보기 */}
      {hasMore && !loading && (
        <div className="text-center mt-4">
          <button onClick={() => setPage(prev => prev + 1)}>
            더보기
          </button>
        </div>
      )}

      {!hasMore && (
        <div className="text-center mt-4">
          마지막 레시피입니다
        </div>
      )}
    </div>
  )
}

export default RecipeList