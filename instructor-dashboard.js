function showNotification(message, type = 'info') {
    alert(`[${type.toUpperCase()}] ${message}`);
}

class InstructorDashboard {
    constructor() {
        this.dashboardData = null;
        this.certifications = [];
        this.availability = [];
        this.privateLessons = [];
        this.consultations = [];
        this.earnings = [];
        this.tutorials = [];
        this.reviews = [];
        this.profile = {};
        this.instructorProfile = {};
        
        // Initialize dashboard
        this.init();
    }

    async init() {
        // Check if user is instructor
        if (!auth.isInstructor()) {
            // Instead of redirecting, show a message in the dashboard
            const dashboardContent = document.querySelector('.dashboard-content');
            if (dashboardContent) {
                dashboardContent.innerHTML = '<div class="not-instructor-message" style="padding:2rem;text-align:center;color:red;font-size:1.5rem;">Access denied. You must be logged in as an instructor to view this page.</div>';
            }
            return;
        }

        // Render user info at the top
        await this.renderUserInfo();

        // Load all dashboard data
        await this.loadDashboardData();
        await this.loadCertifications();
        await this.loadAvailability();
        await this.loadPrivateLessons();
        await this.loadConsultations();
        await this.loadEarnings();

        // Initialize event listeners
        this.initEventListeners();
    }

