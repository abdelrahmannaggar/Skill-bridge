// frontend/js/profile.js

// Fallback showToast if not defined
if (typeof showToast !== 'function') {
    function showToast(msg, type) {
        alert(msg);
    }
}

// Helper: Get user ID from URL if you want to view other users' profiles
function getUserIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id'); // e.g. profilepage.html?id=7
}

async function fetchUserProfile(userId = null) {
    try {
        const user = await api.getProfile();
        console.log('Received profile data:', user); // Debug log
        renderProfile(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        document.getElementById('profile-name').textContent = 'Error loading profile';
        showToast('Error loading profile data. Please try again later.', 'error');
    }
}

function renderProfile(user) {
    console.log('Rendering profile with data:', user); // Debug log

    // Basic profile information
    document.getElementById('profile-name').textContent = user.full_name || user.username || 'User';
    document.getElementById('profile-username').textContent = '@' + (user.username || '');
    document.getElementById('profile-email').textContent = user.email || 'Not provided';
    document.getElementById('profile-location').textContent = user.location || 'Not provided';
    document.getElementById('profile-occupation').textContent = user.occupation || 'Not specified';
    document.getElementById('profile-bio').textContent = user.bio || 'No bio available';
    
    // Profile stats
    document.getElementById('profile-rating').textContent = (user.average_rating || 0).toFixed(1);
    document.getElementById('profile-connections').textContent = user.total_reviews || '0';
    
    // Member since
    if (user.created_at) {
        const joinDate = new Date(user.created_at);
        document.getElementById('profile-member-since').textContent = joinDate.getFullYear();
    }

    // Profile picture
    const profileAvatar = document.getElementById('profile-avatar');
    if (user.avatar) {
        // If the avatar is a relative path, prepend the backend URL
        const avatarUrl = user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`;
        profileAvatar.src = avatarUrl;
        profileAvatar.onerror = function() {
            // If the image fails to load, use the default avatar
            this.src = './Images/avatars/avatar1.jpg';
        };
    } else {
        // Use default avatar if no avatar is set
        profileAvatar.src = './Images/avatars/avatar1.jpg';
    }

    // Skills
    if (user.skills && Array.isArray(user.skills)) {
        displaySkills(user.skills);
    } else {
        console.warn('No skills data or invalid format:', user.skills);
        displaySkills([]);
    }

    // Reviews
    if (user.reviews && Array.isArray(user.reviews)) {
        displayReviews(user.reviews);
    } else {
        console.warn('No reviews data or invalid format:', user.reviews);
        displayReviews([]);
    }

    // Activity log
    if (user.activity_log && Array.isArray(user.activity_log)) {
        displayActivity(user.activity_log);
    } else {
        console.warn('No activity log data or invalid format:', user.activity_log);
        displayActivity([]);
    }

    // Certifications
    if (user.certifications && Array.isArray(user.certifications)) {
        displayCertifications(user.certifications);
    } else {
        console.warn('No certifications data or invalid format:', user.certifications);
        displayCertifications([]);
    }
}

// Helper function to display skills
function displaySkills(skills) {
    const skillsContainer = document.querySelector('.skills-container');
    if (!skillsContainer) return;

    skillsContainer.innerHTML = '<h3>Skills</h3>';
    const skillsList = document.createElement('div');
    skillsList.className = 'skills-list';

    if (!Array.isArray(skills)) {
        console.warn('Skills data is not an array:', skills);
        return;
    }

    if (skills.length === 0) {
        const noSkills = document.createElement('p');
        noSkills.textContent = 'No skills added yet';
        noSkills.className = 'no-skills';
        skillsContainer.appendChild(noSkills);
        return;
    }

    skills.forEach(skill => {
        const skillElement = document.createElement('div');
        skillElement.className = 'skill-item';
        skillElement.innerHTML = `
            <span class="skill-name">${skill.name || skill}</span>
            ${skill.level ? `
                <div class="skill-level">
                    <div class="skill-progress" style="width: ${getLevelPercentage(skill.level)}%"></div>
                </div>
                <span class="skill-level-text">${skill.level}</span>
            ` : ''}
        `;
        skillsList.appendChild(skillElement);
    });

    skillsContainer.appendChild(skillsList);
}

// Helper function to convert skill level to percentage
function getLevelPercentage(level) {
    switch(level?.toLowerCase()) {
        case 'expert':
            return 100;
        case 'advanced':
            return 75;
        case 'intermediate':
            return 50;
        case 'beginner':
            return 25;
        default:
            return 0;
    }
}

// Helper function to display reviews
function displayReviews(reviews) {
    const reviewsContainer = document.querySelector('.reviews-container');
    if (!reviewsContainer) return;

    reviewsContainer.innerHTML = '<h3>Reviews</h3>';
    const reviewsList = document.createElement('div');
    reviewsList.className = 'reviews-list';

    reviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review-item';
        reviewElement.innerHTML = `
            <div class="review-header">
                <img src="${review.reviewer_avatar || 'images/default-avatar.png'}" alt="${review.reviewer_name}" class="reviewer-avatar">
                <div class="reviewer-info">
                    <span class="reviewer-name">${review.reviewer_name}</span>
                    <div class="review-rating">
                        ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                    </div>
                </div>
                <span class="review-date">${new Date(review.created_at).toLocaleDateString()}</span>
            </div>
            <p class="review-comment">${review.comment}</p>
        `;
        reviewsList.appendChild(reviewElement);
    });

    reviewsContainer.appendChild(reviewsList);
}

// Helper function to display activity
function displayActivity(activityLog) {
    const activityTimeline = document.querySelector('.activity-timeline');
    if (!activityTimeline) return;

    activityTimeline.innerHTML = '<h3>Activity History</h3>';
    
    activityLog.forEach(activity => {
        const activityElement = document.createElement('div');
        activityElement.className = 'activity-item';
        activityElement.innerHTML = `
            <i class="fas fa-${getActivityIcon(activity.type)}"></i>
            <div class="activity-content">
                <h3>${activity.details}</h3>
                <p>${activity.type}</p>
                <span class="activity-date">${new Date(activity.timestamp).toLocaleDateString()}</span>
            </div>
        `;
        activityTimeline.appendChild(activityElement);
    });
}

// Helper function to display certifications
function displayCertifications(certifications) {
    const certificationsContainer = document.querySelector('.certifications-container');
    if (!certificationsContainer) return;

    certificationsContainer.innerHTML = '<h3>Certifications</h3>';
    const certList = document.createElement('ul');
    certList.className = 'certifications-list';

    certifications.forEach(cert => {
        const certItem = document.createElement('li');
        certItem.innerHTML = `
            <i class="fas fa-certificate"></i>
            ${cert.name} (${cert.year})
        `;
        certList.appendChild(certItem);
    });

    certificationsContainer.appendChild(certList);
}

// Helper function to get activity icon
function getActivityIcon(type) {
    const icons = {
        'login': 'sign-in-alt',
        'tutorial_completed': 'check-circle',
        'tutorial_view': 'eye',
        'default': 'circle'
    };
    return icons[type] || icons.default;
}

document.addEventListener('DOMContentLoaded', function() {
    const userId = getUserIdFromUrl();
    fetchUserProfile(userId);

    const editBtn = document.getElementById('editProfileBtn');
    const editModal = document.getElementById('editProfileModal');
    const editProfileForm = document.getElementById('editProfileForm');
    const closeEditModal = document.getElementById('closeEditModal');
    const cancelEditModal = document.getElementById('cancelEditModal');

    // Open modal and pre-fill form
    if (editBtn && editModal && editProfileForm) {
        editBtn.addEventListener('click', function() {
            editProfileForm.fullName.value = document.getElementById('profile-name').textContent || '';
            editProfileForm.email.value = document.getElementById('profile-email').textContent || '';
            editProfileForm.location.value = document.getElementById('profile-location').textContent || '';
            editProfileForm.occupation.value = document.getElementById('profile-occupation').textContent || '';
            editProfileForm.bio.value = document.getElementById('profile-bio').textContent || '';
            editModal.style.display = 'block';
        });
    }

    // Close modal
    if (closeEditModal && editModal) {
        closeEditModal.addEventListener('click', function() {
            editModal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === editModal) {
            editModal.style.display = 'none';
        }
    });

    // Handle form submission
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = 'login.html';
                return;
            }
            const userData = {
                fullName: editProfileForm.fullName.value,
                email: editProfileForm.email.value,
                location: editProfileForm.location.value,
                occupation: editProfileForm.occupation.value,
                bio: editProfileForm.bio.value
            };
            console.log('Submitting profile update with data:', userData); // Debug log
            try {
                const response = await fetch('http://localhost:5000/api/users/profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(userData)
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Server error response:', errorData); // Debug log
                    throw new Error('Failed to update profile');
                }
                const updatedUser = await response.json();
                console.log('Received updated user data:', updatedUser); // Debug log
                renderProfile(updatedUser);
                editModal.style.display = 'none';
                alert('Profile updated successfully!');
            } catch (error) {
                console.error('Error updating profile:', error);
                alert('Error updating profile. Please try again.');
            }
        });
    }

    // Close modal when cancel button is clicked
    if (cancelEditModal && editModal) {
        cancelEditModal.addEventListener('click', function() {
            editModal.style.display = 'none';
        });
    }
}); 