# Studio Ghibli Films Explorer �

A beautiful, responsive web application that displays Studio Ghibli films and their details using the Ghibli API.

## Features

- **Homepage**: Displays all Studio Ghibli films with gorgeous movie posters in a visually appealing grid layout
- **Film Details**: Click on any film to see:
  - Complete film information (director, producer, release date, runtime, RT score)
  - Movie banner image
  - Full description
  - All characters with detailed information (gender, age, eye color, hair color, species)
  - Locations, species, and vehicles featured in the film
- **Species Pages**: Clickable species links with dedicated detail pages
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Aesthetic Design**: 
  - Beautiful Studio Ghibli-inspired color palette (greens, creams, and soft pastels)
  - Animated cloud background effects
  - Soot sprites (Susuwatari) with interactive click-to-explode easter egg
  - Kodama (tree spirits) animations
  - Floating leaves effects
  - Smooth animations and hover effects
  - Modern card-based layout with movie images
  - Gorgeous typography and spacing
- **🆕 API Backup System**: Complete offline fallback with automatic API switching
  - Local backup of all API data and images
  - Automatic fallback when external API is unavailable
  - See [BACKUP-GUIDE.md](./BACKUP-GUIDE.md) for details

## Technologies Used

- HTML5
- CSS3 (with CSS Grid and Flexbox)
- Vanilla JavaScript (ES6+)
- [Ghibli API](https://ghibliapi.vercel.app/)

## How to Run

Simply open `index.html` in your web browser. No build process or server required!

### Option 1: Direct File Opening
1. Navigate to the project folder
2. Double-click `index.html`

### Option 2: Using Node.js (Recommended)

**Using npm scripts:**
```bash
npm start
# or
npm run dev
```

**Alternative with npx (no installation needed):**
```bash
npm run serve
# or
npx http-server
```

**Or run the server directly:**
```bash
node server.js
```

Then open `http://localhost:8080` in your browser.


## File Structure

```
├── index.html              # Homepage with film list
├── film.html               # Film detail page
├── species.html            # Species detail page
├── styles.css              # All styles and animations
├── script.js               # Homepage functionality
├── film.js                 # Film detail page functionality
├── species.js              # Species page functionality
├── server.js               # Development server with local API support
├── crawler.js              # API backup script
├── api-client.js           # Smart API client with fallback
├── local-api-service.js    # Local API service
├── BACKUP-GUIDE.md         # Complete backup system documentation
├── api-backup/             # Local API backup (created by crawler)
│   ├── films.json
│   ├── people.json
│   ├── species.json
│   ├── locations.json
│   ├── vehicles.json
│   └── images/             # Downloaded images
├── package.json            # Node.js configuration
└── README.md               # This file
```

## API Information

This project uses the Studio Ghibli API to fetch:
- Films data with images
- Character information
- Locations, species, and vehicles details

**API Base URL**: `https://ghibliapi.vercel.app`

**No Rate Limiting**: The API is free and open with no authentication required!

### 🛡️ API Backup & Resilience

This project includes a complete backup system to ensure it works even if the external API is down:

1. **Create a backup** of all API data and images:
   ```bash
   npm run backup
   ```

2. **Check backup status**:
   ```bash
   npm run backup:check
   ```

3. **Automatic fallback**: The server can automatically serve local data when the external API is unavailable.

📖 **Full documentation**: See [BACKUP-GUIDE.md](./BACKUP-GUIDE.md) for complete instructions on:
- How to create and maintain backups
- Automatic fallback configuration
- Testing and troubleshooting
- Deployment considerations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Credits

- **API**: [Ghibli API](https://ghibliapi.vercel.app/) - The Studio Ghibli API
