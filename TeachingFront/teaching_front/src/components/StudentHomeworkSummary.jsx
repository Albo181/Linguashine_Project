import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, CardActions, Button, Divider, Pagination, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const StudentHomeworkSummary = () => {

  //Starts window at top
  useEffect(() => {
    const vh = window.innerHeight * 0.05; // 5% of viewport height
    window.scrollTo(0, vh);
  }, []);

    const [currentUser, setCurrentUser] = useState(null);
    const [sentSubmissions, setSentSubmissions] = useState([]);
    const [receivedSubmissions, setReceivedSubmissions] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [receivedPage, setReceivedPage] = useState(1);
    const [sentPage, setSentPage] = useState(1);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [submissionToDelete, setSubmissionToDelete] = useState(null);
    const [isInbox, setIsInbox] = useState(true);
    const [sentSort, setSentSort] = useState('newest');
    const [receivedSort, setReceivedSort] = useState('newest');

    const cardsPerPage = 9;

    const receivedSectionRef = React.useRef(null);
    const sentSectionRef = React.useRef(null);

    const scrollToSection = (sectionRef) => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchSent = async () => {
            try {
                const response = await fetch('/api/student/homework/submitted/', {
                    credentials: 'include'
                });
                if (!response.ok) throw new Error("Failed to fetch sent submissions");
                const data = await response.json();
                setSentSubmissions(data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchReceived = async () => {
            try {
                const response = await fetch('/api/student/homework/received/', {
                    credentials: 'include'
                });
                if (!response.ok) throw new Error("Failed to fetch received submissions");
                const data = await response.json();
                console.log('Received submissions:', data);
                setReceivedSubmissions(data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchAllUsers = async () => {
            try {
                const response = await fetch('/users/all-users/', {
                    credentials: 'include'
                });
                if (!response.ok) throw new Error("Failed to fetch all users");
                const data = await response.json();
                setAllUsers(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchSent();
        fetchReceived();
        fetchAllUsers();
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

    const paginateReceived = (data) => {
        const start = (receivedPage - 1) * cardsPerPage;
        return data.slice(start, start + cardsPerPage);
    };

    const paginateSent = (data) => {
        const start = (sentPage - 1) * cardsPerPage;
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

    const truncateText = (text, maxLength = 50) => {
        if (!text) return "";
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    const formatPercentage = (percent) => {
        return typeof percent === 'number' ? percent.toFixed(2) : '0.00';
    };

    const handleDelete = async (submissionId, isSent) => {
        try {
            const endpoint = isSent 
                ? `/api/student/homework/submitted/${submissionId}/`
                : `/api/student/homework/received/${submissionId}/`;
            
            const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.cookie.split('; ').find(row => row.startsWith('csrftoken=')).split('=')[1]
                },
            });
            if (response.ok) {
                // Update the state to remove the deleted submission
                if (isSent) {
                    setSentSubmissions(prev => prev.filter(sub => sub.id !== submissionId));
                } else {
                    setReceivedSubmissions(prev => prev.filter(sub => sub.id !== submissionId));
                }
            } else {
                const errorText = await response.text();
                console.error('Server response:', errorText);
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
            console.log('Attempting to download:', documentUrl);
            const response = await fetch(documentUrl);
            console.log('Download response status:', response.status);
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response:', errorText);
                throw new Error('Download failed');
            }
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

    const sortSubmissions = (submissions, sortType) => {
        const sorted = [...submissions];
        switch (sortType) {
            case 'oldest':
                return sorted.sort((a, b) => new Date(a.submission_date) - new Date(b.submission_date));
            case 'newest':
                return sorted.sort((a, b) => new Date(b.submission_date) - new Date(a.submission_date));
            case 'grade-high':
                return sorted.sort((a, b) => (b.grade_percent || 0) - (a.grade_percent || 0));
            case 'grade-low':
                return sorted.sort((a, b) => (a.grade_percent || 0) - (b.grade_percent || 0));
            default:
                return sorted;
        }
    };

    const handleSentSortChange = (event) => {
        setSentSort(event.target.value);
        setSentPage(1);
    };

    const handleReceivedSortChange = (event) => {
        setReceivedSort(event.target.value);
        setReceivedPage(1);
    };

    console.log("Sent submission example:", sentSubmissions[0]);

    return (
        <Box sx={{ padding: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
            <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
                Student Dashboard
            </Typography>

            {/* Received Submissions Section */}
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
                    {paginateReceived(sortSubmissions(receivedSubmissions, receivedSort)).map((submission) => {
                        console.log('Received submission document URL:', submission.document_area);
                        return (
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
                                                src={getUserProfilePicture(submission.send_to?.id)}
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
                                                    {submission.send_to?.username || 'Unknown Teacher'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                    {submission.send_to?.email}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Task: {submission.task_type}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            From: {submission.student_name?.first_name} {submission.student_name?.last_name}
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
                                        {submission.teacher_notes && (
                                            <Box sx={{ mt: 1 }}>
                                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                    Teacher Notes:
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
                                                    {truncateText(submission.teacher_notes, 100)}
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
                        );
                    })}
                </Grid>
                {/* Pagination Controls for Received Work */}
                <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Button
                        variant="outlined"
                        onClick={() => setReceivedPage((prev) => Math.max(prev - 1, 1))}
                        disabled={receivedPage === 1}
                    >
                        Previous
                    </Button>
                    <Typography variant="body1" sx={{ display: "inline", mx: 2 }}>
                        Page {receivedPage}
                    </Typography>
                    <Button
                        variant="outlined"
                        onClick={() => setReceivedPage((prev) => prev + 1)}
                        disabled={receivedPage * cardsPerPage >= receivedSubmissions.length}
                    >
                        Next
                    </Button>
                </Box>
            </Box>

            {/* Section Divider */}
            <Box 
                sx={{ 
                    my: 6,
                    height: '2px',
                    background: 'linear-gradient(to right, rgba(25, 118, 210, 0.1), rgba(25, 118, 210, 0.5), rgba(25, 118, 210, 0.1))',
                    position: 'relative'
                }}
            >
                <Typography 
                    variant="overline" 
                    sx={{ 
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: '#fff',
                        padding: '0 16px',
                        color: '#666',
                        fontWeight: 500
                    }}
                >
                    HOMEWORK SECTIONS
                </Typography>
            </Box>

            {/* Sent Submissions Section */}
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
                        Sent Work
                    </Typography>
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Sort By</InputLabel>
                        <Select
                            value={sentSort}
                            onChange={handleSentSortChange}
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
                    {paginateSent(sortSubmissions(sentSubmissions, sentSort)).map((submission) => (
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
                                                {submission.student_name?.username}
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
                                        Sent to: {submission.send_to?.first_name} {submission.send_to?.last_name}
                                    </Typography>
                                    {submission.grade_awarded && (
                                        <Typography variant="body1" sx={{ color: "#2196f3" }} noWrap>
                                            Grade: {submission.grade_awarded}/{submission.grade_total} ({formatPercentage(submission.grade_percent)}%)
                                        </Typography>
                                    )}
                                    {submission.student_notes && (
                                        <Box sx={{ mt: 1 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                Your Notes:
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
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                        Submitted: {formatDateTime(submission.submission_date)}
                                    </Typography>
                                    {submission.teacher_notes && (
                                        <Box sx={{ mt: 1 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                Teacher Notes:
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
                                                {truncateText(submission.teacher_notes, 100)}
                                            </Typography>
                                        </Box>
                                    )}
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
                {/* Pagination Controls for Submitted Work */}
                <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Button
                        variant="outlined"
                        onClick={() => setSentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={sentPage === 1}
                    >
                        Previous
                    </Button>
                    <Typography variant="body1" sx={{ display: "inline", mx: 2 }}>
                        Page {sentPage}
                    </Typography>
                    <Button
                        variant="outlined"
                        onClick={() => setSentPage((prev) => prev + 1)}
                        disabled={sentPage * cardsPerPage >= sentSubmissions.length}
                    >
                        Next
                    </Button>
                </Box>
            </Box>

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

export default StudentHomeworkSummary;
