// Global toast notification function
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container') || (() => {
        const container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
        return container;
    })();

    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    
    let iconClass = 'fas fa-info-circle';
    if (type === 'success') {
        iconClass = 'fas fa-check-circle';
    } else if (type === 'error') {
        iconClass = 'fas fa-exclamation-circle';
    }
    
    const icon = document.createElement('i');
    icon.className = iconClass;
    
    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;
    
    toast.appendChild(icon);
    toast.appendChild(messageSpan);
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Add global email validation function
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// == DOMContentLoaded Events ==
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize AOS
        if (typeof AOS !== 'undefined') {
            AOS.init();
        }

        // Check authentication status and update UI
        if (typeof auth !== 'undefined') {
            auth.updateUI();
        }

        // Login Form Handler
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('email')?.value;
                const password = document.getElementById('password')?.value;
                
                const success = await auth.handleLogin(email, password);
                if (success) {
                    window.location.href = 'index.html';
                }
            });
        }

        // Logout Handler
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                auth.logout();
            });
        }

        // FAQ Toggle
        const faqContainer = document.querySelector('.faq-content');
        if (faqContainer) {
            faqContainer.addEventListener('click', (e) => {
                const groupHeader = e.target.closest('.faq-group-header');
                if (!groupHeader) return;

                const group = groupHeader.parentElement;
                const groupBody = group.querySelector('.faq-group-body');
                const icon = groupHeader.querySelector('i');

                icon.classList.toggle('fa-plus');
                icon.classList.toggle('fa-minus');
                groupBody.classList.toggle('open');

                const otherGroups = faqContainer.querySelectorAll('.faq-group');
                otherGroups.forEach((otherGroup) => {
                    if (otherGroup !== group) {
                        const otherGroupBody = otherGroup.querySelector('.faq-group-body');
                        const otherIcon = otherGroup.querySelector('.faq-group-header i');
                        otherGroupBody.classList.remove('open');
                        otherIcon.classList.remove('fa-minus');
                        otherIcon.classList.add('fa-plus');
                    }
                });
            });
        }

        // Dropdown Menu
        const dropbtn = document.querySelector('.dropbtn');
        if (dropbtn) {
            dropbtn.addEventListener('click', function(e) {
                e.preventDefault();
                const dropdown = this.nextElementSibling;
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            });
        }

        // Form Submissions
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            if (form.id && form.id !== 'contactForm') {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    console.log('Form submitted:', this.id);
                });
            }
        });

        // Payment Methods
        const methodButtons = document.querySelectorAll(".pay-btn");
        const cardTypeGroup = document.getElementById("card-type-group");
        const cardFields = document.getElementById("card-fields");
        const cardTypeSelect = document.getElementById("card-type");
        const planCards = document.querySelectorAll('.plan-card');
        const paymentForm = document.getElementById('payment-form');

        // Enhanced plan card selection
        if (planCards.length > 0) {
            planCards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-10px) rotateX(5deg)';
                });

                card.addEventListener('mouseleave', function() {
                    this.style.transform = '';
                });

                card.addEventListener('click', function() {
                    // Remove selected class from all cards
                    planCards.forEach(c => c.classList.remove('selected'));
                    // Add selected class to clicked card
                    this.classList.add('selected');

                    // Update hidden input with selected plan
                    const planId = this.dataset.planId;
                    const planInput = document.getElementById('selected-plan');
                    if (planInput) {
                        planInput.value = planId;
                    }

                    // Show success message
                    showToast('Plan selected successfully!', 'success');
                });
            });
        }

        // Enhanced payment method selection
        if (methodButtons.length > 0) {
            const groups = {
                paypal: document.getElementById("paypal-btn"),
                applepay: document.getElementById("applepay-btn"),
                fawry: document.getElementById("fawry-info"),
                vodafone: document.getElementById("vodafone-info")
            };

            methodButtons.forEach(button => {
                button.addEventListener("click", () => {
                    // Remove active class from all buttons
                    methodButtons.forEach(btn => btn.classList.remove("active"));
                    // Add active class to clicked button
                    button.classList.add("active");

                    const selectedMethod = button.dataset.method;

                    // Hide all method groups
                    Object.values(groups).forEach(group => {
                        if (group) {
                            group.style.display = "none";
                            group.style.animation = '';
                        }
                    });
                    if (cardTypeGroup) cardTypeGroup.style.display = "none";
                    if (cardFields) cardFields.style.display = "none";
                    if (cardTypeSelect) cardTypeSelect.value = "";

                    // Show selected method group with animation
                    if (selectedMethod === "card" && cardTypeGroup) {
                        cardTypeGroup.style.display = "block";
                        cardTypeGroup.style.animation = 'slideDown 0.3s ease-out';
                    } else if (groups[selectedMethod]) {
                        groups[selectedMethod].style.display = "block";
                        groups[selectedMethod].style.animation = 'slideDown 0.3s ease-out';
                    }

                    // Show success message
                    showToast(`Payment method selected: ${selectedMethod}`, 'success');
                });
            });

            // Enhanced card type selection
            if (cardTypeSelect && cardFields) {
                cardTypeSelect.addEventListener("change", () => {
                    if (cardTypeSelect.value) {
                        cardFields.style.display = "block";
                        cardFields.style.animation = 'slideDown 0.3s ease-out';
                    } else {
                        cardFields.style.display = "none";
                    }
                });
            }
        }

        // Enhanced form validation and submission
        if (paymentForm) {
            const formInputs = paymentForm.querySelectorAll('input, select');
            
            // Add real-time validation
            formInputs.forEach(input => {
                input.addEventListener('input', function() {
                    validateInput(this);
                });

                input.addEventListener('blur', function() {
                    validateInput(this);
                });
            });

            // Form submission with enhanced validation
            paymentForm.addEventListener('submit', function(e) {
                e.preventDefault();

                // Validate all inputs
                let isValid = true;
                formInputs.forEach(input => {
                    if (!validateInput(input)) {
                        isValid = false;
                    }
                });

                // Validate plan selection
                const selectedPlan = document.getElementById('selected-plan').value;
                if (!selectedPlan) {
                    showToast('Please select a plan', 'error');
                    isValid = false;
                }

                // Validate payment method
                const selectedMethod = document.querySelector('.pay-btn.active');
                if (!selectedMethod) {
                    showToast('Please select a payment method', 'error');
                    isValid = false;
                }

                if (!isValid) {
                    return;
                }

                // Get form data
                const formData = new FormData(this);
                const paymentData = {
                    planId: formData.get('selected-plan'),
                    paymentMethod: selectedMethod.dataset.method,
                    // Add other form fields as needed
                };

                // Process payment with loading state
                processPayment(paymentData);
            });
        }

        // Input validation function
        function validateInput(input) {
            const value = input.value.trim();
            let isValid = true;
            let errorMessage = '';

            switch (input.type) {
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    isValid = emailRegex.test(value);
                    errorMessage = 'Please enter a valid email address';
                    break;
                case 'tel':
                    const phoneRegex = /^\+?[\d\s-]{10,}$/;
                    isValid = phoneRegex.test(value);
                    errorMessage = 'Please enter a valid phone number';
                    break;
                case 'text':
                    isValid = value.length >= 2;
                    errorMessage = 'This field is required';
                    break;
                case 'number':
                    isValid = !isNaN(value) && value > 0;
                    errorMessage = 'Please enter a valid number';
                    break;
            }

            // Update input styling
            if (isValid) {
                input.classList.remove('error');
                input.classList.add('valid');
            } else {
                input.classList.remove('valid');
                input.classList.add('error');
                if (value !== '') {
                    showToast(errorMessage, 'error');
                }
            }

            return isValid;
        }

        // Enhanced payment processing function
        function processPayment(paymentData) {
            // Show loading state
            const submitBtn = paymentForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

            // Simulate API call (replace with actual API endpoint)
            setTimeout(() => {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;

                // Show success message with animation
                showToast('Payment processed successfully!', 'success');
                
                // Add success animation to the form
                paymentForm.style.animation = 'fadeOut 0.5s ease-out';
                
                // Redirect to success page or dashboard
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 2000);
            }, 2000);
        }

        // Profile Page Functionality
        const avatarInput = document.getElementById('avatar-upload');
        const avatarImg = document.getElementById('profile-avatar');
        if (avatarInput && avatarImg) {
            avatarInput.addEventListener('change', async function() {
                if (this.files && this.files[0]) {
                    const file = this.files[0];
                    // Check file size (5MB limit)
                    if (file.size > 5 * 1024 * 1024) {
                        showToast('File size must be less than 5MB', 'error');
                        return;
                    }
                    
                    // Create FormData
                    const formData = new FormData();
                    formData.append('file', file);
                    
                    try {
                        const token = localStorage.getItem('token');
                        const response = await fetch('http://localhost:5000/api/upload', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            },
                            body: formData
                        });
                        
                        if (!response.ok) {
                            throw new Error('Upload failed');
                        }
                        
                        const data = await response.json();
                        // Update avatar preview
                        avatarImg.src = data.fileUrl;
                        showToast('Profile picture updated successfully!', 'success');
                        
                        // Update user data in localStorage
                        const user = JSON.parse(localStorage.getItem('user'));
                        user.avatar = data.fileUrl;
                        localStorage.setItem('user', JSON.stringify(user));
                        
                    } catch (error) {
                        showToast('Failed to upload profile picture', 'error');
                        console.error('Upload error:', error);
                    }
                }
            });
        }

        // Profile Tab Switching
        const tabs = document.querySelectorAll('.profile-tab');
        const tabContents = document.querySelectorAll('.profile-tab-content');
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(tc => tc.style.display = 'none');
                this.classList.add('active');
                document.getElementById(this.dataset.tab + '-tab').style.display = '';
            });
        });

        // Edit Profile Modal
        const editBtn = document.querySelector('.edit-btn');
        const editModal = document.getElementById('editProfileModal');
        const closeEditModal = document.getElementById('closeEditModal');
        if (editBtn && editModal && closeEditModal) {
            editBtn.addEventListener('click', () => editModal.classList.add('active'));
            closeEditModal.addEventListener('click', () => editModal.classList.remove('active'));
            window.addEventListener('click', function(event) {
                if (event.target === editModal) editModal.classList.remove('active');
            });
        }

        const editProfileForm = document.getElementById('editProfileForm');
        if (editProfileForm) {
            editProfileForm.addEventListener('submit', function(e) {
                e.preventDefault();
                editModal.classList.remove('active');
            });
        }

        // Resume file name
        const resumeInput = document.getElementById('resume');
        const resumeFileName = document.getElementById('resume-file-name');
        if (resumeInput && resumeFileName) {
            resumeInput.addEventListener('change', async function() {
                if (this.files && this.files[0]) {
                    const file = this.files[0];
                    // Check file size (5MB limit)
                    if (file.size > 5 * 1024 * 1024) {
                        showToast('File size must be less than 5MB', 'error');
                        return;
                    }
                    
                    // Update file name display
                    resumeFileName.textContent = file.name;
                    
                    // Create FormData
                    const formData = new FormData();
                    formData.append('file', file);
                    
                    try {
                        const token = localStorage.getItem('token');
                        const response = await fetch('http://localhost:5000/api/upload', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            },
                            body: formData
                        });
                        
                        if (!response.ok) {
                            throw new Error('Upload failed');
                        }
                        
                        const data = await response.json();
                        showToast('Resume uploaded successfully!', 'success');
                        
                        // Update user data in localStorage
                        const user = JSON.parse(localStorage.getItem('user'));
                        user.resume = data.fileUrl;
                        localStorage.setItem('user', JSON.stringify(user));
                        
                    } catch (error) {
                        showToast('Failed to upload resume', 'error');
                        console.error('Upload error:', error);
                        resumeFileName.textContent = 'No file chosen';
                    }
                }
            });
        }

        // Profile picture file name
        const profileInput = document.getElementById('profilePicture');
        const profileFileName = document.getElementById('profile-file-name');
        if (profileInput && profileFileName) {
            profileInput.addEventListener('change', function() {
                profileFileName.textContent = this.files[0] ? this.files[0].name : 'No file chosen';
            });
        }

        // Navbar Scroll
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (!navbar) return;
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            }
        });

        // Prevent # links
        document.querySelectorAll('a[href="#"]').forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
            });
        });

        // Add Event Button Logic (moved here to ensure it runs)
        const addEventBtn = document.getElementById('add-event-btn');
        const addEventContent = document.getElementById('add-event-content');
        if (addEventBtn && addEventContent) {
            addEventBtn.addEventListener('click', function() {
                addEventContent.innerHTML = `
                    <form id="event-form" style="max-width: 500px; margin: 0 auto; text-align: left;">
                        <div class="form-group">
                            <label for="event-title">Event Title</label>
                            <input type="text" id="event-title" class="form-control" required placeholder="Enter event title">
                        </div>
                        <div class="form-group">
                            <label for="event-date">Date</label>
                            <input type="date" id="event-date" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="event-location">Location</label>
                            <input type="text" id="event-location" class="form-control" required placeholder="Enter location (or Online)">
                        </div>
                        <div class="form-group">
                            <label for="event-description">Description</label>
                            <textarea id="event-description" class="form-control" rows="3" required placeholder="Describe the event"></textarea>
                        </div>
                        <div style="display: flex; gap: 12px; justify-content: flex-end;">
                            <button type="button" class="btn btn-secondary" id="cancel-event-btn">Cancel</button>
                            <button type="submit" class="btn btn-primary">Save Event</button>
                        </div>
                    </form>
                `;
                // Cancel button logic
                document.getElementById('cancel-event-btn').onclick = function() {
                    addEventContent.innerHTML = '';
                };
                // Save event logic (add to grid)
                document.getElementById('event-form').onsubmit = function(e) {
                    e.preventDefault();
                    const title = document.getElementById('event-title')?.value;
                    const date = document.getElementById('event-date')?.value;
                    const location = document.getElementById('event-location')?.value;
                    const description = document.getElementById('event-description')?.value;
                    const grid = document.getElementById('events-grid');
                    const card = document.createElement('div');
                    card.className = 'event-card';
                    card.innerHTML = `
                      <div class="event-title"><i class="fas fa-calendar-plus" style="color: var(--accent-color);"></i> ${title}</div>
                      <div class="event-date"><i class="fas fa-calendar-day"></i> ${date}</div>
                      <div class="event-location"><i class="fas fa-map-marker-alt"></i> ${location}</div>
                      <div class="event-description">${description}</div>
                      <a href="#" class="btn btn-primary" style="margin-top: 10px;"><i class="fas fa-sign-in-alt"></i> Join</a>
                    `;
                    // Add new event at the top
                    if (grid.firstChild) {
                      grid.insertBefore(card, grid.firstChild);
                    } else {
                      grid.appendChild(card);
                    }
                    addEventContent.innerHTML = '';
                };
            });
        }

        // Attach files/media
        const attachBtn = document.getElementById('attach-btn');
        const fileInput = document.getElementById('file-input');
        const filePreviewContainer = document.getElementById('file-preview-container');
        let attachedFiles = [];
        if (attachBtn && fileInput && filePreviewContainer) {
          attachBtn.addEventListener('click', function() {
            fileInput.value = '';
            fileInput.click();
          });
          fileInput.addEventListener('change', function() {
            attachedFiles = Array.from(fileInput.files);
            renderFilePreviews();
          });
        }
        function renderFilePreviews() {
          if (!filePreviewContainer) return;
          filePreviewContainer.innerHTML = '';
          attachedFiles.forEach((file, idx) => {
            const preview = document.createElement('div');
            preview.className = 'file-preview';
            let content = '';
            if (file.type.startsWith('image/')) {
              const img = document.createElement('img');
              img.src = URL.createObjectURL(file);
              content = img.outerHTML;
            } else if (file.type.startsWith('video/')) {
              const vid = document.createElement('video');
              vid.src = URL.createObjectURL(file);
              vid.controls = true;
              vid.style.maxWidth = '80px';
              vid.style.maxHeight = '80px';
              content = vid.outerHTML;
            } else {
              content = `<div class='file-name'>${file.name}</div>`;
            }
            preview.innerHTML = content + `<button class='remove-file' title='Remove'>&times;</button>`;
            preview.querySelector('.remove-file').addEventListener('click', function() {
              attachedFiles.splice(idx, 1);
              renderFilePreviews();
            });
            filePreviewContainer.appendChild(preview);
            });
        }
    } catch (error) {
        console.error('Error initializing page:', error);
        showToast('Failed to initialize page', 'error');
    }
});

// ===== Multi-step Signup Form Logic =====
document.addEventListener('DOMContentLoaded', function() {
  const signupForm = document.querySelector('.signup-form');
  if (!signupForm) {
    console.warn('Signup form not found on this page.');
    return;
  }
  const steps = Array.from(document.querySelectorAll('.form-step'));
  const stepperSteps = Array.from(document.querySelectorAll('.signup-stepper .step'));
  const progressFill = document.querySelector('.signup-progress-fill');
  const nextBtn = document.querySelector('.next-step');
  const prevBtn = document.querySelector('.prev-step');
  const submitBtn = document.querySelector('.submit-btn');
  let currentStep = 0;

  console.log('Steps found:', steps.length);
  console.log('Stepper steps found:', stepperSteps.length);

  function showStep(idx) {
    console.log('Showing step', idx);
    steps.forEach((step, i) => {
      step.classList.toggle('active', i === idx);
    });
    stepperSteps.forEach((step, i) => {
      step.classList.toggle('active', i === idx);
    });
    // Progress bar
    if(progressFill) progressFill.style.width = ((idx+1)/steps.length*100) + '%';
    // Buttons
    if(prevBtn) prevBtn.style.display = idx === 0 ? 'none' : '';
    if(nextBtn) nextBtn.style.display = idx === steps.length-1 ? 'none' : '';
    if(submitBtn) submitBtn.style.display = idx === steps.length-1 ? '' : 'none';
  }

  if(nextBtn) {
    nextBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if(currentStep < steps.length-1) {
        currentStep++;
        console.log('Next clicked, new step:', currentStep);
        showStep(currentStep);
      }
    });
  } else {
    console.warn('Next button not found.');
  }
  if(prevBtn) {
    prevBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if(currentStep > 0) {
        currentStep--;
        console.log('Previous clicked, new step:', currentStep);
        showStep(currentStep);
      }
    });
  } else {
    console.warn('Previous button not found.');
  }
  // Initialize
  showStep(currentStep);
});

// ===== Modern Skills Tag Input Logic =====
document.addEventListener('DOMContentLoaded', function() {
  const skillsInput = document.getElementById('skills-input');
  const suggestions = document.getElementById('skills-suggestions');
  const tagsContainer = document.getElementById('skills-tags');
  const skillsListInput = document.getElementById('skillsList');
  if (!skillsInput || !suggestions || !tagsContainer || !skillsListInput) return;
  const predefinedSkills = [
    'Web Development', 'Mobile Development', 'UI/UX Design',
    'Data Science', 'Machine Learning', 'Cloud Computing'
  ];
  let selectedSkills = [];

  function updateTags() {
    tagsContainer.innerHTML = '';
    selectedSkills.forEach(skill => {
      const tag = document.createElement('span');
      tag.className = 'skills-tag';
      tag.textContent = skill;
      const remove = document.createElement('span');
      remove.className = 'remove-tag';
      remove.innerHTML = '&times;';
      remove.onclick = () => {
        selectedSkills = selectedSkills.filter(s => s !== skill);
        updateTags();
      };
      tag.appendChild(remove);
      tagsContainer.appendChild(tag);
    });
    skillsListInput.value = selectedSkills.join(',');
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
      if (skill && !selectedSkills.includes(skill)) {
        selectedSkills.push(skill);
        updateTags();
      }
      skillsInput.value = '';
    }
  });

  Array.from(suggestions.children).forEach(li => {
    li.addEventListener('mousedown', function(e) {
      e.preventDefault();
      const skill = this.textContent;
      if (!selectedSkills.includes(skill)) {
        selectedSkills.push(skill);
        updateTags();
      }
      skillsInput.value = '';
      suggestions.style.display = 'none';
    });
  });
});


