import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, TextField, Button, IconButton, Card, CardContent, Grid, Alert, FormControl, InputLabel, Select, MenuItem, List, ListItem, ListItemText, ListItemIcon, Chip, Divider, Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import relativeTime from 'dayjs/plugin/relativeTime';
import apiClient from '../api/apiClient';

// Configure dayjs
dayjs.locale('en-gb');
dayjs.extend(relativeTime);

const HomeworkPage = () => {

    // Starts window at top
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [homework, setHomework] = useState({
        setDate: dayjs(),
        dueDate: dayjs().add(7, 'day'),
        instructions: '',
        comments: '',
        file: null,
        student: ''
    });
    const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const [userType, setUserType] = useState(null);
    const [userId, setUserId] = useState(null);
    const [studentHomework, setStudentHomework] = useState([]);
    const [submissionFile, setSubmissionFile] = useState(null);
    const [selectedHomework, setSelectedHomework] = useState(null);
    const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
    const [selectedHomeworkId, setSelectedHomeworkId] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [homeworkToDelete, setHomeworkToDelete] = useState(null);

    // Add state for tab management
    const [activeTab, setActiveTab] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch user type
                const userResponse = await apiClient.get('/users/me/');
                
                if (userResponse.status === 200) {
                    const userData = userResponse.data;
                    setUserType(userData.user_type);
                    setUserId(userData.id);
                    console.log('User data:', userData);

                    // If user is a teacher, fetch students list
                    if (userData.user_type === 'teacher') {
                        const studentsResponse = await apiClient.get('/users/all-users/');

                        if (studentsResponse.status === 200) {
                            const studentsData = studentsResponse.data;
                            // Filter for only student users
                            const studentUsers = studentsData.filter(user => user.user_type === 'student');
                            console.log('Available students:', studentUsers);
                            setStudents(studentUsers);
                        } else {
                            console.error('Failed to fetch students:', studentsResponse.data);
                        }
                    }
                } else {
                    console.error('Failed to fetch user data:', userResponse.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await apiClient.get('/users/all-users/');
                if (response.status === 200) {
                    const data = response.data;
                    // Include all users for testing purposes
                    const otherUsers = data;
                    console.log('Available users:', otherUsers);
                    setStudents(otherUsers);
                } else {
                    console.error('Failed to fetch students:', response.data);
                    setAlert({
                        show: true,
                        message: 'Failed to load users. Please try again.',
                        severity: 'error'
                    });
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                setAlert({
                    show: true,
                    message: 'Failed to load users. Please try again.',
                    severity: 'error'
                });
            }
        };

        if (userType === 'teacher') {
            fetchStudents();
        }
    }, [userType]);

    useEffect(() => {
        const fetchStudentHomework = async () => {
            if (userType === 'student') {
                try {
                    const response = await apiClient.get('/api/homework/');
                    setStudentHomework(response.data);
                } catch (error) {
                    console.error('Error fetching homework:', error);
                }
            }
        };

        fetchStudentHomework();
    }, [userType]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Check file size (25MB limit)
            if (file.size > 25 * 1024 * 1024) {
                setAlert({
                    show: true,
                    message: 'File size too large. Maximum size allowed is 25MB.',
                    severity: 'error'
                });
                event.target.value = ''; // Clear the file input
                return;
            }
            setHomework({ ...homework, file: file });
        }
    };

    const handleStudentChange = (event) => {
        const selectedId = event.target.value;
        console.log('Selected student ID:', selectedId);
        // Find the selected student object
        const selectedStudent = students.find(student => student.id === selectedId);
        console.log('Selected student object:', selectedStudent);
        setHomework(prev => ({ ...prev, student: selectedId }));
    };

    const handleSubmissionFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Check file size (25MB limit)
            if (file.size > 25 * 1024 * 1024) {
                setAlert({
                    show: true,
                    message: 'File size too large. Maximum size allowed is 25MB.',
                    severity: 'error'
                });
                event.target.value = ''; // Clear the file input
                return;
            }
            setSubmissionFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!homework.instructions) {
            setAlert({
                show: true,
                message: 'Please enter homework instructions',
                severity: 'error'
            });
            return;
        }

        if (userType === 'teacher' && !homework.student) {
            setAlert({
                show: true,
                message: 'Please select a student',
                severity: 'error'
            });
            return;
        }

        setLoading(true);

        try {
            // Get current user info first
            const userResponse = await apiClient.get('/users/me/');
            const userData = userResponse.data;

            // Format dates according to Django's expected format
            const formattedSetDate = homework.setDate.format('YYYY-MM-DD HH:mm:ss');
            const formattedDueDate = homework.dueDate.format('YYYY-MM-DD HH:mm:ss');

            // Create form data
            const formData = new FormData();
            formData.append('set_date', formattedSetDate);
            formData.append('due_date', formattedDueDate);
            formData.append('instructions', homework.instructions);
            formData.append('comments', homework.comments || '');
            formData.append('teacher', String(userData.id));
            
            if (homework.student) {
                formData.append('student', String(homework.student));
            }
            
            if (homework.file) {
                formData.append('attachment', homework.file);
            }

            // Log form data for debugging
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }

            const response = await apiClient.post('/api/homework/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRFToken': document.cookie.match(/csrftoken=([\w-]+)/)?.[1] || '',
                },
                withCredentials: true
            });

            if (response.status === 201 || response.status === 200) {
                setAlert({
                    show: true,
                    message: 'Homework has been assigned successfully!',
                    severity: 'success'
                });

                // Reset form
                setHomework({
                    setDate: dayjs(),
                    dueDate: dayjs().add(7, 'day'),
                    instructions: '',
                    comments: '',
                    file: null,
                    student: ''
                });
            } else {
                throw new Error(response.data?.error || 'Failed to assign homework');
            }
        } catch (error) {
            console.error('Error:', error);
            setAlert({
                show: true,
                message: error.response?.data?.error || error.message || 'Failed to assign homework. Please try again.',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitClick = (homeworkId) => {
        if (!submissionFile) {
            setAlert({
                show: true,
                message: 'Please select a file to upload first',
                severity: 'error'
            });
            return;
        }
        setSelectedHomeworkId(homeworkId);
        setOpenSubmitDialog(true);
    };

    const handleConfirmSubmit = async () => {
        await submitHomework(selectedHomeworkId);
        setOpenSubmitDialog(false);
        setSubmissionFile(null);
    };

    const handleCancelSubmit = () => {
        setOpenSubmitDialog(false);
        setSelectedHomeworkId(null);
    };

    const submitHomework = async (homeworkId) => {
        try {
            if (!submissionFile) {
                setAlert({
                    show: true,
                    message: 'Please select a file to upload',
                    severity: 'error'
                });
                return;
            }

            const formData = new FormData();
            
            // Debug file object
            console.log('File object:', submissionFile);
            console.log('File type:', submissionFile.type);
            console.log('File name:', submissionFile.name);
            
            // Make sure to use the correct field name expected by Django
            formData.append('file', submissionFile);
            formData.append('homework_id', homeworkId);

            // Debug FormData
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            const response = await apiClient.post('/api/homework-submission/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Try to parse response as JSON, but handle cases where it's not JSON
            let responseData;
            if (response.data) {
                responseData = response.data;
            } else {
                responseData = { message: 'Homework submitted successfully!' };
            }

            if (response.status !== 201 && response.status !== 200) {
                throw new Error(
                    typeof responseData === 'object' ? 
                        responseData.error || 'Failed to submit homework' :
                        responseData || 'Failed to submit homework'
                );
            }

            setAlert({
                show: true,
                message: 'Homework submitted successfully!',
                severity: 'success'
            });

            // Update the homework list to show as submitted
            setStudentHomework(prev => 
                prev.map(hw => 
                    hw.id === homeworkId ? { ...hw, submitted: true } : hw
                )
            );

            // Reset file input
            setSubmissionFile(null);
            setOpenSubmitDialog(false);

        } catch (error) {
            console.error('Error submitting homework:', error);
            setAlert({
                show: true,
                message: error.message || 'Failed to submit homework. Please try again.',
                severity: 'error'
            });
        }
    };

    const handleDeleteHomework = (homeworkItem) => {
        setHomeworkToDelete(homeworkItem);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (homeworkToDelete) {
            // Filter out the selected homework from studentHomework
            setStudentHomework(prevHomework => 
                prevHomework.filter(hw => hw.id !== homeworkToDelete.id)
            );
        }
        setDeleteDialogOpen(false);
        setHomeworkToDelete(null);
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const StudentView = () => {
        // Filter homework based on submission status
        const activeHomework = studentHomework.filter(hw => !hw.submitted);
        const completedHomework = studentHomework.filter(hw => hw.submitted);

        return (
            <Box>
                <Typography variant="h4" component="h1" sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                    <AssignmentIcon sx={{ fontSize: 40, mr: 2 }} />
                    My Homework
                </Typography>

                {/* Email notification message - only shown for students */}
                {userType === 'student' && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontStyle: 'italic' }}>
                        * Any submissions from this page will be sent directly to your teacher's email address
                    </Typography>
                )}

                {/* Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs value={activeTab} onChange={handleTabChange}>
                        <Tab label={`Active Tasks (${activeHomework.length})`} />
                        <Tab label={`Completed Tasks (${completedHomework.length})`} />
                    </Tabs>
                </Box>

                {/* Active Tasks Tab */}
                {activeTab === 0 && (
                    <List>
                        {activeHomework.map((hw) => {
                            const dueDate = dayjs(hw.due_date);
                            const isOverdue = dueDate.isBefore(dayjs());
                            const isSubmitted = hw.submitted;

                            return (
                                <React.Fragment key={hw.id}>
                                    <ListItem
                                        sx={{
                                            mb: 2,
                                            backgroundColor: 'white',
                                            borderRadius: 1,
                                            position: 'relative'
                                        }}
                                    >
                                        <ListItemIcon>
                                            {isSubmitted ? 
                                                <CheckCircleIcon color="success" /> : 
                                                <PendingIcon color={isOverdue ? "error" : "warning"} />
                                            }
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography component="div">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Typography component="span" variant="h6" sx={{ 
                                                            textDecoration: isSubmitted ? 'line-through' : 'none'
                                                        }}>
                                                            {hw.instructions.substring(0, 100)}...
                                                        </Typography>
                                                        <Chip
                                                            label={isOverdue ? 
                                                                `Overdue by ${Math.abs(dueDate.diff(dayjs(), 'day'))} days` : 
                                                                `Due in ${dueDate.diff(dayjs(), 'day')} days`}
                                                            color={isOverdue ? "error" : "primary"}
                                                            size="small"
                                                        />
                                                    </Box>
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography component="div" variant="body2">
                                                    <Typography component="div" variant="body2">
                                                        Set Date: {dayjs(hw.set_date).format('DD/MM/YYYY HH:mm')}
                                                    </Typography>
                                                    <Typography component="div" variant="body2">
                                                        Due Date: {dayjs(hw.due_date).format('DD/MM/YYYY HH:mm')}
                                                    </Typography>
                                                    {hw.comments && (
                                                        <Typography component="div" variant="body2" sx={{ mt: 1 }}>
                                                            Comments: {hw.comments}
                                                        </Typography>
                                                    )}
                                                </Typography>
                                            }
                                        />
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <input
                                                type="file"
                                                id={`file-upload-${hw.id}`}
                                                style={{ display: 'none' }}
                                                onChange={(e) => setSubmissionFile(e.target.files[0])}
                                            />
                                            <label htmlFor={`file-upload-${hw.id}`}>
                                                <Button
                                                    component="span"
                                                    variant="outlined"
                                                    startIcon={<AttachFileIcon />}
                                                >
                                                    Upload Work
                                                </Button>
                                            </label>
                                            {submissionFile && (
                                                <Button
                                                    variant="contained"
                                                    onClick={() => handleSubmitClick(hw.id)}
                                                    color="primary"
                                                    sx={{ ml: 2 }}
                                                >
                                                    Submit
                                                </Button>
                                            )}
                                        </Box>
                                    </ListItem>
                                    <Divider sx={{ my: 2 }} />
                                </React.Fragment>
                            );
                        })}
                        {activeHomework.length === 0 && (
                            <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
                                No active homework tasks
                            </Typography>
                        )}
                    </List>
                )}

                {/* Completed Tasks Tab */}
                {activeTab === 1 && (
                    <List>
                        {completedHomework.map((hw) => {
                            const dueDate = dayjs(hw.due_date);
                            const isOverdue = dueDate.isBefore(dayjs());
                            const isSubmitted = hw.submitted;

                            return (
                                <React.Fragment key={hw.id}>
                                    <ListItem
                                        sx={{
                                            mb: 2,
                                            backgroundColor: 'white',
                                            borderRadius: 1,
                                            position: 'relative'
                                        }}
                                    >
                                        <ListItemIcon>
                                            {isSubmitted ? 
                                                <CheckCircleIcon color="success" /> : 
                                                <PendingIcon color={isOverdue ? "error" : "warning"} />
                                            }
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography component="div">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Typography component="span" variant="h6" sx={{ 
                                                            textDecoration: 'line-through',
                                                            color: 'text.secondary'
                                                        }}>
                                                            {hw.instructions.substring(0, 100)}...
                                                        </Typography>
                                                        <Chip
                                                            label={`Submitted ${dayjs(hw.submission_date).format('DD/MM/YYYY')}`}
                                                            color="success"
                                                            icon={<CheckCircleIcon />}
                                                            size="small"
                                                            sx={{ 
                                                                fontWeight: 'medium'
                                                            }}
                                                        />
                                                    </Box>
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography component="div" variant="body2" sx={{ color: 'text.secondary' }}>
                                                    <Typography component="div" variant="body2">
                                                        <span style={{ textDecoration: 'line-through' }}>
                                                            Set Date: {dayjs(hw.set_date).format('DD/MM/YYYY HH:mm')}
                                                        </span>
                                                    </Typography>
                                                    <Typography component="div" variant="body2">
                                                        <span style={{ textDecoration: 'line-through' }}>
                                                            Due Date: {dayjs(hw.due_date).format('DD/MM/YYYY HH:mm')}
                                                        </span>
                                                    </Typography>
                                                    {hw.comments && (
                                                        <Typography component="div" variant="body2" sx={{ mt: 1 }}>
                                                            <span style={{ textDecoration: 'line-through' }}>
                                                                Comments: {hw.comments}
                                                            </span>
                                                        </Typography>
                                                    )}
                                                </Typography>
                                            }
                                        />
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <IconButton
                                                onClick={() => handleDeleteHomework(hw)}
                                                color="error"
                                                size="small"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </ListItem>
                                    <Divider sx={{ my: 2 }} />
                                </React.Fragment>
                            );
                        })}
                        {completedHomework.length === 0 && (
                            <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
                                No completed homework tasks
                            </Typography>
                        )}
                    </List>
                )}
            </Box>
        );
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{
                minHeight: '100vh',
                backgroundColor: '#f5f5f5',
                pt: 12,
                pb: 6,
                px: 4
            }}>
                <Paper
                    elevation={0}
                    sx={{
                        maxWidth: 800,
                        margin: '0 auto',
                        p: 4,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: 2,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                    }}
                >
                    {userType && (
                        <Box sx={{ mb: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        </Box>
                    )}
                    
                    {userType === 'student' ? (
                        <StudentView />
                    ) : (
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                                <AssignmentIcon sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                                <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                                    Homework Assignment
                                </Typography>
                            </Box>

                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    {/* Email notification message - only shown for students */}
                                    {userType === 'student' && (
                                        <Grid item xs={12}>
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                                                * Submissions from this page will be sent directly to the teacher's email address
                                            </Typography>
                                        </Grid>
                                    )}
                                    
                                    {/* Email notification message - only shown for teachers */}
                                    {userType === 'teacher' && homework.student && (
                                        <Grid item xs={12}>
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                                                * Any files attached will be sent directly to the selected student's email address
                                            </Typography>
                                        </Grid>
                                    )}

                                    {userType === 'teacher' && (
                                        <Grid item xs={12}>
                                            <FormControl fullWidth>
                                                <InputLabel>Select User</InputLabel>
                                                <Select
                                                    value={homework.student || ''}
                                                    onChange={handleStudentChange}
                                                    label="Select User"
                                                >
                                                    {students.map((user) => (
                                                        <MenuItem key={user.id} value={user.id}>
                                                            {user.first_name} {user.last_name} ({user.email}) - {user.user_type}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                                                    * Any files attached will be sent directly to the student's email address
                                                </Typography>
                                            </FormControl>
                                        </Grid>
                                    )}
                                    <Grid item xs={12} md={6}>
                                        <DateTimePicker
                                            label="Set Date"
                                            value={homework.setDate}
                                            onChange={(newValue) => setHomework({ ...homework, setDate: newValue })}
                                            sx={{ width: '100%' }}
                                            format="DD/MM/YYYY HH:mm"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <DateTimePicker
                                            label="Due Date"
                                            value={homework.dueDate}
                                            onChange={(newValue) => setHomework({ ...homework, dueDate: newValue })}
                                            sx={{ width: '100%' }}
                                            format="DD/MM/YYYY HH:mm"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Instructions"
                                            multiline
                                            rows={4}
                                            value={homework.instructions}
                                            onChange={(e) => setHomework({ ...homework, instructions: e.target.value })}
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Additional Comments"
                                            multiline
                                            rows={2}
                                            value={homework.comments}
                                            onChange={(e) => setHomework({ ...homework, comments: e.target.value })}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            component="label"
                                            variant="outlined"
                                            startIcon={<AttachFileIcon />}
                                            sx={{ mr: 2 }}
                                        >
                                            Attach File
                                            <input
                                                type="file"
                                                hidden
                                                onChange={handleFileChange}
                                            />
                                        </Button>
                                        {homework.file && (
                                            <Typography variant="body2" component="span" color="textSecondary">
                                                {homework.file.name}
                                            </Typography>
                                        )}
                                        {alert.show && (
                                            <Alert 
                                                severity={alert.severity}
                                                sx={{ 
                                                    display: 'inline-flex',
                                                    ml: 2,
                                                    py: 0,
                                                    '& .MuiAlert-message': {
                                                        padding: '4px 0'
                                                    }
                                                }}
                                            >
                                                {alert.message}
                                            </Alert>
                                        )}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            size="large"
                                            disabled={loading}
                                            startIcon={<EmailIcon />}
                                            sx={{
                                                mt: 2,
                                                backgroundColor: '#1976d2',
                                                '&:hover': {
                                                    backgroundColor: '#1565c0'
                                                }
                                            }}
                                        >
                                            {loading ? 'Sending...' : 'Send Homework'}
                                        </Button>
                                        {alert.show && (
                                            <Alert 
                                                severity={alert.severity} 
                                                sx={{ mt: 2 }}
                                                onClose={() => setAlert({ ...alert, show: false })}
                                            >
                                                {alert.message}
                                            </Alert>
                                        )}
                                    </Grid>
                                </Grid>
                            </form>
                        </Box>
                    )}
                </Paper>
            </Box>
            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Delete Homework</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to remove this completed homework from your view?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={confirmDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
            {/* Confirmation Dialog */}
            <Dialog
                open={openSubmitDialog}
                onClose={handleCancelSubmit}
                aria-labelledby="submit-dialog-title"
            >
                <DialogTitle id="submit-dialog-title">
                    Confirm Homework Submission
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you ready to submit your homework? Selected file: {submissionFile?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        Note: You won't be able to modify your submission after confirming.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelSubmit} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmSubmit} variant="contained" color="primary">
                        Confirm Submission
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
};

export default HomeworkPage;
