// Subscription Modal Component
class SubscriptionModal {
    constructor() {
        this.init();
    }

    init() {
        // No need to create modal HTML since we'll redirect to payment.html
    }

    show() {
        // Redirect to payment page instead of showing modal
        window.location.href = 'payment.html';
    }

    hide() {
        // No need to hide since we're redirecting
    }

    async handleSubscribe(plan) {
        // Redirect to payment page with plan pre-selected
        window.location.href = `payment.html?plan=${plan}`;
    }
}

// Export the modal instance
const subscriptionModal = new SubscriptionModal();
export default subscriptionModal; 