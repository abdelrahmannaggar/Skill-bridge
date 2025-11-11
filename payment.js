// Payment and subscription handling
document.addEventListener('DOMContentLoaded', () => {
    const planButtons = document.querySelectorAll('.plan-select');
    const paymentModal = document.getElementById('payment-modal');
    const closeModal = document.querySelector('.close-modal');
    const paymentForm = document.getElementById('payment-form');
    const planDetails = document.getElementById('plan-details');

    // Handle plan selection
    planButtons.forEach(button => {
        button.addEventListener('click', () => {
            const plan = button.dataset.plan;
            const planCard = button.closest('.plan-card');
            const price = planCard.querySelector('.price').textContent;
            const features = Array.from(planCard.querySelectorAll('.plan-features li'))
                .map(li => li.textContent.trim());

            // Update modal with selected plan details
            planDetails.innerHTML = `
                <h3>${plan} Plan</h3>
                <p class="price">${price}</p>
                <ul class="selected-features">
                    ${features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            `;

            // Show payment modal
            paymentModal.style.display = 'block';
        });
    });

    // Close modal
    closeModal.addEventListener('click', () => {
        paymentModal.style.display = 'none';
    });

    // Handle payment form submission
    paymentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        const plan = planDetails.querySelector('h3').textContent.replace(' Plan', '');
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

        try {
            const response = await fetch('http://localhost:5000/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    plan: plan,
                    method: paymentMethod
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Show success message
                showToast('Subscription successful!', 'success');
                
                // Update UI to reflect new subscription
                await initSubscriptionGuard();
                
                // Close modal
                paymentModal.style.display = 'none';
                
                // Redirect to profile or dashboard
                setTimeout(() => {
                    window.location.href = 'profilepage.html';
                }, 2000);
            } else {
                throw new Error(data.error || 'Subscription failed');
            }
        } catch (error) {
            console.error('Subscription error:', error);
            showToast(error.message || 'Failed to process subscription', 'error');
        }
    });
});

// Toast notification function
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
        ${message}
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
} 