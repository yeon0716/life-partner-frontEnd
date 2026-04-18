import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import { Toaster } from 'sonner';
import RecipeList from './pages/recipe/RecipeList';
import RecipeEditor from './pages/recipe/RecipeEditor';
import RecipeDetail from './pages/recipe/RecipeDetail';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>
        {/* 기본 접속 시 로그인으로 이동 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/recipe" element={<RecipeList />} />
        <Route path="/recipeEdit" element={<RecipeEditor />} />
        <Route path="/recipe/:recipeId" element={<RecipeDetail/>} />

        {/* 없는 경로 처리 */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;