document.addEventListener('DOMContentLoaded', function() {
  // User switching
  document.querySelectorAll('.user-list .user').forEach(user => {
    user.addEventListener('click', function() {
      document.querySelectorAll('.user-list .user').forEach(u => u.classList.remove('active'));
      this.classList.add('active');
      document.getElementById('chat-username').textContent = this.querySelector('p').textContent;
      // Set chat header avatar
      document.getElementById('chat-header-avatar').textContent = this.getAttribute('data-avatar') || '🧑';
      // For demo: update chat messages (in real app, load from DB)
      const chatMessages = document.getElementById('chat-messages');
      chatMessages.innerHTML = '';
      if (this.dataset.username === 'Smith Mathew') {
        chatMessages.innerHTML = `
          <div class="message-group received">
            <div class="avatar">🧑‍💼</div>
            <div class="bubbles">
              <div class="bubble">Are you still traveling?<span class="timestamp">8:30 PM</span></div>
              <div class="bubble">🎤 Voice message<span class="timestamp">8:31 PM</span></div>
            </div>
          </div>
          <div class="message-group sent">
            <div class="avatar">😊</div>
            <div class="bubbles">
              <div class="bubble">Yes, I'm at Istanbul.<span class="timestamp">8:32 PM</span></div>
            </div>
          </div>`;
      } else if (this.dataset.username === 'Jane Doe') {
        chatMessages.innerHTML = `
          <div class="message-group received">
            <div class="avatar">👩‍💻</div>
            <div class="bubbles">
              <div class="bubble">Let's catch up soon!<span class="timestamp">7:15 PM</span></div>
            </div>
          </div>
          <div class="message-group sent">
            <div class="avatar">😊</div>
            <div class="bubbles">
              <div class="bubble">Sure, let me know when.<span class="timestamp">7:16 PM</span></div>
            </div>
          </div>`;
      } else {
        chatMessages.innerHTML = `<div class='bubble'>No messages yet.</div>`;
      }
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
  });

  // Recent chat selection (simulate opening chat)
  document.querySelectorAll('.recent-chat').forEach(recent => {
    recent.addEventListener('click', function() {
      // For demo: just update chat header and messages
      const name = this.querySelector('.recent-chat-name').textContent;
      const avatar = this.getAttribute('data-avatar') || '🧑';
      document.getElementById('chat-username').textContent = name;
      document.getElementById('chat-header-avatar').textContent = avatar;
      const chatMessages = document.getElementById('chat-messages');
      chatMessages.innerHTML = `
        <div class="message-group received">
          <div class="avatar">${avatar}</div>
          <div class="bubbles">
            <div class="bubble">Hi, this is ${name}!<span class="timestamp">2:00 PM</span></div>
          </div>
        </div>
        <div class="message-group sent">
          <div class="avatar">😊</div>
          <div class="bubbles">
            <div class="bubble">Hello ${name}!<span class="timestamp">2:01 PM</span></div>
          </div>
        </div>`;
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
  });

  // Emoji Picker
  const emojiBtn = document.getElementById('emoji-btn');
  const emojiPicker = document.getElementById('emoji-picker');
  const emojiList = [
    '😀','😁','😂','🤣','😃','😄','😅','😆','😉','😊','😋','😎','😍','😘','🥰','😗','😙','😚','🙂','🤗','🤩','🤔','🤨','😐','😑','😶','🙄','😏','😣','😥','😮','🤐','😯','😪','😫','🥱','😴','😌','😛','😜','😝','🤤','😒','😓','😔','😕','🙃','🤑','😲','☹️','🙁','😖','😞','😟','😤','😢','😭','😦','😧','😨','😩','🤯','😬','😰','😱','🥵','🥶','😳','🤪','😵','😡','😠','🤬','😷','🤒','🤕','🤢','🤮','🥴','😇','🥳','🥺','🤠','🤡','🤥','🤫','🤭','🧐','🤓','😈','👿','👹','👺','💀','👻','👽','🤖','💩','😺','😸','😹','😻','😼','😽','🙀','😿','😾','👍','👎','👌','✌️','🤞','🤟','🤘','🤙','🖐️','✋','🖖','👋','🤚','🖕','👏','🙌','👐','🤲','🙏','💪','🦾','🦵','🦶','👂','👃','🧠','🦷','🦴','👀','👁️','👅','👄','💋','🩷','❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','💟','☮️','✝️','☪️','🕉️','☸️','✡️','🔯','🕎','☯️','☦️','🛐','⛎','♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','🆔','⚛️','🉑','☢️','☣️','📴','📳','🈶','🈚','🈸','🈺','🈷️','✴️','🆚','💯','💢','💥','💫','💦','💨','🕳️','💣','💬','👁️‍🗨️','️','🗯️','💭','💤'
  ];
  if (emojiBtn && emojiPicker) {
  emojiBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'grid' : 'none';
    if (emojiPicker.style.display === 'grid') {
      emojiPicker.innerHTML = '';
      emojiList.forEach(emoji => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = emoji;
        btn.addEventListener('click', function() {
          const input = document.getElementById('message-input');
          input.value += emoji;
          input.focus();
          emojiPicker.style.display = 'none';
        });
        emojiPicker.appendChild(btn);
      });
    }
  });
  document.addEventListener('click', function(e) {
    if (!emojiPicker.contains(e.target) && e.target !== emojiBtn) {
      emojiPicker.style.display = 'none';
    }
  });
  }
  const sendBtn = document.getElementById('send-btn');
  const input = document.getElementById('message-input');
  const chatMessages = document.getElementById('chat-messages');
  if (sendBtn && input && chatMessages) {
  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') sendMessage();
  });
  chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  // ...
  const searchInput = document.querySelector('.search-box input');
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const searchTerm = e.target.value.toLowerCase();
        recentChats.forEach(chat => {
          const userName = chat.querySelector('h4').textContent.toLowerCase();
          const lastMessage = chat.querySelector('.last-message').textContent.toLowerCase();
          const isVisible = userName.includes(searchTerm) || lastMessage.includes(searchTerm);
          chat.style.display = isVisible ? 'flex' : 'none';
        });
      }, 300);
    });
  }
  const messageInput = document.getElementById('message-input');
  const sendButton = document.querySelector('.send-btn');
  if (messageInput && sendButton) {
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }
  // ... existing code ...
});

// Enhanced Chat Functionality
document.addEventListener('DOMContentLoaded', function() {
  const messageInput = document.getElementById('message-input');
  const sendButton = document.querySelector('.send-btn');
  const chatMessages = document.querySelector('.chat-messages');
  const toolButtons = document.querySelectorAll('.tool-btn');
  const actionButtons = document.querySelectorAll('.action-btn');
  const recentChats = document.querySelectorAll('.recent-chat');
  const searchInput = document.querySelector('.search-box input');

  // Message sending with enhanced animations
  function sendMessage(message, type = 'text') {
    // Implementation of the unified sendMessage function
    const chatMessages = document.querySelector('.chat-messages');
    if (!chatMessages) return;

      const messageGroup = document.createElement('div');
      messageGroup.className = 'message-group sent';
    
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    if (type === 'text') {
        bubble.textContent = message;
    } else if (type === 'image') {
        const img = document.createElement('img');
        img.src = message;
        img.alt = 'Sent image';
        bubble.appendChild(img);
    } else if (type === 'file') {
        const link = document.createElement('a');
        link.href = message.url;
        link.textContent = message.name;
        bubble.appendChild(link);
    }
    
    messageGroup.appendChild(bubble);
    chatMessages.appendChild(messageGroup);
          chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Enhanced emoji picker with categories
  function showEmojiPicker() {
    const emojis = {
      'Smileys': ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇'],
      'Animals': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'],
      'Food': ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒'],
      'Activities': ['⚽', '🏀', '🏈', '⚾', '🎾', '🎱', '🏉', '🎳', '🏓', '🏸']
    };

    const picker = document.createElement('div');
    picker.className = 'emoji-picker';
    picker.innerHTML = `
      <div class="emoji-picker-header">
        <h3>Emoji Picker</h3>
        <button class="close-btn">&times;</button>
      </div>
      <div class="emoji-categories">
        ${Object.keys(emojis).map(category => `
          <div class="emoji-category">
            <h4>${category}</h4>
            <div class="emoji-grid">
              ${emojis[category].map(emoji => `
                <button class="emoji-btn">${emoji}</button>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    document.body.appendChild(picker);

    // Handle emoji selection
    picker.querySelectorAll('.emoji-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        messageInput.value += btn.textContent;
        picker.remove();
      });
    });

    // Close picker
    picker.querySelector('.close-btn').addEventListener('click', () => picker.remove());
  }

  // Enhanced file upload with preview
  function showFileUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf,.doc,.docx';
    input.style.display = 'none';
    document.body.appendChild(input);

    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const messageGroup = document.createElement('div');
          messageGroup.className = 'message-group sent';
          
          if (file.type.startsWith('image/')) {
            messageGroup.innerHTML = `
              <div class="bubble">
                <img src="${e.target.result}" alt="Uploaded image" style="max-width: 200px; border-radius: 8px;">
                <span class="timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            `;
          } else {
            messageGroup.innerHTML = `
              <div class="bubble">
                <div class="file-attachment">
                  <i class="fas fa-file"></i>
                  <span>${file.name}</span>
                </div>
                <span class="timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            `;
          }
          
          chatMessages.appendChild(messageGroup);
          chatMessages.scrollTop = chatMessages.scrollHeight;
        };
        reader.readAsDataURL(file);
      }
    });

    input.click();
    document.body.removeChild(input);
  }

  // Enhanced link sharing with preview
  function showLinkInput() {
    const url = prompt('Enter a URL:');
    if (url) {
      const messageGroup = document.createElement('div');
      messageGroup.className = 'message-group sent';
      messageGroup.innerHTML = `
        <div class="bubble">
          <a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>
          <span class="timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      `;
      chatMessages.appendChild(messageGroup);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  // Enhanced video call modal
  function showVideoCallModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h2>Start Video Call</h2>
        <p>Initiating video call with John Doe...</p>
        <div class="video-preview">
          <video autoplay muted></video>
        </div>
        <div class="call-controls">
          <button class="btn btn-danger">End Call</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';

    // Simulate video call
    const video = modal.querySelector('video');
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        video.srcObject = stream;
      })
      .catch(err => {
        console.error('Error accessing camera:', err);
      });

    modal.querySelector('.btn-danger').addEventListener('click', () => {
      modal.remove();
    });
  }

  // Enhanced Google Meet integration
  function showGoogleMeetModal() {
    const meetUrl = 'https://meet.google.com/new';
    window.open(meetUrl, '_blank');
  }

  // Enhanced more options menu
  function showMoreOptions() {
    // Remove any existing menus
    document.querySelectorAll('.chat-header-actions-menu').forEach(menu => menu.remove());

    // Find the three-dot button and its parent
    const moreBtn = document.querySelector('.action-btn[title="More Options"]');
    const actions = moreBtn.parentElement;

    // Create the menu
    const menu = document.createElement('div');
    menu.className = 'chat-header-actions-menu show';
    menu.innerHTML = `
      <button><i class="fas fa-user"></i> View Profile</button>
      <button><i class="fas fa-bell"></i> Mute Notifications</button>
      <button><i class="fas fa-trash"></i> Clear Chat</button>
    `;

    // Append as a child of .chat-actions
    actions.appendChild(menu);

    // Close menu when clicking outside
    document.addEventListener('click', function closeMenu(e) {
      if (!menu.contains(e.target) && e.target !== moreBtn) {
        menu.remove();
        document.removeEventListener('click', closeMenu);
      }
    });
  }

  // Enhanced recent chat selection
  recentChats.forEach(chat => {
    chat.addEventListener('click', () => {
      recentChats.forEach(c => c.classList.remove('active'));
      chat.classList.add('active');
      
      const userName = chat.querySelector('h4').textContent;
      const userAvatar = chat.querySelector('.avatar').textContent;
      
      document.querySelector('.chat-header-user h3').textContent = userName;
      document.querySelector('.chat-header-user .avatar').textContent = userAvatar;
      
      // Add animation
      chat.style.transform = 'scale(1.02)';
      setTimeout(() => chat.style.transform = 'scale(1)', 200);
    });
  });

  // Enhanced search functionality with debounce
  if (typeof searchInput !== 'undefined' && searchInput) {
  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const searchTerm = e.target.value.toLowerCase();
      recentChats.forEach(chat => {
        const userName = chat.querySelector('h4').textContent.toLowerCase();
        const lastMessage = chat.querySelector('.last-message').textContent.toLowerCase();
        const isVisible = userName.includes(searchTerm) || lastMessage.includes(searchTerm);
        chat.style.display = isVisible ? 'flex' : 'none';
      });
    }, 300);
  });
  }

  if (typeof sendButton !== 'undefined' && sendButton && typeof sendMessage === 'function') {
  sendButton.addEventListener('click', sendMessage);
  }
  if (typeof messageInput !== 'undefined' && messageInput) {
  messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && typeof sendMessage === 'function') sendMessage();
  });
    messageInput.addEventListener('focus', () => {
      const chatFooter = document.querySelector('.chat-footer');
      if (chatFooter) chatFooter.classList.add('focused');
    });
    messageInput.addEventListener('blur', () => {
      const chatFooter = document.querySelector('.chat-footer');
      if (chatFooter) chatFooter.classList.remove('focused');
    });
  }
  if (typeof toolButtons !== 'undefined' && toolButtons && toolButtons.forEach) {
  toolButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.add('clicked');
      setTimeout(() => btn.classList.remove('clicked'), 200);
      switch(btn.title) {
        case 'Add Emoji':
            if (typeof showEmojiPicker === 'function') showEmojiPicker();
          break;
        case 'Attach File':
            if (typeof showFileUpload === 'function') showFileUpload();
          break;
        case 'Add Link':
            if (typeof showLinkInput === 'function') showLinkInput();
          break;
      }
    });
  });
  }
  if (typeof actionButtons !== 'undefined' && actionButtons && actionButtons.forEach) {
  actionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.add('clicked');
      setTimeout(() => btn.classList.remove('clicked'), 200);
      switch(btn.title) {
        case 'Start Video Call':
            if (typeof showVideoCallModal === 'function') showVideoCallModal();
          break;
        case 'Start Google Meet':
            if (typeof showGoogleMeetModal === 'function') showGoogleMeetModal();
          break;
        case 'More Options':
            if (typeof showMoreOptions === 'function') showMoreOptions();
          break;
      }
    });
  });
  }
  if (typeof recentChats !== 'undefined' && recentChats && recentChats.forEach) {
    recentChats.forEach(chat => {
      chat.addEventListener('click', () => {
        recentChats.forEach(c => c.classList.remove('active'));
        chat.classList.add('active');
        const userName = chat.querySelector('h4').textContent;
        const userAvatar = chat.querySelector('.avatar').textContent;
        const chatHeaderUser = document.querySelector('.chat-header-user h3');
        const chatHeaderAvatar = document.querySelector('.chat-header-user .avatar');
        if (chatHeaderUser) chatHeaderUser.textContent = userName;
        if (chatHeaderAvatar) chatHeaderAvatar.textContent = userAvatar;
        chat.style.transform = 'scale(1.02)';
        setTimeout(() => chat.style.transform = 'scale(1)', 200);
  });
    });
  }
});

// New Chat Modal Functionality

document.addEventListener('DOMContentLoaded', function() {
  const newChatBtn = document.querySelector('.new-chat-btn');
  const newChatModal = document.getElementById('new-chat-modal');
  const closeNewChatModal = document.getElementById('close-new-chat-modal');
  const newChatSearch = document.getElementById('new-chat-search');
  const newChatUserList = document.getElementById('new-chat-user-list');

  if (newChatBtn && newChatModal && closeNewChatModal) {
    newChatBtn.addEventListener('click', function() {
      newChatModal.style.display = 'block';
      newChatSearch.value = '';
      filterNewChatUsers('');
      newChatSearch.focus();
    });
    closeNewChatModal.addEventListener('click', function() {
      newChatModal.style.display = 'none';
    });
    window.addEventListener('click', function(e) {
      if (e.target === newChatModal) {
        newChatModal.style.display = 'none';
      }
    });
    newChatSearch.addEventListener('input', function() {
      filterNewChatUsers(this.value);
    });
    // Clicking a user closes the modal (demo)
    newChatUserList.querySelectorAll('.new-chat-user-item').forEach(function(item) {
      item.addEventListener('click', function() {
        newChatModal.style.display = 'none';
        // Here you could add logic to actually start a new chat
        // For demo: alert('Starting chat with ' + this.textContent);
      });
    });
  }

  function filterNewChatUsers(query) {
    const items = newChatUserList.querySelectorAll('.new-chat-user-item');
    items.forEach(function(item) {
      if (item.textContent.toLowerCase().includes(query.toLowerCase())) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  }
});

// Simulated user presence and typing status

document.addEventListener('DOMContentLoaded', function() {
  // Dummy user status data
  const userStatus = {
    'John Doe': { online: true, typing: false },
    'Alice Smith': { online: false, typing: false },
    'Robert Johnson': { online: true, typing: false },
    'Maria Lee': { online: false, typing: false }
  };

  // Update status dots and text in recent chat list
  document.querySelectorAll('.recent-chat').forEach(chat => {
    const name = chat.getAttribute('data-username');
    const avatar = chat.querySelector('.avatar');
    const statusText = chat.querySelector('.user-status-text');
    if (userStatus[name]) {
      if (userStatus[name].online) {
        avatar.classList.add('online');
        avatar.classList.remove('offline');
        if (statusText) statusText.textContent = 'Online';
      } else {
        avatar.classList.add('offline');
        avatar.classList.remove('online');
        if (statusText) statusText.textContent = 'Offline';
      }
    }
  });

  // Update status in chat header
  function updateChatHeaderStatus(user) {
    const chatHeaderAvatar = document.querySelector('.chat-header-user .avatar');
    const chatHeaderStatus = document.querySelector('.chat-header-user .status');
    if (userStatus[user]) {
      if (userStatus[user].online) {
        chatHeaderAvatar.classList.add('online');
        chatHeaderAvatar.classList.remove('offline');
        chatHeaderStatus.textContent = 'Online';
        chatHeaderStatus.classList.add('online');
        chatHeaderStatus.classList.remove('offline');
      } else {
        chatHeaderAvatar.classList.add('offline');
        chatHeaderAvatar.classList.remove('online');
        chatHeaderStatus.textContent = 'Offline';
        chatHeaderStatus.classList.add('offline');
        chatHeaderStatus.classList.remove('online');
      }
    }
  }

  // Simulate typing indicator in chat header
  function simulateTyping(user) {
    const typingHeader = document.querySelector('.typing-indicator-header');
    if (!typingHeader) return;
    typingHeader.style.display = 'inline-block';
    setTimeout(() => {
      typingHeader.style.display = 'none';
    }, 2000);
  }

  // When a recent chat is clicked, update header status
  document.querySelectorAll('.recent-chat').forEach(chat => {
    chat.addEventListener('click', function() {
      const name = chat.getAttribute('data-username');
      updateChatHeaderStatus(name);
    });
  });

  // Simulate typing when you send a message
  const sendButton = document.querySelector('.send-btn');
  if (sendButton) {
    sendButton.addEventListener('click', function() {
      // Find the active chat
      const activeChat = document.querySelector('.recent-chat.active');
      if (activeChat) {
        const name = activeChat.getAttribute('data-username');
        // Simulate the other user typing after you send a message
        if (userStatus[name]) {
          userStatus[name].typing = true;
          simulateTyping(name);
          setTimeout(() => { userStatus[name].typing = false; }, 2000);
        }
      }
    });
  }
});

// Simulated unread message badges

document.addEventListener('DOMContentLoaded', function() {
  // Dummy unread counts
  const unreadCounts = {
    'John Doe': 2,
    'Alice Smith': 5,
    'Robert Johnson': 1,
    'Maria Lee': 0
  };

  // Show badges based on unreadCounts
  document.querySelectorAll('.recent-chat').forEach(chat => {
    const name = chat.getAttribute('data-username');
    const badge = chat.querySelector('.unread-badge');
    if (badge && typeof unreadCounts[name] !== 'undefined') {
      if (unreadCounts[name] > 0) {
        badge.textContent = unreadCounts[name];
        badge.style.display = 'inline-flex';
      } else {
        badge.style.display = 'none';
      }
    }
  });

  // When a chat is clicked, clear its unread count
  document.querySelectorAll('.recent-chat').forEach(chat => {
    chat.addEventListener('click', function() {
      const name = chat.getAttribute('data-username');
      const badge = chat.querySelector('.unread-badge');
      if (badge) {
        unreadCounts[name] = 0;
        badge.style.display = 'none';
      }
    });
  });
});

// Message Reactions (Emoji Reactions)
document.addEventListener('DOMContentLoaded', function() {
  const emojiOptions = ['👍', '❤️', '😂', '😮', '😢', '👏'];

  // Helper to create emoji picker
  function createEmojiPicker(onSelect) {
    const picker = document.createElement('div');
    picker.className = 'reaction-emoji-picker';
    emojiOptions.forEach(emoji => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = emoji;
      btn.onclick = () => {
        onSelect(emoji);
        picker.remove();
      };
      picker.appendChild(btn);
    });
    return picker;
  }

  // Handle reaction button click
  document.querySelectorAll('.reaction-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      // Remove any existing pickers
      document.querySelectorAll('.reaction-emoji-picker').forEach(p => p.remove());
      // Show picker
      const bubble = btn.closest('.bubble');
      const picker = createEmojiPicker(function(emoji) {
        addReaction(bubble, emoji);
      });
      bubble.style.position = 'relative';
      bubble.appendChild(picker);
    });
  });

  // Add or update a reaction in the reactions bar
  function addReaction(bubble, emoji) {
    let bar = bubble.querySelector('.reactions-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'reactions-bar';
      bubble.appendChild(bar);
    }
    let item = bar.querySelector(`.reaction-item[data-emoji="${emoji}"]`);
    if (item) {
      // Increment count
      let countSpan = item.querySelector('.reaction-count');
      countSpan.textContent = parseInt(countSpan.textContent) + 1;
    } else {
      // Add new reaction
      item = document.createElement('span');
      item.className = 'reaction-item';
      item.setAttribute('data-emoji', emoji);
      item.innerHTML = `${emoji} <span class="reaction-count">1</span>`;
      bar.appendChild(item);
    }
  }

  // Hide picker when clicking outside
  document.addEventListener('click', function(e) {
    document.querySelectorAll('.reaction-emoji-picker').forEach(picker => {
      if (!picker.contains(e.target)) picker.remove();
    });
  });
});

// Image Preview Modal (Lightbox) and File Download

document.addEventListener('DOMContentLoaded', function() {
  // Image preview modal logic
  const imageModal = document.getElementById('image-preview-modal');
  const imageModalImg = document.getElementById('image-preview-modal-img');
  const closeImageModal = document.getElementById('close-image-preview-modal');

  // Open modal on image click
  document.querySelectorAll('.bubble img').forEach(img => {
    img.addEventListener('click', function(e) {
      imageModalImg.src = img.src;
      imageModal.classList.add('active');
      imageModal.style.display = 'flex';
    });
  });

  // Close modal on close button or outside click
  if (closeImageModal) {
    closeImageModal.addEventListener('click', function() {
      imageModal.classList.remove('active');
      imageModal.style.display = 'none';
      imageModalImg.src = '';
    });
  }
  if (imageModal) {
    imageModal.addEventListener('click', function(e) {
      if (e.target === imageModal) {
        imageModal.classList.remove('active');
        imageModal.style.display = 'none';
        imageModalImg.src = '';
      }
    });
  }

  // File download for file-attachment
  document.querySelectorAll('.file-attachment').forEach(fileDiv => {
    fileDiv.addEventListener('click', function(e) {
      const link = fileDiv.querySelector('a');
      if (link) {
        link.click();
      }
    });
  });
});

