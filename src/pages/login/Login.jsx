import { useState } from "react";
import { memberAPI } from "../../api/member/memberApi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {

  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.'
    }
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.'
    }
    return newErrors
  }

 const handleSubmit = async (e) => {
  e.preventDefault()

  try {
    const res = await memberAPI.login(formData)

    localStorage.setItem("token", res.data.accessToken)
    localStorage.setItem("refreshToken", res.data.refreshToken)
    localStorage.setItem("memberId", res.data.memberId)

    navigate("/recipe")

  } catch (err) {
    // 🔥 로그인 실패하면 기존 토큰 제거
    localStorage.removeItem("token")
    localStorage.removeItem("memberId")

    toast.error("로그인 실패")
  }
}

 return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-number">1</span>
            <span className="logo-text">솔로라이프</span>
          </div>
          <h1 className="auth-title">로그인</h1>
          <p className="auth-subtitle">솔로라이프에 오신 것을 환영합니다</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요"
                className={errors.password ? 'error' : ''}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <span>아이디 저장</span>
            </label>
            <Link to="/forgot-password" className="forgot-link">비밀번호 찾기</Link>
          </div>

          <button type="submit" className="auth-button">로그인</button>
        </form>

        <div className="auth-footer">
          <span>아직 회원이 아니신가요?</span>
          <Link to="/signup" className="signup-link">회원가입</Link>
        </div>
      </div>
    </div>
  )
};