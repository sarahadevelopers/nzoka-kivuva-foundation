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
            // 4. COUNTER ANIMATION (Impact Numbers)
            // ============================================================
            const counters = document.querySelectorAll('.impact-item .number');
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
            // 5. QUICK DONATE BUTTONS
            // ============================================================
            const donateBtns = document.querySelectorAll('.quick-donate-btn');
            const customAmountWrap = document.getElementById('customAmountWrap');
            const customAmountInput = document.getElementById('customAmount');
            const donateImpact = document.getElementById('donateImpact');

            const impactMap = {
                500: '✨ Your donation will provide <strong>footballs for a team</strong>',
                1000: '✨ Your donation will provide <strong>school supplies for 5 students</strong>',
                2500: '✨ Your donation will provide <strong>training kits for a team</strong>',
                5000: '✨ Your donation will sponsor <strong>one student for a term</strong>',
                10000: '✨ Your donation will fund <strong>a full tournament</strong>',
            };

            donateBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    donateBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');

                    const amount = this.dataset.amount;

                    if (amount === 'custom') {
                        customAmountWrap.style.display = 'block';
                        customAmountInput.focus();
                        donateImpact.innerHTML = '✨ Enter an amount to see your impact';
                        return;
                    }

                    customAmountWrap.style.display = 'none';

                    if (impactMap[amount]) {
                        donateImpact.innerHTML = impactMap[amount];
                    } else {
                        donateImpact.innerHTML =
                            `✨ Your donation of <strong>KSh ${parseInt(amount).toLocaleString()}</strong> will make a difference`;
                    }
                });
            });

            if (customAmountInput) {
                customAmountInput.addEventListener('input', function() {
                    const val = parseInt(this.value);
                    if (val > 0) {
                        donateImpact.innerHTML =
                            `✨ Your donation of <strong>KSh ${val.toLocaleString()}</strong> will make a difference`;
                    }
                });
            }

            // ============================================================
            // 6. COPY BUTTONS
            // ============================================================
            document.querySelectorAll('.copy-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const text = this.dataset.copy;
                    navigator.clipboard.writeText(text).then(() => {
                        this.classList.add('copied');
                        setTimeout(() => {
                            this.classList.remove('copied');
                        }, 2000);
                    }).catch(() => {
                        const input = document.createElement('input');
                        input.value = text;
                        document.body.appendChild(input);
                        input.select();
                        document.execCommand('copy');
                        document.body.removeChild(input);
                        this.classList.add('copied');
                        setTimeout(() => {
                            this.classList.remove('copied');
                        }, 2000);
                    });
                });
            });

            // ============================================================
            // 7. TAB SWITCHER
            // ============================================================
            const tabBtns = document.querySelectorAll('.tab-btn');
            const tabPanels = {
                scholarship: document.getElementById('panel-scholarship'),
                club: document.getElementById('panel-club'),
                partner: document.getElementById('panel-partner'),
                volunteer: document.getElementById('panel-volunteer')
            };

            tabBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const tab = this.dataset.tab;

                    tabBtns.forEach(b => {
                        b.classList.remove('active');
                        b.setAttribute('aria-selected', 'false');
                    });
                    this.classList.add('active');
                    this.setAttribute('aria-selected', 'true');

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
            // 8. FAQ ACCORDION
            // ============================================================
            const faqItems = document.querySelectorAll('.faq-item');

            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question');

                question.addEventListener('click', function() {
                    const isActive = item.classList.contains('active');

                    faqItems.forEach(other => {
                        if (other !== item) {
                            other.classList.remove('active');
                            other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                        }
                    });

                    if (isActive) {
                        item.classList.remove('active');
                        question.setAttribute('aria-expanded', 'false');
                    } else {
                        item.classList.add('active');
                        question.setAttribute('aria-expanded', 'true');
                    }
                });

                question.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.click();
                    }
                });
            });

            // ============================================================
            // 9. FORM FEEDBACK
            // ============================================================
            const forms = document.querySelectorAll('form[id$="Form"]');
            forms.forEach(form => {
                form.addEventListener('submit', function(e) {
                    const feedback = this.querySelector('.form-feedback');
                    if (feedback) {
                        feedback.textContent = 'Submitting...';
                        feedback.className = 'form-feedback';
                        feedback.style.color = 'var(--text-secondary-muted)';
                    }
                });
            });

            // ============================================================
            // 10. NEWSLETTER FORM
            // ============================================================
            const newsletterForm = document.getElementById('newsletterForm');
            const newsletterFeedback = document.getElementById('newsletterFeedback');

            if (newsletterForm) {
                newsletterForm.addEventListener('submit', function(e) {
                    const email = document.getElementById('newsletterEmail').value.trim();
                    if (!email || !email.includes('@')) {
                        e.preventDefault();
                        newsletterFeedback.textContent = 'Please enter a valid email address.';
                        newsletterFeedback.style.color = '#b91c1c';
                        newsletterFeedback.style.fontSize = '12px';
                        return;
                    }
                    newsletterFeedback.textContent = 'Subscribing...';
                    newsletterFeedback.style.color = 'rgba(255,255,255,0.6)';
                });
            }

        });