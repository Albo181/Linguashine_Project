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

const App = () => {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="/contacto" element={<Contact />} />
                <Route path="/metodo" element={<Method />} />
                <Route path="/sobre-mi" element={<Sobre_Mi />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/profile" element={<StudentProfilePage />} />
                <Route path="/landing" element={<StudentLanding />} />
                <Route path="/dash/files" element={<FileDashboard />} />
                <Route path="/dash-shared/files" element={<SharedDriveDashboard />} />
                <Route path="/blog" element={<BlogComponent />} />
                <Route path="/blog/:id" element={<BlogDetails />} />
                <Route path="/feedback" element={<FeedbackForm />} />
                <Route path="/homework" element={<HomeworkPage />} />
                <Route path="/teacher-homework" element={<TeacherHomeworkReview />} />
                <Route path="/student-homework" element={<StudentHomeworkSummary />} />
                <Route path="/grade-summary-page" element={<GradeSummary />} />
            </Route>
        )
    );

    return <RouterProvider router={router} />;
};

export default App;