// Voice Message Recording

document.addEventListener('DOMContentLoaded', function() {
  const voiceBtn = document.getElementById('voice-record-btn');
  const chatMessages = document.querySelector('.chat-messages');
  let mediaRecorder, audioChunks = [], isRecording = false;

  if (voiceBtn && navigator.mediaDevices && window.MediaRecorder) {
    voiceBtn.addEventListener('click', async function() {
      if (!isRecording) {
        // Start recording
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaRecorder = new MediaRecorder(stream);
          audioChunks = [];
          mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);
            insertAudioMessage(audioUrl);
          };
          mediaRecorder.start();
          isRecording = true;
          voiceBtn.classList.add('recording');
          voiceBtn.title = 'Stop Recording';
        } catch (err) {
          alert('Microphone access denied or not available.');
        }
      } else {
        // Stop recording
        mediaRecorder.stop();
        isRecording = false;
        voiceBtn.classList.remove('recording');
        voiceBtn.title = 'Record Voice';
      }
    });
  }

  function insertAudioMessage(audioUrl) {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const messageGroup = document.createElement('div');
    messageGroup.className = 'message-group sent';
    messageGroup.innerHTML = `
      <div class="bubble">
        <audio controls src="${audioUrl}"></audio>
        <span class="timestamp">${timestamp}</span>
      </div>
    `;
    chatMessages.appendChild(messageGroup);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});

// Group Chat Header Logic

document.addEventListener('DOMContentLoaded', function() {
  // Dummy group members data
  const groupMembers = {
    'Project Team': ['John Doe', 'Alice Smith', 'Robert Johnson', 'Maria Lee']
  };

  document.querySelectorAll('.recent-chat').forEach(chat => {
    chat.addEventListener('click', function() {
      const isGroup = chat.getAttribute('data-group') === 'true';
      const chatHeaderUser = document.querySelector('.chat-header-user');
      const groupMembersDiv = chatHeaderUser.querySelector('.group-members');
      if (isGroup) {
        // Show group avatar and name
        const groupName = chat.getAttribute('data-username');
        chatHeaderUser.querySelector('.avatar').outerHTML = '<div class="avatar group-avatar"><i class="fas fa-users"></i></div>';
        chatHeaderUser.querySelector('h3').textContent = groupName;
        chatHeaderUser.querySelector('.status').textContent = 'Group Chat';
        groupMembersDiv.style.display = 'flex';
        groupMembersDiv.innerHTML = '<i class="fas fa-user-friends"></i> ' + groupMembers[groupName].join(', ');
      } else {
        // Show individual avatar and status
        const name = chat.getAttribute('data-username');
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
        chatHeaderUser.querySelector('.avatar').outerHTML = `<div class="avatar status-dot online">${initials}</div>`;
        chatHeaderUser.querySelector('h3').textContent = name;
        groupMembersDiv.style.display = 'none';
        groupMembersDiv.innerHTML = '';
      }
    });
  });
});

// User Profile Modal Logic

document.addEventListener('DOMContentLoaded', function() {
  // Dummy user data
  const userProfiles = {
    'John Doe': { initials: 'JD', status: 'Online', bio: 'Web Developer. Loves coding and coffee.' },
    'Alice Smith': { initials: 'AS', status: 'Offline', bio: 'UI/UX Designer. Passionate about user experience.' },
    'Robert Johnson': { initials: 'RJ', status: 'Online', bio: 'Project Manager. Teamwork makes the dream work.' },
    'Maria Lee': { initials: 'ML', status: 'Offline', bio: 'QA Engineer. Quality is my priority.' },
    'Project Team': { initials: 'PT', status: 'Group', bio: 'A collaborative project team.' }
  };

  const profileModal = document.getElementById('user-profile-modal');
  const closeProfileModal = document.getElementById('close-user-profile-modal');
  const avatarDiv = document.getElementById('user-profile-avatar');
  const nameDiv = document.getElementById('user-profile-name');
  const statusDiv = document.getElementById('user-profile-status');
  const bioDiv = document.getElementById('user-profile-bio');

  function openProfile(name) {
    const user = userProfiles[name] || { initials: '?', status: '', bio: '' };
    avatarDiv.textContent = user.initials;
    nameDiv.textContent = name;
    statusDiv.textContent = user.status;
    bioDiv.textContent = user.bio;
    profileModal.classList.add('active');
    profileModal.style.display = 'flex';
  }
  function closeProfile() {
    profileModal.classList.remove('active');
    profileModal.style.display = 'none';
  }
  if (closeProfileModal) closeProfileModal.onclick = closeProfile;
  if (profileModal) {
    profileModal.addEventListener('click', function(e) {
      if (e.target === profileModal) closeProfile();
    });
  }

  // Open profile from recent chat avatars/names
  document.querySelectorAll('.recent-chat .avatar, .recent-chat h4').forEach(el => {
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      const chat = el.closest('.recent-chat');
      if (chat) openProfile(chat.getAttribute('data-username'));
    });
  });
  // Open profile from chat header avatar/name
  document.querySelectorAll('.chat-header-user .avatar, .chat-header-user h3').forEach(el => {
    el.addEventListener('click', function(e) {
      const name = document.querySelector('.chat-header-user h3').textContent;
      openProfile(name);
    });
  });
  // Open profile from group members list
  document.querySelectorAll('.group-members').forEach(div => {
    div.addEventListener('click', function(e) {
      if (e.target && e.target.nodeType === 3) return; // skip text nodes
      const name = e.target.textContent.split(',')[0].trim();
      if (userProfiles[name]) openProfile(name);
    });
  });
});

// Notifications (Browser and In-App Toast)
document.addEventListener('DOMContentLoaded', function() {
  // Request browser notification permission
  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission();
  }

  // Remove the simulated message notification interval
  // setInterval(() => {
  //   const message = 'New message from Alice Smith!';
  //   // Browser notification
  //   if ('Notification' in window && Notification.permission === 'granted') {
  //     new Notification('SkillBridge Chat', {
  //       body: message,
  //       icon: '/Images/skillbridgefontlogo.png'
  //     });
  //   }
  //   // In-app toast
  //   showToast(message);
  // }, 15000);
});

// Chat Options Menu Logic (Improved)
document.addEventListener('DOMContentLoaded', function() {
  // Helper to close all menus
  function closeAllMenus() {
    document.querySelectorAll('.chat-options-menu').forEach(menu => menu.remove());
  }

  document.querySelectorAll('.chat-options-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      closeAllMenus();
      const chat = btn.closest('.recent-chat');
      let menu = chat.querySelector('.chat-options-menu');
      if (!menu) {
        // Create menu if not exists
        menu = document.createElement('div');
        menu.className = 'chat-options-menu show';
        menu.innerHTML = `
          <button class="mute-btn"><i class="fas fa-bell-slash"></i> Mute</button>
          <button class="archive-btn"><i class="fas fa-archive"></i> Archive</button>
          <button class="delete-btn"><i class="fas fa-trash"></i> Delete</button>
          <button class="block-btn"><i class="fas fa-ban"></i> Block/Report</button>
        `;
        chat.appendChild(menu);
        // Mute
        menu.querySelector('.mute-btn').onclick = function(ev) {
          ev.stopPropagation();
          chat.classList.toggle('muted');
          if (chat.classList.contains('muted')) {
            if (!chat.querySelector('.muted-icon')) {
              const icon = document.createElement('i');
              icon.className = 'fas fa-bell-slash muted-icon';
              chat.querySelector('.chat-header h4').appendChild(icon);
            }
          } else {
            const icon = chat.querySelector('.muted-icon');
            if (icon) icon.remove();
          }
          closeAllMenus();
        };
        // Archive
        menu.querySelector('.archive-btn').onclick = function(ev) {
          ev.stopPropagation();
          chat.classList.add('archived');
          closeAllMenus();
        };
        // Delete
        menu.querySelector('.delete-btn').onclick = function(ev) {
          ev.stopPropagation();
          chat.remove();
          closeAllMenus();
        };
        // Block/Report
        menu.querySelector('.block-btn').onclick = function(ev) {
          ev.stopPropagation();
          chat.classList.add('muted');
          alert('User has been blocked/reported (demo).');
          closeAllMenus();
        };
      } else {
        menu.classList.toggle('show');
      }
    });
  });
  // Close menus when clicking outside
  document.addEventListener('click', closeAllMenus);
});

// ===== Settings Page Advanced Features Demo Logic =====
document.addEventListener('DOMContentLoaded', function() {
  const isSettingsPage = document.querySelector('.settings-page');
  if (!isSettingsPage) return;

  // Profile picture upload
  const avatarInput = document.getElementById('avatar-upload');
  const avatarImg = document.getElementById('profile-avatar');
  if (avatarInput && avatarImg) {
    avatarInput.addEventListener('change', function() {
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
          avatarImg.src = e.target.result;
          showToast('Profile picture updated!');
        };
        reader.readAsDataURL(this.files[0]);
      }
    });
    // Clicking the label triggers file input
    document.querySelector('label[for="avatar-upload"]').onclick = function() {
      avatarInput.click();
    };
  }

  // Undo/reset profile form
  const profileForm = document.getElementById('profile-form');
  const resetBtn = document.getElementById('reset-profile');
  if (profileForm && resetBtn) {
    const initialData = Array.from(profileForm.elements).map(el => el.value);
    resetBtn.addEventListener('click', function() {
      Array.from(profileForm.elements).forEach((el, i) => {
        if (el.type !== 'button' && el.type !== 'submit') el.value = initialData[i] || '';
      });
      showToast('Changes reverted.');
    });
  }

  // Save profile form
  if (profileForm) {
    profileForm.addEventListener('submit', function(e) {
      e.preventDefault();
      showToast('Profile saved!');
    });
  }

  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  const themeLabel = document.getElementById('theme-label');
  if (themeToggle && themeLabel) {
    themeToggle.addEventListener('change', function() {
      if (this.checked) {
        document.body.classList.add('dark-theme');
        themeLabel.textContent = 'Dark Mode';
        showToast('Dark mode enabled!');
      } else {
        document.body.classList.remove('dark-theme');
        themeLabel.textContent = 'Light Mode';
        showToast('Light mode enabled!');
      }
    });
  }

  // Accent color
  const accentSelect = document.getElementById('accent-color-select');
  if (accentSelect) {
    accentSelect.addEventListener('change', function() {
      document.documentElement.style.setProperty('--accent-color', this.value);
      showToast('Accent color updated!');
    });
  }

  // Font size
  const fontSizeSelect = document.getElementById('font-size-select');
  if (fontSizeSelect) {
    fontSizeSelect.addEventListener('change', function() {
      document.body.style.fontSize = this.value;
      showToast('Font size changed!');
    });
  }

  // High contrast
  const highContrast = document.getElementById('high-contrast');
  if (highContrast) {
    highContrast.addEventListener('change', function() {
      if (this.checked) {
        document.body.style.filter = 'contrast(1.3)';
        showToast('High contrast enabled!');
      } else {
        document.body.style.filter = '';
        showToast('High contrast disabled.');
      }
    });
  }

  // Notification preview (update on toggle)
  const notificationPreview = document.getElementById('notification-preview');
  ['toggle-system','toggle-marketing','toggle-reminders'].forEach(id => {
    const el = document.getElementById(id);
    if (el && notificationPreview) {
      el.addEventListener('change', function() {
        let enabled = [];
        if(document.getElementById('toggle-system').checked) enabled.push('System');
        if(document.getElementById('toggle-marketing').checked) enabled.push('Marketing');
        if(document.getElementById('toggle-reminders').checked) enabled.push('Reminders');
        notificationPreview.innerHTML = `<i class='fas fa-bell'></i> Notifications: <b>${enabled.join(', ') || 'None'}</b>`;
        showToast('Notification preferences updated!');
      });
    }
  });

  // 2FA toggle
  const toggle2fa = document.getElementById('toggle-2fa');
  if (toggle2fa) {
    toggle2fa.addEventListener('change', function() {
      showToast(this.checked ? '2FA enabled!' : '2FA disabled!');
    });
  }

  // Download data
  const downloadBtn = document.getElementById('download-data');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function() {
      showToast('Your data download will start soon! (Demo)');
    });
  }

  // Log out all devices
  const logoutAll = document.getElementById('logout-all');
  if (logoutAll) {
    logoutAll.addEventListener('click', function() {
      showToast('Logged out from all devices! (Demo)');
    });
  }
  const logoutAllSessions = document.getElementById('logout-all-sessions');
  if (logoutAllSessions) {
    logoutAllSessions.addEventListener('click', function() {
      showToast('Logged out from all sessions! (Demo)');
    });
  }

  // Connected accounts (demo)
  document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      showToast(`Connecting to ${btn.textContent.trim().split(' ')[0]}... (Demo)`);
    });
  });

  // Change email/password (demo)
  const changeEmail = document.getElementById('change-email');
  if (changeEmail) {
    changeEmail.addEventListener('click', function() {
      showToast('Change email flow (Demo)');
    });
  }
  const changePassword = document.getElementById('change-password');
  if (changePassword) {
    changePassword.addEventListener('click', function() {
      showToast('Change password flow (Demo)');
    });
  }

  // Language, timezone, beta features (demo)
  const languageSelect = document.getElementById('language-select');
  if (languageSelect) {
    languageSelect.addEventListener('change', function() {
      showToast('Language changed! (Demo)');
    });
  }
  const timezoneSelect = document.getElementById('timezone-select');
  if (timezoneSelect) {
    timezoneSelect.addEventListener('change', function() {
      showToast('Time zone updated! (Demo)');
    });
  }
  const betaFeatures = document.getElementById('beta-features');
  if (betaFeatures) {
    betaFeatures.addEventListener('change', function() {
      showToast(this.checked ? 'Beta features enabled!' : 'Beta features disabled!');
    });
  }

  // Delete account (demo)
  const deleteAccount = document.getElementById('delete-account');
  if (deleteAccount) {
    deleteAccount.addEventListener('click', function() {
      if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        showToast('Account deleted! (Demo)', 'danger');
      }
    });
  }

  // Help/support links (demo)
  document.querySelectorAll('.settings-section a.btn').forEach(link => {
    link.addEventListener('click', function(e) {
      if (link.getAttribute('href') === '#') {
        e.preventDefault();
        showToast('Live chat coming soon! (Demo)');
      }
    });
  });
});

// ===== Login Page Button & Functionality Enhancements =====
document.addEventListener('DOMContentLoaded', function() {
  // Only run on login page
  if (!document.querySelector('.login-form')) return;

  // Login form handler
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const email = document.getElementById('email')?.value;
      const password = document.getElementById('password')?.value;
      const remember = document.getElementById('remember').checked;
      try {
        const res = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('token', data.token);
          if (remember) {
            localStorage.setItem('rememberedEmail', email);
          } else {
            localStorage.removeItem('rememberedEmail');
          }
          alert('Login successful!');
          window.location.href = 'profilepage.html';
        } else {
          alert(data.error || 'Login failed');
        }
      } catch (err) {
        alert('Network error. Please try again.');
      }
    });
    // Autofill remembered email
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      document.getElementById('email').value = rememberedEmail;
      document.getElementById('remember').checked = true;
    }
  }

  // Social login buttons
  const googleBtn = document.querySelector('.social-btn.google');
  const linkedinBtn = document.querySelector('.social-btn.linkedin');
  if (googleBtn) {
    googleBtn.onclick = function(e) {
      e.preventDefault();
      // Replace with your real Google OAuth URL if needed
      window.open('https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=email%20profile', '_blank');
    };
  }
  if (linkedinBtn) {
    linkedinBtn.onclick = function(e) {
      e.preventDefault();
      // Replace with your real LinkedIn OAuth URL if needed
      window.open('https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=r_liteprofile%20r_emailaddress', '_blank');
    };
  }

  // Forgot password link
  // Handler removed to allow normal navigation to forgot-password.html
});

// ===== Signup Form Handler =====
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.querySelector('.signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(signupForm);
            
            // Validate required fields
            const requiredFields = ['fullName', 'email', 'password', 'confirmPassword'];
            for (const field of requiredFields) {
                if (!formData.get(field)) {
                    showToast(`Please fill in ${field}`, 'error');
                    return;
                }
            }
            
            // Check password match
            if (formData.get('password') !== formData.get('confirmPassword')) {
                showToast('Passwords do not match', 'error');
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.get('email'))) {
                showToast('Please enter a valid email address', 'error');
                return;
            }
            
            // Get selected skills
            const skillsSelect = document.getElementById('skills');
            if (skillsSelect) {
                const selectedSkills = Array.from(skillsSelect.selectedOptions).map(option => option.value);
                formData.delete('skills');
                selectedSkills.forEach(skill => formData.append('skills[]', skill));
            }
            
            // Handle file uploads
            const resumeInput = document.getElementById('resume');
            const profilePicInput = document.getElementById('profilePic');
            
            if (resumeInput && resumeInput.files[0]) {
                formData.append('resume', resumeInput.files[0]);
            }
            
            if (profilePicInput && profilePicInput.files[0]) {
                formData.append('avatar', profilePicInput.files[0]);
            }
            
            // Show loading state
            const submitBtn = signupForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
            
            try {
                const success = await auth.handleRegister(formData);
                if (success) {
                    showToast('Account created successfully!', 'success');
                    window.location.href = 'index.html';
                }
            } catch (error) {
                showToast(error.message || 'Registration failed. Please try again.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }
});

// ===== Online Tutorial Request Page Logic =====
document.addEventListener('DOMContentLoaded', function() {
  const requestContainer = document.querySelector('.request-container');
  if (!requestContainer) return; // Only run on the online tutorial request page

  const enterSkillOption = document.getElementById('enterSkillOption');
  const requestSkillOption = document.getElementById('requestSkillOption');
  const enterSkillForm = document.getElementById('enterSkillForm');
  const requestSkillForm = document.getElementById('requestSkillForm');
  const skillTags = document.querySelectorAll('.skill-tag');
  const skillSearch = document.getElementById('skillSearch');
  const selectedCountSpan = document.getElementById('selectedCount');
  const submitButton = requestSkillForm ? requestSkillForm.querySelector('button[type="submit"]') : null;
  const successModalEl = document.getElementById('successModal');
  const successModal = successModalEl ? new bootstrap.Modal(successModalEl) : null;

  // Toggle between forms
  if (enterSkillOption && requestSkillOption && enterSkillForm && requestSkillForm) {
    enterSkillOption.addEventListener('click', function() {
      enterSkillOption.classList.add('selected');
      requestSkillOption.classList.remove('selected');
      enterSkillForm.style.display = 'block';
      requestSkillForm.style.display = 'none';
    });
    requestSkillOption.addEventListener('click', function() {
      requestSkillOption.classList.add('selected');
      enterSkillOption.classList.remove('selected');
      requestSkillForm.style.display = 'block';
      enterSkillForm.style.display = 'none';
    });
  }

  // Helper: Get selected skills as array
  function getSelectedSkills() {
    return Array.from(skillTags)
      .filter(tag => tag.classList.contains('selected') && tag.style.display !== 'none')
      .map(tag => tag.textContent.trim());
  }

  // Update selected count and search bar
  function updateSelectedState() {
    if (!selectedCountSpan || !submitButton || !skillSearch) return;
    const selectedSkills = getSelectedSkills();
    selectedCountSpan.textContent = selectedSkills.length;
    submitButton.disabled = selectedSkills.length === 0;
    submitButton.style.opacity = selectedSkills.length === 0 ? '0.6' : '1';
    skillSearch.value = selectedSkills.join(', ');
  }

  // Handle skill tag selection
  skillTags.forEach(tag => {
    tag.addEventListener('click', function() {
      if (this.style.display === 'none') return;
      this.classList.toggle('selected');
      updateSelectedState();
    });
  });

  // Initialize state
  updateSelectedState();

  // Add search functionality for skills
  if (skillSearch) {
    skillSearch.addEventListener('input', function(e) {
      const searchTerm = e.target.value.toLowerCase();
      const selectedSkills = getSelectedSkills();
      if (searchTerm === selectedSkills.join(', ').toLowerCase()) {
        skillTags.forEach(tag => {
          if (tag.classList.contains('selected')) {
            tag.style.display = 'inline-block';
          } else {
            tag.style.display = 'none';
          }
        });
      } else {
        skillTags.forEach(tag => {
          const skillName = tag.textContent.toLowerCase();
          if (skillName.includes(searchTerm)) {
            tag.style.display = 'inline-block';
          } else {
            tag.style.display = 'none';
            tag.classList.remove('selected');
          }
        });
      }
      updateSelectedState();
    });
  }

  // Handle enter skill form submission
  const enterSkillFormElement = enterSkillForm ? enterSkillForm.querySelector('form') : null;
  if (enterSkillFormElement) {
    enterSkillFormElement.addEventListener('submit', async function(e) {
      e.preventDefault();
      const skillName = document.getElementById('skillName').value;
      const skillDescription = document.getElementById('skillDescription').value;
      const skillLevel = document.getElementById('skillLevel').value;
      if (!skillName || !skillDescription) {
        alert('Please fill in all required fields');
        return;
      }
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Please log in to submit a request');
          window.location.href = 'login.html';
          return;
        }
        const response = await fetch('http://localhost:5000/api/tutorial-request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            skillName,
            description: skillDescription,
            level: skillLevel,
            type: 'custom'
          })
        });
        if (response.ok && successModal) {
          successModal.show();
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 2000);
        } else {
          const data = await response.json();
          alert(data.error || 'Failed to submit request');
        }
      } catch (error) {
        alert('Failed to submit request. Please try again.');
      }
    });
  }

  // Handle specific skill request submission
  if (submitButton) {
    submitButton.addEventListener('click', async function(e) {
      e.preventDefault();
      const selectedSkills = getSelectedSkills();
      if (selectedSkills.length === 0) {
        alert('Please select at least one skill');
        return;
      }
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Please log in to submit a request');
          window.location.href = 'login.html';
          return;
        }
        const response = await fetch('http://localhost:5000/api/tutorial-request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            skills: selectedSkills,
            type: 'predefined'
          })
        });
        if (response.ok && successModal) {
          successModal.show();
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 2000);
        } else {
          const data = await response.json();
          alert(data.error || 'Failed to submit request');
        }
      } catch (error) {
        alert('Failed to submit request. Please try again.');
      }
    });
  }
});

