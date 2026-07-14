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
   // ---------- 6. CONTACT FORM (AJAX) ----------
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const name = document.getElementById('fullName').value.trim();
        const email = document.getElementById('emailAddress').value.trim();
        const message = document.getElementById('message').value.trim();

        // Clear previous feedback
        formFeedback.innerHTML = '';

        // Validation
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

        // Show sending state
        formFeedback.innerHTML = '<span style="color:#475569;">Sending message...</span>';

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
                formFeedback.innerHTML =
                    '<span style="color:#0b6623;font-weight:500;">✓ Thank you! Your message has been sent. We\'ll get back to you soon.</span>';
                contactForm.reset();
            } else {
                formFeedback.innerHTML =
                    '<span style="color:#b91c1c;font-weight:500;">Something went wrong. Please try again.</span>';
            }
        } catch (error) {
            formFeedback.innerHTML =
                '<span style="color:#b91c1c;font-weight:500;">Server error. Please try again later.</span>';
            console.error('Form error:', error);
        }

        // Clear success/error after 8 seconds
        setTimeout(function() {
            formFeedback.innerHTML = '';
        }, 8000);
    });
}
    // ---------- 7. NEWSLETTER SUBSCRIPTION (FormSubmit - AJAX) ----------
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

    // ---------- 8. PILLARS TABS (Tabbed Hero Image Sections) ----------
   // ---------- 8. PILLARS TABS (Tabbed Hero Image Sections) ----------
const tabs = document.querySelectorAll('.pillar-tab');
const panels = {
    health: document.getElementById('panel-health'),
    education: document.getElementById('panel-education'),
    leadership: document.getElementById('panel-leadership'),
    community: document.getElementById('panel-community')
};

tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
        // Update active tab
        tabs.forEach(function(t) { t.classList.remove('active'); });
        tab.classList.add('active');

        // Hide all panels
        Object.values(panels).forEach(function(p) {
            if (p) p.classList.remove('active');
        });

        // Show the selected panel
        const tabId = tab.getAttribute('data-tab');
        if (panels[tabId]) {
            panels[tabId].classList.add('active');
        }
    });
});
// ---------- 8. TESTIMONIALS AUTOSLIDER ----------
const testimonialsTrack = document.getElementById('testimonialsTrack');
const testimonialPrev = document.getElementById('testimonialPrev');
const testimonialNext = document.getElementById('testimonialNext');
const testimonialDots = document.getElementById('testimonialDots');

if (testimonialsTrack) {
    const slides = testimonialsTrack.querySelectorAll('.testimonial-slide');
    const slideCount = slides.length;
    let currentIndex = 0;
    let autoplayInterval = null;
    const AUTOPLAY_DELAY = 3000; // 3 seconds

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = `testimonial-dot${index === 0 ? ' active' : ''}`;
        dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
        dot.addEventListener('click', () => goToSlide(index));
        testimonialDots.appendChild(dot);
    });

    function goToSlide(index) {
        currentIndex = index;
        const offset = -currentIndex * 100;
        testimonialsTrack.style.transform = `translateX(${offset}%)`;

        // Update dots
        document.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });

        // Reset autoplay
        resetAutoplay();
    }

    function nextSlide() {
        const nextIndex = (currentIndex + 1) % slideCount;
        goToSlide(nextIndex);
    }

    function prevSlide() {
        const prevIndex = (currentIndex - 1 + slideCount) % slideCount;
        goToSlide(prevIndex);
    }

    function startAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
        autoplayInterval = setInterval(nextSlide, AUTOPLAY_DELAY);
    }

    function resetAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            startAutoplay();
        }
    }

    // Event listeners
    testimonialNext.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
    });

    testimonialPrev.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
    });

    // Pause on hover
    const sliderWrapper = document.querySelector('.testimonials-slider-wrapper');
    sliderWrapper.addEventListener('mouseenter', () => {
        if (autoplayInterval) clearInterval(autoplayInterval);
    });

    sliderWrapper.addEventListener('mouseleave', startAutoplay);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!sliderWrapper.contains(document.activeElement)) return;
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
            resetAutoplay();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
            resetAutoplay();
        }
    });

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    sliderWrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        if (autoplayInterval) clearInterval(autoplayInterval);
    });

    sliderWrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            resetAutoplay();
        } else {
            startAutoplay();
        }
    });

    // Start autoplay
    startAutoplay();
}
}); // end DOMContentLoaded