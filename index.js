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
            // 5. UPDATES SLIDER
            // ============================================================
            const sliderTrack = document.getElementById('sliderTrack');
            const sliderWrapper = document.getElementById('sliderWrapper');
            const prevBtn = document.getElementById('sliderPrev');
            const nextBtn = document.getElementById('sliderNext');

            if (sliderTrack && prevBtn && nextBtn) {
                let scrollAmount = 0;
                const cardWidth = 320 + 28;
                let maxScroll = sliderTrack.scrollWidth - sliderWrapper.clientWidth;

                function updateButtons() {
                    scrollAmount = Math.max(0, Math.min(scrollAmount, maxScroll));
                    sliderTrack.style.transform = 'translateX(-' + scrollAmount + 'px)';
                    prevBtn.disabled = scrollAmount <= 0;
                    nextBtn.disabled = scrollAmount >= maxScroll;
                }

                prevBtn.addEventListener('click', function() {
                    scrollAmount = Math.max(0, scrollAmount - cardWidth);
                    updateButtons();
                });

                nextBtn.addEventListener('click', function() {
                    scrollAmount = Math.min(maxScroll, scrollAmount + cardWidth);
                    updateButtons();
                });

                window.addEventListener('resize', function() {
                    maxScroll = sliderTrack.scrollWidth - sliderWrapper.clientWidth;
                    updateButtons();
                });

                updateButtons();
            }

        });