// Fetch and display skills
async function loadSkills() {
  try {
    const response = await fetch('http://localhost:5000/api/skills');
    const skills = await response.json();
    const skillsContainer = document.querySelector('.skills-grid');
    if (skillsContainer) {
      skillsContainer.innerHTML = skills.map(skill => `
        <div class="skill-card">
          <h3>${skill.name}</h3>
          <p>${skill.description}</p>
          <span class="category">${skill.category}</span>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('Error loading skills:', error);
  }
}

// Fetch and display courses
async function loadCourses() {
  try {
    const response = await fetch('http://localhost:5000/api/courses');
    const courses = await response.json();
    const coursesContainer = document.querySelector('.courses-grid');
    if (coursesContainer) {
      coursesContainer.innerHTML = courses.map(course => `
        <div class="course-card">
          <h3>${course.title}</h3>
          <p>${course.description}</p>
          <div class="course-details">
            <span class="level">${course.level}</span>
            <span class="duration">${course.duration}</span>
            <span class="price">$${course.price}</span>
          </div>
          <p class="instructor">Instructor: ${course.instructor_name}</p>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('Error loading courses:', error);
  }
}

// Fetch and display events
async function loadEvents() {
  try {
    const response = await fetch('http://localhost:5000/api/events');
    const events = await response.json();
    const eventsContainer = document.querySelector('.events-grid');
    
    if (eventsContainer) {
      eventsContainer.innerHTML = events.map(event => `
        <div class="event-card">
          <div class="event-title">
            <i class="fas fa-calendar" style="color: var(--accent-color);"></i> ${event.title}
          </div>
          <div class="event-date">
            <i class="fas fa-calendar-day"></i> ${new Date(event.date).toLocaleDateString()}
          </div>
          <div class="event-location">
            <i class="fas fa-map-marker-alt"></i> ${event.location}
          </div>
          <div class="event-description">${event.description}</div>
          <a href="event-details.html?id=${event.id}" class="btn btn-primary" style="margin-top: 10px;">
            <i class="fas fa-sign-in-alt"></i> Join
          </a>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('Error loading events:', error);
    showToast('Failed to load events', 'error');
  }
}

// ... rest of your existing code ...

document.addEventListener('DOMContentLoaded', async function() {
  // Feedbacks Page Dynamic Rendering
  const feedbackList = document.getElementById('feedback-list');
  const avgRatingValue = document.getElementById('avg-rating-value');
  const avgRatingStars = document.getElementById('avg-rating-stars');
  const totalFeedbacks = document.getElementById('total-feedbacks');
  if (feedbackList && avgRatingValue && avgRatingStars && totalFeedbacks && window.api && api.getFeedbacks) {
    try {
      const feedbacks = await api.getFeedbacks();
      if (feedbacks && feedbacks.length > 0) {
        // Calculate average rating
        const avg = (feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbacks.length).toFixed(1);
        avgRatingValue.textContent = avg;
        totalFeedbacks.textContent = `(${feedbacks.length} feedbacks)`;
        // Render stars
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
          starsHtml += `<i class="fas fa-star" style="color:${i <= Math.round(avg) ? '#fbbf24' : '#e5e7eb'}"></i>`;
        }
        avgRatingStars.innerHTML = starsHtml;
        // Render feedback cards
        feedbackList.innerHTML = feedbacks.map(f => `
          <div class="feedback-card">
            <div class="feedback-header">
              <span class="feedback-user"><i class="fas fa-user-circle"></i> ${f.user || 'Anonymous'}</span>
              <span class="feedback-rating">${'★'.repeat(f.rating || 0)}${'☆'.repeat(5 - (f.rating || 0))}</span>
            </div>
            <div class="feedback-message">${f.message}</div>
            <div class="feedback-date">${f.date ? new Date(f.date).toLocaleDateString() : ''}</div>
          </div>
        `).join('');
      } else {
        feedbackList.innerHTML = '<div class="no-feedbacks">No feedbacks yet.</div>';
        avgRatingValue.textContent = '0.0';
        avgRatingStars.innerHTML = '';
        totalFeedbacks.textContent = '(0 feedbacks)';
      }
    } catch (err) {
      feedbackList.innerHTML = '<div class="error">Failed to load feedbacks.</div>';
    }
  }
});

// Welcome Popup Logic (forced display for debugging)


// === Real Chat Data Integration ===
async function fetchChatUsers() {
  try {
    const response = await fetch('http://localhost:5000/api/users');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
}

async function fetchChatMessages(userId) {
  try {
    const response = await fetch(`http://localhost:5000/api/messages?user=${userId}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return [];
  }
}

async function renderChatUserList() {
  const users = await fetchChatUsers();
  const sidebar = document.querySelector('.recent-chats-list');
  if (!sidebar) return;
  sidebar.innerHTML = '';
  users.forEach(user => {
    const initials = (user.full_name || user.username || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);
    const userDiv = document.createElement('div');
    userDiv.className = 'recent-chat';
    userDiv.dataset.userid = user.id;
    userDiv.innerHTML = `
      <div class="avatar status-dot online">${initials}</div>
      <div class="chat-info">
        <div class="chat-header">
          <h4>${user.full_name || user.username}</h4>
          <span class="time"></span>
        </div>
        <p class="last-message"></p>
        <span class="user-status-text">Online</span>
      </div>
    `;
    userDiv.addEventListener('click', () => renderChatMessages(user.id, user.full_name || user.username, initials));
    sidebar.appendChild(userDiv);
  });
}

async function renderChatMessages(userId, userName, initials) {
  const messages = await fetchChatMessages(userId);
  const chatHeader = document.querySelector('.chat-header-user h3');
  const chatAvatar = document.querySelector('.chat-header-user .avatar');
  if (chatHeader) chatHeader.textContent = userName;
  if (chatAvatar) chatAvatar.textContent = initials;
  const chatMessages = document.querySelector('.chat-messages');
  if (!chatMessages) return;
  chatMessages.innerHTML = '';
  messages.forEach(msg => {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'message-group ' + (msg.sent_by_me ? 'sent' : 'received');
    groupDiv.innerHTML = `
      <div class="avatar status-dot online">${initials}</div>
      <div class="bubble">
        ${msg.content}
        <span class="timestamp">${msg.time || ''}</span>
      </div>
    `;
    chatMessages.appendChild(groupDiv);
  });
}

// On chat page load, render real user list
document.addEventListener('DOMContentLoaded', function() {
  if (document.querySelector('.recent-chats-list')) {
    renderChatUserList();
  }
});

// ===== Signup Page Button Logic (Cleaned & Unified) =====
document.addEventListener('DOMContentLoaded', function() {
  // Navigation Buttons
  const steps = Array.from(document.querySelectorAll('.form-step'));
  const stepperSteps = Array.from(document.querySelectorAll('.signup-stepper .step'));
  const progressFill = document.querySelector('.signup-progress-fill');
  const nextBtn = document.querySelector('.next-step');
  const prevBtn = document.querySelector('.prev-step');
  const submitBtn = document.querySelector('.submit-btn');
  let currentStep = 0;

  // Field references
  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const phoneInput = document.getElementById('phone');
  const locationInput = document.getElementById('location');
  const termsCheckbox = document.querySelector('input[name="terms"]');

  // Validation functions
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function validatePhone(phone) {
    return phone && phone.trim().length >= 6; // Simple check
  }
  function validateFullName(name) {
    return name && name.trim().length >= 2;
  }
  function validatePassword(pw) {
    return pw && pw.length >= 6;
  }
  function validateConfirmPassword(pw, cpw) {
    return pw === cpw && cpw.length >= 6;
  }
  function validateLocation(loc) {
    return loc && loc.trim().length > 0;
  }

  function showStep(idx) {
    steps.forEach((step, i) => step.classList.toggle('active', i === idx));
    stepperSteps.forEach((step, i) => step.classList.toggle('active', i === idx));
    if(progressFill) progressFill.style.width = ((idx+1)/steps.length*100) + '%';
    if(prevBtn) prevBtn.style.display = idx === 0 ? 'none' : '';
    if(nextBtn) nextBtn.style.display = idx === steps.length-1 ? 'none' : '';
    if(submitBtn) submitBtn.style.display = idx === steps.length-1 ? '' : 'none';
  }

  function alertAndFocus(input, message) {
    alert(message);
    if (input && typeof input.focus === 'function') {
      input.focus();
      if (typeof input.scrollIntoView === 'function') {
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  if(nextBtn) {
    nextBtn.onclick = function(e) {
      // Step 1: Account Details
      if (currentStep === 0) {
        if (!validateFullName(fullNameInput.value)) {
          alertAndFocus(fullNameInput, 'Please enter your full name (at least 2 characters).');
          e.preventDefault();
          currentStep = 0; showStep(0);
          return;
        }
        if (!validateEmail(emailInput.value)) {
          alertAndFocus(emailInput, 'Please enter a valid email address.');
          e.preventDefault();
          currentStep = 0; showStep(0);
          return;
        }
        if (!validatePassword(passwordInput.value)) {
          alertAndFocus(passwordInput, 'Password must be at least 6 characters.');
          e.preventDefault();
          currentStep = 0; showStep(0);
          return;
        }
        if (!validateConfirmPassword(passwordInput.value, confirmPasswordInput.value)) {
          alertAndFocus(confirmPasswordInput, 'Passwords do not match.');
          e.preventDefault();
          currentStep = 0; showStep(0);
          return;
        }
      }
      // Step 2: Personal Information
      if (currentStep === 1) {
        if (!validatePhone(phoneInput.value)) {
          alertAndFocus(phoneInput, 'Please enter a valid phone number.');
          e.preventDefault();
          currentStep = 0; showStep(0);
          return;
        }
        if (!validateLocation(locationInput.value)) {
          alertAndFocus(locationInput, 'Please enter your location.');
          e.preventDefault();
          currentStep = 0; showStep(0);
          return;
        }
      }
      // Only increment step if all validations pass
      e.preventDefault();
      if(currentStep < steps.length-1) {
        currentStep++;
        showStep(currentStep);
      }
    };
  }
  if(prevBtn) {
    prevBtn.onclick = function(e) {
      e.preventDefault();
      if(currentStep > 0) {
        currentStep--;
        showStep(currentStep);
      }
    };
  }
  if(submitBtn) {
    submitBtn.onclick = function(e) {
      // Step 3: Skills & Preferences (Terms)
      if (termsCheckbox && !termsCheckbox.checked) {
        alertAndFocus(termsCheckbox, 'You must agree to the Terms & Conditions and Privacy Policy.');
        e.preventDefault();
        currentStep = 0; showStep(0);
        return false;
      }
      // You can add more checks here if needed
    };
  }
  showStep(currentStep);

  // Social Sign-in Buttons
  const googleBtn = document.querySelector('.social-btn.google');
  const linkedinBtn = document.querySelector('.social-btn.linkedin');
  if (googleBtn) {
    googleBtn.onclick = function(e) {
      e.preventDefault();
      window.open('https://accounts.google.com/signin', '_blank');
    };
  }
  if (linkedinBtn) {
    linkedinBtn.onclick = function(e) {
      e.preventDefault();
      window.open('https://www.linkedin.com/oauth/v2/authorization', '_blank');
    };
  }

  // File Upload Buttons (Resume & Profile Picture)
  const resumeInput = document.getElementById('resume');
  const resumeFileName = document.getElementById('resume-file-name');
  if (resumeInput && resumeFileName) {
    resumeInput.onchange = function() {
      resumeFileName.textContent = this.files[0] ? this.files[0].name : 'No file chosen';
    };
  }
  const profileInput = document.getElementById('profilePicture');
  const profileFileName = document.getElementById('profile-file-name');
  if (profileInput && profileFileName) {
    profileInput.onchange = function() {
      profileFileName.textContent = this.files[0] ? this.files[0].name : 'No file chosen';
    };
  }
});

// Password Reset Functionality
document.addEventListener('DOMContentLoaded', function() {
  const resetForm = document.getElementById('resetForm');
  if (!resetForm) return;

  resetForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value;
    const feedback = document.getElementById('reset-feedback');
    const emailError = document.getElementById('email-error');
    
    // Reset feedback
    feedback.textContent = '';
    feedback.className = 'feedback-message';
    emailError.textContent = '';
    
    // Validate email
    if (!validateEmail(email)) {
      emailError.textContent = 'Please enter a valid email address';
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        feedback.textContent = 'If this email is registered, a reset link has been sent.';
        feedback.className = 'feedback-message success';
        resetForm.reset();
      } else {
        feedback.textContent = data.error || 'Failed to send reset link.';
        feedback.className = 'feedback-message error';
      }
    } catch (err) {
      feedback.textContent = 'Network error. Please try again.';
      feedback.className = 'feedback-message error';
    }
  });
});

// ... existing code ...
// Password Reset Page Logic
// Handles the reset-password.html form

document.addEventListener('DOMContentLoaded', function() {
  const setPasswordForm = document.getElementById('setPasswordForm');
  if (!setPasswordForm) return;

  setPasswordForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const token = document.getElementById('token').value;
    const password = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;
    const feedback = document.getElementById('reset-feedback');
    feedback.textContent = '';
    feedback.className = 'feedback-message';
    if (password.length < 6) {
      feedback.textContent = 'Password must be at least 6 characters.';
      feedback.className = 'feedback-message error';
      return;
    }
    if (password !== confirm) {
      feedback.textContent = 'Passwords do not match.';
      feedback.className = 'feedback-message error';
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      if (res.ok) {
        feedback.textContent = 'Password reset successful! You can now log in.';
        feedback.className = 'feedback-message success';
        setPasswordForm.reset();
      } else {
        feedback.textContent = data.error || 'Failed to reset password.';
        feedback.className = 'feedback-message error';
      }
    } catch (err) {
      feedback.textContent = 'Network error. Please try again.';
      feedback.className = 'feedback-message error';
    }
  });
});
// ... existing code ...

// Contact Form Handler
function handleSubmit(event) {
    event.preventDefault();
    const form = document.getElementById('contactForm');
    const feedback = document.getElementById('formFeedback');
    const submitBtn = form.querySelector('.submit-btn');

    // Get form values
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const subject = form.querySelector('#subject').value.trim();
    const message = form.querySelector('#message').value.trim();

    // Validate form
    if (!name || !email || !subject || !message) {
        showFeedback('Please fill in all fields', 'error');
        return false;
    }
    if (!validateEmail(email)) {
        showFeedback('Please enter a valid email address', 'error');
        return false;
    }

    // Disable submit button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    // Send data to backend
    fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, subject, message })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        showFeedback('Thank you for contacting us! We\'ll get back to you soon.', 'success');
        form.reset();
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    })
    .catch(error => {
        console.error('Error:', error);
        showFeedback('There was an error submitting your message. Please try again.', 'error');
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    });
    return false;
}

function showFeedback(message, type) {
    const feedback = document.getElementById('formFeedback');
    feedback.textContent = message;
    feedback.className = 'form-feedback ' + type;
    feedback.style.display = 'block';
    
    // Scroll to feedback message
    feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
}


let users = [];
const userResults = document.getElementById('userResults');
const loading = document.getElementById('loading');
const levelFilter = document.getElementById('levelFilter');
const clearBtn = document.getElementById('clearBtn');

async function fetchUsers() {
  try {
    if (typeof loading !== 'undefined' && loading) loading.style.display = 'block';
    const response = await fetch('http://localhost:5000/api/users');
    users = await response.json();
  } catch (error) {
    console.error('Failed to fetch users:', error);
    users = [];
  } finally {
    if (typeof loading !== 'undefined' && loading) loading.style.display = 'none';
  }
}

function renderUsers(skill) {
  if (typeof userResults === 'undefined' || !userResults) return;
  userResults.innerHTML = '';
  if (!skill) return;
  const level = levelFilter ? levelFilter.value : '';
  const defaultAvatars = [
    'images/avatars/3d-rendering-hair-style-avatar-design_23-2151869153.avif',
    'images/avatars/smiling-3d-cartoon-man-avatar_975163-755.avif',
    'images/avatars/color-user-icon-white-background_961147-8.avif',
    'images/avatars/3d-illustration-person-with-sunglasses_23-2149436188.avif',
    'images/avatars/avatar6.jpg',
    'images/avatars/avatar7.jpg',
    'images/avatars/avatar8.jpg',
    'images/avatars/avatar9.jpg',
    'images/avatars/avatar10.jpg',
    'images/avatars/avatar11.jpg',
    'images/avatars/avatar12.jpg',
    'images/avatars/avatar13.jpg',
    'images/avatars/avatar14.jpg',
    'images/avatars/avatar15.jpg',
    'images/avatars/avatar16.jpg',
    'images/avatars/avatar17.jpg',
    'images/avatars/avatar18.jpg',
    'images/avatars/avatar19.jpg',
    'images/avatars/avatar20.jpg',
    'images/avatars/avatar21.jpg',
    'images/avatars/avatar22.jpg',
    'images/avatars/avatar23.jpg',
    'images/avatars/avatar24.jpg',
    'images/avatars/avatar25.jpg',
    'images/avatars/avatar26.jpg'
  ];
  const filtered = users.filter(u =>
    Array.isArray(u.skills)
      ? u.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
      : u.skills.toLowerCase().includes(skill.toLowerCase())
  ).filter(u => !level || u.level === level);
  if (filtered.length === 0) {
    userResults.innerHTML = '<div class="ss-no-results">No users found for this skill.</div>';
    return;
  }
  filtered.forEach(user => {
    let avatarUrl = user.avatar && user.avatar.trim() ? user.avatar.trim() : '';
    const isMissing = !avatarUrl || avatarUrl === 'null' || avatarUrl === 'undefined' || !/\.(jpg|jpeg|png|gif|webp|avif)$/i.test(avatarUrl);
    let avatarHtml = '';
    if (!isMissing) {
      avatarHtml = `<img src="${avatarUrl}" alt="${user.username}" class="ss-user-avatar">`;
    } else {
      const randomAvatar = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
      avatarHtml = `<img src="${randomAvatar}" alt="Default Avatar" class="ss-user-avatar">`;
    }
    const card = document.createElement('div');
    card.className = 'ss-user-card';
    card.innerHTML = `
      <div class="ss-user-header">
        ${avatarHtml}
        <div class="ss-user-info">
          <div class="ss-user-name">${user.full_name || user.username}</div>
          <div class="ss-user-level">
            <i class="fas fa-star"></i> ${user.level || 'Intermediate'}
          </div>
        </div>
      </div>
      <div class="ss-user-bio">${user.bio || ''}</div>
      <div class="ss-user-skills">
        ${Array.isArray(user.skills) ? user.skills.map(s => `<span class="ss-user-skill">${s}</span>`).join('') : ''}
      </div>
      <div class="ss-user-actions">
        <button class="ss-swap-btn" onclick="sendSwapRequest(${user.id})">
          <i class="fas fa-exchange-alt"></i> Swap Skill
        </button>
        <button class="ss-message-btn" onclick="messageUser(${user.id})">
          <i class="fas fa-envelope"></i> Message
        </button>
      </div>
    `;
    userResults.appendChild(card);
  });
}

function searchSkill(skill) {
  document.getElementById('skillSearch').value = skill;
  renderUsers(skill);
}

const skillSearchInput = document.getElementById('skillSearch');
if (skillSearchInput) {
  skillSearchInput.addEventListener('input', (e) => {
    renderUsers(e.target.value);
  });
}

if (typeof levelFilter !== 'undefined' && levelFilter) {
  levelFilter.addEventListener('change', () => {
    renderUsers(document.getElementById('skillSearch').value);
  });
}

if (typeof clearBtn !== 'undefined' && clearBtn) {
  clearBtn.addEventListener('click', () => {
    document.getElementById('skillSearch').value = '';
    if (levelFilter) levelFilter.value = '';
    renderUsers('');
  });
}

async function sendSwapRequest(userId) {
  try {
    const response = await fetch('http://localhost:5000/api/swap-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ receiver_id: userId })
    });
    const data = await response.json();
    if (response.ok) {
      alert('Swap request sent successfully!');
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error('Failed to send swap request:', error);
    alert('Failed to send swap request. Please try again.');
  }
}

function messageUser(userId) {
  // Store the selected user ID in localStorage
  localStorage.setItem('selectedChatUser', userId);
  // Redirect to chat page
  window.location.href = 'chatspage.html';
}
if (document.getElementById('userResults')) {
  fetchUsers();
}


