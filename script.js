// ============================================================
// NEWSLETTER SUBSCRIPTION (FormSubmit - AJAX)
// ============================================================
document.addEventListener('DOMContentLoaded', function() {

    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterEmail = document.getElementById('newsletterEmail');
    const newsletterFeedback = document.getElementById('newsletterFeedback');
    const submitBtn = document.getElementById('newsletterSubmit');

    if (newsletterForm) {

        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const email = newsletterEmail.value.trim();

            // Clear previous feedback
            newsletterFeedback.className = 'newsletter-feedback';
            newsletterFeedback.textContent = '';

            // Validation
            if (!email) {
                newsletterFeedback.className = 'newsletter-feedback error';
                newsletterFeedback.textContent = 'Please enter your email address.';
                newsletterEmail.focus();
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                newsletterFeedback.className = 'newsletter-feedback error';
                newsletterFeedback.textContent = 'Please enter a valid email address.';
                newsletterEmail.focus();
                return;
            }

            // Show loading state
            newsletterFeedback.className = 'newsletter-feedback';
            newsletterFeedback.textContent = 'Subscribing...';
            submitBtn.disabled = true;

            try {
                const formData = new FormData(this);

                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    newsletterFeedback.className = 'newsletter-feedback success';
                    newsletterFeedback.textContent = '✓ Subscribed successfully! Check your email.';
                    newsletterEmail.value = '';
                } else {
                    const data = await response.json();
                    newsletterFeedback.className = 'newsletter-feedback error';
                    newsletterFeedback.textContent = data.message || 'Something went wrong. Please try again.';
                }
            } catch (error) {
                newsletterFeedback.className = 'newsletter-feedback error';
                newsletterFeedback.textContent = 'Server error. Please try again later.';
                console.error('Newsletter error:', error);
            } finally {
                submitBtn.disabled = false;
            }
        });

        // Clear error on input
        newsletterEmail.addEventListener('input', function() {
            if (newsletterFeedback.className.includes('error')) {
                newsletterFeedback.className = 'newsletter-feedback';
                newsletterFeedback.textContent = '';
            }
        });

    }

});