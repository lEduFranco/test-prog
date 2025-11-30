import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';

import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { CandidateDashboard } from './pages/CandidateDashboard';
import { MyApplications } from './pages/MyApplications';
import { JobDetails } from './pages/JobDetails';
import { AdminDashboard } from './pages/AdminDashboard';
import { JobForm } from './pages/JobForm';
import { JobApplications } from './pages/JobApplications';

import {
  candidateDashboardLoader,
  adminDashboardLoader,
  jobDetailsLoader,
  myApplicationsLoader,
  jobApplicationsLoader,
  jobFormLoader,
} from './loaders';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin/dashboard' : '/dashboard'} replace />;
  }

  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <AuthGuard>
        <Login />
      </AuthGuard>
    ),
  },
  {
    path: '/register',
    element: (
      <AuthGuard>
        <Register />
      </AuthGuard>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['candidate']}>
        <CandidateDashboard />
      </ProtectedRoute>
    ),
    loader: candidateDashboardLoader,
  },
  {
    path: '/applications',
    element: (
      <ProtectedRoute allowedRoles={['candidate']}>
        <MyApplications />
      </ProtectedRoute>
    ),
    loader: myApplicationsLoader,
  },
  {
    path: '/jobs/:id',
    element: (
      <ProtectedRoute>
        <JobDetails />
      </ProtectedRoute>
    ),
    loader: jobDetailsLoader,
  },
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
    loader: adminDashboardLoader,
  },
  {
    path: '/admin/jobs/new',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <JobForm />
      </ProtectedRoute>
    ),
    loader: jobFormLoader,
  },
  {
    path: '/admin/jobs/:id/edit',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <JobForm />
      </ProtectedRoute>
    ),
    loader: jobFormLoader,
  },
  {
    path: '/admin/jobs/:id/applications',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <JobApplications />
      </ProtectedRoute>
    ),
    loader: jobApplicationsLoader,
  },
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;
