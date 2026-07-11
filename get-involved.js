 document.addEventListener('DOMContentLoaded', function() {

            // ---------- 1. NAVBAR SCROLL ----------
            const navbar = document.getElementById('navbar');
            const hamburger = document.getElementById('hamburger');
            const mobileMenu = document.getElementById('mobileMenu');

            window.addEventListener('scroll', function() {
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                navbar.classList.toggle('scrolled', currentScroll > 30);
            });

            // ---------- 2. HAMBURGER ----------
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

            // ---------- 3. SCROLL REVEAL ----------
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

            // ---------- 4. TAB SWITCHER ----------
            const tabBtns = document.querySelectorAll('.tab-btn');
            const panels = {
                scholarship: document.getElementById('panel-scholarship'),
                club: document.getElementById('panel-club'),
                partner: document.getElementById('panel-partner'),
                volunteer: document.getElementById('panel-volunteer')
            };

            tabBtns.forEach(function(btn) {
                btn.addEventListener('click', function() {
                    // Remove active from all tabs
                    tabBtns.forEach(function(b) { b.classList.remove('active'); });
                    btn.classList.add('active');

                    // Hide all panels
                    Object.values(panels).forEach(function(p) { p.classList.remove('active'); });

                    // Show the selected panel
                    const tab = btn.getAttribute('data-tab');
                    if (panels[tab]) {
                        panels[tab].classList.add('active');
                    }

                    // Re-trigger reveal animations on the new panel
                    const newReveals = panels[tab].querySelectorAll('.reveal');
                    newReveals.forEach(function(el) {
                        if (!el.classList.contains('visible')) {
                            revealObserver.observe(el);
                        }
                    });
                });
            });

            // ---------- 5. FORM HANDLERS ----------
            function handleFormSubmit(formId, feedbackId, successMessage) {
                const form = document.getElementById(formId);
                const feedback = document.getElementById(feedbackId);

                if (!form) return;

                form.addEventListener('submit', function(e) {
                    e.preventDefault();

                    // Check all required fields
                    const required = form.querySelectorAll('[required]');
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
                        feedback.className = 'form-feedback error';
                        feedback.textContent = 'Please fill in all required fields.';
                        return;
                    }

                    // Simulate submission success
                    feedback.className = 'form-feedback success';
                    feedback.textContent = successMessage || '✓ Your application has been submitted successfully. We\'ll be in touch soon.';
                    form.reset();

                    // Clear success after 8 seconds
                    setTimeout(function() {
                        feedback.textContent = '';
                        feedback.className = 'form-feedback';
                    }, 8000);
                });
            }

            // Initialize all forms
            handleFormSubmit('scholarshipForm', 's_feedback', '✓ Your scholarship application has been submitted. We\'ll review and get back to you within 5 working days.');
            handleFormSubmit('clubForm', 'c_feedback', '✓ Your club registration has been received. Our sports team will contact you to finalize the process.');
            handleFormSubmit('partnerForm', 'p_feedback', '✓ Thank you for your partnership interest. Our partnerships team will reach out to discuss next steps.');
            handleFormSubmit('volunteerForm', 'v_feedback', '✓ Thank you for your willingness to volunteer! We\'ll connect you with the relevant program team shortly.');

            // Reset field border on focus
            document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(function(el) {
                el.addEventListener('focus', function() {
                    this.style.borderColor = '';
                });
            });

        });