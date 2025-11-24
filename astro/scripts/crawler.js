import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// Legg til disse to linjene
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const API_BASE = 'https://ghibliapi.vercel.app';

const BACKUP_DIR = path.join(__dirname, '/..', 'api-backup');
const IMAGES_DIR = path.join(BACKUP_DIR, '/..', 'public', 'api-backup', 'images');

// Ensure directories exist
if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

// Download image and convert directly to webp
function downloadToWebp(url, outputPath) {
    return new Promise((resolve, reject) => {
        if (!url) {
            resolve(null);
            return;
        }

        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
                return;
            }

            const transformer = sharp()
                .webp({ quality: 80 });

            const out = fs.createWriteStream(outputPath);

            response.pipe(transformer).pipe(out);

            out.on('finish', () => {
                console.log(`✓ Downloaded + converted: ${path.basename(outputPath)}`);
                resolve(outputPath);
            });

            out.on('error', reject);
        }).on('error', reject);
    });
}


// Fetch JSON from API
async function fetchJSON(endpoint) {
    return new Promise((resolve, reject) => {
        https.get(`${API_BASE}${endpoint}`, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (err) {
                    reject(err);
                }
            });
        }).on('error', reject);
    });
}

// Sanitize filename
function sanitizeFilename(str) {
    return str.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

// Download and update image URLs in data
async function processImages(items, type) {
    const processed = [];
    
    for (const item of items) {
        const processedItem = { ...item };
        
        // Convert all API URLs to local URLs
        for (const key in processedItem) {
            if (typeof processedItem[key] === 'string' && processedItem[key].startsWith('https://ghibliapi.vercel.app/')) {
                // Convert external API URL to local API URL
                processedItem[key] = processedItem[key].replace('https://ghibliapi.vercel.app', '/api');
            } else if (Array.isArray(processedItem[key])) {
                // Convert arrays of URLs
                processedItem[key] = processedItem[key].map(url => {
                    if (typeof url === 'string' && url.startsWith('https://ghibliapi.vercel.app/')) {
                        return url.replace('https://ghibliapi.vercel.app', '/api');
                    }
                    return url;
                });
            }
        }
        
        // Download main image
        if (item.image) {
            const baseName = `${type}_${sanitizeFilename(item.id || item.name || item.title)}`;
            const webpPath = path.join(IMAGES_DIR, baseName + '.webp');

            try {
                await downloadToWebp(fixTMDB(item.image), webpPath);
                processedItem.image = `api-backup/images/${path.basename(webpPath)}`;
            } catch (err) {
                console.error(`✗ Failed to download image for ${item.name || item.title}:`, err.message);
            }
        }
        
        // Download movie banner (for films)
        if (item.movie_banner) {
            const baseName = `banner_${sanitizeFilename(item.id || item.name || item.title)}`;
            const webpPath = path.join(IMAGES_DIR, baseName + '.webp');
            
            try {
                await downloadToWebp(fixTMDB(item.movie_banner), webpPath);
                processedItem.movie_banner = `api-backup/images/${path.basename(webpPath)}`;
            } catch (err) {
                console.error(`✗ Failed to download banner for ${item.title}:`, err.message);
            }
        }
        
        processed.push(processedItem);
    }
    
    return processed;
}

// replace 'www.themoviedb.org' with 'image.tmdb.org' to get the direct image file, which fixes the 301 redirect issue for the latest movie banner (Earwig and the Witch)
const fixTMDB = (url) => { if (!url) return url; return url.replace("https://www.themoviedb.org/t/p", "https://image.tmdb.org/t/p"); }

// Main crawler function
async function crawlAPI() {
    console.log('🎬 Starting Ghibli API Crawler...\n');
    
    const endpoints = ['films', 'people', 'species', 'locations', 'vehicles'];
    const allData = {};
    
    for (const endpoint of endpoints) {
        try {
            console.log(`\n📥 Fetching ${endpoint}...`);
            const data = await fetchJSON(`/${endpoint}`);
            console.log(`✓ Found ${data.length} ${endpoint}`);
            
            console.log(`📸 Downloading images for ${endpoint}...`);
            const processedData = await processImages(data, endpoint);
            
            allData[endpoint] = processedData;
            
            // Save individual endpoint JSON
            const filepath = path.join(BACKUP_DIR, `${endpoint}.json`);
            fs.writeFileSync(filepath, JSON.stringify(processedData, null, 2));
            console.log(`✓ Saved: ${endpoint}.json`);
            
        } catch (err) {
            console.error(`✗ Error fetching ${endpoint}:`, err.message);
        }
    }
    
    // Save complete backup
    const completeBackupPath = path.join(BACKUP_DIR, 'complete-backup.json');
    fs.writeFileSync(completeBackupPath, JSON.stringify(allData, null, 2));
    console.log(`\n✓ Complete backup saved: complete-backup.json`);
    
    // Generate summary
    console.log('\n📊 Backup Summary:');
    console.log('─────────────────────────────');
    Object.keys(allData).forEach(key => {
        console.log(`  ${key}: ${allData[key].length} items`);
    });
    
    const imageCount = fs.readdirSync(IMAGES_DIR).length;
    console.log(`  images: ${imageCount} files`);
    console.log('─────────────────────────────');
    console.log(`\n✨ Backup complete!\nAll JSON files saved to: ${BACKUP_DIR}\nAll images saved to: ${IMAGES_DIR}`);
}

// Run the crawler
crawlAPI().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