    async loadDashboardData() {
        try {
            const response = await fetch('/api/instructor/dashboard', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            this.dashboardData = await response.json();
            // Assign all new data arrays for UI updates
            this.earnings = this.dashboardData.earnings || [];
            this.certifications = this.dashboardData.certifications || [];
            this.availability = this.dashboardData.availability || [];
            this.privateLessons = this.dashboardData.privateLessons || [];
            this.consultations = this.dashboardData.consultations || [];
            this.tutorials = this.dashboardData.tutorials || [];
            this.reviews = this.dashboardData.reviews || [];
            this.profile = this.dashboardData.profile || {};
            this.instructorProfile = this.dashboardData.instructorProfile || {};
            this.updateDashboardUI();
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            showNotification('Failed to load dashboard data', 'error');
        }
    }

    async loadCertifications() {
        try {
            const response = await fetch('/api/instructor/certifications', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            this.certifications = await response.json();
            this.updateCertificationsUI();
        } catch (error) {
            console.error('Failed to load certifications:', error);
            showNotification('Failed to load certifications', 'error');
        }
    }

    async loadAvailability() {
        try {
            const response = await fetch('/api/instructor/availability', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            this.availability = await response.json();
            this.updateAvailabilityUI();
        } catch (error) {
            console.error('Failed to load availability:', error);
            showNotification('Failed to load availability', 'error');
        }
    }

    async loadPrivateLessons() {
        try {
            const response = await fetch('/api/instructor/private-lessons', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            this.privateLessons = await response.json();
            this.updatePrivateLessonsUI();
        } catch (error) {
            console.error('Failed to load private lessons:', error);
            showNotification('Failed to load private lessons', 'error');
        }
    }

    async loadConsultations() {
        try {
            const response = await fetch('/api/instructor/consultations', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            this.consultations = await response.json();
            this.updateConsultationsUI();
        } catch (error) {
            console.error('Failed to load consultations:', error);
            showNotification('Failed to load consultations', 'error');
        }
    }

    async loadEarnings() {
        try {
            const response = await fetch('/api/instructor/earnings', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            this.earnings = await response.json();
            this.updateEarningsUI();
        } catch (error) {
            console.error('Failed to load earnings:', error);
            showNotification('Failed to load earnings', 'error');
        }
    }

    updateDashboardUI() {
        // Update stats
        document.getElementById('total-earnings').textContent = `$${(this.earnings.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)).toFixed(2)}`;
        document.getElementById('total-students').textContent = this.privateLessons.length;
        document.getElementById('total-tutorials').textContent = this.tutorials.length;

        // Update recent reviews
        const reviewsContainer = document.getElementById('recent-reviews');
        reviewsContainer.innerHTML = this.reviews.slice(0, 5).map(review => `
            <div class="review-card">
                <div class="review-header">
                    <img src="${review.student_avatar || '/images/default-avatar.png'}" alt="${review.student_name || ''}" class="student-avatar">
                    <div class="review-info">
                        <h4>${review.student_name || ''}</h4>
                        <div class="rating">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div>
                    </div>
                </div>
                <p class="review-comment">${review.review_text || review.comment || ''}</p>
                <span class="review-date">${review.created_at ? new Date(review.created_at).toLocaleDateString() : ''}</span>
            </div>
        `).join('');

        // Update upcoming lessons
        const lessonsContainer = document.getElementById('upcoming-lessons');
        lessonsContainer.innerHTML = this.privateLessons.slice(0, 5).map(lesson => `
            <div class="lesson-card">
                <h4>${lesson.title}</h4>
                <p>${lesson.description}</p>
                <div class="lesson-info">
                    <span class="student">Student: ${lesson.student_name || ''}</span>
                    <span class="time">${lesson.start_time ? new Date(lesson.start_time).toLocaleString() : ''}</span>
                    <span class="price">$${lesson.price}</span>
                </div>
            </div>
        `).join('');
    }

    updateCertificationsUI() {
        const container = document.getElementById('certifications-list');
        container.innerHTML = this.certifications.map(cert => `
            <div class="certification-card">
                <h4>${cert.certification_name}</h4>
                <p>Issued by: ${cert.issuing_organization}</p>
                <p>Issue Date: ${new Date(cert.issue_date).toLocaleDateString()}</p>
                ${cert.expiry_date ? `<p>Expiry Date: ${new Date(cert.expiry_date).toLocaleDateString()}</p>` : ''}
                ${cert.credential_url ? `<a href="${cert.credential_url}" target="_blank">View Credential</a>` : ''}
            </div>
        `).join('');
    }

    updateAvailabilityUI() {
        const container = document.getElementById('availability-list');
        container.innerHTML = this.availability.map(avail => `
            <div class="availability-card ${avail.is_available ? 'available' : 'unavailable'}">
                <h4>${avail.day_of_week}</h4>
                <p>${avail.start_time} - ${avail.end_time}</p>
                <span class="status">${avail.is_available ? 'Available' : 'Unavailable'}</span>
            </div>
        `).join('');
    }

    updatePrivateLessonsUI() {
        const container = document.getElementById('private-lessons-list');
        container.innerHTML = this.privateLessons.map(lesson => `
            <div class="lesson-card">
                <h4>${lesson.title}</h4>
                <p>${lesson.description}</p>
                <div class="lesson-info">
                    <span class="student">Student: ${lesson.student_name}</span>
                    <span class="time">${new Date(lesson.start_time).toLocaleString()}</span>
                    <span class="price">$${lesson.price}</span>
                </div>
            </div>
        `).join('');
    }

    updateConsultationsUI() {
        const container = document.getElementById('consultations-list');
        container.innerHTML = this.consultations.map(consult => `
            <div class="consultation-card">
                <h4>${consult.topic}</h4>
                <p>${consult.description}</p>
                <div class="consultation-info">
                    <span class="student">Student: ${consult.student_name}</span>
                    <span class="date">${new Date(consult.preferred_date).toLocaleDateString()}</span>
                    <span class="time">${consult.preferred_time}</span>
                    <span class="duration">${consult.duration} minutes</span>
                    <span class="price">$${consult.price}</span>
                </div>
                <div class="consultation-actions">
                    <button onclick="instructorDashboard.updateConsultationStatus(${consult.id}, 'accepted')" 
                            class="btn-accept" ${consult.status !== 'pending' ? 'disabled' : ''}>
                        Accept
                    </button>
                    <button onclick="instructorDashboard.updateConsultationStatus(${consult.id}, 'rejected')"
                            class="btn-reject" ${consult.status !== 'pending' ? 'disabled' : ''}>
                        Reject
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateEarningsUI() {
        const container = document.getElementById('earnings-list');
        container.innerHTML = this.earnings.map(earning => `
            <div class="earning-card">
                <h4>${earning.source_title}</h4>
                <div class="earning-info">
                    <span class="amount">$${earning.amount}</span>
                    <span class="source">${earning.source}</span>
                    <span class="date">${new Date(earning.created_at).toLocaleDateString()}</span>
                    <span class="status">${earning.status}</span>
                </div>
            </div>
        `).join('');
    }

    async addCertification(certificationData) {
        try {
            const response = await fetch('/api/instructor/certifications', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(certificationData)
            });
            
            if (response.ok) {
                await this.loadCertifications();
                showNotification('Certification added successfully', 'success');
            } else {
                throw new Error('Failed to add certification');
            }
        } catch (error) {
            console.error('Failed to add certification:', error);
            showNotification('Failed to add certification', 'error');
        }
    }

    async addAvailability(availabilityData) {
        try {
            const response = await fetch('/api/instructor/availability', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(availabilityData)
            });
            
            if (response.ok) {
                await this.loadAvailability();
                showNotification('Availability added successfully', 'success');
            } else {
                throw new Error('Failed to add availability');
            }
        } catch (error) {
            console.error('Failed to add availability:', error);
            showNotification('Failed to add availability', 'error');
        }
    }

    async schedulePrivateLesson(lessonData) {
        try {
            const response = await fetch('/api/instructor/private-lessons', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(lessonData)
            });
            
            if (response.ok) {
                await this.loadPrivateLessons();
                showNotification('Private lesson scheduled successfully', 'success');
            } else {
                throw new Error('Failed to schedule private lesson');
            }
        } catch (error) {
            console.error('Failed to schedule private lesson:', error);
            showNotification('Failed to schedule private lesson', 'error');
        }
    }

    async updateConsultationStatus(consultationId, status) {
        try {
            const response = await fetch(`/api/instructor/consultations/${consultationId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });
            
            if (response.ok) {
                await this.loadConsultations();
                showNotification('Consultation status updated successfully', 'success');
            } else {
                throw new Error('Failed to update consultation status');
            }
        } catch (error) {
            console.error('Failed to update consultation status:', error);
            showNotification('Failed to update consultation status', 'error');
        }
    }

    initEventListeners() {
        // Add certification form
        document.getElementById('add-certification-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            this.addCertification({
                certification_name: formData.get('certification_name'),
                issuing_organization: formData.get('issuing_organization'),
                issue_date: formData.get('issue_date'),
                expiry_date: formData.get('expiry_date'),
                credential_url: formData.get('credential_url')
            });
        });

        // Add availability form
        document.getElementById('add-availability-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            this.addAvailability({
                day_of_week: formData.get('day_of_week'),
                start_time: formData.get('start_time'),
                end_time: formData.get('end_time'),
                is_available: formData.get('is_available') === 'true'
            });
        });

