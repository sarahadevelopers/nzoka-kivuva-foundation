// generate-news.js
const fs = require('fs');
const path = require('path');

// Configuration
const NEWS_DIR = './news';
const OUTPUT_FILE = './news.html';
const SITE_URL = 'https://nzokakivuvafoundation.org';

// Blog post data structure
const blogs = [];

// Read all HTML files from the news directory
function getBlogFiles() {
    try {
        const files = fs.readdirSync(NEWS_DIR);
        return files
            .filter(file => file.endsWith('.html'))
            .filter(file => file !== 'index.html') // Exclude index if exists
            .map(file => ({
                filename: file,
                slug: file.replace('.html', ''),
                path: path.join(NEWS_DIR, file)
            }));
    } catch (error) {
        console.error('Error reading news directory:', error);
        return [];
    }
}

// Extract blog metadata from HTML file
function extractBlogMetadata(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Extract title from <title> tag
        const titleMatch = content.match(/<title>(.*?)<\/title>/);
        const title = titleMatch ? titleMatch[1].replace(' | Nzoka Kivuva Foundation', '') : 'Untitled';
        
        // Extract description from meta tag
        const descMatch = content.match(/<meta name="description" content="(.*?)"/);
        const description = descMatch ? descMatch[1] : '';
        
        // Extract date from article-meta
        const dateMatch = content.match(/<span><i class="fas fa-calendar-alt"><\/i>\s*(.*?)<\/span>/);
        const date = dateMatch ? dateMatch[1] : '';
        
        // Extract category from article-badge
        const categoryMatch = content.match(/<span class="article-badge (.*?)">(.*?)<\/span>/);
        const category = categoryMatch ? categoryMatch[2] : 'General';
        
        // Extract image from hero-image background or img tag
        const imageMatch = content.match(/url\('(.*?)'\)/);
        const image = imageMatch ? imageMatch[1] : 'https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=800&h=400&fit=crop';
        
        // Extract excerpt from hero-excerpt
        const excerptMatch = content.match(/<p class="hero-excerpt">(.*?)<\/p>/);
        const excerpt = excerptMatch ? excerptMatch[1].replace(/<[^>]*>/g, '').trim() : '';
        
        return {
            title,
            description,
            date,
            category,
            image,
            excerpt,
            slug: path.basename(filePath, '.html')
        };
    } catch (error) {
        console.error(`Error parsing ${filePath}:`, error);
        return null;
    }
}

// Generate the blog card HTML
function generateBlogCard(blog) {
    const dateObj = new Date(blog.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
    
    // Map category to badge class
    const categoryClass = blog.category.toLowerCase().replace(/[^a-z]/g, '');
    
    return `
                <!-- Article: ${blog.title} -->
                <a href="news/${blog.slug}.html" class="news-card reveal" data-category="${categoryClass}">
                    <div class="card-img">
                        <img src="${blog.image}" alt="${blog.title}" loading="lazy" />
                        <span class="card-badge ${categoryClass}">${blog.category}</span>
                    </div>
                    <div class="card-body">
                        <time datetime="${blog.date}">${formattedDate}</time>
                        <h3>${blog.title}</h3>
                        <p>${blog.excerpt}</p>
                        <span class="read-more">Read more <i class="fas fa-arrow-right"></i></span>
                    </div>
                </a>`;
}

// Generate the full news.html
function generateNewsHTML(blogCards) {
    // Sort blogs by date (newest first)
    const sortedBlogs = blogCards.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
    });
    
    const cardsHTML = sortedBlogs.map(blog => generateBlogCard(blog)).join('\n');
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>News & Updates | Nzoka Kivuva Foundation</title>
    <meta name="description" content="Latest news, stories, and updates from the Nzoka Kivuva Foundation. Youth empowerment, sports, education, and community development in Makueni County." />
    <link rel="canonical" href="${SITE_URL}/news.html" />

    <!-- Open Graph -->
    <meta property="og:title" content="News & Updates | Nzoka Kivuva Foundation" />
    <meta property="og:description" content="Latest news, stories, and updates from the Nzoka Kivuva Foundation. Youth empowerment, sports, education, and community development in Makueni County." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${SITE_URL}/news.html" />
    <meta property="og:image" content="${SITE_URL}/nzoka-kivuva-favicon.webp" />

    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="News & Updates | Nzoka Kivuva Foundation" />
    <meta name="twitter:description" content="Latest news, stories, and updates from the Nzoka Kivuva Foundation." />

    <!-- Favicon -->
    <link rel="icon" type="image/webp" href="nzoka-kivuva-favicon.webp" />

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet" />
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />

    <!-- Global Styles -->
    <link rel="stylesheet" href="global.css" />
    <link rel="stylesheet" href="news.css" />
</head>

