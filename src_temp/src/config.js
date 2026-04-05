const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://vibehub-api.onrender.com'; // Change this after hosting backend

export default API_BASE_URL;
