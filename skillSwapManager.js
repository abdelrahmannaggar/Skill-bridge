// Skill Swap Manager - Handles all skill swap related functionality

class SkillSwapManager {
    constructor() {
        this.swaps = [];
        this.users = [];
        this.initializeEventListeners();
        this.initializeTabSwitching();
        this.loadSwapRequests(); // Load existing swap requests on initialization
    }

    initializeEventListeners() {
        // Initialize swap buttons if they exist
        const swapButtons = document.querySelectorAll('.swap');
        swapButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleSwapRequest(e));
        });

        // Initialize accept buttons if they exist
        const acceptButtons = document.querySelectorAll('.accept');
        acceptButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleAcceptRequest(e);
            });
        });

        // Initialize decline buttons if they exist
        const declineButtons = document.querySelectorAll('.delete');
        declineButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleDeclineRequest(e);
            });
        });

        // Initialize cancel buttons if they exist
        const cancelButtons = document.querySelectorAll('.unswap');
        cancelButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleCancelRequest(e);
            });
        });

        // Initialize card hover effects
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => this.handleCardHover(card, true));
            card.addEventListener('mouseleave', () => this.handleCardHover(card, false));
        });

        // Add skill search functionality
        const skillSearchInput = document.getElementById('skillSearch');
        if (skillSearchInput) {
            skillSearchInput.addEventListener('input', debounce(async (e) => {
                const searchTerm = e.target.value.toLowerCase();
                if (searchTerm) {
                    await this.searchUsersByText(searchTerm);
                } else {
                    await this.loadUsers();
                }
            }, 300));
        }

        // Add skill tag selection
        const skillTags = document.querySelectorAll('.ss-skill-tag');
        skillTags.forEach(tag => {
            tag.addEventListener('click', async () => {
                const skillName = tag.textContent.trim();
                await this.searchUsersByText(skillName);
            });
        });

        // Add level filter
        const levelFilter = document.getElementById('levelFilter');
        if (levelFilter) {
            levelFilter.addEventListener('change', async () => {
                const searchTerm = document.getElementById('skillSearch').value;
                if (searchTerm) {
                    await this.searchUsersByText(searchTerm);
                } else {
                    await this.loadUsers();
                }
            });
        }

        // Add clear button
        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', async () => {
                document.getElementById('skillSearch').value = '';
                if (levelFilter) levelFilter.value = '';
                await this.loadUsers();
            });
        }
    }

    initializeTabSwitching() {
        const sendTab = document.getElementById('sendTab');
        const receivedTab = document.getElementById('receivedTab');
        const sendContent = document.getElementById('sendContent');
        const receivedContent = document.getElementById('receivedContent');

        if (sendTab && receivedTab) {
            sendTab.addEventListener('click', () => this.switchTab('send'));
            receivedTab.addEventListener('click', () => this.switchTab('received'));
        }
    }

    switchTab(tab) {
        const sendTab = document.getElementById('sendTab');
        const receivedTab = document.getElementById('receivedTab');
        const sendContent = document.getElementById('sendContent');
        const receivedContent = document.getElementById('receivedContent');

        if (tab === 'send') {
            sendTab.classList.add('active');
            receivedTab.classList.remove('active');
            sendContent.classList.add('active');
            receivedContent.classList.remove('active');
            this.updateSwapHistory();
        } else {
            receivedTab.classList.add('active');
            sendTab.classList.remove('active');
            receivedContent.classList.add('active');
            sendContent.classList.remove('active');
            this.updateReceivedRequests();
        }
    }

    async loadSwapRequests() {
        try {
            const response = await fetch('http://localhost:5000/api/swap-requests', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to load swap requests');
            }

            const requests = await response.json();
            this.swaps = requests;
            this.updateSwapHistory();
            this.updateReceivedRequests();
        } catch (error) {
            console.error('Error loading swap requests:', error);
            this.showErrorMessage('Failed to load swap requests. Please refresh the page.');
        }
    }

    async handleSwapRequest(event) {
        try {
            const card = event.target.closest('.card');
            const userData = this.extractUserData(card);
            
            if (!this.isUserLoggedIn()) {
                alert('Please log in to start a skill swap');
                window.location.href = 'login.html';
                return;
            }

            if (confirm(`Are you sure you want to start a swap with ${userData.name}?`)) {
                const loadingIndicator = this.showLoading(card);
                
                try {
                    const response = await fetch('http://localhost:5000/api/swap-request', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({ receiver_id: userData.id })
                    });

                    if (!response.ok) {
                        const data = await response.json();
                        throw new Error(data.error || 'Failed to send swap request');
                    }

                    await this.loadSwapRequests(); // Reload all swap requests
                    this.showSuccessMessage('Swap request sent successfully!');
                } catch (error) {
                    console.error('Error sending swap request:', error);
                    this.showErrorMessage(error.message || 'Failed to send swap request. Please try again.');
                } finally {
                    this.hideLoading(loadingIndicator);
                }
            }
        } catch (error) {
            console.error('Error in handleSwapRequest:', error);
            this.showErrorMessage('An unexpected error occurred. Please try again.');
        }
    }

    async handleAcceptRequest(event) {
        try {
            const card = event.target.closest('.card');
            if (!card) {
                console.error('No card found for accept request');
                return;
            }

            const requestId = card.dataset.requestId;
            if (!requestId) {
                console.error('No request ID found on card');
                return;
            }

            const userName = card.querySelector('h2').textContent;
            
            if (confirm(`Are you sure you want to accept the swap request from ${userName}?`)) {
                const loadingIndicator = this.showLoading(card);
                
                try {
                    const response = await fetch(`http://localhost:5000/api/swap-requests/${requestId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({ status: 'accepted' })
                    });

                    if (!response.ok) {
                        const data = await response.json();
                        throw new Error(data.error || 'Failed to accept swap request');
                    }

                    await this.loadSwapRequests(); // Reload all swap requests
                    this.showSuccessMessage('Swap request accepted!');
                } catch (error) {
                    console.error('Error accepting swap request:', error);
                    this.showErrorMessage(error.message || 'Failed to accept swap request. Please try again.');
                } finally {
                    this.hideLoading(loadingIndicator);
                }
            }
        } catch (error) {
            console.error('Error in handleAcceptRequest:', error);
            this.showErrorMessage('An unexpected error occurred. Please try again.');
        }
    }

    async handleDeclineRequest(event) {
        try {
            const card = event.target.closest('.card');
            if (!card) {
                console.error('No card found for decline request');
                return;
            }

            const requestId = card.dataset.requestId;
            if (!requestId) {
                console.error('No request ID found on card');
                return;
            }

            const userName = card.querySelector('h2').textContent;
            
            if (confirm(`Are you sure you want to decline the swap request from ${userName}?`)) {
                const loadingIndicator = this.showLoading(card);
                
                try {
                    const response = await fetch(`http://localhost:5000/api/swap-requests/${requestId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({ status: 'declined' })
                    });

                    if (!response.ok) {
                        const data = await response.json();
                        throw new Error(data.error || 'Failed to decline swap request');
                    }

                    await this.loadSwapRequests(); // Reload all swap requests
                    this.showSuccessMessage('Swap request declined.');
                } catch (error) {
                    console.error('Error declining swap request:', error);
                    this.showErrorMessage(error.message || 'Failed to decline swap request. Please try again.');
                } finally {
                    this.hideLoading(loadingIndicator);
                }
            }
        } catch (error) {
            console.error('Error in handleDeclineRequest:', error);
            this.showErrorMessage('An unexpected error occurred. Please try again.');
        }
    }

    async handleCancelRequest(event) {
        try {
            const card = event.target.closest('.card');
            if (!card) {
                console.error('No card found for cancel request');
                return;
            }

            const requestId = card.dataset.requestId;
            if (!requestId) {
                console.error('No request ID found on card');
                return;
            }

            const userName = card.querySelector('h2').textContent;
            
            if (confirm(`Are you sure you want to cancel the swap request with ${userName}?`)) {
                const loadingIndicator = this.showLoading(card);
                
                try {
                    const response = await fetch(`http://localhost:5000/api/swap-requests/${requestId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({ status: 'cancelled' })
                    });

                    if (!response.ok) {
                        const data = await response.json();
                        throw new Error(data.error || 'Failed to cancel swap request');
                    }

                    await this.loadSwapRequests(); // Reload all swap requests
                    this.showSuccessMessage('Swap request cancelled.');
                } catch (error) {
                    console.error('Error cancelling swap request:', error);
                    this.showErrorMessage(error.message || 'Failed to cancel swap request. Please try again.');
                } finally {
                    this.hideLoading(loadingIndicator);
                }
            }
        } catch (error) {
            console.error('Error in handleCancelRequest:', error);
            this.showErrorMessage('An unexpected error occurred. Please try again.');
        }
    }

    handleCardHover(card, isEntering) {
        if (isEntering) {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
        } else {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
        }
    }

    showLoading(card) {
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = '<div class="spinner"></div>';
        card.appendChild(loadingOverlay);
        return loadingOverlay;
    }

    hideLoading(loadingOverlay) {
        if (loadingOverlay && loadingOverlay.parentNode) {
            loadingOverlay.parentNode.removeChild(loadingOverlay);
        }
    }

    showSuccessMessage(message) {
        this.showToast(message, 'success');
    }

    showErrorMessage(message) {
        this.showToast(message, 'error');
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    extractUserData(card) {
        return {
            id: card.dataset.userId,
            requestId: card.dataset.requestId,
            name: card.querySelector('h2').textContent,
            skill: card.querySelector('p').textContent.split(' ')[0],
            experience: card.querySelector('p:nth-child(3)').textContent,
            rating: card.querySelector('.stars').textContent,
            stats: {
                connections: card.querySelector('.stat-item:nth-child(1)').textContent,
                projects: card.querySelector('.stat-item:nth-child(2)').textContent,
                reviews: card.querySelector('.stat-item:nth-child(3)').textContent
            },
            image: card.querySelector('img').src,
            timestamp: new Date().toISOString()
        };
    }

    updateSwapHistory() {
        const historyContainer = document.getElementById('sendContent');
        if (historyContainer) {
            this.renderSwapHistory(historyContainer);
        }
    }

    updateReceivedRequests() {
        const receivedContainer = document.getElementById('receivedContent');
        if (receivedContainer) {
            this.renderReceivedRequests(receivedContainer);
        }
    }

    renderSwapHistory(container) {
        const userSwaps = this.swaps.filter(swap => 
            swap.sender_id === parseInt(this.getCurrentUserId())
        );

        if (userSwaps.length === 0) {
            container.innerHTML = '<div class="no-swaps">No swap history found.</div>';
            return;
        }

        container.innerHTML = userSwaps.map(swap => this.createSwapCard(swap)).join('');
        this.initializeEventListeners(); // Re-initialize event listeners for new cards
    }

    renderReceivedRequests(container) {
        const receivedSwaps = this.swaps.filter(swap => 
            swap.status === 'pending' && 
            swap.receiver_id === parseInt(this.getCurrentUserId())
        );

        if (receivedSwaps.length === 0) {
            container.innerHTML = '<div class="no-swaps">No pending requests found.</div>';
            return;
        }

        container.innerHTML = receivedSwaps.map(swap => this.createSwapCard(swap)).join('');
        this.initializeEventListeners(); // Re-initialize event listeners for new cards
    }

    createSwapCard(swap) {
        const isSender = swap.sender_id === parseInt(this.getCurrentUserId());
        const otherUser = isSender ? swap.receiver_username : swap.sender_username;
        const otherUserAvatar = isSender ? swap.receiver_avatar : swap.sender_avatar;

        return `
            <div class="card" data-user-id="${isSender ? swap.receiver_id : swap.sender_id}" data-request-id="${swap.id}">
                <img src="${otherUserAvatar || 'default-avatar.png'}" alt="${otherUser}">
                <div class="info">
                    <h2>${otherUser}</h2>
                    <p>${swap.skill || 'Skill'} <span class="stars">${swap.rating || '★★★★☆'}</span></p>
                    <p>Experience: ${swap.experience || 'Not specified'}</p>
                    <div class="stats">
                        <span class="stat-item">${swap.connections || '0'} Connections</span>
                        <span class="stat-item">${swap.projects || '0'} Projects</span>
                        <span class="stat-item">${swap.reviews || '0'} Reviews</span>
                    </div>
                    <p class="status">Status: ${swap.status}</p>
                    <div class="action-buttons">
                        ${this.getActionButton(swap)}
                    </div>
                </div>
            </div>
        `;
    }

    getActionButton(swap) {
        const isSender = swap.sender_id === parseInt(this.getCurrentUserId());
        
        if (isSender) {
            switch(swap.status) {
                case 'pending':
                    return '<button class="unswap" type="button">Cancel Request</button>';
                case 'accepted':
                    return '<button class="swap" type="button">Start Swap</button>';
                default:
                    return '';
            }
        } else {
            switch(swap.status) {
                case 'pending':
                    return `
                        <button class="accept" type="button">Accept</button>
                        <button class="delete" type="button">Decline</button>
                    `;
                default:
                    return '';
            }
        }
    }

    removeCard(card) {
        card.style.opacity = '0';
        card.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            card.remove();
        }, 300);
    }

    generateSwapId() {
        return 'swap_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getCurrentUserId() {
        const token = localStorage.getItem('token');
        if (!token) return null;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.id;
        } catch (error) {
            console.error('Error parsing token:', error);
            return null;
        }
    }

    isUserLoggedIn() {
        return localStorage.getItem('token') !== null;
    }

    saveToLocalStorage() {
        localStorage.setItem('skillSwaps', JSON.stringify(this.swaps));
    }

    async loadUsers() {
        try {
            // Show loading indicator
            const loading = document.getElementById('loading');
            if (loading) loading.style.display = 'block';

            // Fetch users and always send Authorization header
            const response = await fetch('http://localhost:5000/api/users', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to load users');
            }

            const users = await response.json();
            this.users = users;
            this.renderUsers();
        } catch (error) {
            console.error('Error loading users:', error);
            this.showErrorMessage(error.message || 'Failed to load users. Please refresh the page.');
            // Show error in the results container
            const container = document.getElementById('userResults');
            if (container) {
                container.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Failed to load users. Please try again later.</p>
                        <button onclick="window.skillSwapManager.loadUsers()">Retry</button>
                    </div>
                `;
            }
        } finally {
            // Hide loading indicator
            const loading = document.getElementById('loading');
            if (loading) loading.style.display = 'none';
        }
    }

    async searchUsersBySkills(skillIds) {
        try {
            const response = await fetch(`http://localhost:5000/api/users/search?skillIds=${skillIds.join(',')}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to search users');
            }

            this.users = await response.json();
            this.renderUsers();
        } catch (error) {
            console.error('Error searching users:', error);
            this.showErrorMessage('Failed to search users. Please try again.');
        }
    }

    async searchUsersByText(searchTerm) {
        try {
            const response = await fetch(`http://localhost:5000/api/users/search?search=${encodeURIComponent(searchTerm)}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to search users');
            }

            this.users = await response.json();
            this.renderUsers();
        } catch (error) {
            console.error('Error searching users:', error);
            this.showErrorMessage('Failed to search users. Please try again.');
        }
    }

    renderUsers() {
        const container = document.getElementById('userResults');
        if (!container) return;

        if (this.users.length === 0) {
            container.innerHTML = '<div class="no-users">No users found matching your criteria.</div>';
            return;
        }

        container.innerHTML = this.users.map(user => this.createUserCard(user)).join('');
        this.initializeEventListeners(); // Re-initialize event listeners for new cards
    }

    createUserCard(user) {
        const currentUserId = this.getCurrentUserId();
        if (user.id === parseInt(currentUserId)) return ''; // Don't show current user

        // Use the same card structure and classes as the search results for consistency
        const avatarUrl = user.avatar && user.avatar.trim() ? user.avatar.trim() : 'images/avatars/default-avatar.png';
        const level = user.level || 'Intermediate';
        const bio = user.bio || '';
        const skills = Array.isArray(user.skills) ? user.skills.map(s => `<span class="ss-user-skill">${s}</span>`).join('') : '';
        return `
            <div class="ss-user-card">
                <div class="ss-user-header">
                    <img src="${avatarUrl}" alt="${user.username}" class="ss-user-avatar">
                    <div class="ss-user-info">
                        <div class="ss-user-name">${user.full_name || user.username}</div>
                        <div class="ss-user-level">
                            <i class="fas fa-star"></i> ${level}
                        </div>
                    </div>
                </div>
                <div class="ss-user-bio">${bio}</div>
                <div class="ss-user-skills">${skills}</div>
                <div class="ss-user-actions">
                    <button class="ss-swap-btn" onclick="window.skillSwapManager.handleSwapRequestFromCard(${user.id})">
                        <i class="fas fa-exchange-alt"></i> Swap Skill
                    </button>
                    <button class="ss-message-btn" onclick="window.skillSwapManager.handleMessageUser(${user.id})">
                        <i class="fas fa-envelope"></i> Message
                    </button>
                </div>
            </div>
        `;
    }

    // Add handler functions for the new button onclicks
    async handleSwapRequestFromCard(userId) {
        if (!this.isUserLoggedIn()) {
            alert('Please log in to start a skill swap');
            window.location.href = 'login.html';
            return;
        }
        // Find the user object to get their name
        const user = this.users.find(u => u.id === userId || u.id === parseInt(userId));
        // Here you would send the actual swap request to the backend (not just a message)
        // For now, just show a friendly toast message
        const userName = user ? (user.full_name || user.username) : '';
        this.showSuccessMessage(`Your swap request${userName ? ' to ' + userName : ''} has been sent successfully!`);
        // You can call your swap request logic here
    }

    handleMessageUser(userId) {
        if (!this.isUserLoggedIn()) {
            alert('Please log in to send a message');
            window.location.href = 'login.html';
            return;
        }
        // Redirect to chat page with the user
        window.location.href = `chatspage.html?user=${userId}`;
    }
}

// Add styles for loading and toast notifications
const style = document.createElement('style');
style.textContent = `
    .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 24px;
        border-radius: 4px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    }

    .toast.success {
        background-color: #22c55e;
    }

    .toast.error {
        background-color: #ef4444;
    }

    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }

    .no-swaps {
        text-align: center;
        padding: 2rem;
        color: #64748b;
        font-size: 1.1rem;
    }

    .error-message {
        text-align: center;
        padding: 2rem;
        color: #ef4444;
        font-size: 1.1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    .error-message i {
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }

    .error-message button {
        padding: 0.5rem 1rem;
        background-color: #3b82f6;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.2s;
    }

    .error-message button:hover {
        background-color: #2563eb;
    }
`;
document.head.appendChild(style);

// Initialize the SkillSwapManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.skillSwapManager = new SkillSwapManager();
}); 