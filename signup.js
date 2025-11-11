// signup.js - Clean, modern signup logic

// Utility: Show toast notification
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container') || (() => {
        const container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
        return container;
    })();
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Utility: Validate email
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Utility: Validate password
function validatePassword(password) {
    return password && password.length >= 6;
}

// Utility: Validate full name
function validateFullName(name) {
    return name && name.trim().length >= 2;
}

// Utility: Validate phone (simple)
function validatePhone(phone) {
    return phone && phone.trim().length >= 6;
}

// Utility: Validate location
function validateLocation(loc) {
    return loc && loc.trim().length > 0;
}

// Handle skills tag input
function getSelectedSkills() {
    const skillsTags = document.querySelectorAll('.skill-tag');
    return Array.from(skillsTags).map(tag => ({
        name: tag.textContent.trim(),
        level: 'Beginner',
        verified: false,
        experience: 0
    }));
}

// Main signup logic
async function handleSignupSubmit(e) {
    e.preventDefault();
    
    // Show loading state
    const submitBtn = e.target.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');
    btnText.style.display = 'none';
    btnSpinner.style.display = 'inline-block';
    submitBtn.disabled = true;
    
    try {
        // Get form data
        const formData = new FormData(e.target);
        const skills = getSelectedSkills();
        
        // Add skills to formData
        formData.append('skills', JSON.stringify(skills));

        // Validate required files
        const profilePic = formData.get('avatar');
        if (!profilePic || !profilePic.size) {
            throw new Error('Profile picture is required');
        }

        // Validate file sizes
        if (profilePic.size > 2 * 1024 * 1024) {
            throw new Error('Profile picture must be less than 2MB');
        }

        const resume = formData.get('resume');
        if (resume && resume.size > 5 * 1024 * 1024) {
            throw new Error('Resume must be less than 5MB');
        }

        const response = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            body: formData
        });

        const contentType = response.headers.get('content-type');
        let data;
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            throw new Error('Server error: ' + text);
        }

        if (!response.ok) {
            if (data.error === 'Email already exists') {
                throw new Error('This email is already registered. Please use a different email or try logging in.');
            } else {
                throw new Error(data.error || 'Registration failed. Please try again.');
            }
        }

        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Show success message
        showToast('Registration successful! Redirecting...', 'success');

        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);

    } catch (error) {
        console.error('Registration error:', error);
        showToast(error.message || 'Registration failed. Please try again.', 'error');
    } finally {
        // Reset button state
        if (submitBtn) {
            btnText.style.display = 'inline-block';
            btnSpinner.style.display = 'none';
            submitBtn.disabled = false;
        }
    }
}