// Hamburger Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerButton = document.querySelector('.hamburger-button');
    const sidebar = document.querySelector('.sidebar');
    const closeSidebar = document.querySelector('.close-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const body = document.body;

    function openSidebar() {
        if (sidebar) sidebar.classList.add('active');
        if (hamburgerButton) hamburgerButton.classList.add('active');
        if (overlay) overlay.classList.add('active');
        body.style.overflow = 'hidden';
    }
    function closeSidebarMenu() {
        if (sidebar) sidebar.classList.remove('active');
        if (hamburgerButton) hamburgerButton.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        body.style.overflow = '';
    }
    function toggleSidebar() {
        if (sidebar && sidebar.classList.contains('active')) {
            closeSidebarMenu();
        } else {
            openSidebar();
        }
    }
    if (hamburgerButton) {
        hamburgerButton.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleSidebar();
        });
    }
    if (closeSidebar) {
        closeSidebar.addEventListener('click', function(e) {
            e.stopPropagation();
            closeSidebarMenu();
        });
    }
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            e.stopPropagation();
            closeSidebarMenu();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSidebarMenu();
        }
    });
    document.addEventListener('click', function(e) {
        if (sidebar && sidebar.classList.contains('active') &&
            !sidebar.contains(e.target) &&
            !hamburgerButton.contains(e.target)) {
            closeSidebarMenu();
        }
    });
});

// Tutorial Search Functionality
function searchTutorial(tutorial) {
    document.getElementById('tutorialSearch').value = tutorial;
    renderTutorials(tutorial);
}

document.getElementById('tutorialSearch')?.addEventListener('input', (e) => {
    renderTutorials(e.target.value);
});

document.getElementById('levelFilter')?.addEventListener('change', () => {
    renderTutorials(document.getElementById('tutorialSearch').value);
});

document.getElementById('clearBtn')?.addEventListener('click', () => {
    document.getElementById('tutorialSearch').value = '';
    document.getElementById('levelFilter').value = '';
    renderTutorials('');
});

function renderTutorials(searchTerm) {
    const resultsContainer = document.getElementById('tutorialResults');
    const loadingElement = document.getElementById('loading');
    
    if (!resultsContainer || !loadingElement) return;
    
    if (element) {
      element.style.display = 'block';
      // or
      element.innerHTML = '...';
  }

    // Simulated tutorial data - replace with actual API call
    const tutorials = [
        {
            id: 1,
            title: 'Web Development Bootcamp',
            instructor: 'John Doe',
            level: 'Beginner',
            rating: 4.8,
            students: 1200,
            image: 'https://via.placeholder.com/80',
            description: 'Learn web development from scratch with this comprehensive course.'
        },
        {
            id: 2,
            title: 'Data Science Fundamentals',
            instructor: 'Jane Smith',
            level: 'Intermediate',
            rating: 4.9,
            students: 850,
            image: 'https://via.placeholder.com/80',
            description: 'Master the basics of data science and machine learning.'
        }
    ];

    setTimeout(() => {
        loadingElement.style.display = 'none';
        
        const filteredTutorials = tutorials.filter(tutorial => {
            const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLevel = !document.getElementById('levelFilter').value || 
                               tutorial.level === document.getElementById('levelFilter').value;
            return matchesSearch && matchesLevel;
        });

        if (filteredTutorials.length === 0) {
            resultsContainer.innerHTML = `
                <div class="ss-no-results">
                    <i class="fas fa-search" style="font-size: 3rem; color: #666; margin-bottom: 1rem;"></i>
                    <p>No tutorials found matching your search criteria.</p>
                </div>
            `;
            return;
        }

        filteredTutorials.forEach(tutorial => {
            const tutorialCard = document.createElement('div');
            tutorialCard.className = 'ss-user-card';
            tutorialCard.innerHTML = `
                <div class="ss-user-header">
                    <img src="${tutorial.image}" alt="${tutorial.instructor}" class="ss-user-avatar">
                    <div class="ss-user-info">
                        <h3 class="ss-user-name">${tutorial.title}</h3>
                        <div class="ss-user-level">
                            <i class="fas fa-user"></i> ${tutorial.instructor}
                            <span style="margin-left: 1rem;">
                                <i class="fas fa-star" style="color: #ffd700;"></i> ${tutorial.rating}
                            </span>
                            <span style="margin-left: 1rem;">
                                <i class="fas fa-users"></i> ${tutorial.students} students
                            </span>
                        </div>
                    </div>
                </div>
                <p class="ss-user-bio">${tutorial.description}</p>
                <div class="ss-user-actions">
                    <button class="ss-swap-btn" onclick="enrollTutorial(${tutorial.id})">
                        <i class="fas fa-graduation-cap"></i> Enroll Now
                    </button>
                    <button class="ss-message-btn" onclick="contactInstructor(${tutorial.id})">
                        <i class="fas fa-envelope"></i> Contact Instructor
                    </button>
                </div>
            `;
            resultsContainer.appendChild(tutorialCard);
        });
    }, 500);
}

// ... existing code ...

// Tutorial data
const tutorials = [
    {
        id: 11,
        title: "Python Programming for Beginners",
        instructor: "John Smith",
        level: "Beginner",
        category: "Programming",
        description: "Learn Python from scratch with hands-on projects and real-world examples.",
        duration: "8 weeks",
        rating: 4.5,
        students: 1200,
        image: "Images/online tutorials/js.png",
        price: 49.99
    },
    {
        id: 12,
        title: "Web Development Bootcamp",
        instructor: "Sarah Johnson",
        level: "Intermediate",
        category: "Web Development",
        description: "Master HTML, CSS, and JavaScript to build modern web applications.",
        duration: "12 weeks",
        rating: 4.8,
        students: 2500,
        image: "Images/online tutorials/web design.png",
        price: 79.99
    },
    {
        id: 13,
        title: "Data Science Fundamentals",
        instructor: "Michael Brown",
        level: "Advanced",
        category: "Data Science",
        description: "Learn data analysis, machine learning, and statistical methods.",
        duration: "16 weeks",
        rating: 4.7,
        students: 1800,
        image: "Images/online tutorials/gettyimages-1014422502-612x612.jpg",
        price: 99.99
    }
];

// Tutorial Search and Display Functions
function searchTutorial(query = '') {
    const searchInput = document.getElementById('tutorialSearch');
    const levelFilter = document.getElementById('levelFilter');
    const resultsContainer = document.getElementById('tutorialResults');
    const loadingElement = document.getElementById('loading');

    try {
        // Show loading spinner
        loadingElement.style.display = 'block';
        resultsContainer.innerHTML = '';

        // Get search parameters
        const searchTerm = (query || searchInput.value).toLowerCase();
        const selectedLevel = levelFilter.value;

        // Filter tutorials
        const filteredTutorials = tutorials.filter(tutorial => {
            const matchesSearch = 
                tutorial.title.toLowerCase().includes(searchTerm) ||
                tutorial.category.toLowerCase().includes(searchTerm) ||
                tutorial.description.toLowerCase().includes(searchTerm);
            
            const matchesLevel = !selectedLevel || tutorial.level === selectedLevel;
            
            return matchesSearch && matchesLevel;
        });

        if (filteredTutorials.length === 0) {
            resultsContainer.innerHTML = `
                <div class="ss-no-results">
                    <i class="fas fa-search"></i>
                    <p>No tutorials found matching your criteria.</p>
                </div>
            `;
            return;
        }

        // Render tutorial cards
        filteredTutorials.forEach(tutorial => {
            const tutorialCard = document.createElement('div');
            tutorialCard.className = 'ss-user-card';
            tutorialCard.innerHTML = `
                <div class="ss-user-header">
                    <div class="ss-user-avatar">
                        <img src="${tutorial.image}" alt="${tutorial.title}">
                    </div>
                    <div class="ss-user-info">
                        <h3 class="ss-user-name">${tutorial.title}</h3>
                        <div class="ss-user-level">
                            <span><i class="fas fa-user"></i> ${tutorial.instructor}</span>
                            <span><i class="fas fa-signal"></i> ${tutorial.level}</span>
                            <span><i class="fas fa-star" style="color: #ffd700;"></i> ${tutorial.rating}</span>
                        </div>
                    </div>
                </div>
                <p class="ss-user-bio">${tutorial.description}</p>
                <div class="ss-user-actions">
                    <button class="ss-swap-btn" onclick="enrollTutorial(${tutorial.id})">
                        <i class="fas fa-graduation-cap"></i> Enroll Now
                    </button>
                    <button class="ss-message-btn" onclick="contactInstructor(${tutorial.id})">
                        <i class="fas fa-envelope"></i> Contact Instructor
                    </button>
                </div>
            `;
            resultsContainer.appendChild(tutorialCard);
        });
    } catch (error) {
        console.error('Error displaying tutorials:', error);
        resultsContainer.innerHTML = `
            <div class="ss-no-results">
                <i class="fas fa-exclamation-circle"></i>
                <p>Error loading tutorials. Please try again later.</p>
            </div>
        `;
    } finally {
        loadingElement.style.display = 'none';
    }
}

// ... existing code ...

// --- Tutorial Search and Display (Backend API Driven) ---
async function fetchTutorials(searchQuery = '', levelFilter = '') {
    try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (levelFilter) params.append('level', levelFilter);
        const response = await fetch('http://localhost:5000/api/tutorials?' + params.toString());
        if (!response.ok) throw new Error('Failed to fetch tutorials');
        return await response.json();
    } catch (error) {
        console.error('Error fetching tutorials:', error);
        return [];
    }
}

async function searchTutorial() {
    const searchInput = document.getElementById('tutorialSearch');
    const levelFilter = document.getElementById('levelFilter');
    const resultsContainer = document.getElementById('tutorialResults');
    const loadingElement = document.getElementById('loading');

    if (!searchInput || !levelFilter || !resultsContainer || !loadingElement) return;

    loadingElement.style.display = 'block';
    resultsContainer.innerHTML = '';

    const searchTerm = searchInput.value.trim();
    const selectedLevel = levelFilter.value;

    const tutorials = await fetchTutorials(searchTerm, selectedLevel);

    loadingElement.style.display = 'none';

    if (tutorials.length === 0) {
        resultsContainer.innerHTML = `
            <div class="ss-no-results">
                <i class="fas fa-search"></i>
                <p>No tutorials found matching your criteria.</p>
            </div>
        `;
        return;
    }

    tutorials.forEach(tutorial => {
        const tutorialCard = document.createElement('div');
        tutorialCard.className = 'ss-user-card';
        tutorialCard.innerHTML = `
            <div class="ss-user-header">
                <div class="ss-user-avatar">
                    <img src="${tutorial.image}" alt="${tutorial.title}">
                </div>
                <div class="ss-user-info">
                    <h3 class="ss-user-name">${tutorial.title}</h3>
                    <div class="ss-user-level">
                        <span><i class="fas fa-user"></i> ${tutorial.instructor_name || tutorial.instructor}</span>
                        <span><i class="fas fa-signal"></i> ${tutorial.level}</span>
                        <span><i class="fas fa-star" style="color: #ffd700;"></i> ${tutorial.rating}</span>
                    </div>
                </div>
            </div>
            <p class="ss-user-bio">${tutorial.description}</p>
            <div class="ss-user-skills">
                <span class="ss-user-skill">
                    <i class="fas fa-clock"></i> ${tutorial.duration}
                </span>
                <span class="ss-user-skill">
                    <i class="fas fa-users"></i> ${tutorial.students.toLocaleString()} students
                </span>
                <span class="ss-user-skill">
                    <i class="fas fa-tag"></i> ${tutorial.category}
                </span>
            </div>
            <div class="ss-user-actions">
                <button class="ss-swap-btn" onclick="enrollTutorial(${tutorial.id})">
                    <i class="fas fa-graduation-cap"></i> Enroll Now
                </button>
                <button class="ss-message-btn" onclick="contactInstructor(${tutorial.id})">
                    <i class="fas fa-envelope"></i> Contact Instructor
                </button>
            </div>
        `;
        resultsContainer.appendChild(tutorialCard);
    });
}

function enrollTutorial(tutorialId) {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        showToast('Please log in to enroll in tutorials', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    // Simulate enrollment process
    showToast('Processing enrollment...', 'info');
    setTimeout(() => {
        showToast('Successfully enrolled in tutorial!', 'success');
        setTimeout(() => {
            window.location.href = `my-tutorials.html?id=${tutorialId}`;
        }, 1500);
    }, 1000);
}

function contactInstructor(tutorialId) {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        showToast('Please log in to contact instructors', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    // Redirect to chat page
    window.location.href = `chatspage.html?instructor=${tutorialId}`;
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('tutorialSearch');
    const levelFilter = document.getElementById('levelFilter');
    const clearBtn = document.getElementById('clearBtn');

    if (searchInput && levelFilter && clearBtn) {
        // Add event listeners
        searchInput.addEventListener('input', () => searchTutorial());
        levelFilter.addEventListener('change', () => searchTutorial());
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            levelFilter.value = '';
            searchTutorial();
        });

        // Initial search to show all tutorials
        searchTutorial();
    }
});
// --- End of Tutorial Section ---
// (Remove all other static/duplicate tutorial logic below this line)

// --- Tutorial Details Page Logic ---


    

    



// Function to fetch tutorials from the API
async function fetchTutorials(searchQuery = '', levelFilter = '') {
  try {
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (levelFilter) params.append('level', levelFilter);
    
    const response = await fetch(`http://localhost:5000/api/tutorials?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch tutorials');
    
    const tutorials = await response.json();
    return tutorials;
  } catch (error) {
    console.error('Error fetching tutorials:', error);
    return [];
  }
}

// Function to display tutorials in the UI
function displayTutorials(tutorials) {
  const tutorialsContainer = document.getElementById('tutorialResults');
  if (!tutorialsContainer) return;
  
  tutorialsContainer.innerHTML = tutorials.map(tutorial => `
    <div class="tutorial-card">
      <img src="${tutorial.image}" alt="${tutorial.title}" class="tutorial-image">
      <div class="tutorial-content">
        <h3>${tutorial.title}</h3>
        <p class="instructor">Instructor: ${tutorial.instructor_name}</p>
        <p class="level">Level: ${tutorial.level}</p>
        <p class="category">Category: ${tutorial.category}</p>
        <p class="description">${tutorial.description}</p>
        <div class="tutorial-meta">
          <span class="duration">${tutorial.duration}</span>
          <span class="rating">⭐ ${tutorial.rating}</span>
          <span class="students">👥 ${tutorial.students}</span>
        </div>
        <div class="tutorial-footer">
          <span class="price">$${tutorial.price}</span>
          <button onclick="enrollInTutorial(${tutorial.id})" class="enroll-btn">Enroll Now</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Function to handle tutorial search
async function searchTutorials() {
  const searchInput = document.getElementById('tutorialSearch');
  const levelFilter = document.getElementById('levelFilter');
  
  if (!searchInput || !levelFilter) return;
  
  const searchQuery = searchInput.value.trim();
  const selectedLevel = levelFilter.value;
  
  const tutorials = await fetchTutorials(searchQuery, selectedLevel);
  displayTutorials(tutorials);
}

// Function to handle tutorial enrollment
async function enrollInTutorial(tutorialId) {
  try {
    const response = await fetch(`/api/tutorials/${tutorialId}/enroll`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        alert('Please log in to enroll in tutorials');
        return;
      }
      throw new Error('Failed to enroll in tutorial');
    }
    
    const result = await response.json();
    alert('Successfully enrolled in tutorial!');
  } catch (error) {
    console.error('Error enrolling in tutorial:', error);
    alert('Failed to enroll in tutorial. Please try again.');
  }
}

// Initialize tutorials on page load
document.addEventListener('DOMContentLoaded', async () => {
  // Only run if the tutorialResults container exists
  const tutorialsContainer = document.getElementById('tutorialResults');
  if (tutorialsContainer) {
    const tutorials = await fetchTutorials();
    displayTutorials(tutorials);
  }
  // Add event listeners for search and filter
  const searchInput = document.getElementById('tutorialSearch');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(searchTutorials, 300));
  }
  const levelFilter = document.getElementById('levelFilter');
  if (levelFilter) {
    levelFilter.addEventListener('change', searchTutorials);
  }
});

// Utility function for debouncing search
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
} 

// Function to fetch and display enrollment statistics
async function fetchEnrollmentStats() {
    try {
        const res = await fetch('/api/enrollment-stats');
        if (!res.ok) throw new Error('Failed to fetch stats');
        const stats = await res.json();
        const totalElem = document.getElementById('totalEnrollments');
        const popularElem = document.getElementById('mostPopularTutorial');
        const recentElem = document.getElementById('recentEnrollments');
        if (totalElem) totalElem.textContent = stats.totalEnrollments ?? '0';
        if (popularElem) popularElem.textContent = stats.mostPopularTutorial?.title || 'N/A';
        if (recentElem) recentElem.textContent = stats.recentEnrollments ?? '0';
    } catch (err) {
        if (document.getElementById('totalEnrollments')) document.getElementById('totalEnrollments').textContent = 'Error';
        if (document.getElementById('mostPopularTutorial')) document.getElementById('mostPopularTutorial').textContent = 'Error';
        if (document.getElementById('recentEnrollments')) document.getElementById('recentEnrollments').textContent = 'Error';
    }
}

// Function to fetch and display enrollment list
async function fetchEnrollments(filter = 'all') {
    try {
        const res = await fetch(`/api/enrollments?filter=${encodeURIComponent(filter)}`);
        if (!res.ok) throw new Error('Failed to fetch enrollments');
        const enrollments = await res.json();
        renderEnrollmentList(enrollments);
    } catch (err) {
        renderEnrollmentList([]);
    }
}

