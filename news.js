 document.addEventListener('DOMContentLoaded', function() {

            // ---------- NAVBAR ----------
            const navbar = document.getElementById('navbar');
            const hamburger = document.getElementById('hamburger');
            const mobileMenu = document.getElementById('mobileMenu');

            window.addEventListener('scroll', function() {
                navbar.classList.toggle('scrolled', window.pageYOffset > 30);
            });

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

            // ---------- SCROLL REVEAL ----------
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

            // ---------- CATEGORY FILTER ----------
            const filterBtns = document.querySelectorAll('.filter-btn');
            const newsCards = document.querySelectorAll('.news-card');

            filterBtns.forEach(function(btn) {
                btn.addEventListener('click', function() {
                    // Update active button
                    filterBtns.forEach(function(b) { b.classList.remove('active'); });
                    btn.classList.add('active');

                    const filter = btn.getAttribute('data-filter');

                    newsCards.forEach(function(card) {
                        if (filter === 'all' || card.getAttribute('data-category') === filter) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                });
            });

            // ---------- LOAD MORE ----------
            const loadMoreBtn = document.getElementById('loadMoreBtn');
            let visibleCount = 6;
            const allCards = document.querySelectorAll('.news-card');

            // Initially show only first 6
            allCards.forEach(function(card, index) {
                if (index >= 6) {
                    card.style.display = 'none';
                }
            });

            loadMoreBtn.addEventListener('click', function() {
                let newVisible = 0;
                const currentFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');

                allCards.forEach(function(card, index) {
                    const category = card.getAttribute('data-category');
                    const matchesFilter = currentFilter === 'all' || category === currentFilter;

                    if (matchesFilter && index >= visibleCount && index < visibleCount + 3) {
                        card.style.display = 'block';
                        newVisible++;
                    }
                });

                visibleCount += newVisible;

                // Hide button if all visible
                let totalVisible = 0;
                allCards.forEach(function(card) {
                    if (card.style.display !== 'none') totalVisible++;
                });

                if (totalVisible >= allCards.length) {
                    loadMoreBtn.style.display = 'none';
                }
            });

            // ---------- NEWSLETTER FORM ----------
            const newsletterForm = document.getElementById('newsletterForm');
            const newsletterEmail = document.getElementById('newsletterEmail');
            const newsletterFeedback = document.getElementById('newsletterFeedback');
            const submitBtn = document.getElementById('newsletterSubmit');

            if (newsletterForm) {
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
                    submitBtn.disabled = true;

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
                            newsletterFeedback.className = 'newsletter-feedback error';
                            newsletterFeedback.textContent = 'Something went wrong. Please try again.';
                        }
                    } catch (error) {
                        newsletterFeedback.className = 'newsletter-feedback error';
                        newsletterFeedback.textContent = 'Server error. Please try again later.';
                        console.error('Newsletter error:', error);
                    } finally {
                        submitBtn.disabled = false;
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