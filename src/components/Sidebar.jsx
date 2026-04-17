import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Home,
  Refrigerator,
  Lightbulb,
  Wallet,
  UtensilsCrossed,
  ShoppingCart,
  Tag,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  User,
  Settings,
  LogOut,
  UserX,
  Bookmark,
  Heart,
  HelpCircle,
  Key,
  Eye,
  Edit
} from 'lucide-react'

function Sidebar() {
  const navigate = useNavigate()
  const [recipeOpen, setRecipeOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const user = {
    name: '김루틴',
    grade: '일반 회원'
  }

  const mainMenus = [
    { path: '/', icon: Home, label: '홈' },
    { path: '/refrigerator', icon: Refrigerator, label: '냉장고' },
    { path: '/tips', icon: Lightbulb, label: '꿀팁아카이브' },
    { path: '/household', icon: Wallet, label: '가계부' },
  ]

  const recipeSubMenus = [
    { path: '/recipe', label: '레시피 리스트' },
    { path: '/recipe/search', label: '레시피 검색' },
    { path: '/bookmark?type=recipe', label: '북마크한 레시피' },
    { path: '/likes?type=recipe', label: '좋아요한 레시피' },
  ]

  const bottomMenus = [
    { path: '/shopping', icon: ShoppingCart, label: '장보기 계획' },
    { path: '/hotdeal', icon: Tag, label: '핫딜 쇼핑링크' },
    { path: '/routine', icon: RotateCcw, label: '반복루틴' },
  ]

  const userSubMenus = [
    { path: '/myinfo', icon: Eye, label: '내 정보 보기' },
    { path: '/myinfo/edit', icon: Edit, label: '내 정보 수정' },
    { path: '/myinfo/password', icon: Key, label: '비밀번호 변경' },
    { path: '/bookmark', icon: Bookmark, label: '북마크 리스트' },
    { path: '/likes', icon: Heart, label: '좋아요 리스트' },
    { path: '/qna', icon: HelpCircle, label: '고객센터 Q&A' },
  ]

  const handleLogout = () => {
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-number">1</span>
        <span className="logo-text">솔로라이프</span>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {mainMenus.map((menu) => (
            <li key={menu.path}>
              <NavLink to={menu.path} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end={menu.path === '/'}>
                <menu.icon size={20} />
                <span>{menu.label}</span>
              </NavLink>
            </li>
          ))}

          <li className="nav-group">
            <button className="nav-item nav-toggle" onClick={() => setRecipeOpen(!recipeOpen)}>
              <UtensilsCrossed size={20} />
              <span>레시피 아카이브</span>
              {recipeOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {recipeOpen && (
              <ul className="sub-nav-list">
                {recipeSubMenus.map((sub) => (
                  <li key={sub.path}>
                    <NavLink to={sub.path} className="sub-nav-item">
                      {sub.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {bottomMenus.map((menu) => (
            <li key={menu.path}>
              <NavLink to={menu.path} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <menu.icon size={20} />
                <span>{menu.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-user">
        <button className="user-toggle" onClick={() => setUserMenuOpen(!userMenuOpen)}>
          <div className="user-avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <span className="user-name">{user.name} 님</span>
            <span className="user-grade">{user.grade}</span>
          </div>
          {userMenuOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {userMenuOpen && (
          <div className="user-dropdown">
            <div className="user-dropdown-header">
              <span className="dropdown-name">{user.name}</span>
              <span className="dropdown-grade">{user.grade}</span>
            </div>
            <ul className="user-menu-list">
              {userSubMenus.map((menu) => (
                <li key={menu.path}>
                  <NavLink to={menu.path} className="user-menu-item">
                    <menu.icon size={18} />
                    <span>{menu.label}</span>
                  </NavLink>
                </li>
              ))}
              <li className="menu-divider"></li>
              <li>
                <button className="user-menu-item" onClick={handleLogout}>
                  <LogOut size={18} />
                  <span>로그아웃</span>
                </button>
              </li>
              <li>
                <NavLink to="/withdraw" className="user-menu-item danger">
                  <UserX size={18} />
                  <span>회원 탈퇴</span>
                </NavLink>
              </li>
            </ul>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
