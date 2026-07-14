document.addEventListener('DOMContentLoaded', function() {

    // ---------- 1. NAVBAR SCROLL ----------
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            navbar.classList.toggle('scrolled', currentScroll > 30);
        });
    }

    // ---------- 2. HAMBURGER MENU (Robust) ----------
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {

        // Toggle menu on hamburger click
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = mobileMenu.classList.toggle('open');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close menu when clicking a link
        document.querySelectorAll('.mobile-link, .mobile-cta').forEach(function(link) {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('open');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Close menu on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking outside (optional)
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

        // Prevent body scroll when menu is open (touch devices)
        mobileMenu.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, { passive: false });

    } else {
        console.warn('Hamburger or mobile menu elements not found. Check your HTML IDs.');
    }

    // ---------- 3. SCROLL REVEAL ----------
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
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
    }

    // ---------- 4. TAB SWITCHER ----------
    const tabBtns = document.querySelectorAll('.tab-btn');
    const panels = {
        active: document.getElementById('panel-active'),
        past: document.getElementById('panel-past')
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
                }
            });
        });
    }

    // ---------- 5. TOURNAMENT SLIDER (if present) ----------
    const sliderWrapper = document.getElementById('sliderWrapper');
    const sliderTrack = document.getElementById('sliderTrack');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');

    if (sliderWrapper && sliderTrack && prevBtn && nextBtn) {
        function getScrollStep() {
            const firstCard = sliderTrack.querySelector('.update-card');
            if (!firstCard) return 300;
            const cardWidth = firstCard.offsetWidth || 340;
            const gap = 32;
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
        sliderWrapper.setAttribute('tabindex', '0');
    }

    // ---------- 6. NEWSLETTER FORM (if present) ----------
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterEmail = document.getElementById('newsletterEmail');
    const newsletterFeedback = document.getElementById('newsletterFeedback');
    const submitBtn = document.getElementById('newsletterSubmit');

    if (newsletterForm && newsletterEmail && newsletterFeedback) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const email = newsletterEmail.value.trim();

            newsletterFeedback.className = 'newsletter-feedback';
            newsletterFeedback.textContent = '';

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

            newsletterFeedback.className = 'newsletter-feedback';
            newsletterFeedback.textContent = 'Subscribing...';
            if (submitBtn) submitBtn.disabled = true;

            try {
                const formData = new FormData(this);

                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
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
                if (submitBtn) submitBtn.disabled = false;
            }
        });

        newsletterEmail.addEventListener('input', function() {
            if (newsletterFeedback.className.includes('error')) {
                newsletterFeedback.className = 'newsletter-feedback';
                newsletterFeedback.textContent = '';
            }
        });
    }

});