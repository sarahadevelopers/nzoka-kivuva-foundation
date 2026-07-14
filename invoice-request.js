document.addEventListener('DOMContentLoaded', function() {

    // ============================================================
    // 1. NAVBAR SCROLL
    // ============================================================
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (navbar) {
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            navbar.classList.toggle('scrolled', currentScroll > 30);
        });
    }

    // ============================================================
    // 2. HAMBURGER MENU
    // ============================================================
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function() {
            const isOpen = mobileMenu.classList.toggle('open');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        document.querySelectorAll('.mobile-link, .mobile-cta').forEach(function(link) {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('open');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });

        document.addEventListener('click', function(e) {
            if (mobileMenu.classList.contains('open')) {
                const isClickInside = mobileMenu.contains(e.target) || hamburger.contains(e.target);
                if (!isClickInside) {
                    mobileMenu.classList.remove('open');
                    hamburger.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            }
        });
    }

    // ============================================================
    // 3. SCROLL REVEAL
    // ============================================================
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.10,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function(el) {
        revealObserver.observe(el);
    });

    // ============================================================
    // 4. INVOICE REQUEST FORM (AJAX via FormSubmit)
    // ============================================================
    const invoiceForm = document.getElementById('invoiceForm');
    const invoiceFeedback = document.getElementById('invoiceFeedback');

    if (invoiceForm) {
        invoiceForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Reset feedback
            invoiceFeedback.className = 'form-feedback';
            invoiceFeedback.textContent = '';

            // Validate required fields
            const required = invoiceForm.querySelectorAll('[required]');
            let valid = true;

            required.forEach(function(field) {
                if (!field.value.trim()) {
                    valid = false;
                    field.style.borderColor = '#b91c1c';
                } else {
                    field.style.borderColor = '';
                }
            });

            if (!valid) {
                invoiceFeedback.className = 'form-feedback error';
                invoiceFeedback.textContent = 'Please fill in all required fields.';
                return;
            }

            // Prepare form data
            const formData = new FormData(invoiceForm);

            // Show sending state
            invoiceFeedback.className = 'form-feedback';
            invoiceFeedback.textContent = 'Sending request...';

            try {
                const response = await fetch(invoiceForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    invoiceFeedback.className = 'form-feedback success';
                    invoiceFeedback.textContent = '✓ Invoice request submitted successfully! We\'ll process it within 2–3 business days.';
                    invoiceForm.reset();
                } else {
                    const data = await response.json();
                    invoiceFeedback.className = 'form-feedback error';
                    invoiceFeedback.textContent = data.message || 'Something went wrong. Please try again.';
                }
            } catch (error) {
                invoiceFeedback.className = 'form-feedback error';
                invoiceFeedback.textContent = 'Server error. Please try again later.';
                console.error('Invoice form error:', error);
            } finally {
                setTimeout(function() {
                    invoiceFeedback.textContent = '';
                    invoiceFeedback.className = 'form-feedback';
                }, 8000);
            }
        });

        // Reset field border on focus
        invoiceForm.querySelectorAll('input, textarea, select').forEach(function(el) {
            el.addEventListener('focus', function() {
                this.style.borderColor = '';
            });
        });
    }

});