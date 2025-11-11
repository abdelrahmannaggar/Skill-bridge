// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// API Functions
const api = {
    // Base URL for API calls
    baseUrl: API_BASE_URL,

    // Helper function to make API calls
    async fetch(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        };

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Auth Functions
    async login(email, password) {
        return this.fetch('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },

    // Get current user
    async getCurrentUser() {
        return this.fetch('/auth/me');
    },

    // Profile Functions
    async getProfile() {
        return this.fetch('/users/profile');
    },

    // Skills Functions
    async getSkills() {
        return this.fetch('/skills');
    },

    // Courses Functions
    async getCourses() {
        return this.fetch('/courses');
    },

    // Events Functions
    async getEvents() {
        return this.fetch('/events');
    },

    // Feedback Functions
    async getFeedbacks() {
        return this.fetch('/feedbacks');
    },

    async submitFeedback(message) {
        return this.fetch('/feedbacks', {
            method: 'POST',
            body: JSON.stringify({ message })
        });
    }
};

// Export the API object
window.api = api;

// Subscribe/payment API
// export async function subscribe({ name, email, plan, method }) {
//     const res = await fetch('http://localhost:5000/api/subscribe', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name, email, plan, method })
//     });
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.error || 'Subscription failed');
//     return data;
// } 