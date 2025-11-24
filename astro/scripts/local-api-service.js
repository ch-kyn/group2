/**
 * Local API Fallback Service
 * 
 * Serves local backup data when the external Ghibli API is unavailable
 */

const fs = require('fs');
const path = require('path');

const BACKUP_DIR = path.join(__dirname, 'api-backup');

class LocalAPIService {
    constructor() {
        this.data = {};
        this.loadBackup();
    }

    loadBackup() {
        try {
            const endpoints = ['films', 'people', 'species', 'locations', 'vehicles'];
            
            endpoints.forEach(endpoint => {
                const filepath = path.join(BACKUP_DIR, `${endpoint}.json`);
                if (fs.existsSync(filepath)) {
                    this.data[endpoint] = JSON.parse(fs.readFileSync(filepath, 'utf8'));
                    console.log(`✓ Loaded ${endpoint}: ${this.data[endpoint].length} items`);
                }
            });
            
            console.log('✨ Local API backup loaded successfully');
        } catch (err) {
            console.error('Error loading backup:', err.message);
        }
    }

    getAll(endpoint) {
        return this.data[endpoint] || [];
    }

    getById(endpoint, id) {
        const items = this.data[endpoint] || [];
        return items.find(item => item.id === id);
    }

    search(endpoint, query) {
        const items = this.data[endpoint] || [];
        return items.filter(item => {
            const searchStr = JSON.stringify(item).toLowerCase();
            return searchStr.includes(query.toLowerCase());
        });
    }
}

module.exports = LocalAPIService;
