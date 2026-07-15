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

            // ---------- 4. GALLERY DATA ----------
            const galleryItems = [{
                src: 'WhatsApp Image 2026-07-14 at 1.27.47 PM.jpeg',
                caption: 'Under-17 League Finals, Wote, Makueni'
            }, {
                src: 'WhatsApp Image 2026-07-14 at 1.27.50 PM.jpeg',
                caption: 'Scholarship Award Ceremony, Kitengela'
            }, {
                src: 'WhatsApp Image 2026-07-14 at 1.27.56 PM.jpeg',
                caption: 'Community Football Training, Kibwezi'
            }, {
                src: 'WhatsApp Image 2026-07-14 at 1.27.57 PM.jpeg',
                caption: 'Mentorship & Life Skills Session, Makindu'
            }, {
                src: 'WhatsApp Image 2026-07-14 at 1.29.30 PM.jpeg',
                caption: 'Makueni County Inter-Schools Gala, Wote'
            }, {
                src: 'WhatsApp Image 2026-07-14 at 1.29.43 PM.jpeg',
                caption: 'Health & Wellness Outreach, Kibwezi'
            }, {
                src: 'WhatsApp Image 2026-07-14 at 1.29.45 PM (1).jpeg',
                caption: 'Coaches Training & Certification, Makindu'
            }, {
                src: 'WhatsApp Image 2026-07-14 at 1.29.47 PM (1).jpeg',
                caption: 'Unity Tournament – Bridging Social Divides, Makueni'
            }, {
                src: 'WhatsApp Image 2026-07-14 at 1.31.24 PM (2).jpeg',
                caption: 'Vocational Training & Skills Development, Kitengela'
            }, {
                src: 'WhatsApp Image 2026-07-14 at 1.31.32 PM (1).jpeg',
                caption: 'Youth Leadership Camp, Wote'
            }, {
                src: 'WhatsApp Image 2026-07-14 at 1.31.33 PM.jpeg',
                caption: 'Girls’ Football & Gender Equality Program, Kibwezi'
            }, {
                src: 'WhatsApp Image 2026-07-14 at 1.31.35 PM.jpeg',
                caption: 'Tournament Victory Celebration, Makindu'
            }];

            // ---------- 5. RENDER MASONRY ----------
            const grid = document.getElementById('masonryGrid');
            grid.innerHTML = '';

            galleryItems.forEach((item, index) => {
                const div = document.createElement('div');
                div.className = 'masonry-item reveal';
                div.setAttribute('data-index', index);
                div.innerHTML = `
                            <img src="${item.src}" alt="${item.caption}" loading="lazy" />
                            <div class="overlay">
                                <div class="caption"><i class="fas fa-expand"></i> ${item.caption}</div>
                            </div>
                        `;
                grid.appendChild(div);

                // Trigger reveal after a small delay for staggered effect
                setTimeout(() => {
                    div.classList.add('reveal-d' + ((index % 4) + 1));
                }, 50);
            });

            // Re-run reveal observer on new items
            const newReveals = grid.querySelectorAll('.reveal');
            newReveals.forEach(el => revealObserver.observe(el));

            // ---------- 6. LIGHTBOX ----------
            const lightbox = document.getElementById('lightbox');
            const lbImage = document.getElementById('lbImage');
            const lbCaption = document.getElementById('lbCaption');
            const lbClose = document.getElementById('lbClose');
            const lbPrev = document.getElementById('lbPrev');
            const lbNext = document.getElementById('lbNext');
            let currentIndex = 0;

            function openLightbox(index) {
                currentIndex = index;
                const item = galleryItems[index];
                lbImage.src = item.src;
                lbImage.alt = item.caption;
                lbCaption.innerHTML = `<strong>${item.caption}</strong>`;
                lightbox.classList.add('open');
                document.body.style.overflow = 'hidden';
            }

            function closeLightbox() {
                lightbox.classList.remove('open');
                document.body.style.overflow = '';
            }

            function navigateLightbox(direction) {
                const newIndex = (currentIndex + direction + galleryItems.length) % galleryItems.length;
                openLightbox(newIndex);
            }

            // Click on masonry item
            document.querySelectorAll('.masonry-item').forEach((item, idx) => {
                item.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'), 10);
                    if (!isNaN(index)) openLightbox(index);
                });
            });

            // Close button
            lbClose.addEventListener('click', closeLightbox);

            // Navigation buttons
            lbPrev.addEventListener('click', function(e) {
                e.stopPropagation();
                navigateLightbox(-1);
            });

            lbNext.addEventListener('click', function(e) {
                e.stopPropagation();
                navigateLightbox(1);
            });

            // Keyboard navigation
            document.addEventListener('keydown', function(e) {
                if (!lightbox.classList.contains('open')) return;
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') navigateLightbox(-1);
                if (e.key === 'ArrowRight') navigateLightbox(1);
            });

            // Click outside content to close
            lightbox.addEventListener('click', function(e) {
                if (e.target === this) closeLightbox();
            });

        });