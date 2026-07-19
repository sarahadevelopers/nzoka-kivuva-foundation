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

    // ---------- 4. GALLERY DATA WITH CATEGORIES ----------
    const galleryItems = [
        // Sports & Tournaments
        {
            src: 'WhatsApp Image 2026-07-14 at 1.27.47 PM.jpeg',
            caption: 'Under-17 League Finals, Wote, Makueni',
            category: 'sports'
        },
        {
            src: 'WhatsApp Image 2026-07-14 at 1.27.56 PM.jpeg',
            caption: 'Community Football Training, Kibwezi',
            category: 'sports'
        },
        {
            src: 'WhatsApp Image 2026-07-14 at 1.29.30 PM.jpeg',
            caption: 'Makueni County Inter-Schools Gala, Wote',
            category: 'sports'
        },
        {
            src: 'WhatsApp Image 2026-07-14 at 1.29.43 PM.jpeg',
            caption: 'Coaches Training & Certification, Makindu',
            category: 'sports'
        },
        {
            src: 'WhatsApp Image 2026-07-14 at 1.29.45 PM (1).jpeg',
            caption: 'Unity Tournament – Bridging Social Divides, Makueni',
            category: 'sports'
        },
        {
            src: 'WhatsApp Image 2026-07-14 at 1.31.24 PM (2).jpeg',
            caption: 'Vocational Training & Skills Development, Kitengela',
            category: 'education'   // Actually vocational is education
        },
        {
            src: 'WhatsApp Image 2026-07-14 at 1.31.33 PM.jpeg',
            caption: 'Girls’ Football & Gender Equality Program, Kibwezi',
            category: 'sports'
        },
        {
            src: 'WhatsApp Image 2026-07-14 at 1.31.35 PM.jpeg',
            caption: 'Tournament Victory Celebration, Makindu',
            category: 'sports'
        },
        // Education & Scholarships
        {
            src: 'WhatsApp Image 2026-07-14 at 1.27.50 PM.jpeg',
            caption: 'Scholarship Award Ceremony, Kitengela',
            category: 'education'
        },
        {
            src: 'nzoka1.webp',
            caption: 'Empowering Young Lives Through Hope, Education & Opportunity',
            category: 'education'
        },
        {
            src: 'nzoka2.webp',
            caption: 'Creating Better Learning Environments for Every Child',
            category: 'education'
        },
        {
            src: 'nzoka3.webp',
            caption: 'Supporting Vulnerable Children Across Rural Communities',
            category: 'community'
        },
        {
            src: 'nzoka4.webp',
            caption: 'Community Outreach & Youth Engagement Activities',
            category: 'community'
        },
        {
            src: 'nzoka5.jpg',
            caption: 'Youth Empowerment Through Mentorship & Talent Development',
            category: 'leadership'
        },
        {
            src: 'nzoka6.jpg',
            caption: 'Every Child Deserves a Chance to Dream and Succeed',
            category: 'education'
        },
        {
            src: 'nzoka7.webp',
            caption: 'Building Brighter Futures Through Education',
            category: 'education'
        },
        {
            src: 'nzoka8.webp',
            caption: 'Community Participation for Sustainable Development',
            category: 'community'
        },
        {
            src: 'nzoka9.webp',
            caption: 'Promoting Sportsmanship, Teamwork & Leadership',
            category: 'leadership'
        },
        {
            src: 'nzoka10.webp',
            caption: 'Discovering and Nurturing Young Sporting Talent',
            category: 'sports'
        },
        {
            src: 'nzoka11.webp',
            caption: 'Supporting Grassroots Football Across Mwala and Beyond',
            category: 'sports'
        },
        {
            src: 'nzoka12.webp',
            caption: 'Nzoka Kivuva Foundation Boys Football Development Program',
            category: 'sports'
        },
        {
            src: 'nzoka13.webp',
            caption: 'Mwala Starlets FC – Empowering Girls Through Football',
            category: 'sports'
        },
        // Community & Leadership
        {
            src: 'WhatsApp Image 2026-07-14 at 1.27.57 PM.jpeg',
            caption: 'Mentorship & Life Skills Session, Makindu',
            category: 'leadership'
        },
        {
            src: 'WhatsApp Image 2026-07-14 at 1.29.47 PM (1).jpeg',
            caption: 'Health & Wellness Outreach, Kibwezi',
            category: 'community'
        },
        {
            src: 'WhatsApp Image 2026-07-14 at 1.31.32 PM (1).jpeg',
            caption: 'Youth Leadership Camp, Wote',
            category: 'leadership'
        }
    ];

    // ---------- 5. RENDER FUNCTION ----------
    function renderGallery(items) {
        const grid = document.getElementById('masonryGrid');
        grid.innerHTML = '';

        items.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'masonry-item reveal';
            div.setAttribute('data-index', index);
            div.setAttribute('data-category', item.category);
            div.innerHTML = `
                        <img src="${item.src}" alt="${item.caption}" loading="lazy" decoding="async" />
                        <div class="overlay">
                            <div class="caption"><i class="fas fa-expand"></i> ${item.caption}</div>
                        </div>
                    `;
            grid.appendChild(div);

            setTimeout(() => {
                div.classList.add('reveal-d' + ((index % 4) + 1));
            }, 50);
        });

        // Re-observe new reveal elements
        document.querySelectorAll('.masonry-item.reveal').forEach(function(el) {
            revealObserver.observe(el);
        });

        // Store current items for lightbox navigation
        window.currentDisplayedItems = items;
    }

    // ---------- 6. INITIAL RENDER ----------
    renderGallery(galleryItems);

    // ---------- 7. CATEGORY FILTER ----------
    const filterButtons = document.querySelectorAll('.filter-btn');
    let currentFilter = 'all';

    filterButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            currentFilter = filter;

            let filteredItems;
            if (filter === 'all') {
                filteredItems = galleryItems;
            } else {
                filteredItems = galleryItems.filter(item => item.category === filter);
            }

            renderGallery(filteredItems);
        });
    });

    // ---------- 8. LIGHTBOX ----------
    const lightbox = document.getElementById('lightbox');
    const lbImage = document.getElementById('lbImage');
    const lbCaption = document.getElementById('lbCaption');
    const lbClose = document.getElementById('lbClose');
    const lbPrev = document.getElementById('lbPrev');
    const lbNext = document.getElementById('lbNext');
    let currentIndex = 0;

    function getCurrentItems() {
        // Use the displayed items (from filter)
        const items = window.currentDisplayedItems || galleryItems;
        // Get the masonry items in order
        const masonryItems = document.querySelectorAll('.masonry-item');
        const srcs = [];
        const captions = [];
        masonryItems.forEach(function(item) {
            const img = item.querySelector('img');
            const captionEl = item.querySelector('.caption');
            if (img) {
                srcs.push(img.getAttribute('src'));
                captions.push(captionEl ? captionEl.textContent.trim() : '');
            }
        });
        return { srcs, captions };
    }

    function openLightbox(index) {
        const { srcs, captions } = getCurrentItems();
        if (srcs.length === 0) return;
        currentIndex = index;
        lbImage.src = srcs[index];
        lbImage.alt = captions[index] || 'Gallery image';
        lbCaption.innerHTML = `<strong>${captions[index]}</strong>`;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
        const { srcs, captions } = getCurrentItems();
        if (srcs.length === 0) return;
        const newIndex = (currentIndex + direction + srcs.length) % srcs.length;
        currentIndex = newIndex;
        lbImage.src = srcs[newIndex];
        lbImage.alt = captions[newIndex] || 'Gallery image';
        lbCaption.innerHTML = `<strong>${captions[newIndex]}</strong>`;
    }

    // Click on masonry item (event delegation)
    document.addEventListener('click', function(e) {
        const item = e.target.closest('.masonry-item');
        if (item) {
            const img = item.querySelector('img');
            if (img) {
                const allImgs = document.querySelectorAll('.masonry-item img');
                const index = Array.from(allImgs).indexOf(img);
                if (index !== -1) openLightbox(index);
            }
        }
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