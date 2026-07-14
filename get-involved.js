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

        // Close on link click
        document.querySelectorAll('.mobile-link, .mobile-cta').forEach(function(link) {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('open');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });

        // Close on outside click
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
    // 4. TAB SWITCHER (Get Involved Forms)
    // ============================================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const panels = {
        scholarship: document.getElementById('panel-scholarship'),
        club: document.getElementById('panel-club'),
        partner: document.getElementById('panel-partner'),
        volunteer: document.getElementById('panel-volunteer')
    };

    if (tabBtns.length > 0) {
        tabBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                // Remove active from all tabs
                tabBtns.forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');

                // Hide all panels
                Object.values(panels).forEach(function(p) {
                    if (p) p.classList.remove('active');
                });

                // Show the selected panel
                const tab = btn.getAttribute('data-tab');
                if (panels[tab]) {
                    panels[tab].classList.add('active');

                    // Re-trigger reveal animations on the new panel
                    const newReveals = panels[tab].querySelectorAll('.reveal');
                    newReveals.forEach(function(el) {
                        if (!el.classList.contains('visible')) {
                            revealObserver.observe(el);
                        }
                    });
                }
            });
        });
    }

    // ============================================================
    // 5. FORM SUBMISSION (AJAX via FormSubmit)
    // ============================================================
    function handleFormSubmit(formId, feedbackId, successMessage) {
        const form = document.getElementById(formId);
        const feedback = document.getElementById(feedbackId);

        if (!form) return;

        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Reset feedback
            feedback.className = 'form-feedback';
            feedback.textContent = '';

            // Validate required fields
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

            // Prepare form data
            const formData = new FormData(form);

            // Show sending state
            feedback.className = 'form-feedback';
            feedback.textContent = 'Sending...';

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    feedback.className = 'form-feedback success';
                    feedback.textContent = successMessage || '✓ Submitted successfully! We\'ll be in touch soon.';
                    form.reset();
                } else {
                    const data = await response.json();
                    feedback.className = 'form-feedback error';
                    feedback.textContent = data.message || 'Something went wrong. Please try again.';
                }
            } catch (error) {
                feedback.className = 'form-feedback error';
                feedback.textContent = 'Server error. Please try again later.';
                console.error('Form submission error:', error);
            } finally {
                // Clear success/error after 8 seconds
                setTimeout(function() {
                    feedback.textContent = '';
                    feedback.className = 'form-feedback';
                }, 8000);
            }
        });
    }

    // Initialize all forms with their specific success messages
    // Note: Forms must have action="https://formsubmit.co/info@nzokakivuvafoundation.org" and method="POST"
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

    // ============================================================
    // 6. DONATION SECTION – QUICK DONATE, COPY, PROGRESS
    // ============================================================
    // --- Quick Donate Buttons ---
    const donateBtns = document.querySelectorAll('.quick-donate-btn');
    const customWrap = document.getElementById('customAmountWrap');
    const customInput = document.getElementById('customAmount');
    const donateImpact = document.getElementById('donateImpact');

    if (donateBtns.length > 0) {
        const impactMessages = {
            500: '✨ Your donation will provide <strong>sports equipment for 10 kids</strong>',
            1000: '✨ Your donation will provide <strong>sports equipment for 20 kids</strong>',
            2500: '✨ Your donation will fund <strong>one sports-linked scholarship</strong>',
            5000: '✨ Your donation will support <strong>a full community tournament</strong>',
            10000: '✨ Your donation will fund <strong>scholarships for 4 students</strong>'
        };

        donateBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                // Remove active from all buttons
                donateBtns.forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');

                const amount = btn.getAttribute('data-amount');

                // Show/hide custom input
                if (amount === 'custom') {
                    if (customWrap) customWrap.style.display = 'block';
                    if (customInput) customInput.focus();
                    if (donateImpact) donateImpact.innerHTML = '✨ Enter your custom donation amount';
                    return;
                } else {
                    if (customWrap) customWrap.style.display = 'none';
                }

                // Update impact message
                if (donateImpact) {
                    if (impactMessages[amount]) {
                        donateImpact.innerHTML = impactMessages[amount];
                    } else {
                        donateImpact.innerHTML = `✨ Thank you for your generous donation of <strong>KSh ${parseInt(amount).toLocaleString()}</strong>`;
                    }
                }
            });
        });

        // Custom amount input
        if (customInput) {
            customInput.addEventListener('input', function() {
                const val = parseInt(this.value);
                if (donateImpact) {
                    if (val > 0) {
                        donateImpact.innerHTML = `✨ Thank you for your generous donation of <strong>KSh ${val.toLocaleString()}</strong>`;
                    } else {
                        donateImpact.innerHTML = '✨ Enter your custom donation amount';
                    }
                }
            });
        }
    }

    // --- Copy to Clipboard ---
    const copyBtns = document.querySelectorAll('.copy-btn');
    if (copyBtns.length > 0) {
        copyBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const textToCopy = this.getAttribute('data-copy');

                if (navigator.clipboard) {
                    navigator.clipboard.writeText(textToCopy).then(function() {
                        btn.classList.add('copied');
                        btn.innerHTML = '<i class="fas fa-check"></i>';
                        setTimeout(function() {
                            btn.classList.remove('copied');
                            btn.innerHTML = '<i class="fas fa-copy"></i>';
                        }, 2000);
                    }).catch(function() {
                        fallbackCopy(textToCopy, btn);
                    });
                } else {
                    fallbackCopy(textToCopy, btn);
                }
            });
        });

        function fallbackCopy(text, btn) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                btn.classList.add('copied');
                btn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(function() {
                    btn.classList.remove('copied');
                    btn.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);
            } catch (err) {
                console.error('Copy failed:', err);
            }
            document.body.removeChild(textarea);
        }
    }

    // --- Progress Bar Animation ---
    const progressBar = document.querySelector('.impact-progress-fill');
    if (progressBar) {
        const progressObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    // The width is already set in the HTML – this ensures the transition triggers
                    progressBar.style.transition = 'width 1.5s var(--transition-premium)';
                    // Force reflow (optional)
                    // void progressBar.offsetWidth;
                }
            });
        }, { threshold: 0.5 });

        progressObserver.observe(progressBar);
    }

});