// src/App.jsx
import { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import useAuthStore from './store/authStore';

function App() {
  const location = useLocation();
  const { isAuthenticated, rehydrated } = useAuthStore(); // 스토어에서 인증 상태를 가져옵니다.

  // Preline JS 초기화 로직
  useEffect(() => {
    if (rehydrated && window.HSStaticMethods) {
      setTimeout(() => {
        window.HSStaticMethods.autoInit();
      }, 100);
    }
  }, [rehydrated, location.pathname]);

  // 만약 아직 상태 복원이 완료되지 않았다면, 로딩 화면을 보여줍니다.
  if (!rehydrated) {
    return (
      <div className="flex h-screen items-center justify-center">
        {/* 여기에 스피너 컴포넌트를 넣으면 더 좋습니다. */}
        Loading...
      </div>
    );
  }

  return (
    <AppLayout>
      <Routes>
        {/* 기본 경로: 로그인하지 않은 사용자는 로그인 페이지로, 로그인한 사용자는 홈페이지로 */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />
          } 
        />
        
        {/* 로그인 페이지: 이미 로그인한 사용자는 홈페이지로 리다이렉트 */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
          } 
        />
        
        {/* 회원가입 페이지: 이미 로그인한 사용자는 홈페이지로 리다이렉트 */}
        <Route 
          path="/signup" 
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <SignUpPage />
          } 
        />
        
        {/* 존재하지 않는 경로는 로그인 페이지로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AppLayout>
  );
}

export default App;