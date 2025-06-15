import React from 'react';
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
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;