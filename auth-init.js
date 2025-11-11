// Authentication initialization for all pages
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const signupBtn = document.getElementById('signup-btn');
    const loginBtn = document.getElementById('login-btn');
    const signoutBtn = document.getElementById('signout-btn');
    const sidebarSignupBtn = document.querySelector('.sidebar .signup-btn');
    const sidebarLoginBtn = document.querySelector('.sidebar .login-btn');
    const sidebarSignoutBtn = document.querySelector('.sidebar .signout-btn');

    // Function to update auth buttons visibility
    function updateAuthButtons() {
        if (token) {
            // User is logged in
            if (signupBtn) signupBtn.style.display = 'none';
            if (loginBtn) loginBtn.style.display = 'none';
            if (signoutBtn) signoutBtn.style.display = 'inline-block';
            if (sidebarSignupBtn) sidebarSignupBtn.style.display = 'none';
            if (sidebarLoginBtn) sidebarLoginBtn.style.display = 'none';
            if (sidebarSignoutBtn) sidebarSignoutBtn.style.display = 'block';
        } else {
            // User is not logged in
            if (signupBtn) signupBtn.style.display = 'inline-block';
            if (loginBtn) loginBtn.style.display = 'inline-block';
            if (signoutBtn) signoutBtn.style.display = 'none';
            if (sidebarSignupBtn) sidebarSignupBtn.style.display = 'block';
            if (sidebarLoginBtn) sidebarLoginBtn.style.display = 'block';
            if (sidebarSignoutBtn) sidebarSignoutBtn.style.display = 'none';
        }
    }

    // Unified sign out functionality
    function handleSignOut(e) {
        if (e) e.preventDefault();
        
        // Clear all auth-related data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Show success message if toast function exists
        if (typeof showToast === 'function') {
            showToast('Logged out successfully', 'success');
        }
        
        // Redirect to login page
        window.location.href = 'login.html';
    }

    // Add event listeners for sign out buttons
    if (signoutBtn) {
        signoutBtn.addEventListener('click', handleSignOut);
    }
    if (sidebarSignoutBtn) {
        sidebarSignoutBtn.addEventListener('click', handleSignOut);
    }

    // Make handleSignOut available globally
    window.handleSignOut = handleSignOut;

    // Initial update of auth buttons
    updateAuthButtons();

    // Update auth buttons when token changes
    window.addEventListener('storage', (e) => {
        if (e.key === 'token') {
            updateAuthButtons();
        }
    });
}); 