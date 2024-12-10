import React, { useState, useEffect } from "react";
import { Button, TextField, MenuItem, Typography, Box, CircularProgress } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

// Add this function before the FeedbackForm component
const getCsrfToken = () => {
    const name = 'csrftoken=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let cookie of cookieArray) {
        cookie = cookie.trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return null;
};

const FeedbackForm = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [currentUserUsername, setCurrentUserUsername] = useState("");
    const [sendToOptions, setSendToOptions] = useState([]);
    const [sendTo, setSendTo] = useState("");
    const [taskType, setTaskType] = useState("");
    const [taskTypes] = useState([
        { value: 'Cambridge', label: 'Cambridge' },
        { value: 'Aptis', label: 'Aptis' },
        { value: 'EOI', label: 'Escuela Oficial de Idiomas' },
        { value: 'IELTS', label: 'Ielts' },
        { value: 'Trinity', label: 'Trinity' },
        { value: '(Homework task)', label: 'Homework Task' },
        { value: '(Essay)', label: 'Essay' },
        { value: '(Project)', label: 'Project' },
        { value: '*Other*', label: 'Other' }
    ]);
    const [gradeAwarded, setGradeAwarded] = useState("");
    const [gradeTotal, setGradeTotal] = useState("");
    const [gradePercent, setGradePercent] = useState(null);
    const [gradeSpanish, setGradeSpanish] = useState(null);
    const [studentNotes, setStudentNotes] = useState("");
    const [teacherNotes, setTeacherNotes] = useState("");
    const [documentArea, setDocumentArea] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [feedbackId, setFeedbackId] = useState(null);
    const [studentName, setStudentName] = useState("");
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    const isTeacher = user?.user_type === 'teacher';

    // Add session check
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await apiClient.get('/users/check-auth/');
                if (!response.data.logged_in) {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Session check failed:', error);
                // Only navigate to login if it's a 401 error
                if (error.response?.status === 401) {
                    navigate('/login');
                }
            }
        };
        checkSession();
    }, [navigate]);

    // Add navigation handler
    const handleBack = () => {
        navigate('/landing');
    };

    // GETS LOGGED-IN USER DETAILS
    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            const response = await apiClient.get("/users/me/");
            const data = response.data;
            setUserId(data.id);
            setCurrentUser(data);
            setCurrentUserUsername(data.username || "");
            setStudentName(data.name || data.username || "Unknown Student");
        } catch (error) {
            console.error("Error fetching profile:", error);
            setError("Failed to load user profile");
        } finally {
            setIsLoading(false);
        }
    };

    //GETS "ALL" USER DETAILS
    const fetchUsers = async () => {
        try {
            const response = await apiClient.get("/users/all-users/");
            const users = response.data;
            
            // Extract user details including name
            const processedUsers = users.map(user => ({
                id: user.id,
                username: user.username,
                name: user.first_name ? `${user.first_name} ${user.last_name}` : user.username,
                user_type: user.user_type
            }));
            
            const students = processedUsers.filter(user => user.user_type === "student");
            const teachers = processedUsers.filter(user => user.user_type === "teacher");
            
            console.log("Processed users:", processedUsers);
            console.log("Students:", students);
            console.log("Teachers:", teachers);
            
            setSendToOptions(currentUser?.user_type === "teacher" ? students : teachers);
        } catch (error) {
            console.error("Error fetching users:", error);
            setError("Failed to load users list");
        }
    };

    // FETCH LOGGED-IN USER ON FIRST RENDER
    useEffect(() => {
        fetchProfile();
    }, []);

    // FETCHES ALL USERS WHENEVER A USER FIRST LOGS IN
    useEffect(() => {
        if (currentUser) fetchUsers();
    }, [currentUser]);

    // CALCULATES HOMEWORK PERCENTAGE
    useEffect(() => {
        if (gradeAwarded && gradeTotal) {
            const percentage = (gradeAwarded / gradeTotal) * 100;
            setGradePercent(percentage.toFixed(2));
            setGradeSpanish((percentage / 10).toFixed(1));
        }
    }, [gradeAwarded, gradeTotal]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("File selected:", file);
            console.log("File type:", file.type);
            console.log("File name:", file.name);
            console.log("File size:", file.size);
            
            // Check file size (25MB limit)
            if (file.size > 25 * 1024 * 1024) {
                alert("File size too large. Maximum size allowed is 25MB.");
                e.target.value = ''; // Clear the file input
                return;
            }
            
            // Check file type
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];
            
            if (!allowedTypes.includes(file.type)) {
                alert("Invalid file type. Please upload a PDF, DOC, or DOCX file.");
                e.target.value = ''; // Clear the file input
                return;
            }
            
            setDocumentArea(file);
            if (file.type === 'application/pdf') {
                setPreviewUrl(URL.createObjectURL(file));
            } else {
                setPreviewUrl(null);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        if (!userId) {
            alert("User ID not found. Please log in again.");
            setIsSubmitting(false);
            return;
        }

        try {
            // Validate required fields
            if (!sendTo) {
                throw new Error(currentUser?.user_type === 'teacher' ? 'Please select a student' : 'Please select a teacher');
            }
            if (!taskType) {
                throw new Error('Please select a task type');
            }
            if (!documentArea) {
                throw new Error('Please upload a document');
            }

            const formData = new FormData();
            
            // Add the file with correct field name
            formData.append('document_area', documentArea);
            
            // Add other form fields
            formData.append('student_name', currentUser?.user_type === 'teacher' ? sendTo : userId.toString());
            formData.append('send_to', sendTo);
            formData.append('task_type', taskType);

            // Add teacher-specific fields
            if (isTeacher) {
                if (teacherNotes) formData.append('teacher_notes', teacherNotes);
                if (gradeAwarded) formData.append('grade_awarded', gradeAwarded);
                if (gradeTotal) formData.append('grade_total', gradeTotal);
            } else {
                if (studentNotes) formData.append('student_notes', studentNotes);
            }

            // Log FormData contents for debugging
            console.log('Submitting form with data:');
            for (let [key, value] of formData.entries()) {
                if (value instanceof File) {
                    console.log(`${key}: File - ${value.name} (${value.type}, ${value.size} bytes)`);
                } else {
                    console.log(`${key}: ${value}`);
                }
            }

            const response = await apiClient.post('/api/upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRFToken': getCsrfToken(),
                }
            });

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            setSuccess(true);
            alert('Feedback submitted successfully!');
            resetForm();
        } catch (error) {
            console.error("Error during submission:", error);
            setError(error.message || "An error occurred while submitting the feedback.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setSendTo('');
        setTaskType('');
        setGradeAwarded('');
        setGradeTotal('');
        setGradePercent(null);
        setGradeSpanish(null);
        setStudentNotes('');
        setTeacherNotes('');
        setDocumentArea(null);
        setPreviewUrl(null);
        setError(null);
        setIsSubmitting(false);
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            width: '100%',
            maxWidth: '100vw',
            overflow: 'hidden',
            p: { xs: 2, sm: 4, md: 6 },
            mt: '80px'
        }}>
            {/* Add back button */}
            <Button
                onClick={handleBack}
                variant="outlined"
                sx={{ mb: 2 }}
            >
                Back to Landing Page
            </Button>

            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
                {currentUser?.user_type === 'teacher' ? 'Teacher Feedback Form' : 'Student Assignment Upload'}
            </Typography>
            
            <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 4,
                maxWidth: '1400px',
                mx: 'auto',
                px: { xs: 1, sm: 2, md: 4 }
            }}>
                {/* Left side - Form */}
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        flex: 1,
                        minWidth: { xs: '100%', sm: '380px' },
                        maxWidth: { sm: '45%' }
                    }}
                >
                    {/* Send To Field */}
                    <TextField
                        select
                        label={currentUser?.user_type === 'teacher' ? "Select Student" : "Select Teacher"}
                        value={sendTo}
                        onChange={(e) => setSendTo(e.target.value)}
                        fullWidth
                        required
                        sx={{ mb: 2.5 }}
                    >
                        {sendToOptions.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.username}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* Task Type Field */}
                    <TextField
                        select
                        label="Task Type"
                        value={taskType}
                        onChange={(e) => setTaskType(e.target.value)}
                        fullWidth
                        required
                        sx={{ mb: 2.5 }}
                    >
                        {taskTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                                {type.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* Teacher-specific fields */}
                    {currentUser?.user_type === 'teacher' && (
                        <>
                            <TextField
                                label="Grade Awarded"
                                type="number"
                                value={gradeAwarded}
                                onChange={(e) => setGradeAwarded(e.target.value)}
                                fullWidth
                                sx={{ mb: 2.5 }}
                            />
                            <TextField
                                label="Total Grade"
                                type="number"
                                value={gradeTotal}
                                onChange={(e) => setGradeTotal(e.target.value)}
                                fullWidth
                                sx={{ mb: 2.5 }}
                            />
                            
                            {/* Grade Calculations Display */}
                            {(gradeAwarded && gradeTotal) && (
                                <Box sx={{ 
                                    mb: 2.5, 
                                    p: 2, 
                                    bgcolor: 'background.paper',
                                    borderRadius: 1,
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}>
                                    <Typography variant="body1" gutterBottom>
                                        Grade Percentage: {gradePercent}%
                                    </Typography>
                                    <Typography variant="body1">
                                        Spanish Grade: {gradeSpanish} / 10
                                    </Typography>
                                </Box>
                            )}

                            <TextField
                                label="Teacher Notes"
                                multiline
                                rows={4}
                                value={teacherNotes}
                                onChange={(e) => setTeacherNotes(e.target.value)}
                                fullWidth
                                sx={{ mb: 2.5 }}
                            />
                        </>
                    )}

                    {/* Student-specific fields */}
                    {currentUser?.user_type === 'student' && (
                        <TextField
                            label="Student Notes"
                            multiline
                            rows={4}
                            value={studentNotes}
                            onChange={(e) => setStudentNotes(e.target.value)}
                            fullWidth
                            sx={{ mb: 2.5 }}
                        />
                    )}

                    {/* File Upload */}
                    <Box sx={{ mb: 2.5 }}>
                        <input
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            style={{ display: 'none' }}
                            id="document-upload"
                            type="file"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="document-upload">
                            <Button variant="contained" component="span">
                                Upload Document
                            </Button>
                        </label>
                        {documentArea && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Selected file: {documentArea.name}
                            </Typography>
                        )}
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                    >
                        Submit
                    </Button>
                </Box>

                {/* Right side - Preview */}
                <Box sx={{ 
                    flex: 1,
                    minWidth: { xs: '100%', sm: '380px' },
                    maxWidth: { sm: '45%' },
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '500px',
                    bgcolor: 'background.paper'
                }}>
                    {documentArea ? (
                        documentArea.type === 'application/pdf' && previewUrl ? (
                            <iframe
                                src={previewUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 'none', minHeight: '500px' }}
                                title="Document Preview"
                            />
                        ) : (
                            <Box sx={{ textAlign: 'center', p: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    File Selected: {documentArea.name}
                                </Typography>
                                <Typography color="text.secondary">
                                    Preview not available for this file type.
                                    File will be uploaded when you submit.
                                </Typography>
                            </Box>
                        )
                    ) : (
                        <Typography color="text.secondary">
                            Upload a document to see preview
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default FeedbackForm;
