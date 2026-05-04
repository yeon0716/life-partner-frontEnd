import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import { Toaster } from 'sonner';

import RecipeList from './pages/recipe/RecipeList';
import RecipeEditor from './pages/recipe/RecipeEditor';
import RecipeDetail from './pages/recipe/RecipeDetail';
import MainLayout from './layouts/MainLayout';
import { ToastProvider } from './components/common/Toast';
import AccountPage from './pages/account/AccountPage';
import AccountDashboard from './pages/account/AccountDashboard';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
    <ToastProvider>
        <Routes>
            {/* 로그인 / 회원가입 (사이드바 없음) */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* 🔥 사이드바 있는 영역 */}
            <Route element={<MainLayout />}>
              <Route path="/recipe" element={<RecipeList />} />
              <Route path="/recipe/edit" element={<RecipeEditor />} />
              <Route path="/recipe/edit/:id" element={<RecipeEditor />} />
              <Route path="/recipe/:id" element={<RecipeDetail />} />
              <Route path="/account" element={<AccountDashboard />} />
            </Route>

            {/* 기본 */}
            <Route path="/" element={<Navigate to="/recipe" />} />

            {/* 없는 경로 */}
            <Route path="*" element={<Navigate to="/login" />} />

          </Routes>
    </ToastProvider>
      
    </BrowserRouter>
  );
}

export default App;