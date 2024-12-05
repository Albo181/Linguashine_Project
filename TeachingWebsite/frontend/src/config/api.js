// API endpoint configuration
const API_BASE_URL = 'http://localhost:8000';

export const API_ENDPOINTS = {
    // User endpoints
    USER_INFO: `${API_BASE_URL}/users/user-info/`,
    CHECK_AUTH: `${API_BASE_URL}/users/check-auth/`,
    LOGIN: `${API_BASE_URL}/users/login/`,
    LOGOUT: `${API_BASE_URL}/users/logout/`,
    CURRENT_USER: `${API_BASE_URL}/users/me/`,
    
    // Feedback endpoints
    GRADE_SUMMARY: `${API_BASE_URL}/api/grade-summary/`,
    TEACHER_UPLOAD: `${API_BASE_URL}/api/teacher-upload/`,
    STUDENT_UPLOAD: `${API_BASE_URL}/api/student-upload/`,
    
    // Task endpoints
    TASK_TYPES: `${API_BASE_URL}/api/task-types/`,
    
    // CSRF token
    CSRF_TOKEN: `${API_BASE_URL}/users/api/get-csrf-token/`,
};

// API request helper with CSRF token
export const apiRequest = async (url, options = {}) => {
    // Get CSRF token from cookie
    const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];

    // Default options
    const defaultOptions = {
        credentials: 'include',  // Include cookies
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
    };

    // Merge options
    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, finalOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
};
