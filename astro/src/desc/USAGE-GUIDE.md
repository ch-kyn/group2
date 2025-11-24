# 🚀 Quick Start Guide - Development & Production

## 📦 Two Modes, Zero Code Changes

Your website now works in **two modes** without editing any code:

### 🌐 Production Mode (Default)
Uses external Ghibli API - perfect for deployment

```bash
npm start
```

**Output:**
```
🎬 Studio Ghibli Server is running!
🚀 Open your browser at: http://localhost:8080
🌐 PRODUCTION MODE: Using external Ghibli API
💾 Local backup available
✨ May your heart be filled with magic!
```

**What it does:**
- ✅ Uses `https://ghibliapi.vercel.app`
- ✅ Images loaded from TMDB/external sources
- ✅ Works when uploaded to `public_html`
- ✅ No server needed in production

---

### 📦 Local Mode (Development)
Uses local backup - perfect for offline development

```bash
npm run local
```

**Output:**
```
🎬 Studio Ghibli Server is running!
🚀 Open your browser at: http://localhost:8080
📦 LOCAL MODE: Using backup API from api-backup/
   - API endpoint: /api/*
   - Images: /api-backup/images/*
💾 Local backup available
✨ May your heart be filled with magic!
```

**What it does:**
- ✅ Uses `/api/*` (local backup)
- ✅ Images served from `api-backup/images/`
- ✅ Works offline
- ✅ Faster (no external requests)

---

## 🎯 Usage Examples

### Normal Development (with internet)
```bash
npm start
# Uses external API - like production
```

### Offline Development / Testing Backup
```bash
npm run local
# Uses local backup - no internet needed
```

### Create/Update Backup
```bash
npm run backup
# Downloads latest data and images
```

### Deploy to Production
Just upload files to `public_html`:
```bash
# Upload these files:
- index.html
- film.html
- species.html
- styles.css
- script.js
- film.js
- species.js
- api-config.js  (important!)

# Optional (for fallback):
- api-backup/ folder
```

---

## 📂 How It Works

### Production Mode (Default)
```
Browser → api-config.js (mode: 'external')
       → script.js reads config
       → API_BASE = 'https://ghibliapi.vercel.app'
       → Fetches from external API ✓
```

### Local Mode (`npm run local`)
```
Browser → api-config.js (mode: 'local', injected by server)
       → script.js reads config
       → API_BASE = '/api'
       → Server serves from api-backup/*.json ✓
       → Images from api-backup/images/ ✓
```

---

## ✅ What Changed

### Before (Bad Approach)
- Had to edit 3 files to switch modes ❌
- Easy to forget to switch back ❌
- Can't test both modes easily ❌

### Now (Good Approach)
- **Zero code changes** - just use different npm command ✓
- `npm start` = production mode ✓
- `npm run local` = local mode ✓
- Safe to deploy - always uses external by default ✓

---

## 🧪 Testing Both Modes

### Test Production Mode
```bash
npm start
# Open: http://localhost:8080
# Should load data from ghibliapi.vercel.app
```

Check console:
```javascript
// Should NOT see "Running in LOCAL mode"
// Data loads from external API
```

### Test Local Mode
```bash
npm run local
# Open: http://localhost:8080
# Should load data from /api/*
```

Check console:
```javascript
// Should see: "🔧 Running in LOCAL mode - using backup API"
// Data loads from local backup
```

---

## 📋 Command Reference

| Command | Purpose | API Source |
|---------|---------|------------|
| `npm start` | Normal development | External API |
| `npm run local` | Offline development | Local backup |
| `npm run backup` | Create/update backup | Downloads from external |
| `npm run backup:check` | Check if backup exists | - |
| `npm run dev` | Same as `npm start` | External API |

---

## 🌍 Deployment Scenarios

### Scenario 1: Deploy to Public HTML (Most Common)
```bash
# Just upload files via FTP/SFTP
# No server.js needed
# Works with external API automatically
```

**Upload:**
- All `.html` files
- All `.js` files
- All `.css` files
- `api-config.js` ← Important!

### Scenario 2: Deploy with Backup (Resilient)
```bash
# Upload everything including api-backup/
# If external API down, can switch to local
```

**Upload:**
- All files from Scenario 1
- `api-backup/` folder
- Can manually switch if needed

### Scenario 3: Fully Self-Hosted
```bash
# Deploy Node.js server with backup
# Can use npm run local in production
```

**Deploy:**
- All files
- `server.js`
- Run `npm run local` on server

---

## 🔧 Configuration Details

### api-config.js (Static - Default)
```javascript
window.API_CONFIG = {
    mode: 'external',
    baseUrl: 'https://ghibliapi.vercel.app'
};
```

### api-config.js (Dynamic - Local Mode)
When you run `npm run local`, server injects:
```javascript
window.API_CONFIG = {
    mode: 'local',
    baseUrl: '/api'
};
console.log('🔧 Running in LOCAL mode - using backup API');
```

### JavaScript Files (All)
```javascript
const API_BASE = (typeof window !== 'undefined' && window.API_CONFIG) 
    ? window.API_CONFIG.baseUrl 
    : 'https://ghibliapi.vercel.app';
```

**Logic:**
1. Check if `window.API_CONFIG` exists
2. If yes, use `API_CONFIG.baseUrl`
3. If no, default to external API
4. Safe for all environments ✓

---

## ⚡ Quick Reference

**Want to use external API?**
```bash
npm start
```

**Want to use local backup?**
```bash
npm run local
```

**Want to create backup?**
```bash
npm run backup
```

**Want to deploy to production?**
```bash
# Just upload files - no changes needed
# Uses external API by default
```

---

## 🎉 Benefits

✅ **No code changes** - switch with npm commands  
✅ **Safe for production** - defaults to external API  
✅ **Easy testing** - test both modes quickly  
✅ **Offline capable** - develop without internet  
✅ **Deployment ready** - works in public_html  
✅ **Backup resilience** - local fallback available  

---

**Everything now works as expected!** 🚀
