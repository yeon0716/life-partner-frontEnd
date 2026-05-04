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
    { path: '/account', icon: Wallet, label: '가계부' },
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

  const handleLogout = () => navigate('/login')

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col justify-between">

      {/* Logo */}
      <div className="p-5 font-bold text-lg flex items-center gap-2">
        <span className="w-6 h-6 bg-black text-white flex items-center justify-center rounded">
          1
        </span>
        힘들어디진다
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3">
        <ul className="space-y-1">

          {/* main menu */}
          {mainMenus.map((menu) => (
            <li key={menu.path}>
              <NavLink
                to={menu.path}
                end={menu.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
                  ${isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'}`
                }
              >
                <menu.icon size={20} />
                {menu.label}
              </NavLink>
            </li>
          ))}

          {/* recipe group */}
          <li>
            <button
              onClick={() => setRecipeOpen(!recipeOpen)}
              className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <UtensilsCrossed size={20} />
                레시피 아카이브
              </div>
              {recipeOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {recipeOpen && (
              <ul className="ml-6 mt-1 space-y-1">
                {recipeSubMenus.map((sub) => (
                  <li key={sub.path}>
                    <NavLink
                      to={sub.path}
                      className="block px-2 py-1 text-sm text-gray-600 hover:text-black"
                    >
                      {sub.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* bottom menus */}
          {bottomMenus.map((menu) => (
            <li key={menu.path}>
              <NavLink
                to={menu.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
                  ${isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'}`
                }
              >
                <menu.icon size={20} />
                {menu.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User */}
      <div className="relative border-t border-gray-200 p-3">

        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
        >
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User size={18} />
          </div>

          <div className="flex-1 text-left">
            <div className="text-sm font-medium">{user.name} 님</div>
            <div className="text-xs text-gray-500">{user.grade}</div>
          </div>

          {userMenuOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {/* dropdown */}
        {userMenuOpen && (
          <div className="absolute bottom-16 left-3 right-3 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
            {userSubMenus.map((menu) => (
              <NavLink
                key={menu.path}
                to={menu.path}
                className="flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-gray-100"
              >
                <menu.icon size={16} />
                {menu.label}
              </NavLink>
            ))}

            <div className="my-2 border-t" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded"
            >
              <LogOut size={16} />
              로그아웃
            </button>

            <NavLink
              to="/withdraw"
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded"
            >
              <UserX size={16} />
              회원 탈퇴
            </NavLink>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar