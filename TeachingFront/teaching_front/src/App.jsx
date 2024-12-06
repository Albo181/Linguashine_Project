import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MainLayout from './Layout/MainLayout';
import Contact from './pages/Contact';
import Method from './pages/Method';
import Sobre_Mi from './pages/Sobre_Mi';
import LoginPage from './pages/LoginPage';
import StudentProfilePage from './pages/StudentProfilePage';
import StudentLanding from './pages/StudentLanding';
import FileDashboard from './components/FileDashboard';
import SharedDriveDashboard from './components/SharedDriveDashboard';
import BlogComponent from './components/BlogComponent';
import BlogDetails from './components/BlogDetails';
import FeedbackForm from './components/FeedbackForm';
import TeacherHomeworkReview from './components/TeacherHomeworkReview';  
import StudentHomeworkSummary from './components/StudentHomeworkSummary';  
import GradeSummary from './components/GradeSummary';
import HomeworkPage from './components/HomeworkPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="/contacto" element={<Contact />} />
                <Route path="/metodo" element={<Method />} />
                <Route path="/sobre-mi" element={<Sobre_Mi />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/blog" element={<BlogComponent />} />
                <Route path="/blog/:id" element={<BlogDetails />} />
                <Route path="/profile" element={<ProtectedRoute><StudentProfilePage /></ProtectedRoute>} />
                <Route path="/landing" element={<ProtectedRoute><StudentLanding /></ProtectedRoute>} />
                <Route path="/dash/files" element={<ProtectedRoute><FileDashboard /></ProtectedRoute>} />
                <Route path="/dash-shared/files" element={<ProtectedRoute><SharedDriveDashboard /></ProtectedRoute>} />
                <Route path="/feedback" element={<ProtectedRoute><FeedbackForm /></ProtectedRoute>} />
                <Route path="/homework" element={<ProtectedRoute><HomeworkPage /></ProtectedRoute>} />
                <Route path="/teacher-homework" element={<ProtectedRoute><TeacherHomeworkReview /></ProtectedRoute>} />
                <Route path="/student-homework" element={<ProtectedRoute><StudentHomeworkSummary /></ProtectedRoute>} />
                <Route path="/grade-summary-page" element={<ProtectedRoute><GradeSummary /></ProtectedRoute>} />
            </Route>
        )
    );

    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
};

export default App;
