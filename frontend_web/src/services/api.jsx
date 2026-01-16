import axios from 'axios';

// Create an Axios instance with base configuration
const api = axios.create({
  // Base URL is loaded securely from the VITE_API_BASE_URL variable in your .env file
  baseURL: import.meta.env.VITE_API_BASE_URL,
  
  // CRITICAL for PHP sessions: ensures cookies/session tokens are sent with every request
  withCredentials: true,
  
  // Default headers for all API calls
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can customize global error handling here (e.g., redirect to login on 401)
    
    // Check if the error object has a response (i.e., it's an HTTP error, not a network error)
    if (error.response) {
        console.error('API Error Status:', error.response.status);
        console.error('API Error Data:', error.response.data);
    } else {
        console.error('Network Error:', error.message);
    }
    
    // Pass the original error promise to the calling component's catch block
    return Promise.reject(error);
  }
);

// Export the configured instance for use in components/contexts
export default api;