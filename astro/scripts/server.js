const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const BACKUP_DIR = path.join(__dirname, 'api-backup');
const USE_LOCAL_API = process.env.USE_LOCAL_API === 'true';

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
    // Parse URL to remove query parameters
    const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
    let filePath = '.' + parsedUrl.pathname;
    
    // Inject local API config when in local mode
    if (USE_LOCAL_API && filePath === './api-config.js') {
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.end(`

        `);
        return;
    }
    
    // Handle local API endpoints (for offline fallback)
    if (filePath.startsWith('./api/')) {
        handleLocalAPI(parsedUrl.pathname, res);
        return;
    }
    
    if (filePath === './') {
        filePath = './index.html';
    }

    // Get file extension
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // Read and serve the file
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // File not found
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File Not Found</h1>', 'utf-8');
            } else {
                // Server error
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            // Success
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Handle local API requests (fallback when external API is down)
function handleLocalAPI(pathname, res) {
    // Remove /api/ prefix
    const parts = pathname.replace('/api/', '').split('/');
    const endpoint = parts[0]; // films, people, species, etc.
    const id = parts[1]; // optional ID
    
    const filepath = path.join(BACKUP_DIR, `${endpoint}.json`);
    
    if (!fs.existsSync(filepath)) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Backup data not found' }));
        return;
    }
    
    try {
        const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        
        if (id) {
            // Return single item by ID
            const item = data.find(d => d.id === id);
            if (item) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(item));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Item not found' }));
            }
        } else {
            // Return all items
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        }
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error reading backup data' }));
    }
}

server.listen(PORT, () => {
    console.log(`🎬 Studio Ghibli Server is running!`);
    console.log(`🚀 Open your browser at: http://localhost:${PORT}`);
    
    if (USE_LOCAL_API) {
        console.log(`📦 LOCAL MODE: Using backup API from api-backup/`);
        console.log(`   - API endpoint: /api/*`);
        console.log(`   - Images: /api-backup/images/*`);
    } else {
        console.log(`🌐 PRODUCTION MODE: Using external Ghibli API`);
    }
    
    // Check if backup exists
    if (fs.existsSync(BACKUP_DIR)) {
        console.log(`💾 Local backup available`);
    } else {
        console.log(`⚠️  No local backup found. Run 'npm run backup' to create one.`);
    }
    
    console.log(`✨ May your heart be filled with magic!`);
});
