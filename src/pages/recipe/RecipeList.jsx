import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { UtensilsCrossed, Search, Clock, Heart } from 'lucide-react'
import { recipeAPI } from '../../api/recipe/recipeApi'

function RecipeList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const [recipes, setRecipes] = useState([])

  // 페이지네이션 추가
  const [page, setPage] = useState(0)
  const [size] = useState(6)
  const [totalPages, setTotalPages] = useState(0)

  const [loading, setLoading] = useState(false)

  // API 호출
  useEffect(() => {
    fetchRecipes()
  }, [page, searchTerm])

  const fetchRecipes = async () => {
    setLoading(true)
    try {
      const res = await recipeAPI.list({
        page,
        size,
        keyword: searchTerm,
      })

      // 👉 Spring Page 객체 기준
      setRecipes(res.data.content)
      setTotalPages(res.data.totalPages)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { key: 'all', label: '전체' },
    { key: '한식', label: '한식' },
    { key: '양식', label: '양식' },
    { key: '중식', label: '중식' },
    { key: '일식', label: '일식' },
  ]

  const filteredRecipes = recipes.filter(recipe => {
    return activeCategory === 'all'
      ? true
      : recipe.category === activeCategory
  })

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
            setPage(0) // 검색 시 첫 페이지로
          }}
        />
      </div>

      {/* 카테고리 */}
      <div className="filter-tabs">
        {categories.map(cat => (
          <button
            key={cat.key}
            className={`filter-tab ${activeCategory === cat.key ? 'active' : ''}`}
            onClick={() => {
              setActiveCategory(cat.key)
              setPage(0)
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 로딩 */}
      {loading && <div>로딩중...</div>}

      {/* 리스트 */}
      <div className="recipe-grid">
        {filteredRecipes.map(recipe => (
          <Link
            key={recipe.id}
            to={`/recipe/${recipe.id}`}
            className="recipe-card"
          >
            <img src={recipe.image} alt={recipe.name} />
            <h3>{recipe.name}</h3>
          </Link>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="pagination">
        <button
          disabled={page === 0}
          onClick={() => setPage(prev => prev - 1)}
        >
          이전
        </button>

        <span>
          {page + 1} / {totalPages}
        </span>

        <button
          disabled={page + 1 === totalPages}
          onClick={() => setPage(prev => prev + 1)}
        >
          다음
        </button>
      </div>
    </div>
  )
}

export default RecipeList