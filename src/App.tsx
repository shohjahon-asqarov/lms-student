import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Quizzes from './pages/Quizzes';
import Results from './pages/Results';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import TakeQuiz from './pages/TakeQuiz';
import { queryConfig } from './config/env';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: queryConfig.retryCount,
      staleTime: queryConfig.staleTime,
      refetchOnWindowFocus: queryConfig.refetchOnWindowFocus,
    },
  },
});

function App() {
  const toast = useRef(null);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />

              {/* Protected Routes - Student Only */}
              <Route path="/" element={
                <ProtectedRoute requiredRoles={['STUDENT']}>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={
                  <ProtectedRoute requiredRoles={['STUDENT']}>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="quizzes" element={
                  <ProtectedRoute requiredRoles={['STUDENT']}>
                    <Quizzes />
                  </ProtectedRoute>
                } />
                <Route path="results" element={
                  <ProtectedRoute requiredRoles={['STUDENT']}>
                    <Results />
                  </ProtectedRoute>
                } />
                <Route path="take-quiz/:id" element={
                  <ProtectedRoute requiredRoles={['STUDENT']}>
                    <TakeQuiz />
                  </ProtectedRoute>
                } />
                <Route path="profile" element={
                  <ProtectedRoute requiredRoles={['STUDENT']}>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="settings" element={
                  <ProtectedRoute requiredRoles={['STUDENT']}>
                    <Settings />
                  </ProtectedRoute>
                } />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
          <Toast ref={toast} position="top-right" />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;