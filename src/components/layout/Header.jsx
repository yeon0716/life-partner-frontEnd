import { useState } from 'react'

function Header() {
  const [isAdmin, setIsAdmin] = useState(false)

  return (
    <header className="w-full h-14 flex items-center justify-end px-4 border-b border-gray-200 bg-white">

      <button
        onClick={() => setIsAdmin(!isAdmin)}
        className={`
          flex flex-col items-end px-4 py-2 rounded-lg text-sm transition
          ${isAdmin
            ? 'bg-black text-white'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
        `}
      >
        <span className="font-medium">
          {isAdmin ? '관리자 모드' : '일반 회원 모드'}
        </span>

        <span className="text-[11px] opacity-70">
          (클릭시 관리자 변경)
        </span>
      </button>

    </header>
  )
}

export default Header