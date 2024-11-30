export function getCsrfToken() {
    console.log('Document Cookies:', document.cookie);  // Add this for debugging
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === 'csrftoken') return decodeURIComponent(value);
    }
    return null;
}
