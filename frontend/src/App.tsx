import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';

function App() {
  const { fetchProfile, isLoading } = useAuthStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<div>Login Page (Coming in Phase 6)</div>} />
        <Route path="/register" element={<div>Register Page (Coming in Phase 6)</div>} />
        <Route path="/dashboard" element={<div>Dashboard (Coming in Phase 7)</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
