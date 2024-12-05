import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, Card, CardContent, CardActions, Button, Divider, CircularProgress, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const TeacherHomeworkReview = () => {

  //Starts window at top
  useEffect(() => {
    const vh = window.innerHeight * 0.05; // 5% of viewport height
    window.scrollTo(0, vh);
  }, []);
  
    const [receivedSubmissions, setReceivedSubmissions] = useState([]);
    const [submittedSubmissions, setSubmittedSubmissions] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [receivedPage, setReceivedPage] = useState(1);  // Separate page for inbox
    const [submittedPage, setSubmittedPage] = useState(1);  // Separate page for outbox
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [submissionToDelete, setSubmissionToDelete] = useState(null);
    const [isInbox, setIsInbox] = useState(true);
    const [receivedSort, setReceivedSort] = useState('newest');
    const [submittedSort, setSubmittedSort] = useState('newest');
    const cardsPerPage = 9; // Adjust to display fewer cards for a more refined look
    const [loading, setLoading] = useState(true);
    const receivedSectionRef = useRef(null);
    const sentSectionRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [receivedResponse, submittedResponse, usersResponse] = await Promise.all([
                    fetch('/api/teacher/homework/received/', {
                        credentials: 'include'
                    }),
                    fetch('/api/teacher/homework/submitted/', {
                        credentials: 'include'
                    }),
                    fetch('/users/all-users/', {
                        credentials: 'include'
                    })
                ]);

                if (!receivedResponse.ok || !submittedResponse.ok || !usersResponse.ok) {
                    throw new Error('One or more requests failed');
                }

                const [receivedData, submittedData, usersData] = await Promise.all([
                    receivedResponse.text().then(text => {
                        try {
                            return JSON.parse(text);
                        } catch (e) {
                            console.error('Failed to parse received data:', text);
                            return [];
                        }
                    }),
                    submittedResponse.text().then(text => {
                        try {
                            return JSON.parse(text);
                        } catch (e) {
                            console.error('Failed to parse submitted data:', text);
                            return [];
                        }
                    }),
                    usersResponse.text().then(text => {
                        try {
                            return JSON.parse(text);
                        } catch (e) {
                            console.error('Failed to parse users data:', text);
                            return [];
                        }
                    })
                ]);

                setReceivedSubmissions(receivedData);
                setSubmittedSubmissions(submittedData);
                setAllUsers(usersData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatDateTime = (dateTime) => {
        if (!dateTime) return "Date not available";
        const date = new Date(dateTime);
        if (isNaN(date.getTime())) return "Invalid date";
        return date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const paginate = (data, page) => {
        const start = (page - 1) * cardsPerPage;
        return data.slice(start, start + cardsPerPage);
    };

    const getFullImageUrl = (imagePath) => {
        if (!imagePath) return "/placeholder-profile.png";  // Default placeholder image
        return imagePath;  // Assuming the image URL is already complete
    };

    const getUserProfilePicture = (userId) => {
        const user = allUsers.find((user) => user.id === userId);
        return user ? getFullImageUrl(user.profile_picture) : "/placeholder-profile.png";
    };

    const handleDelete = async (submissionId, isReceived) => {
        try {
            const endpoint = isReceived 
                ? `/api/teacher/homework/received/${submissionId}/`
                : `/api/teacher/homework/submitted/${submissionId}/`;
            
            const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.cookie.split('; ').find(row => row.startsWith('csrftoken=')).split('=')[1]
                },
            });

            if (response.ok) {
                // Update the state to remove the deleted submission
                if (isReceived) {
                    setReceivedSubmissions(prev => prev.filter(sub => sub.id !== submissionId));
                } else {
                    setSubmittedSubmissions(prev => prev.filter(sub => sub.id !== submissionId));
                }
            } else {
                console.error('Failed to delete submission');
            }
        } catch (error) {
            console.error('Error deleting submission:', error);
        }
    };

    const handleDeleteClick = (submissionId, isInboxSubmission) => {
        setSubmissionToDelete(submissionId);
        setIsInbox(isInboxSubmission);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (submissionToDelete) {
            await handleDelete(submissionToDelete, isInbox);
            setDeleteDialogOpen(false);
            setSubmissionToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setSubmissionToDelete(null);
    };

    const handleDownload = async (documentUrl) => {
        try {
            const response = await fetch(documentUrl);
            if (!response.ok) throw new Error('Download failed');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = documentUrl.split('/').pop();
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    const scrollToSection = (ref) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const sortSubmissions = (submissions, sortType) => {
        const sorted = [...submissions];
        switch (sortType) {
            case 'oldest':
                return sorted.sort((a, b) => new Date(a.submission_date) - new Date(b.submission_date));
            case 'newest':
                return sorted.sort((a, b) => new Date(b.submission_date) - new Date(a.submission_date));
            case 'grade-high':
                return sorted.sort((a, b) => {
                    const gradeA = a.grade_awarded ? (a.grade_awarded / a.grade_total * 100) : 0;
                    const gradeB = b.grade_awarded ? (b.grade_awarded / b.grade_total * 100) : 0;
                    return gradeB - gradeA;
                });
            case 'grade-low':
                return sorted.sort((a, b) => {
                    const gradeA = a.grade_awarded ? (a.grade_awarded / a.grade_total * 100) : 0;
                    const gradeB = b.grade_awarded ? (b.grade_awarded / b.grade_total * 100) : 0;
                    return gradeA - gradeB;
                });
            default:
                return sorted;
        }
    };

    const handleReceivedSortChange = (event) => {
        setReceivedSort(event.target.value);
        setReceivedPage(1);
    };

    const handleSubmittedSortChange = (event) => {
        setSubmittedSort(event.target.value);
        setSubmittedPage(1);
    };

    const truncateText = (text, length) => {
        if (text.length > length) {
            return text.substring(0, length) + '...';
        }
        return text;
    };

    return (
        <Box sx={{ padding: 4, backgroundColor: "#f9f9f9", minHeight: "100vh", fontFamily: "'Roboto', sans-serif" }}>
            <Typography variant="h4" sx={{ marginBottom: 4, textAlign: "center", color: "#3f51b5", fontWeight: 600 }}>
                Teacher Dashboard
            </Typography>

            {/* Loading Spinner */}
            {loading && (
                <Box sx={{ textAlign: "center", marginTop: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {/* Received Submissions (Inbox) */}
            {!loading && (
                <Box 
                    ref={receivedSectionRef}
                    sx={{ 
                        backgroundColor: '#f0f7ff',
                        borderRadius: '8px',
                        p: 3,
                        mb: 6,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                >
                    <Box sx={{ 
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 3
                    }}>
                        <Button
                            onClick={() => scrollToSection(sentSectionRef)}
                            sx={{ 
                                backgroundColor: '#ff9800',
                                color: 'white',
                                fontWeight: 'bold',
                                '&:hover': { backgroundColor: '#f57c00' }
                            }}
                        >
                            ↓ Sent
                        </Button>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                display: 'flex',
                                alignItems: 'center',
                                '&::before': {
                                    content: '""',
                                    display: 'block',
                                    width: '4px',
                                    height: '24px',
                                    backgroundColor: '#1976d2',
                                    marginRight: '12px',
                                    borderRadius: '2px'
                                }
                            }}
                        >
                            Received Work
                        </Typography>
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Sort By</InputLabel>
                            <Select
                                value={receivedSort}
                                onChange={handleReceivedSortChange}
                                label="Sort By"
                                size="small"
                            >
                                <MenuItem value="newest">Newest First</MenuItem>
                                <MenuItem value="oldest">Oldest First</MenuItem>
                                <MenuItem value="grade-high">Grade (High to Low)</MenuItem>
                                <MenuItem value="grade-low">Grade (Low to High)</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Grid container spacing={3}>
                        {paginate(sortSubmissions(receivedSubmissions, receivedSort), receivedPage).map((submission) => (
                            <Grid item xs={12} sm={6} md={4} key={submission.id}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: '100%',
                                        borderRadius: '8px',
                                        position: 'relative',
                                        backgroundColor: '#fafafa',
                                        background: 'linear-gradient(45deg, #fafafa 25%, #ffffff 25%, #ffffff 50%, #fafafa 50%, #fafafa 75%, #ffffff 75%, #ffffff 100%)',
                                        backgroundSize: '40px 40px',
                                        backgroundOpacity: 0.3,
                                        border: '0.5px solid #eaeaea',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 12px 24px rgba(0,0,0,0.07)',
                                            transition: 'all 0.3s ease'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <IconButton
                                        onClick={() => handleDeleteClick(submission.id, true)}
                                        sx={{
                                            position: 'absolute',
                                            right: 8,
                                            top: 8,
                                            zIndex: 3,
                                            color: 'rgba(0, 0, 0, 0.54)',
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                            '&:hover': {
                                                color: 'rgba(0, 0, 0, 0.87)',
                                                backgroundColor: 'rgba(255, 255, 255, 1)'
                                            },
                                            padding: '4px',
                                            minWidth: '32px',
                                            minHeight: '32px'
                                        }}
                                    >
                                        <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>×</span>
                                    </IconButton>
                                    <CardContent sx={{ 
                                        flexGrow: 1, 
                                        overflow: 'hidden', 
                                        p: 1.5,
                                        pt: 3,
                                        borderRadius: '0 0 8px 8px',
                                        position: 'relative'
                                    }}>
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            mb: 1,
                                            position: 'relative',
                                            zIndex: 2
                                        }}>
                                            <img
                                                src={getUserProfilePicture(submission.student_name?.id)}
                                                alt="Profile"
                                                style={{
                                                    height: "40px",
                                                    width: "40px",
                                                    borderRadius: "50%",
                                                    objectFit: "cover",
                                                    border: "2px solid #3f51b5",
                                                }}
                                            />
                                            <Box sx={{ ml: 1 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                                                    {submission.student_name?.username || 'Unknown Student'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                    {submission.student_name?.email}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Task: {submission.task_type}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            From: {submission.student_name?.first_name} {submission.student_name?.last_name}
                                        </Typography>
                                        {(submission.grade !== null && submission.grade !== undefined) && (
                                            <Typography 
                                                variant="body1" 
                                                sx={{ 
                                                    color: "#2196f3",
                                                    fontWeight: 500,
                                                    mt: 1,
                                                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    display: 'inline-block'
                                                }}
                                            >
                                                Grade: {submission.grade}
                                            </Typography>
                                        )}
                                        {submission.student_notes && (
                                            <Box sx={{ mt: 1 }}>
                                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                    Student Notes:
                                                </Typography>
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        backgroundColor: '#f5f5f5',
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        whiteSpace: 'pre-wrap',
                                                        maxHeight: '60px',
                                                        overflow: 'auto'
                                                    }}
                                                >
                                                    {truncateText(submission.student_notes, 100)}
                                                </Typography>
                                            </Box>
                                        )}
                                        <Typography variant="body2" color="text.secondary">
                                            Received: {formatDateTime(submission.submission_date)}
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ pt: 0.5, pb: 1, px: 1.5 }}>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            onClick={() => handleDownload(submission.document_area)}
                                            sx={{ textTransform: "none" }}
                                        >
                                            Download
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Pagination for Inbox */}
                    <Box sx={{ mt: 4, textAlign: "center" }}>
                        <Button
                            variant="outlined"
                            onClick={() => setReceivedPage((prev) => Math.max(prev - 1, 1))}
                            disabled={receivedPage === 1}
                            sx={{
                                textTransform: "none",
                                borderColor: "#3f51b5",
                                color: "#3f51b5",
                                "&:hover": { borderColor: "#2c3e50", color: "#2c3e50" },
                            }}
                        >
                            Previous
                        </Button>
                        <Typography variant="body2" sx={{ marginX: 2, display: "inline-block" }}>
                            Page {receivedPage}
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={() => setReceivedPage((prev) => prev + 1)}
                            disabled={receivedSubmissions.length <= receivedPage * cardsPerPage}
                            sx={{
                                textTransform: "none",
                                borderColor: "#3f51b5",
                                color: "#3f51b5",
                                "&:hover": { borderColor: "#2c3e50", color: "#2c3e50" },
                            }}
                        >
                            Next
                        </Button>
                    </Box>
                </Box>
            )}

            {/* Submitted Submissions (Outbox) */}
            {!loading && (
                <Box 
                    ref={sentSectionRef}
                    sx={{ 
                        backgroundColor: '#fff8f0',
                        borderRadius: '8px',
                        p: 3,
                        mb: 4,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                >
                    <Box sx={{ 
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 3
                    }}>
                        <Button
                            onClick={() => scrollToSection(receivedSectionRef)}
                            sx={{ 
                                backgroundColor: '#2196f3',
                                color: 'white',
                                fontWeight: 'bold',
                                '&:hover': { backgroundColor: '#1976d2' }
                            }}
                        >
                            ↑ Received
                        </Button>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                display: 'flex',
                                alignItems: 'center',
                                '&::before': {
                                    content: '""',
                                    display: 'block',
                                    width: '4px',
                                    height: '24px',
                                    backgroundColor: '#ffb74d',
                                    marginRight: '12px',
                                    borderRadius: '2px'
                                }
                            }}
                        >
                            Submitted Work
                        </Typography>
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Sort By</InputLabel>
                            <Select
                                value={submittedSort}
                                onChange={handleSubmittedSortChange}
                                label="Sort By"
                                size="small"
                            >
                                <MenuItem value="newest">Newest First</MenuItem>
                                <MenuItem value="oldest">Oldest First</MenuItem>
                                <MenuItem value="grade-high">Grade (High to Low)</MenuItem>
                                <MenuItem value="grade-low">Grade (Low to High)</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Grid container spacing={3}>
                        {paginate(sortSubmissions(submittedSubmissions, submittedSort), submittedPage).map((submission) => (
                            <Grid item xs={12} sm={6} md={4} key={submission.id}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: '100%',
                                        borderRadius: '8px',
                                        position: 'relative',
                                        backgroundColor: '#fafafa',
                                        background: 'linear-gradient(45deg, #fafafa 25%, #ffffff 25%, #ffffff 50%, #fafafa 50%, #fafafa 75%, #ffffff 75%, #ffffff 100%)',
                                        backgroundSize: '40px 40px',
                                        backgroundOpacity: 0.3,
                                        border: '0.5px solid #eaeaea',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 12px 24px rgba(0,0,0,0.07)',
                                            transition: 'all 0.3s ease'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <IconButton
                                        onClick={() => handleDeleteClick(submission.id, false)}
                                        sx={{
                                            position: 'absolute',
                                            right: 8,
                                            top: 8,
                                            zIndex: 3,
                                            color: 'rgba(0, 0, 0, 0.54)',
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                            '&:hover': {
                                                color: 'rgba(0, 0, 0, 0.87)',
                                                backgroundColor: 'rgba(255, 255, 255, 1)'
                                            },
                                            padding: '4px',
                                            minWidth: '32px',
                                            minHeight: '32px'
                                        }}
                                    >
                                        <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>×</span>
                                    </IconButton>
                                    <CardContent sx={{ 
                                        flexGrow: 1, 
                                        overflow: 'hidden', 
                                        p: 1.5,
                                        pt: 3,
                                        borderRadius: '0 0 8px 8px',
                                        position: 'relative'
                                    }}>
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            mb: 1,
                                            position: 'relative',
                                            zIndex: 2
                                        }}>
                                            <img
                                                src={getUserProfilePicture(submission.student_name?.id)}
                                                alt="Profile"
                                                style={{
                                                    height: "40px",
                                                    width: "40px",
                                                    borderRadius: "50%",
                                                    objectFit: "cover",
                                                    border: "2px solid #3f51b5",
                                                }}
                                            />
                                            <Box sx={{ ml: 1 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                                                    {submission.student_name?.username || 'Unknown Student'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                    {submission.student_name?.email}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Task: {submission.task_type}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            To: {submission.send_to?.first_name} {submission.send_to?.last_name}
                                        </Typography>
                                        {(submission.grade_awarded !== null && submission.grade_awarded !== undefined) && (
                                            <Typography 
                                                variant="body1" 
                                                sx={{ 
                                                    color: "#2196f3",
                                                    fontWeight: 500,
                                                    mt: 1,
                                                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    display: 'inline-block'
                                                }}
                                            >
                                                Grade: {submission.grade_awarded}/{submission.grade_total} ({((submission.grade_awarded / submission.grade_total) * 100).toFixed(1)}%)
                                            </Typography>
                                        )}
                                        {submission.student_notes && (
                                            <Box sx={{ mt: 1 }}>
                                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                    Student Notes:
                                                </Typography>
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        backgroundColor: '#f5f5f5',
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        whiteSpace: 'pre-wrap',
                                                        maxHeight: '60px',
                                                        overflow: 'auto'
                                                    }}
                                                >
                                                    {truncateText(submission.student_notes, 100)}
                                                </Typography>
                                            </Box>
                                        )}
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                            Received: {formatDateTime(submission.submission_date)}
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ pt: 0.5, pb: 1, px: 1.5 }}>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            onClick={() => handleDownload(submission.document_area)}
                                            sx={{ textTransform: "none" }}
                                        >
                                            Download
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Pagination for Outbox */}
                    <Box sx={{ mt: 4, textAlign: "center" }}>
                        <Button
                            variant="outlined"
                            onClick={() => setSubmittedPage((prev) => Math.max(prev - 1, 1))}
                            disabled={submittedPage === 1}
                            sx={{
                                textTransform: "none",
                                borderColor: "#3f51b5",
                                color: "#3f51b5",
                                "&:hover": { borderColor: "#2c3e50", color: "#2c3e50" },
                            }}
                        >
                            Previous
                        </Button>
                        <Typography variant="body2" sx={{ marginX: 2, display: "inline-block" }}>
                            Page {submittedPage}
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={() => setSubmittedPage((prev) => prev + 1)}
                            disabled={submittedSubmissions.length <= submittedPage * cardsPerPage}
                            sx={{
                                textTransform: "none",
                                borderColor: "#3f51b5",
                                color: "#3f51b5",
                                "&:hover": { borderColor: "#2c3e50", color: "#2c3e50" },
                            }}
                        >
                            Next
                        </Button>
                    </Box>
                </Box>
            )}
            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                aria-labelledby="delete-dialog-title"
            >
                <DialogTitle id="delete-dialog-title">
                    Confirm Deletion
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this submission? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TeacherHomeworkReview;
