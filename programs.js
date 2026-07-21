 document.addEventListener('DOMContentLoaded', function() {

        // ============================================================
        // 1. NAVBAR SCROLL
        // ============================================================
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // ============================================================
        // 2. MOBILE MENU
        // ============================================================
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobileMenu');

        hamburger.addEventListener('click', function() {
            const isActive = mobileMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // ============================================================
        // 3. SCROLL REVEAL
        // ============================================================
        const revealElements = document.querySelectorAll('.reveal');
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -20px 0px'
        });
        revealElements.forEach(el => revealObserver.observe(el));

        // ============================================================
        // 4. COUNTER ANIMATION
        // ============================================================
        const counters = document.querySelectorAll('.number');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-count'));
                    if (!isNaN(target) && entry.target.innerText === '0') {
                        animateCounter(entry.target, target);
                    }
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        counters.forEach(counter => counterObserver.observe(counter));

        function animateCounter(element, target) {
            let current = 0;
            const increment = Math.max(1, Math.floor(target / 80));
            const duration = 2000;
            const stepTime = Math.max(16, Math.floor(duration / (target / increment)));

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    element.innerText = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    element.innerText = current.toLocaleString();
                }
            }, stepTime);
        }

        // ============================================================
        // 5. TAB SWITCHER (Tournaments)
        // ============================================================
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanels = {
            active: document.getElementById('panel-active'),
            past: document.getElementById('panel-past')
        };

        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tab = this.dataset.tab;

                // Update buttons
                tabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');

                // Update panels
                Object.keys(tabPanels).forEach(key => {
                    const panel = tabPanels[key];
                    if (key === tab) {
                        panel.classList.add('active');
                        panel.setAttribute('aria-hidden', 'false');
                    } else {
                        panel.classList.remove('active');
                        panel.setAttribute('aria-hidden', 'true');
                    }
                });
            });
        });

        // ============================================================
        // 6. FAQ ACCORDION
        // ============================================================
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');

            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');

                // Close all other items
                faqItems.forEach(other => {
                    if (other !== item) {
                        other.classList.remove('active');
                        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                    }
                });

                // Toggle current
                if (isActive) {
                    item.classList.remove('active');
                    question.setAttribute('aria-expanded', 'false');
                } else {
                    item.classList.add('active');
                    question.setAttribute('aria-expanded', 'true');
                }
            });

            // Keyboard support
            question.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });

        // ============================================================
        // 7. NEWSLETTER FORM
        // ============================================================
        const newsletterForm = document.getElementById('newsletterForm');
        const newsletterFeedback = document.getElementById('newsletterFeedback');

        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                const email = document.getElementById('newsletterEmail').value.trim();

                if (!email || !email.includes('@')) {
                    e.preventDefault();
                    newsletterFeedback.textContent = 'Please enter a valid email address.';
                    newsletterFeedback.style.color = '#ef4444';
                    newsletterFeedback.style.fontSize = '12px';
                    return;
                }

                // Let form submit naturally to formsubmit.co
                newsletterFeedback.textContent = 'Subscribing...';
                newsletterFeedback.style.color = 'rgba(255,255,255,0.6)';
            });
        }

        // ============================================================
        // 8. CONTACT FORM (if present)
        // ============================================================
        const contactForm = document.getElementById('contactForm');
        const formFeedback = document.getElementById('formFeedback');

        if (contactForm && formFeedback) {
            contactForm.addEventListener('submit', function(e) {
                const name = document.getElementById('fullName')?.value.trim();
                const email = document.getElementById('emailAddress')?.value.trim();
                const message = document.getElementById('message')?.value.trim();

                if (!name || !email || !message) {
                    e.preventDefault();
                    formFeedback.textContent = 'Please fill in all required fields.';
                    formFeedback.style.color = '#ef4444';
                    return;
                }

                if (!email.includes('@')) {
                    e.preventDefault();
                    formFeedback.textContent = 'Please enter a valid email address.';
                    formFeedback.style.color = '#ef4444';
                    return;
                }

                formFeedback.textContent = 'Sending...';
                formFeedback.style.color = '#475569';
            });
        }

    });