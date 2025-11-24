# Ghibli API Backup & Fallback System

This project includes a complete backup and fallback system to ensure your website continues working even if the external Ghibli API becomes unavailable.

## 📋 Overview

The system consists of three main components:

1. **Crawler** (`crawler.js`) - Downloads all API data and images
2. **Local API Service** (`server.js` with local endpoints) - Serves backup data
3. **API Client** (`api-client.js`) - Automatically switches between external and local APIs

## 🚀 Quick Start

### Step 1: Create Your Backup

>You can skip this step since the API is only downloaded in `/api-backup` folder

Run the crawler to download all API data and images:

```bash
node crawler.js
```

This will:
- Fetch all films, people, species, locations, and vehicles
- Download all images (posters, banners) to `api-backup/images/`
- Save JSON files to `api-backup/`
- Update image URLs to point to local files

**Expected output:**
```
🎬 Starting Ghibli API Crawler...

📥 Fetching films...
✓ Found 22 films
📸 Downloading images for films...
✓ Downloaded: films_2baf70d1_42bb_4437_b551_e5fed5a87abe.jpg
...

📊 Backup Summary:
─────────────────────────────────
  films: 22 items
  people: 87 items
  species: 14 items
  locations: 51 items
  vehicles: 8 items
  images: 44 files
─────────────────────────────────

✨ Backup complete!
```

### Step 2: Test the Backup

Your server (`server.js`) now serves local backup data at `/api/*` endpoints:

- External API: `https://ghibliapi.vercel.app/films`
- Local backup: `http://localhost:8080/api/films`

### Step 3: Update Your Frontend (Optional)

For automatic fallback, replace your fetch calls with the unified API client:

**Before:**
```javascript
const response = await fetch(`${API_BASE}/films`);
const data = await response.json();
```

**After:**
```javascript
// Include api-client.js in your HTML
const data = await apiFetch('/films');
```

## 📁 Directory Structure

```
gib/
├── api-backup/              # Created by crawler
│   ├── films.json          # All films data
│   ├── people.json         # All characters data
│   ├── species.json        # All species data
│   ├── locations.json      # All locations data
│   ├── vehicles.json       # All vehicles data
│   ├── complete-backup.json # Complete combined data
│   └── images/             # Downloaded images
│       ├── films_xxx.jpg
│       ├── banner_xxx.jpg
│       └── ...
├── crawler.js              # Backup creation script
├── api-client.js           # Smart API client with fallback
├── local-api-service.js    # Local API service class
└── server.js               # Enhanced server with /api/* endpoints
```

## 🔧 How It Works

### Automatic Fallback

The `api-client.js` implements smart fallback logic:

1. **First request**: Try external API with 5-second timeout
2. **If external fails**: Automatically switch to local backup
3. **Subsequent requests**: Use local backup (cached decision)
4. **Manual reset**: Call `resetAPIMode()` to try external again

### Example Usage

```javascript
// Include in your HTML
<script src="api-client.js"></script>

// Use in your code
async function loadFilms() {
    try {
        // Automatically tries external, falls back to local if needed
        const films = await apiFetch('/films');
        console.log(`Loaded ${films.length} films`);
        return films;
    } catch (error) {
        console.error('Both APIs failed:', error);
        // Show user-friendly error message
    }
}

// Check which API is being used
console.log(`Current API mode: ${getAPIMode()}`); // 'external' or 'local'

// Force local mode (useful for testing)
forceLocalAPI();

// Reset to try external again
resetAPIMode();
```

## 🎨 Image Handling

The crawler downloads images and updates URLs in the JSON files:

**Original API response:**
```json
{
  "id": "2baf70d1-42bb-4437-b551-e5fed5a87abe",
  "title": "My Neighbor Totoro",
  "image": "https://image.tmdb.org/t/p/w600_and_h900_bestv2/rtGDOeG9LzoerkDGZF9dnVeLppL.jpg"
}
```

**After backup:**
```json
{
  "id": "2baf70d1-42bb-4437-b551-e5fed5a87abe",
  "title": "My Neighbor Totoro",
  "image": "./images/films_2baf70d1_42bb_4437_b551_e5fed5a87abe.jpg"
}
```

Your server serves these images from `api-backup/images/`.

## 🔄 Keeping Backup Updated

Run the crawler periodically to keep your backup fresh:

```bash
# Run monthly or when you know API data has changed
node crawler.js
```

**Note**: The Ghibli API data rarely changes, so monthly updates are sufficient.

## 🧪 Testing the Fallback

### Test Local API Manually

1. Start your server:
   ```bash
   npm start
   ```

2. Visit in browser:
   - `http://localhost:8080/api/films` - Should return JSON
   - `http://localhost:8080/api/films/2baf70d1-42bb-4437-b551-e5fed5a87abe` - Single film
   - `http://localhost:8080/api-backup/images/films_xxx.jpg` - Image

### Test Automatic Fallback

Temporarily break external API access to test fallback:

```javascript
// In your browser console
forceLocalAPI(); // Force local mode
location.reload(); // Reload page - will use local API
```

Or simulate network failure:
1. Open DevTools → Network tab
2. Set throttling to "Offline"
3. Reload page - should automatically use local backup

## ⚠️ Important Notes

### Image Copyright

The Ghibli API images are sourced from TMDB and other services. This backup is for:
- **Personal use** or **development/testing**
- **Ensuring your site works offline** during development
- **Emergency fallback** if external API is temporarily down

**For production deployment**, consider:
- Hosting images with proper licensing
- Using CDN services
- Crediting image sources appropriately

### Deployment Considerations

When deploying to production:

1. **Include backup in your deployment** but as fallback only
2. **Keep using external API as primary** for freshest data
3. **Add .gitignore for large backups**:
   ```gitignore
   # Add to .gitignore
   api-backup/images/*.jpg
   api-backup/images/*.png
   ```
4. **Use environment variable** to control API mode:
   ```javascript
   const USE_LOCAL_API = process.env.USE_LOCAL_API === 'true';
   ```

## 🛠️ Troubleshooting

### Crawler fails to download images

**Issue**: HTTPS timeout or network errors

**Solution**: Increase timeout or retry logic in `crawler.js`:
```javascript
const TIMEOUT = 10000; // 10 seconds
```

### Local API returns 404

**Check**:
1. Does `api-backup/` directory exist?
2. Does `api-backup/films.json` exist?
3. Is server running (`npm start`)?
4. Are you using correct endpoint (`/api/films`, not `/films`)?

### Images not displaying

**Check**:
1. Are images in `api-backup/images/`?
2. Is server serving static files from that directory?
3. Check browser console for 404 errors
4. Verify image paths in JSON match actual filenames

## 📊 Backup Statistics

Typical backup size (as of 2025):
- **JSON data**: ~2-3 MB total
- **Images**: ~40-50 MB total (44 images)
- **Total backup**: ~45-55 MB

## 🔐 Security

- Backup is stored locally, not exposed publicly
- Server only serves files in project directory
- No authentication needed for local development
- Add authentication for production if serving backup publicly

## 📝 License

This backup system is part of your Ghibli Films Explorer project.

The Ghibli API data is provided by [ghibliapi.vercel.app](https://ghibliapi.vercel.app/) and is for educational/non-commercial use.
