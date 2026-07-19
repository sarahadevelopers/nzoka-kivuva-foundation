const fs = require('fs');
const path = require('path');

// ============================================================
// CONFIGURATION
// ============================================================
const HTML_DIR = './';
const NEWS_DIR = './news';
const OUTPUT_LOG = './alt-text-changes.log';

// Manual mappings – you can keep these, but they will be prefixed with foundation name
const ALT_MAPPINGS = {
    // Your existing mappings here...
};

// ============================================================
// ENSURE FOUNDATION NAME IS IN EVERY ALT TEXT
// ============================================================
const FOUNDATION_NAME = 'Nzoka Kivuva Foundation';

// Helper to add foundation name at the beginning
function ensureFoundationName(text) {
    // Already starts with foundation name? (case-insensitive)
    if (text.toLowerCase().startsWith('nzoka kivuva foundation')) {
        return text;
    }
    // Remove leading "Nzoka Kivuva Foundation" variations if any
    const cleaned = text.replace(/^Nzoka Kivuva Foundation\s*[:,-]?\s*/i, '');
    return `${FOUNDATION_NAME} ${cleaned}`;
}

// Generate alt text from filename and context
function generateAltText(filename) {
    const baseName = path.basename(filename);
    
    // Check manual mapping first
    if (ALT_MAPPINGS[baseName]) {
        return ensureFoundationName(ALT_MAPPINGS[baseName]);
    }
    
    // Otherwise generate from filename
    const nameWithoutExt = path.basename(filename, path.extname(filename));
    let words = nameWithoutExt
        .replace(/[-_]/g, ' ')
        .replace(/\d+/g, '')
        .replace(/WhatsApp Image \d{4}-\d{2}-\d{2} at \d{1,2}\.\d{2}\.\d{2} [AP]M/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    
    if (!words || words.length < 3) {
        words = 'youth empowerment program';
    }
    
    return `${FOUNDATION_NAME} ${words} in Machakos County, Kenya`;
}

// Process a single HTML file
function processHtmlFile(filePath, fileName) {
    const fullPath = path.join(filePath, fileName);
    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;
    let changes = [];

    const imgRegex = /<img([^>]*)>/g;
    const imgMatches = [...content.matchAll(imgRegex)];
    
    imgMatches.forEach((match) => {
        const fullTag = match[0];
        const attributes = match[1];
        
        const srcMatch = attributes.match(/src=["']([^"']*)["']/);
        const altMatch = attributes.match(/alt=["']([^"']*)["']/);
        
        if (!srcMatch) return;
        
        const src = srcMatch[1];
        const currentAlt = altMatch ? altMatch[1] : '';
        const filename = path.basename(src);
        
        // Generate new alt with foundation name always included
        const newAlt = generateAltText(filename);
        
        // Skip if same (already has foundation and same rest)
        if (newAlt === currentAlt) return;
        
        let newTag;
        if (altMatch) {
            newTag = fullTag.replace(/alt=["'][^"']*["']/, `alt="${newAlt}"`);
        } else {
            newTag = fullTag.replace(/>/, ` alt="${newAlt}">`);
        }
        
        content = content.replace(fullTag, newTag);
        modified = true;
        changes.push({
            file: fileName,
            oldAlt: currentAlt || '(none)',
            newAlt: newAlt,
            src: filename
        });
    });
    
    if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ Updated ${fileName}: ${changes.length} image(s)`);
        return changes;
    }
    return [];
}

// Main execution
function main() {
    console.log('🔍 Scanning HTML files for image alt text optimization...\n');
    
    const files = getHtmlFiles();
    let totalChanges = 0;
    let allChanges = [];
    
    files.forEach(({ path: filePath, file: fileName }) => {
        const changes = processHtmlFile(filePath, fileName);
        allChanges = allChanges.concat(changes);
        totalChanges += changes.length;
    });
    
    console.log(`\n📊 Summary: ${totalChanges} image alt text(s) updated across ${files.length} files.`);
    
    if (allChanges.length > 0) {
        const logContent = allChanges.map(c => 
            `[${c.file}] ${c.src}: "${c.oldAlt}" → "${c.newAlt}"`
        ).join('\n');
        fs.writeFileSync(OUTPUT_LOG, logContent, 'utf8');
        console.log(`📝 Changes logged to ${OUTPUT_LOG}`);
    }
}

// Helper function to get all HTML files
function getHtmlFiles() {
    const files = [];
    const rootFiles = fs.readdirSync(HTML_DIR).filter(f => f.endsWith('.html') && f !== 'news.html');
    rootFiles.forEach(f => files.push({ path: HTML_DIR, file: f }));
    
    if (fs.existsSync(NEWS_DIR)) {
        const newsFiles = fs.readdirSync(NEWS_DIR).filter(f => f.endsWith('.html'));
        newsFiles.forEach(f => files.push({ path: NEWS_DIR, file: f }));
    }
    return files;
}

main();