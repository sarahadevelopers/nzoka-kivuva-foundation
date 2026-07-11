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

            // ---------- 4. CONTACT FORM ----------
            const contactForm = document.getElementById('contactForm');
            const formFeedback = document.getElementById('formFeedback');

            if (contactForm) {
                contactForm.addEventListener('submit', function(e) {
                    e.preventDefault();

                    const name = document.getElementById('fullName').value.trim();
                    const email = document.getElementById('emailAddress').value.trim();
                    const message = document.getElementById('message').value.trim();

                    if (!name || !email || !message) {
                        formFeedback.innerHTML =
                            '<span style="color:#b91c1c;font-weight:500;">Please fill in all required fields.</span>';
                        return;
                    }

                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(email)) {
                        formFeedback.innerHTML =
                            '<span style="color:#b91c1c;font-weight:500;">Please enter a valid email address.</span>';
                        return;
                    }

                    formFeedback.innerHTML =
                        '<span style="color:#0b6623;font-weight:500;">✓ Thank you! Your message has been sent. We\'ll get back to you soon.</span>';
                    contactForm.reset();

                    setTimeout(function() {
                        formFeedback.innerHTML = '';
                    }, 6000);
                });
            }

        });