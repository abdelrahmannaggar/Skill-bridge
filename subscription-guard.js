import { getUserType, isProUser, isBasicUser, isFreeUser } from './auth.js';

// Feature access control
const featureAccess = {
    skillSwap: {
        free: { maxSwaps: 0, message: 'Upgrade to Basic or Pro plan to access Skill Swap' },
        basic: { maxSwaps: 3, message: 'You have used all your skill swaps for this period' },
        pro: { maxSwaps: 10, message: 'You have used all your skill swaps for this period' }
    },
    messaging: {
        free: { maxMessages: 5, message: 'Upgrade to Pro plan for unlimited messaging' },
        basic: { maxMessages: 20, message: 'Upgrade to Pro plan for unlimited messaging' },
        pro: { maxMessages: Infinity, message: '' }
    },
    tutorials: {
        free: { access: false, message: 'Upgrade to Basic or Pro plan to access tutorials' },
        basic: { access: true, message: '' },
        pro: { access: true, message: '' }
    },
    events: {
        free: { access: true, message: '' },
        basic: { access: true, message: '' },
        pro: { access: true, message: '' }
    }
};

// Initialize subscription guard
export async function initSubscriptionGuard() {
    await getUserType();
    updateUI();
}

// Update UI based on user type
function updateUI() {
    const userType = isProUser() ? 'pro' : isBasicUser() ? 'basic' : 'free';
    
    // Update plan-specific UI elements
    document.querySelectorAll('[data-plan-feature]').forEach(element => {
        const feature = element.dataset.planFeature;
        const access = featureAccess[feature][userType];
        
        if (access.access === false || (access.maxSwaps !== undefined && access.maxSwaps === 0)) {
            element.classList.add('disabled');
            element.title = access.message;
        } else {
            element.classList.remove('disabled');
        }
    });

    // Update user type indicator if exists
    const userTypeIndicator = document.getElementById('user-type-indicator');
    if (userTypeIndicator) {
        userTypeIndicator.textContent = userType.charAt(0).toUpperCase() + userType.slice(1);
        userTypeIndicator.className = `user-type-${userType}`;
    }
}

// Check if user can access a feature
export function canAccessFeature(feature) {
    const userType = isProUser() ? 'pro' : isBasicUser() ? 'basic' : 'free';
    const access = featureAccess[feature][userType];
    
    if (access.access === false) {
        return { allowed: false, message: access.message };
    }
    
    if (access.maxSwaps !== undefined) {
        // TODO: Implement swap count tracking
        return { allowed: true, message: '' };
    }
    
    return { allowed: true, message: '' };
}

// Show upgrade prompt
export function showUpgradePrompt(feature) {
    const userType = isProUser() ? 'pro' : isBasicUser() ? 'basic' : 'free';
    const access = featureAccess[feature][userType];
    
    if (access.message) {
        const toast = document.createElement('div');
        toast.className = 'toast toast-info';
        toast.innerHTML = `
            <i class="fas fa-info-circle"></i>
            ${access.message}
            <a href="payment.html" class="upgrade-link">Upgrade Now</a>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initSubscriptionGuard); 