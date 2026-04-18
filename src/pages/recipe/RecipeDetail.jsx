import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Users, ChefHat, Heart, Bookmark, Share2, CheckCircle } from 'lucide-react'

function RecipeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [completedSteps, setCompletedSteps] = useState([])

  const recipe = {
    id: parseInt(id),
    name: '10분 완성 간장계란밥',
    category: '한식',
    difficulty: '쉬움',
    time: '10분',
    servings: '1인분',
    likes: 234,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=400&fit=crop',
    description: '바쁜 아침이나 혼밥할 때 딱! 10분이면 완성되는 간단하고 맛있는 간장계란밥 레시피입니다.',
    ingredients: [
      { name: '밥', amount: '1공기' },
      { name: '계란', amount: '2개' },
      { name: '간장', amount: '1큰술' },
      { name: '참기름', amount: '1작은술' },
      { name: '대파', amount: '약간' },
      { name: '깨', amount: '약간' },
    ],
    steps: [
      '밥을 그릇에 담아 준비합니다.',
      '프라이팬에 기름을 두르고 계란 프라이를 만듭니다.',
      '밥 위에 계란 프라이를 올립니다.',
      '간장과 참기름을 뿌립니다.',
      '송송 썬 대파와 깨를 올려 완성합니다.',
    ],
    tips: '계란 노른자를 터뜨려 밥과 함께 비벼 먹으면 더 맛있어요!'
  }

  const toggleStep = (index) => {
    if (completedSteps.includes(index)) {
      setCompletedSteps(completedSteps.filter(i => i !== index))
    } else {
      setCompletedSteps([...completedSteps, index])
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('링크가 복사되었습니다.')
  }

  return (
    <div className="page-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        <span>목록으로</span>
      </button>

      <article className="recipe-detail">
        <img src={recipe.image} alt={recipe.name} className="recipe-detail-image" />

        <header className="recipe-detail-header">
          <div className="recipe-badges">
            <span className="badge category">{recipe.category}</span>
            <span className="badge difficulty">{recipe.difficulty}</span>
          </div>
          <h1 className="recipe-detail-title">{recipe.name}</h1>
          <p className="recipe-description">{recipe.description}</p>

          <div className="recipe-meta-row">
            <span className="meta-item">
              <Clock size={18} />
              {recipe.time}
            </span>
            <span className="meta-item">
              <Users size={18} />
              {recipe.servings}
            </span>
            <span className="meta-item">
              <ChefHat size={18} />
              {recipe.difficulty}
            </span>
          </div>

          <div className="recipe-actions">
            <button className={`action-btn ${liked ? 'active' : ''}`} onClick={() => setLiked(!liked)}>
              <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
              <span>{recipe.likes + (liked ? 1 : 0)}</span>
            </button>
            <button className={`action-btn ${bookmarked ? 'active' : ''}`} onClick={() => setBookmarked(!bookmarked)}>
              <Bookmark size={20} fill={bookmarked ? 'currentColor' : 'none'} />
              <span>북마크</span>
            </button>
            <button className="action-btn" onClick={handleShare}>
              <Share2 size={20} />
              <span>공유</span>
            </button>
          </div>
        </header>

        <section className="recipe-section">
          <h2 className="section-title">재료</h2>
          <ul className="ingredients-list">
            {recipe.ingredients.map((ing, index) => (
              <li key={index} className="ingredient-item">
                <span className="ingredient-name">{ing.name}</span>
                <span className="ingredient-amount">{ing.amount}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="recipe-section">
          <h2 className="section-title">조리 순서</h2>
          <ol className="steps-list">
            {recipe.steps.map((step, index) => (
              <li 
                key={index} 
                className={`step-item ${completedSteps.includes(index) ? 'completed' : ''}`}
                onClick={() => toggleStep(index)}
              >
                <span className="step-number">{index + 1}</span>
                <span className="step-text">{step}</span>
                {completedSteps.includes(index) && <CheckCircle size={20} className="step-check" />}
              </li>
            ))}
          </ol>
        </section>

        {recipe.tips && (
          <section className="recipe-section tips">
            <h2 className="section-title">요리 팁</h2>
            <p className="tips-content">{recipe.tips}</p>
          </section>
        )}
      </article>
    </div>
  )
}

export default RecipeDetail
