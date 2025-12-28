import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import WorkoutPage from './pages/WorkoutPage';
import DashboardPage from './pages/DashboardPage';
import DietPage from './pages/DietPage';
import ProgressPage from './pages/ProgressPage';
import ProfileDashboard from './pages/ProfileDashboard';
import ProfileWizard from './pages/ProfileWizard';
import TodayPage from './pages/TodayPage';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="auth" element={<AuthPage />} />

        {/* Protected Routes */}
        <Route
          path="today"
          element={
            <ProtectedRoute>
              <TodayPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="workout"
          element={
            <ProtectedRoute>
              <WorkoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="diet"
          element={
            <ProtectedRoute>
              <DietPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="progress"
          element={
            <ProtectedRoute>
              <ProgressPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfileDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile/setup"
          element={
            <ProtectedRoute>
              <ProfileWizard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<HomePage />} />
      </Route>
    </Routes>
  );
};

export default App;
