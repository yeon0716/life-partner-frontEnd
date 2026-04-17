import { useState } from 'react'
import { Link } from 'react-router-dom'
import { RefreshCw, Flame, Bookmark, Refrigerator, Wallet, ShoppingCart, Lightbulb, Clock, ChevronRight } from 'lucide-react'

function Dashboard() {
  const user = { name: '김루틴' }

  const [routines] = useState([
    { id: 1, text: '아침 기상 후 물 1잔', completed: true },
    { id: 2, text: '영양제 챙겨먹기', completed: true },
    { id: 3, text: '10분 가벼운 스트레칭', completed: false },
    { id: 4, text: '퇴근 후 쓰레기통 비우기', completed: false },
  ])

  const [hotDeals] = useState([
    { id: 1, category: '생필품', badge: '특가판매', name: '크리넥스 3겹 화장지 30롤 x 2팩 특가', discount: 45, price: 24900 },
    { id: 2, category: '식품', name: '맹진닭컴 닭가슴살 혼합 패키지 30팩', discount: 30, price: 39800 },
    { id: 3, category: '식품', name: '햇반 210g 36개입 박스', discount: 20, price: 32500 },
  ])

  const [bookmarkedRecipes] = useState([
    { id: 1, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop', name: '10분 완성 간장계란밥', time: '10분 소요' },
    { id: 2, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&h=100&fit=crop', name: '자취생 필수 얼큰 순두부찌개', time: '25분 소요' },
    { id: 3, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&h=100&fit=crop', name: '건강한 닭가슴살 샐러드', time: '15분 소요' },
  ])

  const completedCount = routines.filter(r => r.completed).length
  const progressPercent = (completedCount / routines.length) * 100

  const quickLinks = [
    { path: '/refrigerator', icon: Refrigerator, label: '냉장고 관리', color: '#4CAF50' },
    { path: '/household', icon: Wallet, label: '가계부', color: '#FF9800' },
    { path: '/shopping', icon: ShoppingCart, label: '장보기 계획', color: '#2196F3' },
    { path: '/tips', icon: Lightbulb, label: '꿀팁 아카이브', color: '#9C27B0' },
  ]

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <h1 className="welcome-title">환영합니다, {user.name}님!</h1>
        <p className="welcome-subtitle">오늘도 체계적이고 평온한 솔로라이프를 응원합니다.</p>
      </div>

      <div className="dashboard-grid">
        <div className="card routine-card">
          <div className="card-header">
            <div className="card-title">
              <RefreshCw size={20} />
              <span>오늘의 반복루틴</span>
            </div>
            <Link to="/routine" className="card-link">전체보기</Link>
          </div>
          <ul className="routine-list">
            {routines.map((routine) => (
              <li key={routine.id} className="routine-item">
                <label className="routine-checkbox">
                  <input type="checkbox" checked={routine.completed} readOnly />
                  <span className={routine.completed ? 'completed' : ''}>{routine.text}</span>
                </label>
              </li>
            ))}
          </ul>
          <div className="progress-section">
            <span className="progress-label">달성률</span>
            <span className="progress-value">{Math.round(progressPercent)}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        <div className="card hotdeal-card">
          <div className="card-header">
            <div className="card-title">
              <Flame size={20} />
              <span>실시간 인기 핫딜</span>
            </div>
            <Link to="/hotdeal" className="card-link">더보기</Link>
          </div>
          <ul className="hotdeal-list">
            {hotDeals.map((deal) => (
              <li key={deal.id} className="hotdeal-item">
                <div className="hotdeal-info">
                  <span className="hotdeal-category">{deal.category}</span>
                  {deal.badge && <span className="hotdeal-badge">{deal.badge}</span>}
                </div>
                <p className="hotdeal-name">{deal.name}</p>
                <div className="hotdeal-price">
                  <span className="discount">{deal.discount}%</span>
                  <span className="price">{deal.price.toLocaleString()}원</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card recipe-card">
          <div className="card-header">
            <div className="card-title">
              <Bookmark size={20} />
              <span>북마크한 레시피</span>
            </div>
            <Link to="/bookmark?type=recipe" className="card-link">레시피 창고</Link>
          </div>
          <ul className="recipe-list">
            {bookmarkedRecipes.map((recipe) => (
              <li key={recipe.id} className="recipe-item">
                <img src={recipe.image} alt={recipe.name} className="recipe-image" />
                <div className="recipe-info">
                  <p className="recipe-name">{recipe.name}</p>
                  <span className="recipe-time">
                    <Clock size={14} />
                    {recipe.time}
                  </span>
                </div>
                <ChevronRight size={20} className="recipe-arrow" />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="quick-links">
        {quickLinks.map((link) => (
          <Link key={link.path} to={link.path} className="quick-link-card">
            <div className="quick-link-icon" style={{ backgroundColor: `${link.color}20`, color: link.color }}>
              <link.icon size={24} />
            </div>
            <span className="quick-link-label">{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