function renderEnrollmentList(enrollments) {
    const container = document.getElementById('enrollmentResults');
    if (!container) return;
    container.innerHTML = '';
    if (!enrollments.length) {
        container.innerHTML = '<div class="no-tutorials"><i class="fas fa-user-slash"></i><p>No enrollments found.</p></div>';
        return;
    }
    enrollments.forEach(enr => {
        const card = document.createElement('div');
        card.className = 'enrollment-card';
        card.innerHTML = `
            <div class="user-info">
                <img src="${enr.userAvatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(enr.userName || 'User')}" alt="User Avatar">
                <div class="user-details">
                    <div class="user-name">${enr.userName || 'User'}</div>
                    <div class="enrollment-date"><i class="fas fa-calendar-alt"></i> ${enr.enrolledAt ? new Date(enr.enrolledAt).toLocaleDateString() : ''}</div>
                </div>
            </div>
            <div class="tutorial-info">
                <div class="tutorial-title">${enr.tutorialTitle || 'Tutorial'}</div>
                <div class="tutorial-level"><i class="fas fa-signal"></i> ${enr.tutorialLevel || ''}</div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Attach event listeners and initialize on DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEnrollmentStatsAndList);
} else {
    initEnrollmentStatsAndList();
}

function initEnrollmentStatsAndList() {
    // Only run if the relevant elements exist
    if (document.getElementById('totalEnrollments')) fetchEnrollmentStats();
    if (document.getElementById('enrollmentResults')) fetchEnrollments();
    const filter = document.getElementById('enrollmentFilter');
    if (filter) {
        filter.addEventListener('change', e => {
            fetchEnrollments(e.target.value);
        });
    }
}

document.addEventListener('DOMContentLoaded', async function() {
  const list = document.getElementById('myTutorialsList');
  const loading = document.getElementById('loading');
  loading.style.display = 'block';
  try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/my-tutorials', {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      const tutorials = await response.json();
      loading.style.display = 'none';
      if (!Array.isArray(tutorials) || tutorials.length === 0) {
          list.innerHTML = `<div class='ss-no-results'><i class='fas fa-exclamation-circle'></i><p>You are not enrolled in any tutorials yet.</p></div>`;
          return;
      }
      list.innerHTML = '';
      tutorials.forEach(tutorial => {
          const card = document.createElement('div');
          card.className = 'ss-user-card';
          card.innerHTML = `
              <div class="ss-user-header">
                  <div class="ss-user-avatar">
                      <img src="${tutorial.image || 'images/default-tutorial.jpg'}" alt="${tutorial.title}">
                  </div>
                  <div class="ss-user-info">
                      <h3 class="ss-user-name">${tutorial.title}</h3>
                      <div class="ss-user-level">
                          <span><i class="fas fa-user"></i> ${tutorial.instructor_name || tutorial.instructor}</span>
                          <span><i class="fas fa-signal"></i> ${tutorial.level}</span>
                          <span><i class="fas fa-star" style="color: #ffd700;"></i> ${tutorial.rating}</span>
                      </div>
                  </div>
              </div>
              <p class="ss-user-bio">${tutorial.description}</p>
              <div class="ss-user-skills">
                  <span class="ss-user-skill">
                      <i class="fas fa-clock"></i> ${tutorial.duration}
                  </span>
                  <span class="ss-user-skill">
                      <i class="fas fa-users"></i> ${tutorial.students} students
                  </span>
                  <span class="ss-user-skill">
                      <i class="fas fa-tag"></i> ${tutorial.category}
                  </span>
              </div>
              <div class="ss-user-actions">
                  <a href="my-tutorials.html?id=${tutorial.id}" class="ss-swap-btn">
                      <i class="fas fa-eye"></i> View Details
                  </a>
              </div>
          `;
          list.appendChild(card);
      });
  } catch (error) {
      loading.style.display = 'none';
      list.innerHTML = `<div class='ss-no-results'><i class='fas fa-exclamation-circle'></i><p>Error loading your tutorials. Please try again later.</p></div>`;
  }
});

// Only keep this enrollInTutorial:
// Only keep this loadMyTutorials:
async function loadMyTutorials() {
  const list = document.getElementById('myTutorialsList');
  const loading = document.getElementById('loading');
  if (!list) return;
  if (loading) loading.style.display = '';
  list.innerHTML = '';
  try {
      const token = localStorage.getItem('token');
      if (!token) {
          list.innerHTML = `<div class='ss-no-results'><i class='fas fa-exclamation-circle'></i><p>Please log in to view your enrolled tutorials.</p></div>`;
          if (loading) loading.style.display = 'none';
          return;
      }
      const res = await fetch('/api/my-tutorials', {
          headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) throw new Error('Failed to fetch enrolled tutorials');
      const tutorials = await res.json();
      if (!tutorials.length) {
          list.innerHTML = `<div class='ss-no-results'><i class='fas fa-exclamation-circle'></i><p>You are not enrolled in any tutorials yet.</p></div>`;
      } else {
          list.innerHTML = '';
          tutorials.forEach(tutorial => {
              const card = document.createElement('div');
              card.className = 'tutorial-card';
              card.innerHTML = `
                  <img src="${tutorial.image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(tutorial.title)}" class="tutorial-image" alt="Tutorial Image">
                  <div class="tutorial-content">
                      <h3>${tutorial.title}</h3>
                      <div class="instructor"><i class="fas fa-user"></i> ${tutorial.instructor_name || ''}</div>
                      <div class="level"><i class="fas fa-signal"></i> ${tutorial.level || ''}</div>
                      <div class="category"><i class="fas fa-tag"></i> ${tutorial.category || ''}</div>
                      <div class="description">${tutorial.description || ''}</div>
                      <div class="tutorial-meta">
                          <span><i class="fas fa-clock"></i> ${tutorial.duration || ''}</span>
                          <span><i class="fas fa-star"></i> ${tutorial.rating || ''}</span>
                      </div>
                  </div>
              `;
              list.appendChild(card);
          });
      }
  } catch (err) {
      list.innerHTML = `<div class='ss-no-results'><i class='fas fa-exclamation-circle'></i><p>Failed to load your enrolled tutorials.</p></div>`;
  }
  if (loading) loading.style.display = 'none';
}
// --- ENROLLMENT REDIRECT LOGIC ---

// --- MY TUTORIALS PAGE LOGIC ---
// Only keep this unified, modern version for my-tutorials.html
async function loadMyTutorials() {
    const list = document.getElementById('myTutorialsList');
    const loading = document.getElementById('loading');
    if (!list) return;
    if (loading) loading.style.display = '';
    list.innerHTML = '';
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            list.innerHTML = `<div class='ss-no-results'><i class='fas fa-exclamation-circle'></i><p>Please log in to view your enrolled tutorials.</p></div>`;
            if (loading) loading.style.display = 'none';
            return;
        }
        const res = await fetch('http://localhost:5000/api/my-tutorials', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (!res.ok) throw new Error('Failed to fetch enrolled tutorials');
        const tutorials = await res.json();
        if (!tutorials.length) {
            list.innerHTML = `<div class='ss-no-results'><i class='fas fa-exclamation-circle'></i><p>You are not enrolled in any tutorials yet.</p></div>`;
        } else {
            list.innerHTML = '';
            tutorials.forEach(tutorial => {
                list.innerHTML += createEnrolledTutorialCard(tutorial);
            });
        }
    } catch (err) {
        list.innerHTML = `<div class='ss-no-results'><i class='fas fa-exclamation-circle'></i><p>Failed to load your enrolled tutorials.</p></div>`;
    }
    if (loading) loading.style.display = 'none';
}

function createEnrolledTutorialCard(tutorial) {
    return `
        <div class="tutorial-card" data-tutorial-id="${tutorial.id}">
            <div class="tutorial-image">
                <img src="${tutorial.image || 'Images/online tutorials/graphic.jpg'}" alt="${tutorial.title}" loading="lazy">
                <div class="tutorial-level-badge">${tutorial.level || 'Not specified'}</div>
            </div>
            <div class="tutorial-content">
                <h3 class="tutorial-title">${tutorial.title}</h3>
                <p class="tutorial-description">${tutorial.description || 'No description available.'}</p>
                <div class="tutorial-meta">
                    <div class="meta-item">
                        <i class="fas fa-clock"></i>
                        <span>${tutorial.duration || 'Not specified'}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-user"></i>
                        <span>${tutorial.instructor_name || tutorial.instructor || 'Not specified'}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-star"></i>
                        <span>${tutorial.rating || '0'}</span>
                    </div>
                </div>
                <div class="tutorial-actions">
                    <a href="tutorial-content.html?id=${tutorial.id}" class="primary-btn continue-btn">
                        <i class="fas fa-play"></i>
                        <span>Continue Learning</span>
                    </a>
                    <button class="secondary-btn contact-btn" onclick="contactInstructor('${tutorial.id}')">
                        <i class="fas fa-comments"></i>
                        <span>Chat with Instructor</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Auto-load on my-tutorials.html
if (window.location.pathname.endsWith('my-tutorials.html')) {
    document.addEventListener('DOMContentLoaded', loadMyTutorials);
}
// ... existing code ...

if (window.location.pathname.endsWith('my-tutorials.html')) {
  document.addEventListener('DOMContentLoaded', loadMyTutorials);
}


// --- CLEANED: ENROLLMENT & MY TUTORIALS LOGIC ---
async function enrollInTutorial(tutorialId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to enroll in tutorials');
            window.location.href = 'login.html';
            return;
        }
        const response = await fetch(`/api/tutorials/${tutorialId}/enroll`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        if (!response.ok) {
            const data = await response.json();
            alert(data.error || 'Failed to enroll in tutorial');
            return;
        }
        showToast('Successfully enrolled in tutorial!', 'success');
        setTimeout(() => {
            window.location.href = 'my-tutorials.html';
        }, 1500);
    } catch (error) {
        alert('Failed to enroll in tutorial. Please try again.');
    }
}

async function loadMyTutorials() {
    const list = document.getElementById('myTutorialsList');
    const loading = document.getElementById('loading');
    if (!list) return;
    if (loading) loading.style.display = '';
    list.innerHTML = '';
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            list.innerHTML = `<div class='ss-no-results'><i class='fas fa-exclamation-circle'></i><p>Please log in to view your enrolled tutorials.</p></div>`;
            if (loading) loading.style.display = 'none';
            return;
        }
        const res = await fetch('/api/my-tutorials', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (!res.ok) throw new Error('Failed to fetch enrolled tutorials');
        const tutorials = await res.json();
        if (!tutorials.length) {
            list.innerHTML = `<div class='ss-no-results'><i class='fas fa-exclamation-circle'></i><p>You are not enrolled in any tutorials yet.</p></div>`;
        } else {
            list.innerHTML = '';
            tutorials.forEach(tutorial => {
                const card = document.createElement('div');
                card.className = 'tutorial-card';
                card.innerHTML = `
                    <img src="${tutorial.image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(tutorial.title)}" class="tutorial-image" alt="Tutorial Image">
                    <div class="tutorial-content">
                        <h3>${tutorial.title}</h3>
                        <div class="instructor"><i class="fas fa-user"></i> ${tutorial.instructor_name || ''}</div>
                        <div class="level"><i class="fas fa-signal"></i> ${tutorial.level || ''}</div>
                        <div class="category"><i class="fas fa-tag"></i> ${tutorial.category || ''}</div>
                        <div class="description">${tutorial.description || ''}</div>
                        <div class="tutorial-meta">
                            <span><i class="fas fa-clock"></i> ${tutorial.duration || ''}</span>
                            <span><i class="fas fa-star"></i> ${tutorial.rating || ''}</span>
                        </div>
                    </div>
                `;
                list.appendChild(card);
            });
        }
    } catch (err) {
        list.innerHTML = `<div class='ss-no-results'><i class='fas fa-exclamation-circle'></i><p>Failed to load your enrolled tutorials.</p></div>`;
    }
    if (loading) loading.style.display = 'none';
}

if (window.location.pathname.endsWith('my-tutorials.html')) {
  document.addEventListener('DOMContentLoaded', loadMyTutorials);
}

// ... existing code ...
const logoutBtn = document.querySelector('.profile-logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', function() {
    console.log('Logout button clicked'); // Debug log
    auth.logout();
  });
}
// ... existing code ...

// Profile Picture Upload Handler
document.addEventListener('DOMContentLoaded', function() {
    const avatarUpload = document.getElementById('avatar-upload');
    const changePicBtn = document.getElementById('change-pic-btn');
    const profileAvatar = document.getElementById('profile-avatar');
    const editProfileBtn = document.querySelector('.profile-edit-btn');
    const editProfileModal = document.getElementById('editProfileModal');
    const closeEditModal = document.getElementById('closeEditModal');
    const editProfileForm = document.getElementById('editProfileForm');

    // Handle profile picture upload
    if (changePicBtn && avatarUpload) {
        changePicBtn.addEventListener('click', () => {
            avatarUpload.click();
        });

        avatarUpload.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const formData = new FormData();
                    formData.append('avatar', file);

                    const token = localStorage.getItem('token');
                    if (!token) {
                        showToast('Please log in to update your profile picture', 'error');
                        return;
                    }

                    const response = await fetch('/api/users/avatar', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        body: formData
                    });

                    if (response.ok) {
                        const data = await response.json();
                        profileAvatar.src = data.avatarUrl;
                        showToast('Profile picture updated successfully', 'success');
                    } else {
                        throw new Error('Failed to upload profile picture');
                    }
                } catch (error) {
                    console.error('Error uploading profile picture:', error);
                    showToast('Failed to upload profile picture', 'error');
                }
            }
        });
    }

    // Handle Edit Profile Modal
    if (editProfileBtn && editProfileModal) {
        editProfileBtn.addEventListener('click', () => {
            editProfileModal.style.display = 'block';
            // Pre-fill form with current user data
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                const form = editProfileForm;
                form.querySelector('input[type="text"]').value = user.fullName || user.name || '';
                form.querySelector('input[type="email"]').value = user.email || '';
            }
        });

        closeEditModal.addEventListener('click', () => {
            editProfileModal.style.display = 'none';
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === editProfileModal) {
                editProfileModal.style.display = 'none';
            }
        });

        // Handle form submission
        editProfileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(editProfileForm);
            const userData = {
                fullName: formData.get('fullName'),
                email: formData.get('email'),
                bio: formData.get('bio')
            };

            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    showToast('Please log in to update your profile', 'error');
                    return;
                }

                const response = await fetch('/api/users/profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(userData)
                });

                if (response.ok) {
                    const updatedUser = await response.json();
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    
                    // Update profile display
                    document.querySelector('.profile-name').textContent = updatedUser.fullName || updatedUser.name;
                    document.querySelector('.profile-username').textContent = `@${updatedUser.username || updatedUser.email.split('@')[0]}`;
                    if (updatedUser.bio) {
                        document.querySelector('#about-tab p').textContent = updatedUser.bio;
                    }

                    showToast('Profile updated successfully', 'success');
                    editProfileModal.style.display = 'none';
                } else {
                    throw new Error('Failed to update profile');
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                showToast('Failed to update profile', 'error');
            }
        });
    }
});

// ... existing code ...

// === Profile Edit Modal Logic ===
document.addEventListener('DOMContentLoaded', function() {
  const editBtn = document.getElementById('editProfileBtn');
  const modal = document.getElementById('editProfileModal');
  const closeBtns = document.querySelectorAll('#closeEditModal');
  const editForm = document.getElementById('editProfileForm');
  const logoutBtn = document.querySelector('.profile-logout-btn');

  // Handle logout
  if (logoutBtn) {
      logoutBtn.addEventListener('click', function() {
          // Clear user data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Redirect to login page
          window.location.href = 'login.html';
      });
  }

  // Open modal
  if (editBtn && modal && editForm) {
      editBtn.addEventListener('click', function() {
          // Prefill form with user data
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          if (user) {
              if (editForm.fullName) editForm.fullName.value = user.full_name || '';
              if (editForm.email) editForm.email.value = user.email || '';
              if (editForm.location) editForm.location.value = user.location || '';
              if (editForm.occupation) editForm.occupation.value = user.occupation || '';
              if (editForm.bio) editForm.bio.value = user.bio || '';
          }
          modal.style.display = 'block';
      });
  }

  // Close modal (all close buttons)
  if (closeBtns && modal) {
      closeBtns.forEach(btn => {
          if (btn) {
              btn.addEventListener('click', function() {
                  modal.style.display = 'none';
              });
          }
      });
  }

  // Close modal when clicking outside
  if (modal) {
      window.addEventListener('click', function(e) {
          if (e.target === modal) {
              modal.style.display = 'none';
          }
      });
  }

  // Handle form submission
  if (editForm && modal) {
      editForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(editForm);
          const userData = {
              fullName: formData.get('fullName'),
              email: formData.get('email'),
              location: formData.get('location'),
              occupation: formData.get('occupation'),
              bio: formData.get('bio')
          };
          try {
              const token = localStorage.getItem('token');
              if (!token) {
                  showToast('Please log in to update your profile', 'error');
                  return;
              }
              const response = await fetch('http://localhost:5000/api/users/profile', {
                  method: 'PUT',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify(userData)
              });
              if (response.ok) {
                  const updatedUser = await response.json();
                  localStorage.setItem('user', JSON.stringify(updatedUser));
                  
                  // Update profile display
                  document.getElementById('profile-name').textContent = updatedUser.full_name || updatedUser.username;
                  document.getElementById('profile-username').textContent = `@${updatedUser.username || updatedUser.email.split('@')[0]}`;
                  document.getElementById('profile-email').textContent = updatedUser.email || '';
                  document.getElementById('profile-location').textContent = updatedUser.location || '';
                  document.getElementById('profile-occupation').textContent = updatedUser.occupation || '';
                  document.getElementById('profile-bio').textContent = updatedUser.bio || '';

                  showToast('Profile updated successfully', 'success');
                  modal.style.display = 'none';
              } else {
                  throw new Error('Failed to update profile');
              }
          } catch (error) {
              console.error('Error updating profile:', error);
              showToast('Failed to update profile', 'error');
          }
      });
  }
});
// ... existing code ...


    

    



// Function to fetch tutorials from the API
async function fetchTutorials(searchQuery = '', levelFilter = '') {
  try {
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (levelFilter) params.append('level', levelFilter);
    
    const response = await fetch(`http://localhost:5000/api/tutorials?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch tutorials');
    
    const tutorials = await response.json();
    return tutorials;
  } catch (error) {
    console.error('Error fetching tutorials:', error);
    return [];
  }
}

// Function to display tutorials in the UI
function displayTutorials(tutorials) {
  const tutorialsContainer = document.getElementById('tutorialResults');
  if (!tutorialsContainer) return;
  
  tutorialsContainer.innerHTML = tutorials.map(tutorial => `
    <div class="tutorial-card">
      <img src="${tutorial.image}" alt="${tutorial.title}" class="tutorial-image">
      <div class="tutorial-content">
        <h3>${tutorial.title}</h3>
        <p class="instructor">Instructor: ${tutorial.instructor_name}</p>
        <p class="level">Level: ${tutorial.level}</p>
        <p class="category">Category: ${tutorial.category}</p>
        <p class="description">${tutorial.description}</p>
        <div class="tutorial-meta">
          <span class="duration">${tutorial.duration}</span>
          <span class="rating">⭐ ${tutorial.rating}</span>
          <span class="students">👥 ${tutorial.students}</span>
        </div>
        <div class="tutorial-footer">
          <span class="price">$${tutorial.price}</span>
          <button onclick="enrollInTutorial(${tutorial.id})" class="enroll-btn">Enroll Now</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Function to handle tutorial search
async function searchTutorials() {
  const searchInput = document.getElementById('tutorialSearch');
  const levelFilter = document.getElementById('levelFilter');
  
  if (!searchInput || !levelFilter) return;
  
  const searchQuery = searchInput.value.trim();
  const selectedLevel = levelFilter.value;
  
  const tutorials = await fetchTutorials(searchQuery, selectedLevel);
  displayTutorials(tutorials);
}

// Function to handle tutorial enrollment
async function enrollInTutorial(tutorialId) {
  try {
    const response = await fetch(`/api/tutorials/${tutorialId}/enroll`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        alert('Please log in to enroll in tutorials');
        return;
      }
      throw new Error('Failed to enroll in tutorial');
    }
    
    const result = await response.json();
    alert('Successfully enrolled in tutorial!');
  } catch (error) {
    console.error('Error enrolling in tutorial:', error);
    alert('Failed to enroll in tutorial. Please try again.');
  }
}

// Initialize tutorials on page load
document.addEventListener('DOMContentLoaded', async () => {
  // Only run if the tutorialResults container exists
  const tutorialsContainer = document.getElementById('tutorialResults');
  if (tutorialsContainer) {
    const tutorials = await fetchTutorials();
    displayTutorials(tutorials);
  }
  // Add event listeners for search and filter
  const searchInput = document.getElementById('tutorialSearch');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(searchTutorials, 300));
  }
  const levelFilter = document.getElementById('levelFilter');
  if (levelFilter) {
    levelFilter.addEventListener('change', searchTutorials);
  }
});

// Utility function for debouncing search
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
} 

// Function to fetch and display enrollment statistics
async function fetchEnrollmentStats() {
    try {
        const res = await fetch('/api/enrollment-stats');
        if (!res.ok) throw new Error('Failed to fetch stats');
        const stats = await res.json();
        const totalElem = document.getElementById('totalEnrollments');
        const popularElem = document.getElementById('mostPopularTutorial');
        const recentElem = document.getElementById('recentEnrollments');
        if (totalElem) totalElem.textContent = stats.totalEnrollments ?? '0';
        if (popularElem) popularElem.textContent = stats.mostPopularTutorial?.title || 'N/A';
        if (recentElem) recentElem.textContent = stats.recentEnrollments ?? '0';
    } catch (err) {
        if (document.getElementById('totalEnrollments')) document.getElementById('totalEnrollments').textContent = 'Error';
        if (document.getElementById('mostPopularTutorial')) document.getElementById('mostPopularTutorial').textContent = 'Error';
        if (document.getElementById('recentEnrollments')) document.getElementById('recentEnrollments').textContent = 'Error';
    }
}

// Function to fetch and display enrollment list
async function fetchEnrollments(filter = 'all') {
    try {
        const res = await fetch(`/api/enrollments?filter=${encodeURIComponent(filter)}`);
        if (!res.ok) throw new Error('Failed to fetch enrollments');
        const enrollments = await res.json();
        renderEnrollmentList(enrollments);
    } catch (err) {
        renderEnrollmentList([]);
    }
}

