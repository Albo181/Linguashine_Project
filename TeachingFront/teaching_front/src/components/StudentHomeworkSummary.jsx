import React, { useEffect, useState, useMemo } from "react";
import { Box, Typography, Card, CardContent, CardActions, Button, Divider, Pagination, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel, CircularProgress, Avatar } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import apiClient from '../api/apiClient';

const ProfileImage = React.memo(({ profilePicture, firstName }) => {
    const [imageError, setImageError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Construct the full URL based on whether it's a local or production URL
    const fullImageUrl = useMemo(() => {
        if (!profilePicture) return null;
        
        if (profilePicture.startsWith('http')) {
            return profilePicture;
        }
        
        const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
        const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        return `${cleanBaseUrl}${profilePicture}`;
    }, [profilePicture]);

    useEffect(() => {
        setImageError(false);
        setIsLoading(true);
        
        if (!fullImageUrl) {
            setImageError(true);
            setIsLoading(false);
            return;
        }

        console.log('Attempting to load image from:', fullImageUrl);

        // Test image loading
        const img = new Image();
        img.onload = () => {
            console.log('Successfully loaded image:', fullImageUrl);
            setIsLoading(false);
            setImageError(false);
        };
        img.onerror = (e) => {
            console.error('Failed to load image:', fullImageUrl, e);
            setImageError(true);
            setIsLoading(false);
        };
        img.src = fullImageUrl;

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [fullImageUrl]);

    if (imageError || !fullImageUrl) {
        return (
            <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-500 border-4 border-white shadow-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            </div>
        );
    }

    return (
        <div className="relative w-[60px] h-[60px]">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-full">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
            )}
            <img
                src={fullImageUrl}
                alt={`${firstName}'s profile`}
                className={`w-full h-full rounded-full object-cover border-4 border-white shadow-xl ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                onError={() => setImageError(true)}
            />
        </div>
    );
});

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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cardsPerPage = 9;

    const receivedSectionRef = React.useRef(null);
    const sentSectionRef = React.useRef(null);

    const scrollToSection = (sectionRef) => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [sentResponse, receivedResponse, usersResponse] = await Promise.all([
                    apiClient.get('/api/student/homework/submitted/'),
                    apiClient.get('/api/student/homework/received/'),
                    apiClient.get('/users/all-users/')
                ]);

                setSentSubmissions(sentResponse.data);
                setReceivedSubmissions(receivedResponse.data);
                setAllUsers(usersResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '100vh',
                flexDirection: 'column',
                gap: 2
            }}>
                <CircularProgress />
                <Typography>Loading your homework submissions...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '100vh',
                flexDirection: 'column',
                gap: 2
            }}>
                <Typography color="error">{error}</Typography>
                <Button 
                    variant="contained" 
                    onClick={() => window.location.reload()}
                >
                    Retry
                </Button>
            </Box>
        );
    }

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
        const user = allUsers.find(user => user.id === userId);
        if (user) {
            const pictureUrl = user.profile_picture_url || user.profile_picture || user.profilePicture;
            if (pictureUrl && pictureUrl.startsWith('/media')) {
                const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
                const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
                return `${cleanBaseUrl}${pictureUrl}`;
            }
            return pictureUrl;
        }
        return "/placeholder-profile.png";
    };

    const truncateText = (text, maxLength = 50) => {
        if (!text) return "";
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    const formatPercentage = (percent) => {
        return typeof percent === 'number' ? percent.toFixed(2) : '0.00';
    };

    const handleDelete = async (submissionId, isInbox) => {
        try {
            // Note: isInbox is true for received submissions, false for sent submissions
            const endpoint = !isInbox 
                ? `/api/student/homework/submitted/${submissionId}/`
                : `/api/student/homework/received/${submissionId}/`;
            
            console.log('Deleting submission at endpoint:', endpoint);
            const response = await apiClient.delete(endpoint);
            
            if (response.status === 204 || response.status === 200) {
                // Update the state to remove the hidden submission
                if (!isInbox) {
                    setSentSubmissions(prev => prev.filter(sub => sub.id !== submissionId));
                } else {
                    setReceivedSubmissions(prev => prev.filter(sub => sub.id !== submissionId));
                }
            }
        } catch (error) {
            console.error('Error hiding submission:', error);
            // Optionally show an error message to the user
            setError('Failed to hide submission. Please try again.');
            setTimeout(() => setError(null), 3000); // Clear error after 3 seconds
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
            const response = await apiClient.get(documentUrl, {
                responseType: 'blob'
            });
            
            const blob = response.data;
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

    const getProfilePicture = (user) => {
        if (!user || !user.profile_picture) return "/placeholder-profile.png";
        return user.profile_picture;
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
                    {paginateReceived(sortSubmissions(receivedSubmissions, receivedSort)).map((submission) => (
                        <Grid item xs={12} sm={6} md={4} key={submission.id}>
                            <Card sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: '8px',
                                backgroundColor: '#fafafa',
                                background: 'linear-gradient(45deg, #fafafa 25%, #ffffff 25%, #ffffff 50%, #fafafa 50%, #fafafa 75%, #ffffff 75%, #ffffff 100%)',
                                backgroundSize: '40px 40px',
                                backgroundOpacity: 0.3,
                                border: '0.5px solid #eaeaea',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 12px 24px rgba(0,0,0,0.07)',
                                    transition: 'all 0.3s ease'
                                },
                                transition: 'all 0.3s ease'
                            }}>
                                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <ProfileImage 
                                            profilePicture={getUserProfilePicture(submission.send_to?.id)}
                                            firstName={submission.send_to?.first_name}
                                        />
                                        <Box sx={{ ml: 2 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                                                {submission.task_type}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                From: {submission.send_to?.first_name} {submission.send_to?.last_name}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    
                                    {submission.grade_awarded !== null && (
                                        <Typography 
                                            variant="body1" 
                                            sx={{ 
                                                color: "#2196f3",
                                                fontWeight: 500,
                                                mt: 1,
                                                mb: 2,
                                                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                display: 'inline-block'
                                            }}
                                        >
                                            Grade: {submission.grade_awarded}/{submission.grade_total} ({((submission.grade_awarded / submission.grade_total) * 100).toFixed(1)}%)
                                        </Typography>
                                    )}

                                    {/* Teacher's notes in received work */}
                                    {submission.teacher_notes && (
                                        <Box sx={{ mt: 1 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                Teacher Notes:
                                            </Typography>
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    backgroundColor: '#e3f2fd',
                                                    padding: '8px 12px',
                                                    borderRadius: '4px',
                                                    whiteSpace: 'pre-wrap',
                                                    maxHeight: '60px',
                                                    overflow: 'auto',
                                                    border: '1px solid rgba(33, 150, 243, 0.1)',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
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
                                <CardActions sx={{ p: 2, pt: 0 }}>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        onClick={() => handleDownload(submission.document_area)}
                                    >
                                        Download
                                    </Button>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDeleteClick(submission.id, true)}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
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
                            <Card sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: '8px',
                                backgroundColor: '#fafafa',
                                background: 'linear-gradient(45deg, #fafafa 25%, #ffffff 25%, #ffffff 50%, #fafafa 50%, #fafafa 75%, #ffffff 75%, #ffffff 100%)',
                                backgroundSize: '40px 40px',
                                backgroundOpacity: 0.3,
                                border: '0.5px solid #eaeaea',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 12px 24px rgba(0,0,0,0.07)',
                                    transition: 'all 0.3s ease'
                                },
                                transition: 'all 0.3s ease'
                            }}>
                                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <ProfileImage 
                                            profilePicture={getUserProfilePicture(submission.student_name?.id)}
                                            firstName={submission.student_name?.first_name}
                                        />
                                        <Box sx={{ ml: 2 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                                                {submission.task_type}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                To: {submission.send_to?.first_name} {submission.send_to?.last_name}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Student's notes in sent work */}
                                    {submission.student_notes && (
                                        <Box sx={{ mt: 1 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                Your Notes:
                                            </Typography>
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    backgroundColor: '#f5f5f5',
                                                    padding: '8px 12px',
                                                    borderRadius: '4px',
                                                    whiteSpace: 'pre-wrap',
                                                    maxHeight: '60px',
                                                    overflow: 'auto',
                                                    border: '1px solid rgba(0,0,0,0.05)',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                                }}
                                            >
                                                {truncateText(submission.student_notes, 100)}
                                            </Typography>
                                        </Box>
                                    )}

                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                        Sent: {formatDateTime(submission.submission_date)}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ p: 2, pt: 0 }}>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        onClick={() => handleDownload(submission.document_area)}
                                    >
                                        Download
                                    </Button>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDeleteClick(submission.id, false)}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
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
                    Hide Submission
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to hide this submission? It will be removed from your view but will still be visible to the teacher.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="primary" variant="contained">
                        Hide
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default StudentHomeworkSummary;
