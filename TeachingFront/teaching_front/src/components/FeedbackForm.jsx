import React, { useState, useEffect } from "react";
import { Button, TextField, MenuItem, Typography, Box } from "@mui/material";
import AnnotationList from "./AnnotationEditor";
import apiClient from '../api/apiClient';

const FeedbackForm = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [currentUserUsername, setCurrentUserUsername] = useState("");
    const [sendToOptions, setSendToOptions] = useState([]);
    const [sendTo, setSendTo] = useState("");
    const [taskType, setTaskType] = useState("");
    const [taskTypes, setTaskTypes] = useState([]);
    const [gradeAwarded, setGradeAwarded] = useState("");
    const [gradeTotal, setGradeTotal] = useState("");
    const [gradePercent, setGradePercent] = useState(null);
    const [gradeSpanish, setGradeSpanish] = useState(null);
    const [studentNotes, setStudentNotes] = useState("");
    const [teacherNotes, setTeacherNotes] = useState("");
    const [documentArea, setDocumentArea] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [annotations, setAnnotations] = useState([]);
    const [feedbackId, setFeedbackId] = useState(null);
    const [studentName, setStudentName] = useState("");
    const [userId, setUserId] = useState(null);

    const getCsrfToken = () => {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith('csrftoken=')) {
                return cookie.substring('csrftoken='.length);
            }
        }
        return null;
    };

    // GETS LOGGED-IN USER DETAILS
    const fetchProfile = async () => {
        try {
            const response = await fetch("/api/users/me", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCsrfToken(),
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch profile: ${response.statusText}`);
            }

            const data = await response.json();
            // Store the ID separately
            setUserId(data.id);
            setCurrentUser(data);
            setCurrentUserUsername(data.username || "");
            setStudentName(data.name || data.username || "Unknown Student");
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    //GETS "ALL" USER DETAILS
    const fetchUsers = async () => {
        try {
            const response = await fetch("/api/users", {
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCsrfToken(),
                },
                credentials: 'include',
            });
            const users = await response.json();
            
            // Extract just IDs and usernames
            const processedUsers = users.map(user => ({
                id: user.id,
                username: user.username,
                user_type: user.user_type
            }));
            
            const students = processedUsers.filter(user => user.user_type === "student");
            const teachers = processedUsers.filter(user => user.user_type === "teacher");
            
            setSendToOptions(currentUser?.user_type === "teacher" ? students : teachers);
        } catch (error) {
            console.error("Error fetching users:", error);
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

    // ** CALCULATES HOMEWORK PERCENTAGE (likely redundant - as done on back end)
    useEffect(() => {
        if (gradeAwarded && gradeTotal) {
            const percentage = (gradeAwarded / gradeTotal) * 100;
            setGradePercent(percentage.toFixed(2));
            setGradeSpanish((percentage / 10).toFixed(1));
        }
    }, [gradeAwarded, gradeTotal]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file.type === 'application/pdf') {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl(null);
        }
        setDocumentArea(file);
    };

    // FETCHES TASK-TYPES FOR DROP DOWN MENU (on upload)
    useEffect(() => {
        const fetchTaskTypes = async () => {
            try {
                const response = await fetch("/api/task-types/"); 
                if (!response.ok) {
                    throw new Error("Failed to fetch task types");
                }
                const data = await response.json();
                setTaskTypes(data); 
            } catch (error) {
                console.error("Error fetching task types:", error);
            }
        };

        fetchTaskTypes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!userId) {
            alert("User ID not found. Please log in again.");
            return;
        }

        try {
            const formData = new FormData();
            
            // Handle student_name field based on user type
            if (currentUser?.user_type === "teacher") {
                // For teachers, student_name is the recipient (sendTo)
                if (!sendTo) {
                    throw new Error("Please select a student to send feedback to.");
                }
                formData.append("student_name", String(sendTo));
                // send_to will be set automatically to the current teacher in the backend
            } else {
                // For students, student_name is themselves and send_to is the teacher
                formData.append("student_name", String(userId));
                if (!sendTo) {
                    throw new Error("Please select a teacher to send to.");
                }
                formData.append("send_to", String(sendTo));
            }
            
            if (!taskType) {
                throw new Error("Please select a task type.");
            }
            formData.append("task_type", taskType);
            
            // Add appropriate fields based on user type
            if (currentUser?.user_type === "teacher") {
                if (gradeAwarded) formData.append("grade_awarded", gradeAwarded);
                if (gradeTotal) formData.append("grade_total", gradeTotal);
                if (teacherNotes) formData.append("teacher_notes", teacherNotes);
            } else {
                if (studentNotes) formData.append("student_notes", studentNotes);
            }
            
            if (!documentArea) {
                throw new Error("Please upload a document.");
            }
            formData.append("document_area", documentArea);
            
            // Log form data for debugging
            console.log("Form data entries:");
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
            
            const endpoint = "/api/upload/";
            console.log("Sending request to:", endpoint);
            
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'X-CSRFToken': getCsrfToken(),
                },
                credentials: "include",
                body: formData,
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.log("Error response:", errorText);
                let errorMessage;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.error || errorJson.detail || errorText;
                } catch {
                    errorMessage = errorText;
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            setFeedbackId(result.id);
            setAnnotations(result.annotations || []);
            alert("Work submitted successfully!");
            
        } catch (error) {
            console.error("Error during submission:", error);
            alert(error.message || "Error submitting work. Please try again.");
        }
    };

    const handleSendToChange = (e) => {
        const selectedId = Number(e.target.value);
        console.log('Selected user ID:', selectedId, 'Type:', typeof selectedId);
        setSendTo(selectedId);
    };

    return (
        <Box sx={{
            width: '100%',
            maxWidth: '100vw',
            overflow: 'hidden'
        }}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ 
                    width: '100%',
                    maxWidth: '100%',
                    px: { xs: 2, sm: 8 },
                    py: { xs: 4, sm: 8 },
                    mt: { xs: 4, sm: 8 },
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 3, sm: 4 },
                    overflow: 'hidden'
                }}
                encType="multipart/form-data"
            >
                <Box sx={{ 
                    width: { xs: '100%', sm: '50%' },
                    minWidth: { xs: 'auto', sm: '400px' },
                    maxWidth: '100%'
                }}>
                    <Typography variant="h5" gutterBottom>
                        Upload an assignment
                    </Typography>

                    {currentUser ? (
                        <TextField
                            id="sender_name"
                            label="Sender Name"
                            fullWidth
                            value={currentUser?.username || ""}
                            margin="normal"
                            InputProps={{ readOnly: true }}
                        />
                    ) : (
                        <Typography>Loading...</Typography>
                    )}

                    <TextField
                        id="task_type"
                        label="Task Type"
                        select
                        fullWidth
                        value={taskType}
                        onChange={(e) => setTaskType(e.target.value)}
                        margin="normal"
                    >
                        {taskTypes.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        id="send_to"
                        label="Send To"
                        select
                        fullWidth
                        value={sendTo || ""} 
                        onChange={handleSendToChange}
                        margin="normal"
                    >
                        {sendToOptions.length > 0 ? (
                            sendToOptions.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    {user.username}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No users available</MenuItem>
                        )}
                    </TextField>

                    {currentUser?.user_type === "teacher" && (
                        <>
                            <TextField
                                id="grade_awarded"
                                label="Grade Awarded"
                                type="number"
                                fullWidth
                                value={gradeAwarded}
                                onChange={(e) => {
                                    if (currentUser?.user_type === "teacher") {
                                        setGradeAwarded(e.target.value);
                                    }
                                }}
                                disabled={currentUser?.user_type === "student"} 
                                margin="normal"
                            />

                            <TextField
                                id="grade_total"
                                label="Grade Total"
                                type="number"
                                fullWidth
                                value={gradeTotal}
                                onChange={(e) => setGradeTotal(e.target.value)}
                                margin="normal"
                            />

                            <Typography variant="body1" sx={{ mt: 2 }}>
                                Grade Percentage: {gradePercent || "N/A"}
                            </Typography>

                            <Typography variant="body1" sx={{ mt: 1 }}>
                                Grade (Spanish System): {gradeSpanish || "N/A"} / 10
                            </Typography>
                        </>
                    )}

                    {currentUser?.user_type === "student" && (
                        <TextField
                            id="student_notes"
                            label="Student Notes"
                            multiline
                            rows={4}
                            fullWidth
                            value={studentNotes}
                            onChange={(e) => setStudentNotes(e.target.value)}
                            margin="normal"
                        />
                    )}

                    {currentUser?.user_type === "teacher" && (
                        <TextField
                            id="teacher_notes"
                            label="Teacher Notes"
                            multiline
                            rows={4}
                            fullWidth
                            value={teacherNotes}
                            onChange={(e) => setTeacherNotes(e.target.value)}
                            margin="normal"
                        />
                    )}

                    <Box sx={{ mt: 2, mb: 2 }}>
                        <Button variant="contained" component="label">
                            Upload File
                            <input type="file" hidden onChange={handleFileChange} />
                        </Button>
                        <Button type="submit" variant="contained" sx={{ marginLeft: "2rem" }}>
                            Submit
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ 
                    width: { xs: '100%', sm: '50%' },
                    minWidth: { xs: '100%', sm: '400px' },
                    border: "4px solid #ccc",
                    p: 2
                }}>
                    <Box sx={{ 
                        display: 'flex',
                        flexDirection: { xs: 'row', sm: 'column' },
                        alignItems: { xs: 'center', sm: 'flex-start' },
                        gap: 2,
                        mb: 2
                    }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h6">
                                {currentUser?.user_type === "teacher" ? "Teacher's Dashboard" : "Student's Dashboard"}
                            </Typography>
                            <Typography 
                                variant="subtitle1"
                            >
                                {currentUser?.user_type === "teacher" 
                                    ? "(INSTRUCTIONS: Here you can review and provide feedback on student submissions)"
                                    : "(INSTRUCTIONS: Here you can upload assignments for grading ** Only use when instructed by your teacher**)"}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Preview iframe - full width below header */}
                    {documentArea && (
                        <Box sx={{ 
                            width: '100%',
                            height: { xs: '300px', sm: '600px' },
                            mt: 2
                        }}>
                            {documentArea.type === 'application/pdf' ? (
                                <iframe
                                    src={previewUrl}
                                    title="Document Preview"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        border: 'none',
                                        borderRadius: '4px'
                                    }}
                                />
                            ) : (
                                <Box sx={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '2px dashed #ccc',
                                    borderRadius: '4px',
                                    p: 3
                                }}>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        File Selected: {documentArea.name}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        Preview not available for this file type.
                                        File will be uploaded when you submit.
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default FeedbackForm;
