import React, { useState, useEffect } from "react";
import { Checkbox, FormControlLabel, Button } from "@mui/material";

// Helper function to retrieve CSRF token from cookies
function getCsrfToken() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith('csrftoken=')) {
            return cookie.substring('csrftoken='.length);
        }
    }
    return null;
}

const NotificationSettings = () => {
    const [receiveNotifications, setReceiveNotifications] = useState(false);

    useEffect(() => {
        // Fetch the initial preference
        fetch('/api/student-notification-preference/')
            .then(res => res.json())
            .then(data => setReceiveNotifications(data.receive_email_notifications))
            .catch(console.error);
    }, []);

    const handlePreferenceChange = async () => {
        // Send updated preference to the backend
        const response = await fetch('/api/student-notification-preference/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken(), // Include CSRF token for security
            },
            body: JSON.stringify({ receive_email_notifications: receiveNotifications }),
        });
        if (!response.ok) {
            console.error('Failed to update preference');
        } else {
            alert('Notification preference updated successfully!');
        }
    };

    return (
        <div>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={receiveNotifications}
                        onChange={(e) => setReceiveNotifications(e.target.checked)}
                    />
                }
                label="Receive email notifications when a document is uploaded"
            />
            <Button
                variant="contained"
                onClick={handlePreferenceChange}
                sx={{
                    textTransform: "none",
                    backgroundColor: "#4caf50",
                    "&:hover": { backgroundColor: "#388e3c" },
                }}
            >
                Save Preferences
            </Button>
        </div>
    );
};

export default NotificationSettings;
