import React, { lazy, Suspense, useLayoutEffect } from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, useLocation } from 'react-router-dom';
import MainLayout from './Layout/MainLayout';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Scroll restoration component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant', // Skip animations for immediate response
    });
  }, [pathname]);

  return null;
};

// Wrap MainLayout with ScrollToTop
const LayoutWithScroll = () => (
  <>
    <ScrollToTop />
    <MainLayout />
  </>
);

// Lazy load components
const HomePage = lazy(() => import('./pages/HomePage'));
const Contact = lazy(() => import('./pages/Contact'));
const Method = lazy(() => import('./pages/Method'));
const Sobre_Mi = lazy(() => import('./pages/Sobre_Mi'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const StudentProfilePage = lazy(() => import('./pages/StudentProfilePage'));
const StudentLanding = lazy(() => import('./pages/StudentLanding'));
const FileDashboard = lazy(() => import('./components/FileDashboard'));
const SharedDriveDashboard = lazy(() => import('./components/SharedDriveDashboard'));
const BlogComponent = lazy(() => import('./components/BlogComponent'));
const BlogDetails = lazy(() => import('./components/BlogDetails'));
const FeedbackForm = lazy(() => import('./components/FeedbackForm'));
const TeacherHomeworkReview = lazy(() => import('./components/TeacherHomeworkReview'));
const StudentHomeworkSummary = lazy(() => import('./components/StudentHomeworkSummary'));
const GradeSummary = lazy(() => import('./components/GradeSummary'));
const HomeworkPage = lazy(() => import('./components/HomeworkPage'));

// Loading component
const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <div style={{ 
      width: '50px', 
      height: '50px', 
      border: '5px solid #f3f3f3',
      borderTop: '5px solid #3498db',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
  </div>
);

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<LayoutWithScroll />}>
        <Route index element={
          <Suspense fallback={<LoadingSpinner />}>
            <HomePage />
          </Suspense>
        } />
        <Route path="/contacto" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Contact />
          </Suspense>
        } />
        <Route path="/metodo" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Method />
          </Suspense>
        } />
        <Route path="/sobre-mi" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Sobre_Mi />
          </Suspense>
        } />
        <Route path="/login" element={
          <Suspense fallback={<LoadingSpinner />}>
            <LoginPage />
          </Suspense>
        } />
        <Route path="/blog" element={
          <Suspense fallback={<LoadingSpinner />}>
            <BlogComponent />
          </Suspense>
        } />
        <Route path="/blog/:id" element={
          <Suspense fallback={<LoadingSpinner />}>
            <BlogDetails />
          </Suspense>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <StudentProfilePage />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/landing" element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <StudentLanding />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/dash/files" element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <FileDashboard />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/dash-shared/files" element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <SharedDriveDashboard />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/feedback" element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <FeedbackForm />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/homework" element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <HomeworkPage />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/teacher-homework" element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <TeacherHomeworkReview />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/student-homework" element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <StudentHomeworkSummary />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/grade-summary-page" element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <GradeSummary />
            </Suspense>
          </ProtectedRoute>
        } />
      </Route>
    ),
    {
      basename: '/',
      future: {
        v7_normalizeFormMethod: true
      }
    }
  );

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
