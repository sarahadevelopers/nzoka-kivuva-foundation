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
                active: document.getElementById('panel-active'),
                past: document.getElementById('panel-past')
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
                });
            });

        });