// Multi-step form logic
window.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.querySelector('.signup-form');
    if (!signupForm) return;

    const steps = Array.from(signupForm.querySelectorAll('.form-step'));
    const stepperSteps = Array.from(document.querySelectorAll('.signup-stepper .step'));
    const progressFill = document.querySelector('.signup-progress-fill');
    const nextBtn = signupForm.querySelector('.next-step');
    const prevBtn = signupForm.querySelector('.prev-step');
    const submitBtn = signupForm.querySelector('.submit-btn');
    let currentStep = 0;

    function showStep(idx) {
        steps.forEach((step, i) => step.classList.toggle('active', i === idx));
        stepperSteps.forEach((step, i) => step.classList.toggle('active', i === idx));
        if (progressFill) progressFill.style.width = ((idx + 1) / steps.length * 100) + '%';
        if (prevBtn) prevBtn.style.display = idx === 0 ? 'none' : '';
        if (nextBtn) nextBtn.style.display = idx === steps.length - 1 ? 'none' : '';
        if (submitBtn) submitBtn.style.display = idx === steps.length - 1 ? '' : 'none';
    }

    function validateStep(idx) {
        const form = document.querySelector('.signup-form');
        if (!form) return false;

        // Basic validation for each step
        if (idx === 0) {
            const fullName = form.querySelector('#fullName').value.trim();
            const email = form.querySelector('#email').value.trim();
            const password = form.querySelector('#password').value;
            const confirmPassword = form.querySelector('#confirmPassword').value;

            if (!validateFullName(fullName)) {
                showToast('Please enter your full name (at least 2 characters).', 'error');
                return false;
            }
            if (!validateEmail(email)) {
                showToast('Please enter a valid email address.', 'error');
                return false;
            }
            if (!validatePassword(password)) {
                showToast('Password must be at least 6 characters.', 'error');
                return false;
            }
            if (password !== confirmPassword) {
                showToast('Passwords do not match.', 'error');
                return false;
            }
        } else if (idx === 1) {
            const phone = form.querySelector('#phone').value.trim();
            const location = form.querySelector('#location').value.trim();
            const bio = form.querySelector('#bio').value.trim();

            if (!validatePhone(phone)) {
                showToast('Please enter a valid phone number.', 'error');
                return false;
            }
            if (!validateLocation(location)) {
                showToast('Please enter your location.', 'error');
                return false;
            }
            if (bio && bio.length > 500) {
                showToast('Bio must be less than 500 characters.', 'error');
                return false;
            }
        } else if (idx === 2) {
            const terms = form.querySelector('input[name="terms"]');
            const skills = getSelectedSkills();
            const resume = form.querySelector('#resume').files[0];

            if (!terms.checked) {
                showToast('You must agree to the Terms & Conditions and Privacy Policy.', 'error');
                return false;
            }

            if (skills.length === 0 && !resume) {
                showToast('Please add at least one skill or upload a resume.', 'error');
                return false;
            }
        } else if (idx === 3) {
            const profilePic = form.querySelector('#profilePicture').files[0];
            if (!profilePic) {
                showToast('Please upload a profile picture.', 'error');
                return false;
            }

            // Validate file type
            if (!profilePic.type.startsWith('image/')) {
                showToast('Please upload an image file.', 'error');
                return false;
            }

            // Validate file size
            if (profilePic.size > 2 * 1024 * 1024) {
                showToast('Profile picture must be less than 2MB.', 'error');
                return false;
            }
        }
        return true;
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (validateStep(currentStep)) {
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    showStep(currentStep);
                }
            }
        });
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (currentStep > 0) {
                currentStep--;
                showStep(currentStep);
            }
        });
    }
    showStep(currentStep);
});

// Skills tag input logic
window.addEventListener('DOMContentLoaded', () => {
    const skillsInput = document.getElementById('skills-input');
    const suggestions = document.getElementById('skills-suggestions');
    const tagsContainer = document.getElementById('skills-tags');
    const skillsListInput = document.getElementById('skillsList');
    if (!skillsInput || !suggestions || !tagsContainer || !skillsListInput) return;
    let selectedSkills = [];

    function updateTags() {
        tagsContainer.innerHTML = '';
        selectedSkills.forEach(skill => {
            const tag = document.createElement('span');
            tag.className = 'skill-tag';
            tag.textContent = skill.name;
            
            const remove = document.createElement('span');
            remove.className = 'remove-tag';
            remove.innerHTML = '&times;';
            remove.onclick = () => {
                selectedSkills = selectedSkills.filter(s => s.name !== skill.name);
                updateTags();
            };
            tag.appendChild(remove);
            tagsContainer.appendChild(tag);
        });
        skillsListInput.value = JSON.stringify(selectedSkills);
    }

    skillsInput.addEventListener('focus', () => {
        suggestions.style.display = 'block';
    });

    skillsInput.addEventListener('blur', () => {
        setTimeout(() => { suggestions.style.display = 'none'; }, 150);
    });

    skillsInput.addEventListener('input', () => {
        const val = skillsInput.value.toLowerCase();
        Array.from(suggestions.children).forEach(li => {
            li.style.display = li.textContent.toLowerCase().includes(val) ? '' : 'none';
        });
        suggestions.style.display = 'block';
    });

    skillsInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && skillsInput.value.trim()) {
            e.preventDefault();
            const skill = skillsInput.value.trim();
            if (skill && !selectedSkills.some(s => s.name.toLowerCase() === skill.toLowerCase())) {
                selectedSkills.push({
                    name: skill,
                    level: 'Beginner',
                    verified: false,
                    experience: 0
                });
                updateTags();
            }
            skillsInput.value = '';
        }
    });

    // Event delegation for skill selection
    suggestions.addEventListener('mousedown', function(e) {
        if (e.target && e.target.tagName === 'LI') {
            const skillName = e.target.textContent;
            if (!selectedSkills.some(s => s.name === skillName)) {
                selectedSkills.push({
                    name: skillName,
                    level: 'Beginner',
                    verified: false
                });
                updateTags();
            }
            skillsInput.value = '';
            suggestions.style.display = 'none';
        }
    });
});

