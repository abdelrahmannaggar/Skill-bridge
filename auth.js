// Authentication Functions
const auth = {
    // Check if user is logged in
    isLoggedIn() {
        return !!localStorage.getItem('token');
    },

    // Get current user
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Check if user is an instructor
    isInstructor() {
        const user = this.getCurrentUser();
        return user && user.role === 'instructor';
    },

    // Get user type
    async getUserType() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return 'free';
            }

            const response = await fetch('http://localhost:5000/api/user-type', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to get user type');
            }

            const data = await response.json();
            return data.userType;
        } catch (error) {
            console.error('Error getting user type:', error);
            return 'free';
        }
    },

    // Login function
    async login(email, password) {
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    // Register function
    async register(userData) {
        try {
            const formData = new FormData();
            for (const key in userData) {
                if (key === 'resume' || key === 'avatar') {
                    if (userData[key]) {
                        formData.append(key, userData[key]);
                    }
                } else {
                    formData.append(key, userData[key]);
                }
            }

            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    // Logout function
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    },

    // Update UI based on auth state
    updateUI() {
        const isLoggedIn = this.isLoggedIn();
        const loginBtns = document.querySelectorAll('.login-btn, a[href="login.html"]');
        const signupBtns = document.querySelectorAll('.signup-btn, a[href="signup.html"]');
        const logoutBtns = document.querySelectorAll('.logout-btn');
        
        // Remove existing logout buttons
        logoutBtns.forEach(btn => {
            const parent = btn.parentNode;
            if (parent) {
                parent.removeChild(btn);
            }
        });

        if (isLoggedIn) {
            // Hide login/signup buttons
            loginBtns.forEach(btn => {
                const parent = btn.parentNode;
                if (parent) {
                    parent.removeChild(btn);
                }
            });
            
            signupBtns.forEach(btn => {
                const parent = btn.parentNode;
                if (parent) {
                    parent.removeChild(btn);
                }
            });
            
            // Add logout button to navbar
            const navbar = document.querySelector('.main-menu ul');
            if (navbar && !navbar.querySelector('.logout-btn')) {
                const logoutLi = document.createElement('li');
                const logoutBtn = document.createElement('a');
                logoutBtn.href = '#';
                logoutBtn.className = 'btn logout-btn';
                logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Log Out';
                logoutBtn.onclick = (e) => {
                    e.preventDefault();
                    this.logout();
                };
                logoutLi.appendChild(logoutBtn);
                navbar.appendChild(logoutLi);
            }
            
            // Add logout button to sidebar
            const sidebarSupport = document.querySelector('.menu-section.support-section');
            if (sidebarSupport && !sidebarSupport.querySelector('.logout-btn')) {
                const logoutBtn = document.createElement('a');
                logoutBtn.href = '#';
                logoutBtn.className = 'logout-btn';
                logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Log Out';
                logoutBtn.onclick = (e) => {
                    e.preventDefault();
                    this.logout();
                };
                sidebarSupport.appendChild(logoutBtn);
            }
        } else {
            // Show login/signup buttons if they don't exist
            const navbar = document.querySelector('.main-menu ul');
            if (navbar && !navbar.querySelector('a[href="login.html"]')) {
                const loginLi = document.createElement('li');
                const loginBtn = document.createElement('a');
                loginBtn.href = 'login.html';
                loginBtn.className = 'btn';
                loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Log In';
                loginLi.appendChild(loginBtn);
                navbar.appendChild(loginLi);
            }

            if (navbar && !navbar.querySelector('a[href="signup.html"]')) {
                const signupLi = document.createElement('li');
                const signupBtn = document.createElement('a');
                signupBtn.href = 'signup.html';
                signupBtn.className = 'btn';
                signupBtn.innerHTML = '<i class="fas fa-user"></i> Sign Up';
                signupLi.appendChild(signupBtn);
                navbar.appendChild(signupLi);
            }

            // Add login/signup buttons to sidebar if they don't exist
            const sidebarSupport = document.querySelector('.menu-section.support-section');
            if (sidebarSupport) {
                if (!sidebarSupport.querySelector('a[href="login.html"]')) {
                    const loginBtn = document.createElement('a');
                    loginBtn.href = 'login.html';
                    loginBtn.className = 'login-btn';
                    loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Log In';
                    sidebarSupport.appendChild(loginBtn);
                }
                if (!sidebarSupport.querySelector('a[href="signup.html"]')) {
                    const signupBtn = document.createElement('a');
                    signupBtn.href = 'signup.html';
                    signupBtn.className = 'signup-btn';
                    signupBtn.innerHTML = '<i class="fas fa-user-plus"></i> Sign Up';
                    sidebarSupport.appendChild(signupBtn);
                }
            }
        }
    },

    isProUser() {
        const user = this.getCurrentUser();
        return user && user.userType === 'pro';
    },

    isBasicUser() {
        const user = this.getCurrentUser();
        return user && user.userType === 'basic';
    },

    isFreeUser() {
        const user = this.getCurrentUser();
        return !user || user.userType === 'free';
    }
};

// Export auth object
window.auth = auth;

// User type management
let currentUserType = 'free';

auth.getUserType = async function() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            currentUserType = 'free';
            return currentUserType;
        }

        const response = await fetch('http://localhost:5000/api/user-type', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to get user type');
        }

        const data = await response.json();
        currentUserType = data.userType;
        return currentUserType;
    } catch (error) {
        console.error('Error getting user type:', error);
        currentUserType = 'free';
        return currentUserType;
    }
};

auth.isProUser = function() {
    return currentUserType === 'pro';
};

auth.isBasicUser = function() {
    return currentUserType === 'basic';
};

auth.isFreeUser = function() {
    return currentUserType === 'free';
}; 