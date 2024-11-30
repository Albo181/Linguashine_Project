import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, CardActions, Button, Divider } from "@mui/material";
import { Grid } from "@mui/system";

const StudentHomeworkSummary = () => {
    const [sentSubmissions, setSentSubmissions] = useState([]);
    const [receivedSubmissions, setReceivedSubmissions] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [page, setPage] = useState(1);
    const cardsPerPage = 100;

    useEffect(() => {
        const fetchSent = async () => {
            try {
                const response = await fetch("/api/student-homework-submitted/");
                if (!response.ok) throw new Error("Failed to fetch sent submissions");
                const data = await response.json();
                setSentSubmissions(data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchReceived = async () => {
            try {
                const response = await fetch("/api/student-homework-received/");
                if (!response.ok) throw new Error("Failed to fetch received submissions");
                const data = await response.json();
                setReceivedSubmissions(data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchAllUsers = async () => {
            try {
                const response = await fetch("/users/all-users/");
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

    const paginate = (data) => {
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

    return (
        <Box sx={{ padding: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
            <Typography variant="h4" sx={{ marginBottom: 4, textAlign: "center", color: "#3f51b5" }}>
                Student Dashboard
            </Typography>

            {/* Sent Submissions Section */}
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
                Submitted Work:
            </Typography>
            <Grid container spacing={3}>
                {paginate(sentSubmissions).map((submission) => (
                    <Grid key={submission.id} sx={{ padding: 1 }}>
                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                            <CardContent>
                                <Box sx={{ marginBottom: 2, textAlign: "center" }}>
                                    <img
                                        src={getUserProfilePicture(submission.send_to.id)}
                                        alt={`${submission.send_to?.username || "Unknown"}'s Profile`}
                                        style={{
                                            height: "50px",
                                            width: "50px",
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                            border: "2px solid #3f51b5",
                                        }}
                                    />
                                </Box>
                                <Typography variant="h6">
                                    Sent to: {submission.send_to?.username || "Unknown"}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Task: {submission.task_type}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Sent: {formatDateTime(submission.submission_date)}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    size="small"
                                    variant="contained"
                                    href={submission.document_area}
                                    sx={{ textTransform: "none" }}
                                >
                                    Download
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Divider sx={{ my: 6, borderStyle: "dashed" }} />

            {/* Received Submissions Section */}
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
                Received Work (Feedback):
            </Typography>
            <Grid container spacing={3}>
                {paginate(receivedSubmissions).map((submission) => (
                    <Grid key={submission.id} sx={{ padding: 1 }}>
                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                            <CardContent>
                                <Box sx={{ marginBottom: 2, textAlign: "center" }}>
                                    <img
                                        src={getUserProfilePicture(submission.student_name.id)}
                                        alt={`${submission.student_name.username || "Unknown"}'s Profile`}
                                        style={{
                                            height: "50px",
                                            width: "50px",
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                            border: "2px solid #3f51b5",
                                        }}
                                    />
                                </Box>
                                <Typography variant="h6">
                                    From: {submission.student_name.username}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Task: {submission.task_type}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Received: {formatDateTime(submission.submission_date)}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    size="small"
                                    variant="contained"
                                    href={submission.document_area}
                                    sx={{ textTransform: "none" }}
                                >
                                    Download
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Pagination Controls */}
            <Box sx={{ mt: 4, textAlign: "center" }}>
                <Button
                    variant="outlined"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                >
                    Previous
                </Button>
                <Typography variant="body1" sx={{ display: "inline", mx: 2 }}>
                    Page {page}
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={page * cardsPerPage >= sentSubmissions.length}
                >
                    Next
                </Button>
            </Box>
        </Box>
    );
};

export default StudentHomeworkSummary;
