import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, CardActions, Button, Divider, CircularProgress } from "@mui/material";
import { Grid } from "@mui/system";

const TeacherHomeworkReview = () => {
    const [receivedSubmissions, setReceivedSubmissions] = useState([]);
    const [submittedSubmissions, setSubmittedSubmissions] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [receivedPage, setReceivedPage] = useState(1);  // Separate page for inbox
    const [submittedPage, setSubmittedPage] = useState(1);  // Separate page for outbox
    const cardsPerPage = 10; // Adjust to display fewer cards for a more refined look
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responses = await Promise.all([
                    fetch("/api/teacher-homework-received/"),
                    fetch("/api/teacher-homework-submitted/"),
                    fetch("/users/all-users/")
                ]);
                const data = await Promise.all(responses.map((res) => res.json()));

                setReceivedSubmissions(data[0]);
                setSubmittedSubmissions(data[1]);
                setAllUsers(data[2]);
                setLoading(false);
            } catch (error) {
                console.error(error);
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

    const getTeacherNotesExcerpt = (notes) => {
        if (!notes) return "No notes available";
        const firstLine = notes.split("\n")[0];  // Assuming notes are multiline
        return firstLine.length > 100 ? firstLine.substring(0, 100) + "..." : firstLine;
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
                <>
                    <Typography variant="h5" sx={{ marginBottom: 2, color: "#2c3e50", fontWeight: 500 }}>
                        Graded Work - Inbox:
                    </Typography>
                    <Grid container spacing={3}>
                        {paginate(receivedSubmissions, receivedPage).map((submission) => (
                            <Grid key={submission.id} item xs={12} sm={6} md={4}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 2,
                                        boxShadow: 2,
                                        "&:hover": { boxShadow: 6 },
                                        transition: "box-shadow 0.3s ease",
                                        height: '100%',
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1, paddingBottom: 2 }}>
                                        <Box sx={{ marginBottom: 2, textAlign: "center" }}>
                                            <img
                                                src={getUserProfilePicture(submission.student_name.id)}
                                                alt={`${submission.student_name.username || "Unknown"}'s Profile`}
                                                style={{
                                                    height: "60px",
                                                    width: "60px",
                                                    borderRadius: "50%",
                                                    objectFit: "cover",
                                                    border: "2px solid #3f51b5",
                                                }}
                                            />
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            From: {submission.student_name.username}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Task: {submission.task_type}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Received: {formatDateTime(submission.submission_date)}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ marginTop: 2, fontStyle: "italic" }}
                                        >
                                            Teacher's Note: {getTeacherNotesExcerpt(submission.teacher_notes)}
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ paddingTop: 1 }}>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            href={submission.document_area}
                                            sx={{
                                                textTransform: "none",
                                                backgroundColor: "#4caf50",  // Green color for the button
                                                "&:hover": { backgroundColor: "#388e3c" },  // Darker green on hover
                                            }}
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

                    <Divider sx={{ my: 6, borderStyle: "dashed" }} />
                </>
            )}

            {/* Submitted Submissions (Outbox) */}
            {!loading && (
                <>
                    <Typography variant="h5" sx={{ marginBottom: 2, color: "#2c3e50", fontWeight: 500 }}>
                        Graded Work - Outbox:
                    </Typography>
                    <Grid container spacing={3}>
                        {paginate(submittedSubmissions, submittedPage).map((submission) => (
                            <Grid key={submission.id} item xs={12} sm={6} md={4}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 2,
                                        boxShadow: 2,
                                        "&:hover": { boxShadow: 6 },
                                        transition: "box-shadow 0.3s ease",
                                        height: '100%',
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1, paddingBottom: 2 }}>
                                        <Box sx={{ marginBottom: 2, textAlign: "center" }}>
                                            <img
                                                src={getUserProfilePicture(submission.send_to.id)}
                                                alt={`${submission.send_to?.username || "Unknown"}'s Profile`}
                                                style={{
                                                    height: "60px",
                                                    width: "60px",
                                                    borderRadius: "50%",
                                                    objectFit: "cover",
                                                    border: "2px solid #3f51b5",
                                                }}
                                            />
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            Sent to: {submission.send_to?.username || "Unknown"}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Task: {submission.task_type}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Sent: {formatDateTime(submission.submission_date)}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ marginTop: 2, fontStyle: "italic" }}
                                        >
                                            Teacher's Note: {getTeacherNotesExcerpt(submission.teacher_notes)}
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ paddingTop: 1 }}>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            href={submission.document_area}
                                            sx={{
                                                textTransform: "none",
                                                backgroundColor: "#4caf50",  // Green color for the button
                                                "&:hover": { backgroundColor: "#388e3c" },  // Darker green on hover
                                            }}
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
                </>
            )}
        </Box>
    );
};

export default TeacherHomeworkReview;
