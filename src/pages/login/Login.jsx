import { useState } from "react";
import { memberAPI } from "../../api/member/memberApi";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 입력값 체크
    if (!formData.email || !formData.password) {
      toast.error("이메일과 비밀번호를 입력하세요");
      return;
    }

    try {
      const res = await memberAPI.login(formData);

      if (res.data?.token) {
        localStorage.setItem("accessToken", res.data.token);
      }

      toast.success("로그인 성공!");
      navigate("/");

    } catch (err) {
      toast.error("로그인 실패");
      console.log(err);
    }
  };

  return (
   <div className="login-container">
  <div className="login-card">

    <div className="login-logo">1</div>

    <div className="login-title">로그인</div>
    <div className="login-desc">계정에 로그인하세요</div>

    <form onSubmit={handleSubmit} className="login-form">

      <div>
        <div className="login-label">이메일</div>
        <input
          className="login-input"
          type="email"
          placeholder="email@example.com"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />
      </div>

      <div>
        <div className="login-label">비밀번호</div>
        <input
          className="login-input"
          type="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
      </div>

      <button className="login-button">로그인</button>

      <div className="login-footer">
        계정이 없으신가요?{" "}
        <Link to="/signup" className="login-link">
          회원가입
        </Link>
      </div>

    </form>
  </div>
</div>
  );
};