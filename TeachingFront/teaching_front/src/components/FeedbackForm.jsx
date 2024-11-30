import React, { useState, useEffect } from "react";
import { Button, TextField, MenuItem, Typography, Box } from "@mui/material";
import AnnotationList from "./AnnotationEditor";

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
     


    const getCsrfToken = () => {
        const cookies = document.cookie.split(";");
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith("csrftoken=")) {
                return cookie.substring("csrftoken=".length);
            }
        }
        return null; // Ensure this fallback returns null when no token is found
    };
    



    // GETS LOGGED-IN USER DETAILS
    const fetchProfile = async () => {
        try {
            const csrfToken = getCsrfToken();
            if (!csrfToken) {
                throw new Error("CSRF token not found. Please ensure it's included in the cookies.");
            }
    
            const response = await fetch("/api/users/me", {
                method: "GET", // Explicitly state the HTTP method
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                },
                credentials: "include", // Ensure cookies are included in the request
            });
    
            if (!response.ok) {
                throw new Error(`Failed to fetch profile: ${response.statusText}`);
            }
    
            const data = await response.json();
            console.log("Fetched user profile:", data); // Debugging
    
            setCurrentUser(data); // Set the logged-in user object
            setCurrentUserUsername(data.username || ""); // Set the username
    
            // Extract and set the student name (if applicable)
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
            });
            const users = await response.json();
            const students = users.filter((user) => user.user_type === "student");
            const teachers = users.filter((user) => user.user_type === "teacher");
            setSendToOptions(currentUser?.user_type === "teacher" ? students : teachers);
            console.log('current user is: ', currentUser)
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
        setPreviewUrl(URL.createObjectURL(file));
        setDocumentArea(file);
    };



    // FETCHES TASK-TYPES FOR DROP DOWN MENU (on upload)
    useEffect(() => {
        const fetchTaskTypes = async () => {
        try {
            const response = await fetch("/api/task-types/"); // Fetch task types
            if (!response.ok) {
            throw new Error("Failed to fetch task types");
            }
            const data = await response.json();
            setTaskTypes(data); // Set available task types
        } catch (error) {
            console.error("Error fetching task types:", error);
        }
        };

        fetchTaskTypes();
    }, []);  





    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Ensure that sendTo is not null or undefined before submitting the form
        if (!sendTo) {
            console.error("sendTo is required but is missing.");
            alert("Please select a user to send to.");
            return;  // Stop form submission if sendTo is not set
        }
        try {
            // Debugging: Log current state values before submission
            console.log("Current State:");
            console.log("student name:", studentName);
            console.log("sendTo:", sendTo);  // Ensure this is an object with an 'id' property
            console.log("taskType:", taskType);
            console.log("gradeAwarded:", gradeAwarded);
            console.log("gradeTotal:", gradeTotal);
            console.log("teacherNotes:", teacherNotes);
            console.log("studentNotes:", studentNotes);
            console.log("documentArea:", documentArea);
    
            // Prepare the FormData object
            const formData = new FormData();
        
            // Append required fields to the FormData
            formData.append("student_name", currentUser.id);
        
            console.log("Current user ID:", currentUser.id);  // Check if it's a valid number

    
        if (sendTo) {
          formData.append("send_to", sendTo); // sendTo is now the numeric id
          console.log("send_to:", sendTo); // Log for debugging
           } else {
             console.error("sendTo is required but is missing.");
             alert("Please select a user to send to.");
             return; // Stop submission if sendTo is not set
           }

            
    
            formData.append("task_type", taskType);
        
            if (currentUser?.user_type === "teacher") {
                formData.append("grade_awarded", gradeAwarded);
                formData.append("grade_total", gradeTotal);
                formData.append("teacher_notes", teacherNotes);
               
            }
        
            if (currentUser?.user_type === "student") {
                formData.append("student_notes", studentNotes);  
            }
        
            if (documentArea) {
                formData.append("document_area", documentArea); 
                console.log("big big boobies")
                console.log("F-O-R-M D-A-T-A", formData)
            } else {
                console.error("No file uploaded.");
            }
        
            // Log the FormData contents to the console
         
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`);
                if (value instanceof File) {
                    console.log(`  - File Name: ${value.name}`);
                    console.log(`  - File Type: ${value.type}`);
                    console.log(`  - File Size: ${value.size} bytes`);
                } else {
                    console.log(`  - Value: ${value}`);
                }
            }
        
            // POST CALL 
            const endpoint =
                currentUser?.user_type === "teacher"
                    ? "/api/teacher-upload/"
                    : "/api/student-upload/";
             
                    
        
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "X-CSRFToken": getCsrfToken(),
                },
                credentials: "include",
                body: formData,
            });
        
            console.log("CSRF Token:", getCsrfToken());
        
            if (!response.ok) {
                console.error("Failed to submit feedback:", response.statusText);
                alert("Error submitting work. Please try again.");
                return;
            }
        
            const result = await response.json();
            console.log("Submission result:", result);
        
            setFeedbackId(result.id);
            setAnnotations(result.annotations || []);
            alert("Work submitted successfully!");
        } catch (error) {
            console.error("Error submitting work:", error); //ERROR LINE <--------------
            alert("Error submitting work. Please try again.");
        }
    };
    

    const handleSendToChange = (e) => {
        setSendTo(parseInt(e.target.value, 10)); // Ensure sendTo is the numeric ID
    };
    
    


    

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", gap: 4, marginTop: "8rem", marginBottom: "4rem", marginLeft: "8rem", marginRight: "8rem" }}
            encType="multipart/form-data" 
        >
            <Box sx={{ flex: 1 }}>
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
                        // Ensure the key is unique. If option is a string, you can use it directly.
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
                    value={sendTo || ""} // Use sendTo directly (now an id)
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
            disabled={currentUser?.user_type === "student"} // Disable for students
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

            <Box
                sx={{
                    flex: 1,
                    mt: 4,
                    ml: 4,
                    border: "4px solid #ccc",
                    height: "800px",
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Typography variant="subtitle1">Document Preview:</Typography>
                {previewUrl ? (
                    <iframe
                        src={previewUrl}
                        title="Document Preview"
                        style={{ width: "100%", height: "100%", border: "none" }}
                    ></iframe>
                ) : (
                    <Typography>(No document selected)</Typography>
                )}
            </Box>

            {feedbackId && annotations.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Annotations
                    </Typography>
                    {AnnotationList}
                </Box>
            )}
        </Box>
    );
};

export default FeedbackForm;