<body>

    <!-- ============================================================
    NAVBAR
    ============================================================ -->
    <header class="navbar" id="navbar" role="navigation" aria-label="Main navigation">
        <div class="logo">
            <img src="nzoka-kivuva-favicon.webp" alt="Nzoka Kivuva Foundation Logo" />
        </div>
        <ul class="nav-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="about.html">About Us</a></li>
            <li><a href="programs.html">Programs</a></li>
            <li><a href="gallery.html">Gallery</a></li>
            <li><a href="news.html" class="active">News</a></li>
            <li><a href="contact.html">Contact</a></li>
            <li><a href="get-involved.html" class="nav-cta">Get Involved</a></li>
        </ul>
        <button class="hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </header>

    <!-- Mobile Menu -->
    <div class="mobile-menu" id="mobileMenu" role="dialog" aria-modal="true">
        <a href="index.html" class="mobile-link">Home</a>
        <a href="about.html" class="mobile-link">About Us</a>
        <a href="programs.html" class="mobile-link">Programs</a>
        <a href="gallery.html" class="mobile-link">Gallery</a>
        <a href="news.html" class="mobile-link">News</a>
        <a href="contact.html" class="mobile-link">Contact</a>
        <a href="get-involved.html" class="mobile-cta">Get Involved</a>
    </div>

    <!-- ============================================================
    NEWS HERO
    ============================================================ -->
    <section class="news-hero-bg" id="news">
        <div class="container">
            <div class="news-hero-content reveal">
                <span class="tag">Stories &amp; Updates</span>
                <h1>What's happening in Makueni &amp; Ukambani</h1>
                <p>
                    Real stories from the field — tournaments, scholarships, community outreach, 
                    and the young lives we're transforming across the region.
                </p>
                <div class="news-meta">
                    <span><i class="fas fa-newspaper"></i> ${sortedBlogs.length} articles</span>
                    <span><i class="fas fa-tag"></i> 5 categories</span>
                    <span><i class="fas fa-calendar-alt"></i> Latest: ${sortedBlogs.length > 0 ? sortedBlogs[0].date : 'N/A'}</span>
                </div>
            </div>
        </div>
    </section>

    <!-- ============================================================
    CATEGORY FILTER
    ============================================================ -->
    <section class="news-filter">
        <div class="container">
            <div class="filter-scroll">
                <button class="filter-btn active" data-filter="all">All Stories</button>
                <button class="filter-btn" data-filter="sports">Sports</button>
                <button class="filter-btn" data-filter="education">Education</button>
                <button class="filter-btn" data-filter="community">Community</button>
                <button class="filter-btn" data-filter="development">Development</button>
            </div>
        </div>
    </section>

    <!-- ============================================================
    FEATURED ARTICLE
    ============================================================ -->
    <section class="featured-article">
        <div class="container">
            <div class="featured-grid">
                <div class="featured-image reveal">
                    <img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop" alt="Featured story" />
                </div>
                <div class="featured-content reveal reveal-d2">
                    <span class="badge sports">Featured Story</span>
                    <time datetime="2026-06-15">June 15, 2026</time>
                    <h2>Wote Under-17 League: A New Chapter for Makueni Youth</h2>
                    <p>
                        The Nzoka Kivuva Foundation officially launched the Wote Under-17 Football League, 
                        bringing together 12 teams from across Makueni County. The tournament aims to foster 
                        unity, discipline, and talent development while keeping young people engaged in 
                        productive activities.
                    </p>
                    <a href="news/wote-under-17-league.html" class="read-more">
                        Read full story <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- ============================================================
    NEWS GRID
    ============================================================ -->
    <section class="news-grid-section" id="articles">
        <div class="container">
            <div class="section-header reveal">
                <h2>Latest Stories</h2>
                <button class="view-all" id="openNewsletter">
                    Subscribe to newsletter <i class="fas fa-arrow-right"></i>
                </button>
            </div>

            <div class="news-grid" id="newsGrid">
${cardsHTML}
            </div>

            <!-- Load More -->
            <div class="load-more-wrap reveal">
                <button class="btn-outline-dark" id="loadMoreBtn">
                    Load More Stories <i class="fas fa-arrow-down" style="margin-left:8px;"></i>
                </button>
            </div>
        </div>
    </section>

    <!-- ============================================================
    FOOTER
    ============================================================ -->
    <footer class="footer" role="contentinfo">
        <!-- Footer content here (same as your existing footer) -->
    </footer>

    <!-- Floating WhatsApp Button -->
    <div class="whatsapp-float-wrapper">
        <a href="https://wa.me/254710599653?text=Hello%20Nzoka%20Kivuva%20Foundation%2C%20I%27d%20like%20to%20learn%20more%20about%20your%20programs." 
           class="whatsapp-float" 
           target="_blank" 
           rel="noopener noreferrer"
           aria-label="Chat with us on WhatsApp">
            <i class="fab fa-whatsapp"></i>
            <span class="whatsapp-label">Chat with us</span>
        </a>
    </div>

    <!-- JavaScript -->
    <script src="news.js"></script>

</body>
</html>`;
}

// Main execution
function main() {
    console.log('📰 Generating news.html from blog posts...');
    
    const blogFiles = getBlogFiles();
    console.log(`📁 Found ${blogFiles.length} blog files.`);
    
    const blogData = [];
    for (const file of blogFiles) {
        const metadata = extractBlogMetadata(file.path);
        if (metadata) {
            blogData.push(metadata);
            console.log(`✅ Extracted: ${metadata.title} (${metadata.date})`);
        }
    }
    
    // Sort by date (newest first)
    blogData.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const htmlContent = generateNewsHTML(blogData);
    
    try {
        fs.writeFileSync(OUTPUT_FILE, htmlContent, 'utf8');
        console.log(`✅ Successfully generated ${OUTPUT_FILE}`);
        console.log(`📊 Total blogs: ${blogData.length}`);
    } catch (error) {
        console.error('❌ Error writing file:', error);
    }
}

// Run the script
main();