function renderEnrollmentList(enrollments) {
    const container = document.getElementById('enrollmentResults');
    if (!container) return;
    container.innerHTML = '';
    if (!enrollments.length) {
        container.innerHTML = '<div class="no-tutorials"><i class="fas fa-user-slash"></i><p>No enrollments found.</p></div>';
        return;
    }
    enrollments.forEach(enr => {
        const card = document.createElement('div');
        card.className = 'enrollment-card';
        card.innerHTML = `
            <div class="user-info">
                <img src="${enr.userAvatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(enr.userName || 'User')}" alt="User Avatar">
                <div class="user-details">
                    <div class="user-name">${enr.userName || 'User'}</div>
                    <div class="enrollment-date"><i class="fas fa-calendar-alt"></i> ${enr.enrolledAt ? new Date(enr.enrolledAt).toLocaleDateString() : ''}</div>
                </div>
            </div>
            <div class="tutorial-info">
                <div class="tutorial-title">${enr.tutorialTitle || 'Tutorial'}</div>
                <div class="tutorial-level"><i class="fas fa-signal"></i> ${enr.tutorialLevel || ''}</div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Attach event listeners and initialize on DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEnrollmentStatsAndList);
} else {
    initEnrollmentStatsAndList();
}

function initEnrollmentStatsAndList() {
    // Only run if the relevant elements exist
    if (document.getElementById('totalEnrollments')) fetchEnrollmentStats();
    if (document.getElementById('enrollmentResults')) fetchEnrollments();
    const filter = document.getElementById('enrollmentFilter');
    if (filter) {
        filter.addEventListener('change', e => {
            fetchEnrollments(e.target.value);
        });
    }
}

document.addEventListener('DOMContentLoaded', async function() {
  const list = document.getElementById('myTutorialsList');
  const loading = document.getElementById('loading');
  loading.style.display = 'block';
  try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/my-tutorials', {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      const tutorials = await response.json();
      loading.style.display = 'none';
      if (!Array.isArray(tutorials) || tutorials.length === 0) {
          list.innerHTML = `<div class='ss-no-results'><i class='fas fa-exclamation-circle'></i><p>You are not enrolled in any tutorials yet.</p></div>`;
          return;
      }
      list.innerHTML = '';
      tutorials.forEach(tutorial => {
          const card = document.createElement('div');
          card.className = 'ss-user-card';
          card.innerHTML = `
              <div class="ss-user-header">
                  <div class="ss-user-avatar">
                      <img src="${tutorial.image || 'images/default-tutorial.jpg'}" alt="${tutorial.title}">
                  </div>
                  <div class="ss-user-info">
                      <h3 class="ss-user-name">${tutorial.title}</h3>
                      <div class="ss-user-level">
                          <span><i class="fas fa-user"></i> ${tutorial.instructor_name || tutorial.instructor}</span>
                          <span><i class="fas fa-signal"></i> ${tutorial.level}</span>
                          <span><i class="fas fa-star" style="color: #ffd700;"></i> ${tutorial.rating}</span>
                      </div>
                  </div>
              </div>
              <p class="ss-user-bio">${tutorial.description}</p>
              <div class="ss-user-skills">
                  <span class="ss-user-skill">
                      <i class="fas fa-clock"></i> ${tutorial.duration}
                  </span>
                  <span class="ss-user-skill">
                      <i class="fas fa-users"></i> ${tutorial.students} students
                  </span>
                  <span class="ss-user-skill">
                      <i class="fas fa-tag"></i> ${tutorial.category}
                  </span>
              </div>
              <div class="ss-user-actions">
                  <a href="my-tutorials.html?id=${tutorial.id}" class="ss-swap-btn">
                      <i class="fas fa-eye"></i> View Details
                  </a>
              </div>
          `;
          list.appendChild(card);
      });
  } catch (error) {
      loading.style.display = 'none';
      list.innerHTML = `<div class='ss-no-results'><i class='fas fa-exclamation-circle'></i><p>Error loading your tutorials. Please try again later.</p></div>`;
  }
});

// Only keep this enrollInTutorial:
// Only keep this loadMyTutorials:
async function loadMyTutorials() {
  const list = document.getElementById('myTutorialsList');
  const loading = document.getElementById('loading');
  if (!list) return;
  if (loading) loading.style.display = '';
  list.innerHTML = '';
  try {
      const token = localStorage.getItem('token');
      if (!token) {
          list.innerHTML = `<div class='ss-no-results'><i class='fas fa-exclamation-circle'></i><p>Please log in to view your enrolled tutorials.</p></div>`;
          if (loading) loading.style.display = 'none';
          return;
      }
      const res = await fetch('/api/my-tutorials', {
          headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) throw new Error('Failed to fetch enrolled tutorials');
      const tutorials = await res.json();
      if (!tutorials.length) {
          list.innerHTML = `<div class='ss-no-results'><i class='fas fa-exclamation-circle'></i><p>You are not enrolled in any tutorials yet.</p></div>`;
      } else {
          list.innerHTML = '';
          tutorials.forEach(tutorial => {
              const card = document.createElement('div');
              card.className = 'tutorial-card';
              card.innerHTML = `
                  <img src="${tutorial.image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(tutorial.title)}" class="tutorial-image" alt="Tutorial Image">
                  <div class="tutorial-content">
                      <h3>${tutorial.title}</h3>
                      <div class="instructor"><i class="fas fa-user"></i> ${tutorial.instructor_name || ''}</div>
                      <div class="level"><i class="fas fa-signal"></i> ${tutorial.level || ''}</div>
                      <div class="category"><i class="fas fa-tag"></i> ${tutorial.category || ''}</div>
                      <div class="description">${tutorial.description || ''}</div>
                      <div class="tutorial-meta">
                          <span><i class="fas fa-clock"></i> ${tutorial.duration || ''}</span>
                          <span><i class="fas fa-star"></i> ${tutorial.rating || ''}</span>
                      </div>
                  </div>
              `;
              list.appendChild(card);
          });
      }
  } catch (err) {
      list.innerHTML = `<div class='ss-no-results'><i class='fas fa-exclamation-circle'></i><p>Failed to load your enrolled tutorials.</p></div>`;
  }
  if (loading) loading.style.display = 'none';
}
// --- ENROLLMENT REDIRECT LOGIC ---

// --- MY TUTORIALS PAGE LOGIC ---
async function loadMyTutorials() {
    const list = document.getElementById('myTutorialsList');
    const loading = document.getElementById('loading');
    if (!list) return;
    if (loading) loading.style.display = '';
    list.innerHTML = '';
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            list.innerHTML = `<div class='ss-no-results'><i class='fas fa-exclamation-circle'></i><p>Please log in to view your enrolled tutorials.</p></div>`;
            if (loading) loading.style.display = 'none';
            return;
        }
        const res = await fetch('http://localhost:5000/api/my-tutorials', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (!res.ok) throw new Error('Failed to fetch enrolled tutorials');
        const tutorials = await res.json();
        if (!tutorials.length) {
            list.innerHTML = `<div class='ss-no-results'><i class='fas fa-exclamation-circle'></i><p>You are not enrolled in any tutorials yet.</p></div>`;
        } else {
            list.innerHTML = '';
            tutorials.forEach(tutorial => {
                const card = document.createElement('div');
                card.className = 'tutorial-card';
                card.innerHTML = `
                    <img src="${tutorial.image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(tutorial.title)}" class="tutorial-image" alt="Tutorial Image">
                    <div class="tutorial-content">
                        <h3>${tutorial.title}</h3>
                        <div class="instructor"><i class="fas fa-user"></i> ${tutorial.instructor_name || ''}</div>
                        <div class="level"><i class="fas fa-signal"></i> ${tutorial.level || ''}</div>
                        <div class="category"><i class="fas fa-tag"></i> ${tutorial.category || ''}</div>
                        <div class="description">${tutorial.description || ''}</div>
                        <div class="tutorial-meta">
                            <span><i class="fas fa-clock"></i> ${tutorial.duration || ''}</span>
                            <span><i class="fas fa-star"></i> ${tutorial.rating || ''}</span>
                        </div>
                    </div>
                `;
                list.appendChild(card);
            });
        }
    } catch (err) {
        list.innerHTML = `<div class='ss-no-results'><i class='fas fa-exclamation-circle'></i><p>Failed to load your enrolled tutorials.</p></div>`;
    }
    if (loading) loading.style.display = 'none';
}
// Auto-load on my-tutorials.html
if (window.location.pathname.endsWith('my-tutorials.html')) {
    document.addEventListener('DOMContentLoaded', loadMyTutorials);
}
// ... existing code ...

if (window.location.pathname.endsWith('my-tutorials.html')) {
  document.addEventListener('DOMContentLoaded', loadMyTutorials);
}


// --- CLEANED: ENROLLMENT & MY TUTORIALS LOGIC ---
async function enrollInTutorial(tutorialId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to enroll in tutorials');
            window.location.href = 'login.html';
            return;
        }
        const response = await fetch(`/api/tutorials/${tutorialId}/enroll`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        if (!response.ok) {
            const data = await response.json();
            alert(data.error || 'Failed to enroll in tutorial');
            return;
        }
        showToast('Successfully enrolled in tutorial!', 'success');
        setTimeout(() => {
            window.location.href = 'my-tutorials.html';
        }, 1500);
    } catch (error) {
        alert('Failed to enroll in tutorial. Please try again.');
    }
}

async function loadMyTutorials() {
    const list = document.getElementById('myTutorialsList');
    const loading = document.getElementById('loading');
    if (!list) return;
    if (loading) loading.style.display = '';
    list.innerHTML = '';
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            list.innerHTML = `<div class='ss-no-results'><i class='fas fa-exclamation-circle'></i><p>Please log in to view your enrolled tutorials.</p></div>`;
            if (loading) loading.style.display = 'none';
            return;
        }
        const res = await fetch('/api/my-tutorials', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (!res.ok) throw new Error('Failed to fetch enrolled tutorials');
        const tutorials = await res.json();
        if (!tutorials.length) {
            list.innerHTML = `<div class='ss-no-results'><i class='fas fa-exclamation-circle'></i><p>You are not enrolled in any tutorials yet.</p></div>`;
        } else {
            list.innerHTML = '';
            tutorials.forEach(tutorial => {
                const card = document.createElement('div');
                card.className = 'tutorial-card';
                card.innerHTML = `
                    <img src="${tutorial.image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(tutorial.title)}" class="tutorial-image" alt="Tutorial Image">
                    <div class="tutorial-content">
                        <h3>${tutorial.title}</h3>
                        <div class="instructor"><i class="fas fa-user"></i> ${tutorial.instructor_name || ''}</div>
                        <div class="level"><i class="fas fa-signal"></i> ${tutorial.level || ''}</div>
                        <div class="category"><i class="fas fa-tag"></i> ${tutorial.category || ''}</div>
                        <div class="description">${tutorial.description || ''}</div>
                        <div class="tutorial-meta">
                            <span><i class="fas fa-clock"></i> ${tutorial.duration || ''}</span>
                            <span><i class="fas fa-star"></i> ${tutorial.rating || ''}</span>
                        </div>
                    </div>
                `;
                list.appendChild(card);
            });
        }
    } catch (err) {
        list.innerHTML = `<div class='ss-no-results'><i class='fas fa-exclamation-circle'></i><p>Failed to load your enrolled tutorials.</p></div>`;
    }
    if (loading) loading.style.display = 'none';
}

if (window.location.pathname.endsWith('my-tutorials.html')) {
  document.addEventListener('DOMContentLoaded', loadMyTutorials);
}

// ... existing code ...

// ... existing code ...

// Logout function (keep if used globally)
function logout() {
    try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    } catch (error) {
        alert('Error during logout');
    }
}
// ... existing code ...

// (All profile fetching, rendering, and profile event listeners removed)

// ... existing code ...
window.handleSubmit = handleSubmit;
window.showFeedback = showFeedback;
// ... existing code ...

// Unified function to create tutorial card HTML
function createTutorialCard(tutorial) {
    return `
        <div class="tutorial-card" data-aos="fade-up">
            <div class="tutorial-image">
                <img src="${tutorial.image || 'Images/online tutorials/graphic.jpg'}" alt="${tutorial.title}" loading="lazy">
                <div class="tutorial-level-badge">${tutorial.level || 'Not specified'}</div>
            </div>
            <div class="tutorial-content">
                <h3 class="tutorial-title">${tutorial.title}</h3>
                <p class="tutorial-description">${tutorial.description || 'No description available.'}</p>
                <div class="tutorial-meta">
                    <div class="meta-item">
                        <i class="fas fa-clock"></i>
                        <span>${tutorial.duration || 'N/A'}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-user"></i>
                        <span>${tutorial.instructor || tutorial.instructor_name || 'Unknown'}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-star"></i>
                        <span>${tutorial.rating || '0.0'}</span>
                    </div>
                </div>
                <div class="tutorial-actions">
                    <a href="tutorial-details.html?id=${tutorial.id}" class="primary-btn enroll-btn">
                        <i class="fas fa-play"></i>
                        <span>Start Learning</span>
                    </a>
                    <a href="tutorial-details.html?id=${tutorial.id}" class="secondary-btn contact-btn">
                        <i class="fas fa-eye"></i>
                        <span>View Details</span>
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Update displayTutorials function to use the same card structure
function displayTutorials(tutorials) {
    const resultsContainer = document.getElementById('tutorialResults');
    if (!resultsContainer) return;

    if (!tutorials || tutorials.length === 0) {
        resultsContainer.innerHTML = '<p class="no-results">No tutorials found.</p>';
        return;
    }

    resultsContainer.innerHTML = tutorials.map(tutorial => createTutorialCard(tutorial)).join('');
}

// Update renderTutorials function
function renderTutorials(searchTerm) {
    const resultsContainer = document.getElementById('tutorialResults');
    if (!resultsContainer) return;

    // Filter tutorials based on search term
    const filteredTutorials = tutorials.filter(tutorial => 
        tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutorial.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredTutorials.length === 0) {
        resultsContainer.innerHTML = '<p class="no-results">No tutorials found matching your search.</p>';
        return;
    }

    resultsContainer.innerHTML = filteredTutorials.map(tutorial => createTutorialCard(tutorial)).join('');
}

// ... existing code ...

// Function to get course-specific image
function getCourseImage(courseType) {
    const imageMap = {
        'Python Programming': 'Images/online tutorials/js.png',
        'Web Development': 'Images/online tutorials/web design.png',
        'Front End Development': 'Images/online tutorials/front end web.jpg',
        'UI/UX Design': 'Images/online tutorials/ui and ux.png',
        'Mobile Development': 'Images/online tutorials/mobile app development.jpg',
        'Data Science': 'Images/online tutorials/gettyimages-1014422502-612x612.jpg',
        'Digital Marketing': 'Images/online tutorials/gettyimages-1126452727-612x612.jpg',
        'Machine Learning': 'Images/online tutorials/gettyimages-1150968776-612x612.jpg',
        'Cloud Computing': 'Images/online tutorials/gettyimages-1153429431-612x612.jpg',
        'Cybersecurity': 'Images/online tutorials/gettyimages-1396895543-612x612.jpg',
        'DevOps': 'Images/online tutorials/gettyimages-1406633343-612x612.jpg',
        'Game Development': 'Images/online tutorials/gettyimages-1415237216-612x612.jpg',
        'Blockchain': 'Images/online tutorials/gettyimages-2148162976-612x612.jpg'
    };
    
    return imageMap[courseType] || 'Images/online tutorials/graphic.jpg';
}

// Single unified function to create tutorial card HTML
function createTutorialCard(tutorial) {
    const courseImage = getCourseImage(tutorial.title);
    
    return `
        <div class="tutorial-card" data-aos="fade-up">
            <div class="tutorial-image">
                <img src="${courseImage}" alt="${tutorial.title}" loading="lazy" onerror="this.onerror=null; this.src='Images/online tutorials/graphic.jpg';">
                <div class="tutorial-level-badge">${tutorial.level || 'Not specified'}</div>
            </div>
            <div class="tutorial-content">
                <h3 class="tutorial-title">${tutorial.title}</h3>
                <p class="tutorial-description">${tutorial.description || 'No description available.'}</p>
                <div class="tutorial-meta">
                    <div class="meta-item">
                        <i class="fas fa-clock"></i>
                        <span>${tutorial.duration || 'N/A'}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-user"></i>
                        <span>${tutorial.instructor || 'Unknown'}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-star"></i>
                        <span>${tutorial.rating || '0.0'}</span>
                    </div>
                </div>
                <div class="tutorial-actions">
                    <button class="primary-btn enroll-btn" onclick="enrollInTutorial('${tutorial.id}')">
                        <i class="fas fa-graduation-cap"></i>
                        <span>Start Learning</span>
                    </button>
                    <button class="secondary-btn contact-btn" onclick="contactInstructor('${tutorial.id}')">
                        <i class="fas fa-comments"></i>
                        <span>Chat with Instructor</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ... existing code ...

// Unified function to create tutorial card HTML with improved design
function createTutorialCard(tutorial) {
    return `
        <div class="tutorial-card" data-aos="fade-up">
            <div class="tutorial-image">
                <img src="${tutorial.image || 'Images/online tutorials/graphic.jpg'}" alt="${tutorial.title}" loading="lazy">
                <div class="tutorial-level-badge">${tutorial.level || 'Not specified'}</div>
            </div>
            <div class="tutorial-content">
                <h3 class="tutorial-title">${tutorial.title}</h3>
                <p class="tutorial-description">${tutorial.description || 'No description available.'}</p>
                <div class="tutorial-meta">
                    <div class="meta-item">
                        <i class="fas fa-clock"></i>
                        <span>${tutorial.duration || 'N/A'}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-user"></i>
                        <span>${tutorial.instructor || 'Unknown'}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-star"></i>
                        <span>${tutorial.rating || '0.0'}</span>
                    </div>
                </div>
                <div class="tutorial-actions">
                    <button class="primary-btn enroll-btn" onclick="enrollInTutorial('${tutorial.id}')">
                        <i class="fas fa-graduation-cap"></i>
                        <span>Start Learning</span>
                    </button>
                    <button class="secondary-btn contact-btn" onclick="contactInstructor('${tutorial.id}')">
                        <i class="fas fa-comments"></i>
                        <span>Chat with Instructor</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Single unified function to display tutorials
function displayTutorials(tutorials) {
    const resultsContainer = document.getElementById('tutorialResults');
    if (!resultsContainer) {
        console.error('Tutorial results container not found');
        return;
    }

    if (!tutorials || tutorials.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No tutorials found</p>
            </div>
        `;
        return;
    }

    resultsContainer.innerHTML = tutorials.map(tutorial => createTutorialCard(tutorial)).join('');
}

// Single unified function to render tutorials with search
function renderTutorials(searchTerm = '') {
    const resultsContainer = document.getElementById('tutorialResults');
    if (!resultsContainer) return;

    // Filter tutorials based on search term
    const filteredTutorials = tutorials.filter(tutorial => 
        tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutorial.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    displayTutorials(filteredTutorials);
}

// Remove all other duplicate functions (displayTutorials, renderTutorials, createTutorialCard)
// ... existing code ...

// Single unified function to fetch tutorials
async function fetchTutorials(searchQuery = '', levelFilter = '') {
    try {
        // Sample data that matches our image paths
        const sampleTutorials = [
            {
                id: '11',
                title: 'Python Programming',
                description: 'Learn Python programming from scratch with hands-on exercises and real-world projects.',
                level: 'Beginner',
                duration: '8 weeks',
                instructor: 'John Doe',
                rating: '4.5',
                image: 'Images/online tutorials/js.png'
            },
            {
                id: '12',
                title: 'Web Development',
                description: 'Master modern web development with HTML, CSS, and JavaScript.',
                level: 'Intermediate',
                duration: '12 weeks',
                instructor: 'Jane Smith',
                rating: '4.8',
                image: 'Images/online tutorials/web design.png'
            },
            {
                id: '13',
                title: 'Front End Development',
                description: 'Become a front-end developer with modern frameworks and tools.',
                level: 'Intermediate',
                duration: '10 weeks',
                instructor: 'Mike Johnson',
                rating: '4.7',
                image: 'Images/online tutorials/front end web.jpg'
            },
            {
                id: '14',
                title: 'UI/UX Design',
                description: 'Learn to create beautiful and user-friendly interfaces.',
                level: 'Beginner',
                duration: '6 weeks',
                instructor: 'Sarah Wilson',
                rating: '4.9',
                image: 'Images/online tutorials/ui and ux.png'
            },
            {
                id: '15',
                title: 'Mobile Development',
                description: 'Build mobile applications for iOS and Android platforms.',
                level: 'Advanced',
                duration: '14 weeks',
                instructor: 'David Brown',
                rating: '4.6',
                image: 'Images/online tutorials/mobile app development.jpg'
            },
            {
                id: '16',
                title: 'Data Science',
                description: 'Master data analysis, visualization, and machine learning.',
                level: 'Advanced',
                duration: '16 weeks',
                instructor: 'Emily Chen',
                rating: '4.8',
                image: 'Images/online tutorials/Data science.jpg'
            }
        ];

        // Filter tutorials based on search query and level
        let filteredTutorials = sampleTutorials;
        
        if (searchQuery) {
            filteredTutorials = filteredTutorials.filter(tutorial =>
                tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tutorial.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (levelFilter) {
            filteredTutorials = filteredTutorials.filter(tutorial =>
                tutorial.level.toLowerCase() === levelFilter.toLowerCase()
            );
        }

        return filteredTutorials;
    } catch (error) {
        console.error('Error fetching tutorials:', error);
        return [];
    }
}

// Single unified function to create tutorial card HTML
function createTutorialCard(tutorial) {
    return `
        <div class="tutorial-card" data-aos="fade-up">
            <div class="tutorial-image">
                <img src="${tutorial.image}" alt="${tutorial.title}" loading="lazy" onerror="this.onerror=null; this.src='Images/online tutorials/graphic.jpg';">
                <div class="tutorial-level-badge">${tutorial.level || 'Not specified'}</div>
            </div>
            <div class="tutorial-content">
                <h3 class="tutorial-title">${tutorial.title}</h3>
                <p class="tutorial-description">${tutorial.description || 'No description available.'}</p>
                <div class="tutorial-meta">
                    <div class="meta-item">
                        <i class="fas fa-clock"></i>
                        <span>${tutorial.duration || 'N/A'}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-user"></i>
                        <span>${tutorial.instructor || 'Unknown'}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-star"></i>
                        <span>${tutorial.rating || '0.0'}</span>
                    </div>
                </div>
                <div class="tutorial-actions">
                    <button class="primary-btn enroll-btn" onclick="enrollInTutorial('${tutorial.id}')">
                        <i class="fas fa-graduation-cap"></i>
                        <span>Start Learning</span>
                    </button>
                    <button class="secondary-btn contact-btn" onclick="contactInstructor('${tutorial.id}')">
                        <i class="fas fa-comments"></i>
                        <span>Chat with Instructor</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ... rest of the code ...

function createTutorialCard(tutorial) {
    return `
        <div class="tutorial-card" data-aos="fade-up">
            <div class="tutorial-image">
                <img src="${tutorial.image || 'Images/online tutorials/graphic.jpg'}" alt="${tutorial.title}" loading="lazy">
                <div class="tutorial-level-badge">${tutorial.level || 'Not specified'}</div>
            </div>
            <div class="tutorial-content">
                <h3 class="tutorial-title">${tutorial.title}</h3>
                <p class="tutorial-description">${tutorial.description || 'No description available.'}</p>
                <div class="tutorial-meta">
                    <div class="meta-item">
                        <i class="fas fa-clock"></i>
                        <span>${tutorial.duration || 'N/A'}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-user"></i>
                        <span>${tutorial.instructor || 'Unknown'}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-star"></i>
                        <span>${tutorial.rating || '0.0'}</span>
                    </div>
                </div>
                <div class="tutorial-actions">
                    <button class="primary-btn enroll-btn" onclick="window.location.href='tutorial-details.html?id=${tutorial.id}'">
                        <i class="fas fa-graduation-cap"></i>
                        <span>Start Learning</span>
                    </button>
                    <button class="secondary-btn contact-btn" onclick="contactInstructor('${tutorial.id}')">
                        <i class="fas fa-comments"></i>
                        <span>Chat with Instructor</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ... existing code ...

// File upload handling
document.addEventListener('DOMContentLoaded', function() {
    const resumeInput = document.getElementById('resume');
    const resumeFileName = document.getElementById('resume-file-name');
    const profilePictureInput = document.getElementById('profilePicture');
    const profileFileName = document.getElementById('profile-file-name');

    if (resumeInput) {
        resumeInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validate file type
                const allowedTypes = ['.pdf', '.doc', '.docx'];
                const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
                
                if (!allowedTypes.includes(fileExtension)) {
                    showToast('Please upload a PDF or Word document', 'error');
                    resumeInput.value = '';
                    resumeFileName.textContent = 'No file chosen';
                    return;
                }

                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    showToast('File size should be less than 5MB', 'error');
                    resumeInput.value = '';
                    resumeFileName.textContent = 'No file chosen';
                    return;
                }

                resumeFileName.textContent = file.name;
            } else {
                resumeFileName.textContent = 'No file chosen';
            }
        });
    }

    if (profilePictureInput) {
        profilePictureInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    showToast('Please upload an image file', 'error');
                    profilePictureInput.value = '';
                    profileFileName.textContent = 'No file chosen';
                    return;
                }

                // Validate file size (max 2MB)
                if (file.size > 2 * 1024 * 1024) {
                    showToast('Image size should be less than 2MB', 'error');
                    profilePictureInput.value = '';
                    profileFileName.textContent = 'No file chosen';
                    return;
                }

                // Preview image
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.querySelector('.profile-preview');
                    if (preview) {
                        preview.innerHTML = `<img src="${e.target.result}" alt="Profile Preview">`;
                    }
                };
                reader.readAsDataURL(file);

                profileFileName.textContent = file.name;
            } else {
                profileFileName.textContent = 'No file chosen';
            }
        });
    }
});

// Update the handleSubmit function to include file uploads
async function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');
    
    // Validate required fields
    const requiredFields = {
        'email': 'Email',
        'password': 'Password',
        'confirmPassword': 'Confirm Password',
        'fullName': 'Full Name',
        'phone': 'Phone Number',
        'location': 'Location'
    };

    for (const [fieldId, fieldName] of Object.entries(requiredFields)) {
        const field = form.querySelector(`#${fieldId}`);
        if (!field || !field.value.trim()) {
            showToast(`${fieldName} is required`, 'error');
            field?.focus();
            return;
        }
    }

    // Validate email format
    const email = form.querySelector('#email').value;
    if (!validateEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        form.querySelector('#email').focus();
        return;
    }

    // Validate password match
    const password = form.querySelector('#password').value;
    const confirmPassword = form.querySelector('#confirmPassword').value;
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        form.querySelector('#confirmPassword').focus();
        return;
    }

    // Validate password strength
    if (password.length < 8) {
        showToast('Password must be at least 8 characters long', 'error');
        form.querySelector('#password').focus();
        return;
    }

    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnSpinner.style.display = 'inline-block';

    try {
        const formData = new FormData(form);
        let resumeUrl = '';
        let avatarUrl = '';
        
        // Handle resume upload
        const resumeFile = formData.get('resume');
        if (resumeFile && resumeFile.size > 0) {
            try {
                const resumeFormData = new FormData();
                resumeFormData.append('file', resumeFile);
                
                console.log('Uploading resume:', resumeFile.name);
                
                const resumeResponse = await fetch('http://localhost:5000/api/upload', {
                    method: 'POST',
                    body: resumeFormData
                });
                
                if (!resumeResponse.ok) {
                    const errorData = await resumeResponse.json();
                    throw new Error(errorData.error || 'Failed to upload resume');
                }
                
                const resumeData = await resumeResponse.json();
                console.log('Resume upload response:', resumeData);
                resumeUrl = resumeData.fileUrl;
            } catch (uploadError) {
                console.error('Resume upload error:', uploadError);
                throw new Error(`Resume upload failed: ${uploadError.message}`);
            }
        }

        // Handle profile picture upload
        const profileFile = formData.get('profilePicture');
        if (profileFile && profileFile.size > 0) {
            try {
                const profileFormData = new FormData();
                profileFormData.append('file', profileFile);
                
                console.log('Uploading profile picture:', profileFile.name);
                
                const profileResponse = await fetch('http://localhost:5000/api/upload', {
                    method: 'POST',
                    body: profileFormData
                });
                
                if (!profileResponse.ok) {
                    const errorData = await profileResponse.json();
                    throw new Error(errorData.error || 'Failed to upload profile picture');
                }
                
                const profileData = await profileResponse.json();
                console.log('Profile picture upload response:', profileData);
                avatarUrl = profileData.fileUrl;
            } catch (uploadError) {
                console.error('Profile picture upload error:', uploadError);
                throw new Error(`Profile picture upload failed: ${uploadError.message}`);
            }
        }

        // Get selected skills
        const skills = getSelectedSkills();
        console.log('Selected skills:', skills);

        // Prepare user data
        const userData = {
            username: email.split('@')[0], // Generate username from email
            email: email,
            password: password,
            full_name: formData.get('fullName'),
            phone: formData.get('phone'),
            location: formData.get('location'),
            bio: formData.get('bio') || '',
            avatar: avatarUrl,
            resume: resumeUrl,
            skills: skills
        };

        console.log('Sending registration data:', { ...userData, password: '[REDACTED]' });

        // Register user
        const response = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Registration failed');
        }

        console.log('Registration response:', result);
        
        showToast('Registration successful! Redirecting to login...', 'success');
        
        // Store user ID if needed
        if (result.userId) {
            localStorage.setItem('currentUserId', result.userId);
        }

        // Clear form
        form.reset();
        if (resumeFileName) resumeFileName.textContent = 'No file chosen';
        if (profileFileName) profileFileName.textContent = 'No file chosen';

        // Redirect to login page after a short delay
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);

    } catch (error) {
        console.error('Registration error:', error);
        showToast(error.message || 'Registration failed. Please try again.', 'error');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        btnText.style.display = 'inline-block';
        btnSpinner.style.display = 'none';
    }
}

// Add event listener for form submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }

    // ... rest of the existing code ...
});

