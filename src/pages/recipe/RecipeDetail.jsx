import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { recipeAPI } from '../../api/recipe/recipeApi'
import {
  ArrowLeft,
  Clock,
  Users,
  ChefHat,
  Heart,
  Edit,
  Trash2,
  Check,
  Bookmark,
  Share2
} from 'lucide-react'

import Button from '../../components/common/Button'
import Skeleton from '../../components/common/Skeleton'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { useToast } from '../../components/common/Toast'
import clsx from 'clsx'

function RecipeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()

  const [recipe, setRecipe] = useState(null)
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [checkedIngredients, setCheckedIngredients] = useState(new Set())
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isMyPost, setIsMyPost] = useState(false)

  useEffect(() => {
    fetchDetail()
  }, [id])

  const fetchDetail = async () => {
    try {
      const res = await recipeAPI.detail(id)
      const data = res.data

      const token = localStorage.getItem("token")
      let loginMemberId = null

      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]))
        loginMemberId = Number(payload.memberId)
      }

      const writerId = Number(data.memberId)
      setIsMyPost(loginMemberId && loginMemberId === writerId)

      setRecipe(data)
      setLiked(data.liked === 1)
      setBookmarked(data.bookmarked === 1)

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const toggleIngredient = (ingredientId) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev)
      next.has(ingredientId) ? next.delete(ingredientId) : next.add(ingredientId)
      return next
    })
  }
  // 좋아요 & 북마크
  const toggle = async (type) => {
    const token = localStorage.getItem("token")

    if (!token) {
      alert("로그인 후 이용하실 수 있습니다.")
      return
    }
    if (loading) return
    setLoading(true)

    try {
      if (type === 'like') {
        const nextLiked = !liked
        await recipeAPI.like(id)

        setLiked(nextLiked)
        setRecipe(prev => ({
          ...prev,
          likeCount: nextLiked
            ? prev.likeCount + 1
            : prev.likeCount - 1
        }))
      }

      if (type === 'bookmark') {
        await recipeAPI.bookmark(id)
        setBookmarked(prev => !prev)
      }

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }


  const handleDelete = async () => {
    try {
      await recipeAPI.delete(id)
      addToast({ type: 'success', message: '레시피 삭제됨' })
      navigate("/recipe")
    } catch (err) {
      console.error(err)
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    addToast({ type: 'success', message: '링크 복사 완료' })
  }

  const renderBlocks = () => {
    if (!recipe?.blockList) return null

    return recipe.blockList.map((b, i) => (
      <div key={i} className="flex gap-4">
        <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs">
          {i + 1}
        </div>

        <div className="flex-1">
          {b.blockType === 'TEXT' ? (
            <p className="text-gray-700 leading-relaxed">{b.content}</p>
          ) : (
            <img
              src={
                b.content.startsWith("http")
                  ? b.content
                  : `${process.env.REACT_APP_API_BASE_URL}${b.content}`
              }
              className="rounded-xl w-full max-w-md object-cover mt-2"
              alt=""
            />
          )}
        </div>
      </div>
    ))
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-gray-500 mb-4">레시피 없음</p>
        <Button onClick={() => navigate('/recipe')}>목록</Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">

      {/* 뒤로가기 + 액션 */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/recipe')}
          className="flex items-center gap-2 text-gray-500 hover:text-black"
        >
          <ArrowLeft className="w-5 h-5" />
          목록
        </button>

        <div className="flex gap-2">
          <button onClick={()=> toggle('like')} className="p-2 hover:bg-gray-100 rounded-lg">
            <Heart className={clsx("w-5 h-5", liked && "fill-red-500 text-red-500")} />
          </button>

          <button onClick={()=> toggle('like')} className="p-2 hover:bg-gray-100 rounded-lg">
            <Bookmark className={clsx("w-5 h-5", bookmarked && "fill-black text-black")} />
          </button>

          <button onClick={handleShare} className="p-2 hover:bg-gray-100 rounded-lg">
            <Share2 className="w-5 h-5" />
          </button>

          {isMyPost && (
            <>
              <button
                onClick={() => navigate(`/recipeEdit/${id}`)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Edit className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowDeleteDialog(true)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* 이미지 */}
      <div className="relative rounded-xl overflow-hidden">
        <img
          src={`${process.env.REACT_APP_API_BASE_URL}${recipe.thumbnailUrl}`}
          className="w-full h-72 object-cover"
        />
        <span className="absolute bottom-3 left-3 bg-black/60 text-white px-3 py-1 text-sm rounded-lg">
          {recipe.category}
        </span>
      </div>

      {/* 제목 */}
      <div>
        <h1 className="text-3xl font-bold">{recipe.title}</h1>
        <p className="text-gray-500 mt-1">{recipe.description}</p>
      </div>

      {/* 메타 */}
      <div className="flex gap-3 flex-wrap text-sm text-gray-600">
        <span className="flex items-center gap-1"><Clock size={16}/> {recipe.cookingTime}</span>
        <span className="flex items-center gap-1"><ChefHat size={16}/> {recipe.difficulty}</span>
        <span className="flex items-center gap-1"><Users size={16}/> {recipe.servings}</span>
      </div>

      {/* 재료 */}
      <div className="bg-white border rounded-xl p-4">
        <h2 className="font-semibold mb-3">재료</h2>

        <div className="space-y-2">
          {recipe.ingredientList?.map((i, idx) => (
            <button
              key={idx}
              onClick={() => toggleIngredient(i.id || idx)}
              className={clsx(
                "flex items-center justify-between w-full p-3 rounded-lg",
                checkedIngredients.has(i.id || idx)
                  ? "bg-gray-100 line-through text-gray-400"
                  : "hover:bg-gray-50"
              )}
            >
              <span>{i.name || i}</span>
              <span className="text-sm text-gray-500">{i.amount}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 조리 순서 */}
      <div className="bg-white border rounded-xl p-4 space-y-4">
        <h2 className="font-semibold">조리 순서</h2>
        {renderBlocks()}
      </div>

      {/* 삭제 */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="레시피 삭제"
        message="삭제하시겠습니까?"
        confirmText="삭제"
      />
    </div>
  )
}

export default RecipeDetail