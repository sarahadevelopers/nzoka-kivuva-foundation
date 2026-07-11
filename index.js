 document.addEventListener('DOMContentLoaded', function() {

            // ---------- 1. NAVBAR SCROLL EFFECT ----------
            const navbar = document.getElementById('navbar');
            const hamburger = document.getElementById('hamburger');
            const mobileMenu = document.getElementById('mobileMenu');

            let lastScroll = 0;
            window.addEventListener('scroll', function() {
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                if (currentScroll > 30) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                lastScroll = currentScroll;
            });

            // ---------- 2. HAMBURGER MENU ----------
            hamburger.addEventListener('click', function() {
                const isOpen = mobileMenu.classList.toggle('open');
                hamburger.classList.toggle('active');
                hamburger.setAttribute('aria-expanded', isOpen);
                document.body.style.overflow = isOpen ? 'hidden' : '';
            });

            // Close mobile menu on link click
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

            // ---------- 3. SCROLL REVEAL (IntersectionObserver) ----------
            const revealElements = document.querySelectorAll('.reveal');
            const revealObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        // Optionally unobserve after reveal
                        // revealObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.10,
                rootMargin: '0px 0px -40px 0px'
            });

            revealElements.forEach(function(el) {
                revealObserver.observe(el);
            });

            // ---------- 4. COUNT-UP COUNTERS ----------
            const counters = document.querySelectorAll('.number[data-count]');

            function animateCounter(el) {
                const target = parseFloat(el.getAttribute('data-count'));
                if (isNaN(target) || target <= 0) return;
                const duration = 2000; // ms
                const startTime = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // EaseOutExpo for a premium feel
                    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                    const current = Math.floor(eased * target);

                    // Format with commas
                    el.textContent = current.toLocaleString();

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        el.textContent = target.toLocaleString();
                    }
                }

                requestAnimationFrame(updateCounter);
            }

            // Use IntersectionObserver to trigger counters only when visible
            const counterObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        // Only animate if not already counted
                        if (!el.dataset.counted) {
                            el.dataset.counted = 'true';
                            animateCounter(el);
                        }
                        // Optionally unobserve after trigger
                        // counterObserver.unobserve(el);
                    }
                });
            }, {
                threshold: 0.25
            });

            counters.forEach(function(c) {
                counterObserver.observe(c);
            });

            // If a counter is already visible on load (e.g., above fold), trigger it
            // But our counters are below fold, so this is fine.

            // ---------- 5. SLIDER CONTROLS ----------
            const sliderWrapper = document.getElementById('sliderWrapper');
            const sliderTrack = document.getElementById('sliderTrack');
            const prevBtn = document.getElementById('sliderPrev');
            const nextBtn = document.getElementById('sliderNext');

            if (sliderWrapper && sliderTrack && prevBtn && nextBtn) {
                function getScrollStep() {
                    const firstCard = sliderTrack.querySelector('.update-card');
                    if (!firstCard) return 300;
                    const cardWidth = firstCard.offsetWidth || 340;
                    const gap = 32; // matches gap-2rem (2rem = 32px)
                    return cardWidth + gap;
                }

                prevBtn.addEventListener('click', function() {
                    sliderWrapper.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
                });

                nextBtn.addEventListener('click', function() {
                    sliderWrapper.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
                });

                // Keyboard support
                sliderWrapper.addEventListener('keydown', function(e) {
                    if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        sliderWrapper.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
                    } else if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        sliderWrapper.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
                    }
                });
                // Make slider focusable
                sliderWrapper.setAttribute('tabindex', '0');
            }

            // ---------- 6. CONTACT FORM (basic validation + feedback) ----------
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

                    // Simple email validation
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(email)) {
                        formFeedback.innerHTML =
                            '<span style="color:#b91c1c;font-weight:500;">Please enter a valid email address.</span>';
                        return;
                    }

                    // Success simulation
                    formFeedback.innerHTML =
                        '<span style="color:#0b6623;font-weight:500;">✓ Thank you! Your message has been sent. We\'ll get back to you soon.</span>';
                    contactForm.reset();

                    // Clear success after 6 seconds
                    setTimeout(function() {
                        formFeedback.innerHTML = '';
                    }, 6000);
                });
            }

        }); // end DOMContentLoaded