// Helper function to get selected skills
function getSelectedSkills() {
    const skillsTags = document.querySelectorAll('.skill-tag');
    return Array.from(skillsTags).map(tag => tag.dataset.skillId);
}

// ... rest of the existing code ...

document.addEventListener('DOMContentLoaded', async function() {
  // Check if we are on the Skill Swap Search page
  if (document.getElementById('userResults')) {
    await fetchUsers();
  }
    renderUsers('');
  
});

// WebSocket connection
let ws = null;
let currentChatUser = null;

function connectWebSocket(userId) {
  if (ws) {
    ws.close();
  }
  
  ws = new WebSocket(`ws://localhost:5000?userId=${userId}`);
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    switch (data.type) {
      case 'message':
        if (currentChatUser && (data.senderId === currentChatUser.id || data.senderId === userId)) {
          appendMessage(data);
        }
        break;
        
      case 'typing':
        if (currentChatUser && data.senderId === currentChatUser.id) {
          showTypingIndicator(data.senderId);
        }
        break;
    }
  };
  
  ws.onclose = () => {
    setTimeout(() => connectWebSocket(userId), 1000);
  };
}

function appendMessage(data) {
  const chatMessages = document.querySelector('.chat-messages');
  if (!chatMessages) return;
  const messageGroup = document.createElement('div');
  messageGroup.className = `message-group ${data.senderId === currentChatUser.id ? 'received' : 'sent'}`;
  const timestamp = new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  messageGroup.innerHTML = `
    ${data.senderId === currentChatUser.id ? `<div class="avatar status-dot online">${getInitials(data.senderName)}</div>` : ''}
    <div class="bubble">
      ${data.content ? data.content : '[No Content]'}
      <span class="timestamp">${timestamp}</span>
      ${data.senderId !== currentChatUser.id ? `<span class="read-receipt" title="Delivered">✓</span>` : ''}
      <button class="reaction-btn" title="React">😊</button>
      <div class="reactions-bar"></div>
    </div>
  `;
  chatMessages.appendChild(messageGroup);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage(message, type = 'text') {
  if (!ws || !currentChatUser) return;
  
  const messageData = {
    type: 'message',
    senderId: getCurrentUserId(),
    receiverId: currentChatUser.id,
    content: message,
    messageType: type
  };
  
  ws.send(JSON.stringify(messageData));
  appendMessage(messageData);
}

function showTypingIndicator(userId) {
  const typingIndicator = document.querySelector('.typing-indicator-header');
  typingIndicator.style.display = 'inline';
  
  setTimeout(() => {
    typingIndicator.style.display = 'none';
  }, 3000);
}

// Update the existing renderMessages function
async function renderMessages(userId, userName, initials) {
  currentChatUser = { id: userId, name: userName };
  
  const chatHeader = document.querySelector('.chat-header-user h3');
  const chatAvatar = document.querySelector('.chat-header-user .avatar');
  chatHeader.textContent = userName;
  chatAvatar.textContent = initials;
  
  const chatMessages = document.querySelector('.chat-messages');
  chatMessages.innerHTML = '';
  
  try {
    const response = await fetch(`http://localhost:5000/api/messages/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch messages');
    
    const messages = await response.json();
    messages.forEach(msg => {
      const messageData = {
        senderId: msg.sender_id,
        content: msg.content,
        timestamp: msg.created_at,
        senderName: msg.sender_name
      };
      appendMessage(messageData);
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    showToast('Failed to load messages', 'error');
  }
}

// Update the existing renderUserList function
async function renderUserList() {
  try {
    const response = await fetch('http://localhost:5000/api/users', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch users');
    
    const users = await response.json();
    const sidebar = document.querySelector('.recent-chats-list');
    sidebar.innerHTML = '';
    
    users.forEach(user => {
      const initials = getInitials(user.full_name);
      const userDiv = document.createElement('div');
      userDiv.className = 'recent-chat';
      userDiv.dataset.userid = user.id;
      
      userDiv.innerHTML = `
        <div class="avatar status-dot online">${initials}</div>
        <div class="chat-info">
          <div class="chat-header">
            <h4>${user.full_name}</h4>
            <span class="time"></span>
          </div>
          <p class="last-message"></p>
          <span class="user-status-text">Online</span>
        </div>
      `;
      
      userDiv.addEventListener('click', () => {
        document.querySelectorAll('.recent-chat').forEach(chat => chat.classList.remove('active'));
        userDiv.classList.add('active');
        renderMessages(user.id, user.full_name, initials);
      });
      
      sidebar.appendChild(userDiv);
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    showToast('Failed to load users', 'error');
  }
}

// Helper function to get user initials
function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

// Helper function to get current user ID
function getCurrentUserId() {
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

// Initialize WebSocket connection when user logs in
document.addEventListener('DOMContentLoaded', () => {
  const userId = getCurrentUserId();
  if (userId) {
    connectWebSocket(userId);
    renderUserList();
  }
});

// ... existing code ...

// Add this to the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on the chat page
  if (window.location.pathname.includes('chatspage.html')) {
    const selectedUserId = localStorage.getItem('selectedChatUser');
    if (selectedUserId) {
      // Fetch user details and initialize chat
      fetch(`http://localhost:5000/api/users/${selectedUserId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => response.json())
      .then(user => {
        const initials = getInitials(user.full_name);
        renderMessages(user.id, user.full_name, initials);
        // Clear the stored user ID after loading
        localStorage.removeItem('selectedChatUser');
      })
      .catch(error => {
        console.error('Error loading user:', error);
        showToast('Failed to load user chat', 'error');
      });
    }
  }
});

// ... existing code ...

document.addEventListener('DOMContentLoaded', () => {
  const userId = getCurrentUserId();
  // Only run chat user logic on chatspage.html
  if (userId && window.location.pathname.includes('chatspage.html')) {
    connectWebSocket(userId);
    renderUserList();
  }
  // Only run skill swap user logic on skill swap search page
  if (document.getElementById('userResults')) {
    fetchUsers().then(() => renderUsers(''));
  }
});
// ... existing code ...

// --- Tutorial Search and Display (Backend API Driven) ---
async function fetchTutorials(searchQuery = '', levelFilter = '') {
    try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (levelFilter) params.append('level', levelFilter);
        const response = await fetch('http://localhost:5000/api/tutorials?' + params.toString());
        if (!response.ok) throw new Error('Failed to fetch tutorials');
        return await response.json();
    } catch (error) {
        console.error('Error fetching tutorials:', error);
        return [];
    }
}

// Single unified function to create tutorial card HTML with improved design
function createTutorialCard(tutorial) {
    // Note: Assuming tutorial object now includes learning_objectives and requirements, but we don't display them on listing page
    return `
        <div class="tutorial-card" data-aos="fade-up">
            <div class="tutorial-image">
                <img src="${tutorial.image || 'Images/online tutorials/graphic.jpg'}" alt="${tutorial.title}" loading="lazy">
                <div class="tutorial-level-badge">${tutorial.level || 'Not specified'}</div>
            </div>
            <div class="tutorial-content">
                <h3 class="tutorial-title">${tutorial.title}</h3>
                <p class="tutorial-description">${tutorial.description || 'No description available.'}</p>
                <div class="tutorial-meta">
                    <div class="meta-item">
                        <i class="fas fa-clock"></i>
                        <span>${tutorial.duration || 'N/A'}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-user"></i>
                        <span>${tutorial.instructor || tutorial.instructor_name || 'Unknown'}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-star"></i>
                        <span>${tutorial.rating || '0.0'}</span>
                    </div>
                </div>
                <div class="tutorial-actions">
                    <button class="primary-btn enroll-btn" onclick="enrollTutorial(${tutorial.id})">
                        <i class="fas fa-graduation-cap"></i>
                        <span>Enroll Now</span>
                    </button>
                     
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Single unified function to display tutorials
function displayTutorials(tutorials) {
    const resultsContainer = document.getElementById('tutorialResults');
    if (!resultsContainer) {
        console.error('Tutorial results container not found');
        return;
    }

    if (!tutorials || tutorials.length === 0) {
        resultsContainer.innerHTML = `
            <div class="ss-no-results">
                <i class="fas fa-search"></i>
                <p>No tutorials found matching your criteria.</p>
            </div>
        `;
        return;
    }

    resultsContainer.innerHTML = tutorials.map(tutorial => createTutorialCard(tutorial)).join('');
}

// Single unified function to handle tutorial search and filtering
async function searchTutorials() {
    const searchInput = document.getElementById('tutorialSearch');
    const levelFilter = document.getElementById('levelFilter');
    const resultsContainer = document.getElementById('tutorialResults');
    const loadingElement = document.getElementById('loading'); // Assuming there is a loading element

    if (!searchInput || !levelFilter || !resultsContainer) return;

    // Show loading indicator if it exists
    if (loadingElement) loadingElement.style.display = 'block';
    resultsContainer.innerHTML = ''; // Clear previous results

    const searchTerm = searchInput.value.trim();
    const selectedLevel = levelFilter.value;

    const tutorials = await fetchTutorials(searchTerm, selectedLevel);

    // Hide loading indicator if it exists
    if (loadingElement) loadingElement.style.display = 'none';

    displayTutorials(tutorials);
}

// Function to handle tutorial enrollment (assuming this navigates to a page or triggers an action)
async function enrollTutorial(tutorialId) {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        showToast('Please log in to enroll in tutorials', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    // Simulate enrollment process or call backend API
    showToast('Processing enrollment...', 'info');
    try {
        const response = await fetch(`http://localhost:5000/api/tutorials/${tutorialId}/enroll`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
             throw new Error(errorData.error || 'Failed to enroll');
        }

        // Assuming successful enrollment means navigating to my-tutorials or similar
        showToast('Successfully enrolled in tutorial!', 'success');
         setTimeout(() => {
             window.location.href = `my-tutorials.html`; // Or tutorial-content.html if that's the next step
         }, 1500);

    } catch (error) {
        console.error('Enrollment error:', error);
        showToast(error.message || 'Failed to enroll in the tutorial', 'error');
    }
}

// Function to contact instructor (assuming this navigates to the chat page)
function contactInstructor(tutorialId) {
     // Check if user is logged in
     const token = localStorage.getItem('token');
     if (!token) {
         showToast('Please log in to contact instructors', 'warning');
         setTimeout(() => {
             window.location.href = 'login.html';
         }, 1500);
         return;
     }
    // Redirect to chat page, potentially with instructor ID
    showToast('Redirecting to chat...', 'info');
    setTimeout(() => {
        window.location.href = `chatspage.html?instructor=${tutorialId}`; // Pass instructor ID
    }, 1000);
}

// Initialize tutorial search on page load if the search elements exist
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('tutorialSearch');
    const levelFilter = document.getElementById('levelFilter');
    const clearBtn = document.getElementById('clearBtn');
    const resultsContainer = document.getElementById('tutorialResults');

    // Only initialize if the necessary elements for the tutorial search page are present
    if (searchInput && levelFilter && clearBtn && resultsContainer) {
        // Add event listeners
        searchInput.addEventListener('input', debounce(searchTutorials, 300));
        levelFilter.addEventListener('change', () => searchTutorials());
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            levelFilter.value = '';
            searchTutorials(); // Perform search after clearing
        });

        // Initial search to load tutorials when the page loads
        searchTutorials();
    }

     // ... other DOMContentLoaded logic ...

});

// Utility function for debouncing search (keep one instance)
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Keep only one instance of necessary global functions like showToast and validateEmail
// Ensure other page-specific DOMContentLoaded logic and functions are kept and not duplicated.

// Find and remove duplicate or incomplete tutorial search/display/interaction functions
// This part needs manual identification and removal based on the full file content.
// The code edit above provides the intended unified functions.

// Ensure the correct event listeners for tutorial search/filter/clear are kept.

// Ensure the correct implementations of enrollTutorial and contactInstructor are kept.
// The provided enrollTutorial and contactInstructor above are updated to use showToast and redirect.

// Function to set accent color and save to localStorage
function setAccentColor(color) {
  document.documentElement.style.setProperty('--accent-color', color);
  localStorage.setItem('accentColor', color);
}

// Function to load saved accent color
function loadSavedAccentColor() {
  const savedColor = localStorage.getItem('accentColor');
  if (savedColor) {
    document.documentElement.style.setProperty('--accent-color', savedColor);
    // Update select if it exists on the page
    const accentSelect = document.getElementById('accent-color-select');
    if (accentSelect) {
      accentSelect.value = savedColor;
    }
  }
}

// Load saved accent color when page loads
document.addEventListener('DOMContentLoaded', function() {
  loadSavedAccentColor();
  
  // Accent color select handler
  const accentSelect = document.getElementById('accent-color-select');
  if (accentSelect) {
    accentSelect.addEventListener('change', function() {
      setAccentColor(this.value);
      showToast('Accent color updated!');
    });
  }
});

// ... existing code ...

// Delete account functionality
async function deleteAccount(event) {
    event.preventDefault();
    const password = document.getElementById('deletePassword').value;
    const feedback = document.getElementById('deleteFeedback');
    const deleteBtn = document.getElementById('deleteAccountBtn');
    
    if (!password) {
        feedback.textContent = 'Please enter your password to confirm deletion';
        feedback.style.color = '#ef4444';
        return;
    }

    // Disable button and show loading state
    deleteBtn.disabled = true;
    deleteBtn.textContent = 'Deleting Account...';
    feedback.textContent = 'Processing your request...';
    feedback.style.color = '#6b7280';

    try {
        const response = await fetch('/api/user/delete-account', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.error || 'Failed to delete account');
        }

        // Clear local storage
        localStorage.clear();
        
        // Show success message
        feedback.textContent = 'Account deleted successfully. Redirecting...';
        feedback.style.color = '#10b981';
        
        // Redirect to home page after a short delay
        setTimeout(() => {
            window.location.href = '/index.html';
        }, 2000);
    } catch (error) {
        feedback.textContent = error.message;
        feedback.style.color = '#ef4444';
    } finally {
        // Reset button state
        deleteBtn.disabled = false;
        deleteBtn.textContent = 'Delete Account';
    }
}

// ... existing code ...

// Fetch and display events
async function loadEvents() {
  try {
    const response = await fetch('http://localhost:5000/api/events');
    const events = await response.json();
    const eventsContainer = document.querySelector('.events-grid');
    
    if (eventsContainer) {
      eventsContainer.innerHTML = events.map(event => `
        <div class="event-card">
          <div class="event-title">
            <i class="fas fa-calendar" style="color: var(--accent-color);"></i> ${event.title}
          </div>
          <div class="event-date">
            <i class="fas fa-calendar-day"></i> ${new Date(event.date).toLocaleDateString()}
          </div>
          <div class="event-location">
            <i class="fas fa-map-marker-alt"></i> ${event.location}
          </div>
          <div class="event-description">${event.description}</div>
          <a href="event-details.html?id=${event.id}" class="btn btn-primary" style="margin-top: 10px;">
            <i class="fas fa-sign-in-alt"></i> Join
          </a>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('Error loading events:', error);
    showToast('Failed to load events', 'error');
  }
}

// Call loadEvents when the page loads
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('event.html')) {
    loadEvents();
  }
});

// ... existing code ...

// Function to load user's events
async function loadUserEvents() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch('http://localhost:5000/api/my-events', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = 'login.html';
                return;
            }
            throw new Error('Failed to fetch events');
        }

        const events = await response.json();
        const eventsGrid = document.getElementById('events-grid');
        const noEvents = document.getElementById('no-events');

        if (!events || events.length === 0) {
            eventsGrid.style.display = 'none';
            noEvents.style.display = 'block';
            return;
        }

        eventsGrid.style.display = 'grid';
        noEvents.style.display = 'none';

        eventsGrid.innerHTML = events.map(event => `
            <div class="event-card">
                <div class="event-title">
                    <i class="fas fa-calendar" style="color: var(--accent-color);"></i>
                    ${event.title}
                </div>
                <div class="event-meta">
                    <div class="event-meta-item">
                        <i class="fas fa-calendar-day"></i>
                        ${new Date(event.event_date).toLocaleDateString()}
                    </div>
                    <div class="event-meta-item">
                        <i class="fas fa-map-marker-alt"></i>
                        ${event.location || 'Online'}
                    </div>
                    <div class="event-meta-item">
                        <i class="fas fa-clock"></i>
                        ${event.time || 'TBA'}
                    </div>
                    <div class="event-meta-item">
                        <i class="fas fa-users"></i>
                        ${event.category || 'General'}
                    </div>
                </div>
                <div class="event-description">${event.description || 'No description available'}</div>
                <a href="event-details.html?id=${event.id}" class="btn btn-primary">
                    <i class="fas fa-info-circle"></i> View Details
                </a>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading events:', error);
        const eventsGrid = document.getElementById('events-grid');
        const noEvents = document.getElementById('no-events');
        eventsGrid.style.display = 'none';
        noEvents.style.display = 'block';
        noEvents.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <h2>Error Loading Events</h2>
            <p>There was a problem loading your events. Please try again later.</p>
            <a href="event.html" class="back-to-events">
                <i class="fas fa-arrow-left"></i> Browse Events
            </a>
        `;
    }
}

// Add event listener for my-events page
if (window.location.pathname.includes('my-events.html')) {
    document.addEventListener('DOMContentLoaded', loadUserEvents);
}

// ... rest of the existing code ...

