import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { UtensilsCrossed, Search, Bookmark, BookmarkCheck, Heart } from 'lucide-react'
import { recipeAPI } from '../../api/recipe/recipeApi'

function RecipeList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categories, setCategories] = useState([])
  const [recipes, setRecipes] = useState([])
  const [categoryId, setCategoryId] = useState(null)

  const [page, setPage] = useState(1)
  const [size] = useState(6)

  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const [loadingMap, setLoadingMap] = useState({})

  /* =========================
     데이터 호출
  ========================= */
  useEffect(() => {
    fetchRecipes()
  }, [page, categoryId, searchTerm])

  const fetchRecipes = async () => {
    setLoading(true)

    try {
      const res = await recipeAPI.list(page, size, searchTerm, categoryId)
      const newData = res.data || []

      setRecipes(prev =>
        page === 1 ? newData : [...prev, ...newData]
      )

      setHasMore(newData.length === size)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  /* =========================
     카테고리
  ========================= */
  useEffect(() => {
    fetchCategories()
  }, [])

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
     통합 toggle (like / bookmark)
  ========================= */
  const toggle = async (recipeId, type) => {
    const key = `${type}-${recipeId}`
    if (loadingMap[key]) return

    const current = recipes.find(r => r.recipeId === recipeId)

    setLoadingMap(prev => ({
      ...prev,
      [key]: true,
    }))

    // optimistic update
    setRecipes(prev =>
      prev.map(r => {
        if (r.recipeId !== recipeId) return r

        if (type === 'like') {
          return {
            ...r,
            liked: !r.liked,
            likes: r.liked ? r.likes - 1 : r.likes + 1,
          }
        }

        if (type === 'bookmark') {
          return {
            ...r,
            bookmarked: !r.bookmarked,
          }
        }

        return r
      })
    )

    try {
      if (type === 'like') {
        await recipeAPI.like(recipeId)
      } else if (type === 'bookmark') {
        await recipeAPI.bookmark(recipeId)
      }
    } catch (err) {
      console.error(err)

      // rollback
      setRecipes(prev =>
        prev.map(r =>
          r.recipeId === recipeId ? current : r
        )
      )
    } finally {
      setLoadingMap(prev => {
        const copy = { ...prev }
        delete copy[key]
        return copy
      })
    }
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="page-container">

      {/* HEADER */}
      <div className="page-header">
        <h1 className="page-title">
          <UtensilsCrossed size={24} />
          레시피
        </h1>
      </div>

      {/* SEARCH */}
      <div className="search-bar">
        <Search size={18} />
        <input
          type="text"
          placeholder="레시피 검색"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setRecipes([])
            setPage(1)
            setHasMore(true)
          }}
        />
      </div>

      {/* CATEGORY */}
      <div className="filter-tabs">
        {categories.map(cat => (
          <button
            key={cat.categoryId ?? 'all'}
            className={`filter-tab ${categoryId === cat.categoryId ? 'active' : ''}`}
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

      {/* LIST */}
      <div className="recipe-grid">
        {recipes.map(recipe => (
          <Link
            key={recipe.recipeId}
            to={`/recipe/${recipe.recipeId}`}
            className="recipe-card"
            style={{ position: 'relative' }}
          >

            {/* IMAGE */}
            <div className="recipe-img-wrapper">
              <img
                src={`${process.env.REACT_APP_API_BASE_URL}${recipe.thumbnailUrl}`}
                alt={recipe.title}
                onError={(e) => {
                  e.target.src = '/default-recipe.png'
                }}
              />

              {/* OVERLAY */}
              <div className="recipe-overlay">

                {/* BOOKMARK */}
                <button
                    disabled={loadingMap[`bookmark-${recipe.recipeId}`]}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      toggle(recipe.recipeId, 'bookmark')
                    }}
                    style={{
                      pointerEvents: 'auto',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                  {recipe.bookmarked ? (
                    <BookmarkCheck size={16} fill="currentColor" className="text-primary" />
                  ) : (
                    <Bookmark size={16} />
                  )}
                </button>

                <div className="category-badge">
                  {recipe.categoryName}
                </div>
              </div>
            </div>

            {/* BODY */}
            <div className="recipe-card-body">
              <div className="recipe-title">{recipe.title}</div>

              <div className="recipe-meta">

                <span>🍳 간단 레시피</span>

                {/* LIKE */}
                <span
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggle(recipe.recipeId, 'like')
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <Heart
                    size={16}
                    fill={recipe.liked ? 'red' : 'none'}
                    color={recipe.liked ? 'red' : 'black'}
                  />
                  {recipe.likes}
                </span>

              </div>
            </div>

          </Link>
        ))}
      </div>

      {/* EMPTY */}
      {!loading && recipes.length === 0 && (
        <div className="empty-box">
          검색 결과가 없습니다 😢
        </div>
      )}

      {/* LOADING */}
      {loading && <div>로딩중...</div>}

      {/* MORE */}
      {hasMore && !loading && (
        <div className="text-center mt-4">
          <button
            className="load-more-btn"
            onClick={() => setPage(prev => prev + 1)}
          >
            더보기
          </button>
        </div>
      )}

      {!hasMore && recipes.length > 0 && (
        <div className="empty-box">
          마지막 레시피입니다
        </div>
      )}
    </div>
  )
}

export default RecipeList