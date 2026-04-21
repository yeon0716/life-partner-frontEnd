import { Heart, Bookmark, Clock, Users } from 'lucide-react'
import Card from '../common/Card'
import { clsx } from 'clsx'

export default function RecipeCard({
  recipe,
  onLike,
  onBookmark,
  onClick
}) {

  /* =========================
     LIKE
  ========================= */
  const handleLike = (e) => {
    e.stopPropagation()

    const token = localStorage.getItem("token")
    if (!token) {
      alert("로그인 후 이용 가능합니다.")
      return
    }

    onLike(recipe.recipeId)
  }

  /* =========================
     BOOKMARK
  ========================= */
  const handleBookmark = (e) => {
    e.stopPropagation()

    const token = localStorage.getItem("token")
    if (!token) {
      alert("로그인 후 이용 가능합니다.")
      return
    }

    onBookmark(recipe.recipeId)
  }

  return (
    <Card hoverable onClick={onClick} className="overflow-hidden">

      {/* IMAGE */}
      <div className="relative">
        <img
          src={`${process.env.REACT_APP_API_BASE_URL}${recipe.thumbnailUrl}`}
          alt={recipe.title}
          className="w-full h-40 object-cover"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=300&fit=crop'
          }}
        />

        {/* 🔥 우측 상단 버튼 영역 */}
        <div className="absolute top-3 right-3 flex gap-2">

          {/* BOOKMARK */}
          <button
            onClick={handleBookmark}
            className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:scale-110 active:scale-95"
          >
            <Bookmark
              className={clsx(
                "w-4 h-4",
                recipe.bookmarked
                  ? "fill-black text-black"
                  : "text-gray-400"
              )}
            />
          </button>

          {/* LIKE */}
          <button
            onClick={handleLike}
            className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:scale-110 active:scale-95"
          >
            <Heart
              className={clsx(
                "w-4 h-4",
                recipe.liked
                  ? "fill-red-500 text-red-500"
                  : "text-gray-400"
              )}
            />
          </button>

        </div>

        {/* CATEGORY */}
        <span className="absolute bottom-3 left-3 px-2 py-1 text-xs font-medium bg-black/60 text-white rounded-md">
          {recipe.categoryName}
        </span>
      </div>

      {/* BODY */}
      <div className="p-4">
        <h3 className="font-semibold line-clamp-1 mb-1">
          {recipe.title}
        </h3>

        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
          {recipe.description}
        </p>

        {/* META */}
        <div className="flex items-center gap-4 text-xs text-gray-500">

          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{recipe.cookingTime}</span>
          </div>

          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{recipe.servings}</span>
          </div>

          <span
            className={clsx(
              "px-2 py-0.5 rounded-full text-xs",
              recipe.difficulty === "쉬움" && "bg-green-100 text-green-700",
              recipe.difficulty === "보통" && "bg-yellow-100 text-yellow-700",
              recipe.difficulty === "어려움" && "bg-red-100 text-red-700"
            )}
          >
            {recipe.difficulty}
          </span>

        </div>
      </div>

    </Card>
  )
}