// Resume and profile picture upload logic
window.addEventListener('DOMContentLoaded', () => {
    // Resume
    const resumeInput = document.getElementById('resume');
    const resumeFileName = document.getElementById('resume-file-name');
    if (resumeInput && resumeFileName) {
        resumeInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                // Validate file type
                const allowedTypes = ['.pdf', '.doc', '.docx'];
                const ext = file.name.split('.').pop().toLowerCase();
                if (!allowedTypes.includes('.' + ext)) {
                    showToast('Please upload a PDF or Word document', 'error');
                    this.value = '';
                    resumeFileName.textContent = 'No file chosen';
                    return;
                }
                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    showToast('File size should be less than 5MB', 'error');
                    this.value = '';
                    resumeFileName.textContent = 'No file chosen';
                    return;
                }
                resumeFileName.textContent = file.name;
            } else {
                resumeFileName.textContent = 'No file chosen';
            }
        });
    }
    // Profile Picture
    const profileInput = document.getElementById('profilePicture');
    const profileFileName = document.getElementById('profile-file-name');
    const profilePreview = document.querySelector('.profile-preview');
    if (profileInput && profileFileName) {
        profileInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    showToast('Please upload an image file', 'error');
                    this.value = '';
                    profileFileName.textContent = 'No file chosen';
                    if (profilePreview) profilePreview.innerHTML = '<i class="fas fa-user-circle"></i><span>Preview</span>';
                    return;
                }
                // Validate file size (max 2MB)
                if (file.size > 2 * 1024 * 1024) {
                    showToast('Image size should be less than 2MB', 'error');
                    this.value = '';
                    profileFileName.textContent = 'No file chosen';
                    if (profilePreview) profilePreview.innerHTML = '<i class="fas fa-user-circle"></i><span>Preview</span>';
                    return;
                }
                profileFileName.textContent = file.name;
                // Preview image
                const reader = new FileReader();
                reader.onload = function(e) {
                    if (profilePreview) profilePreview.innerHTML = `<img src="${e.target.result}" alt="Profile Preview">`;
                };
                reader.readAsDataURL(file);
            } else {
                profileFileName.textContent = 'No file chosen';
                if (profilePreview) profilePreview.innerHTML = '<i class="fas fa-user-circle"></i><span>Preview</span>';
            }
        });
    }
});

// Fetch all skills from backend and populate suggestions
window.addEventListener('DOMContentLoaded', () => {
    const suggestions = document.getElementById('skills-suggestions');
    if (!suggestions) return;
    fetch('http://localhost:5000/api/skills')
        .then(res => res.json())
        .then(skills => {
            suggestions.innerHTML = '';
            skills.forEach(skill => {
                const li = document.createElement('li');
                li.textContent = skill.name;
                suggestions.appendChild(li);
            });
        })
        .catch(err => {
            console.error('Failed to load skills:', err);
        });
});

// Attach handler on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.querySelector('.signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignupSubmit);
    }
}); 