import { useState } from "react";
import { memberAPI } from "../../api/member/memberApi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    phone: ""
  });

  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);

  // 📌 이메일 정규식
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 📌 전화번호 자동 포맷
  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, "");

    if (numbers.length < 4) return numbers;
    if (numbers.length < 8)
      return numbers.replace(/(\d{3})(\d+)/, "$1-$2");
    return numbers.replace(/(\d{3})(\d{4})(\d+)/, "$1-$2-$3");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 전화번호 포맷 적용
    if (name === "phone") {
      setForm({ ...form, phone: formatPhone(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // 📌 이메일 인증 요청
  const sendEmail = async () => {
    if (!form.email) {
      toast.error("이메일을 입력하세요");
      return;
    }

    if (!emailRegex.test(form.email)) {
      toast.error("올바른 이메일 형식이 아닙니다 (example@domain.com)");
      return;
    }

    try {
      await memberAPI.sendEmail(form.email);
      toast.success("인증번호 발송 완료");
    } catch (err) {
      toast.error("메일 발송 실패");
    }
  };

  // 📌 인증 확인
  const verify = async () => {
    if (!code) {
      toast.error("인증번호를 입력하세요");
      return;
    }

    try {
      const res = await memberAPI.verify(form.email, code);

      if (res.data === "성공") {
        setVerified(true);
        toast.success("이메일 인증 완료");
      } else {
        toast.error("인증 실패");
      }
    } catch (err) {
      toast.error("인증 오류");
    }
  };

  // 📌 회원가입
  const signup = async () => {
    // 인증 체크
    if (!verified) {
      toast.error("이메일 인증 먼저 진행해주세요");
      return;
    }

    // 필수값 체크
    if (!form.email || !form.password || !form.name || !form.phone) {
      toast.error("모든 항목을 입력하세요");
      return;
    }

    // 이메일 형식 체크
    if (!emailRegex.test(form.email)) {
      toast.error("이메일 형식이 올바르지 않습니다");
      return;
    }

    // 비밀번호 조건 (최소 8자)
    if (form.password.length < 8) {
      toast.error("비밀번호는 8자 이상 입력하세요");
      return;
    }

    // 이름 최소 길이
    if (form.name.length < 2) {
      toast.error("이름은 2자 이상 입력하세요");
      return;
    }

    // 전화번호 형식 체크
    if (!/^010-\d{4}-\d{4}$/.test(form.phone)) {
      toast.error("전화번호 형식이 올바르지 않습니다 (010-1234-5678)");
      return;
    }

    try {
        await memberAPI.signup(form);
        toast.success("회원가입 완료");
        navigate("/login");
    } catch (err) {
        const msg = err.response?.data;
        if (msg === "EMAIL_DUPLICATE") {
            toast.error("이미 존재하는 이메일입니다");
        } else if (msg === "EMAIL_NOT_VERIFIED") {
            toast.error("이메일 인증을 먼저 진행해주세요");
        } else {
            toast.error("회원가입 실패");
        }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">

        <h2 className="signup-title">회원가입</h2>

        {/* 이메일 */}
        <div className="signup-row">
          <input
            className="signup-input"
            name="email"
            placeholder="example@email.com"
            onChange={handleChange}
          />
          <button className="signup-button" onClick={sendEmail}>
            인증
          </button>
        </div>

        {/* 인증번호 */}
        <div className="signup-row">
          <input
            className="signup-input"
            placeholder="인증번호 입력"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button className="signup-button" onClick={verify}>
            확인
          </button>
        </div>

        {/* 비밀번호 */}
        <input
          className="signup-input"
          name="password"
          type="password"
          placeholder="비밀번호 (8자 이상)"
          onChange={handleChange}
        />

        {/* 이름 */}
        <input
          className="signup-input"
          name="name"
          placeholder="이름"
          onChange={handleChange}
        />

        {/* 전화번호 */}
        <input
          className="signup-input"
          name="phone"
          placeholder="010-1234-5678"
          value={form.phone}
          onChange={handleChange}
        />

        <button className="signup-main-button" onClick={signup}>
          회원가입
        </button>

      </div>
    </div>
  );
}