import { useState } from 'react'
import { Settings } from 'lucide-react'

function Header() {
  const [isAdmin, setIsAdmin] = useState(false)

  return (
    <header className="header">
      <div className="header-right">
        <button 
          className={`mode-toggle ${isAdmin ? 'admin' : ''}`}
          onClick={() => setIsAdmin(!isAdmin)}
        >
          {isAdmin ? '관리자 모드' : '일반 회원 모드'}
          <span className="toggle-hint">(클릭시 관리자 변경)</span>
        </button>
      </div>
    </header>
  )
}

export default Header