        // Schedule private lesson form
        document.getElementById('schedule-lesson-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            this.schedulePrivateLesson({
                student_id: formData.get('student_id'),
                title: formData.get('title'),
                description: formData.get('description'),
                start_time: formData.get('start_time'),
                end_time: formData.get('end_time'),
                price: formData.get('price')
            });
        });
    }

    async renderUserInfo() {
        // Fetch instructor profile from backend
        try {
            const response = await fetch('/api/instructor/profile', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch instructor profile');
            const user = await response.json();

            let userInfoSection = document.getElementById('instructor-user-info');
            if (!userInfoSection) {
                userInfoSection = document.createElement('div');
                userInfoSection.id = 'instructor-user-info';
                userInfoSection.className = 'user-info-section';
                const dashboardContent = document.querySelector('.dashboard-content');
                if (dashboardContent) {
                    dashboardContent.insertBefore(userInfoSection, dashboardContent.firstChild);
                }
            }
            userInfoSection.innerHTML = `
                <div class="user-info-card">
                    <img src="${user.avatar || 'images/profile-placeholder.jpg'}" alt="Avatar" class="user-avatar">
                    <div class="user-details">
                        <h2>${user.full_name || user.username || 'Instructor'}</h2>
                        <p><strong>Email:</strong> ${user.email || ''}</p>
                        <p><strong>Bio:</strong> ${user.bio || user.instructor_bio || ''}</p>
                        <p><strong>Specialization:</strong> ${user.specialization || ''}</p>
                        <p><strong>Years of Experience:</strong> ${user.years_of_experience || ''}</p>
                        <p><strong>Expertise Level:</strong> ${user.expertise_level || ''}</p>
                        <p><strong>Hourly Rate:</strong> ${user.hourly_rate ? '$' + user.hourly_rate : ''}</p>
                        <p><strong>Total Students:</strong> ${user.total_students || 0}</p>
                        <p><strong>Total Courses:</strong> ${user.total_courses || 0}</p>
                        <p><strong>Average Rating:</strong> ${user.average_rating || 0}</p>
                        <p><strong>Total Reviews:</strong> ${user.total_reviews || 0}</p>
                        <p><strong>Verified:</strong> ${user.is_verified ? 'Yes' : 'No'}</p>
                        <p><strong>Verification Date:</strong> ${user.verification_date ? new Date(user.verification_date).toLocaleDateString() : ''}</p>
                        <p><strong>Preferred Teaching Method:</strong> ${user.preferred_teaching_method || ''}</p>
                        <p><strong>Preferred Platform:</strong> ${user.preferred_teaching_platform || ''}</p>
                        <p><strong>Achievements:</strong> ${user.achievements || ''}</p>
                        <p><strong>Social Links:</strong> ${user.social_links || ''}</p>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Failed to load instructor profile:', error);
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.instructorDashboard = new InstructorDashboard();
}); 