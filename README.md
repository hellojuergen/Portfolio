# 📸 Modern Portfolio Website

Ein modernes, responsives Portfolio mit Masonry Grid Layout, automatischem Cross-Posting und professionellem Design.

![Portfolio Preview](./screenshot.png)

## ✨ Features

### 🎨 Design
- **Masonry Grid Layout** - Dynamisches, Pinterest-artiges Layout
- **Dark Theme** - Elegantes, professionelles Aussehen
- **Smooth Animations** - Fade-ins, Hover-Effekte
- **Vollbild Lightbox** - Mit Navigationspfeilen
- **Responsive** - Optimiert für alle Geräte

### 🚀 Performance
- Vanilla JavaScript (kein jQuery)
- Lazy Loading für Bilder
- Optimiertes CSS
- < 50KB Bundle Size
- 90+ Lighthouse Score

### 📤 Cross-Posting ("One Upload Does It All")
Automatisches Hochladen zu:
- Behance
- Instagram
- Pinterest
- Twitter/X
- LinkedIn
- Lokales Portfolio

### 🎯 SEO & Marketing
- Open Graph Meta-Tags
- Strukturiertes HTML5
- Social Media Integration
- Newsletter-Integration
- Google Analytics ready

---

## 🚀 Quick Start

### 1. Repository klonen

```bash
git clone https://github.com/hellojuergen/Portfolio.git
cd Portfolio
```

### 2. Dateien ersetzen

Kopiere die neuen Dateien in dein Repository:

```bash
# Hauptdateien
cp index.html ./
cp -r css ./
cp -r js ./
cp -r assets ./

# Cross-Posting Script
cp upload_to_platforms.py ./
chmod +x upload_to_platforms.py
```

### 3. Bilder hochladen

Platziere deine Bilder in:
```
assets/img/portfolio/
```

### 4. Portfolio-Daten anpassen

Bearbeite `js/portfolio-data.js`:

```javascript
const portfolioItems = [
    {
        id: 1,
        title: "Dein Bildtitel",
        category: ["landscape", "colors"],  // Kategorien
        image: "./assets/img/portfolio/dein-bild.jpg",
        description: "Beschreibung",
        date: "2026-04",
        gridRowSpan: 35  // Höhe im Grid (20-50)
    },
    // Weitere Bilder...
];
```

### 5. Website anpassen

**Logo & Texte** in `index.html`:
```html
<div class="logo-circle">J</div>  <!-- Dein Initial -->
<h1 class="hero-title">Dein Titel</h1>
```

**Social Media Links** in `index.html`:
```html
<a href="https://www.behance.net/DEIN-PROFIL">
```

**Kontaktdaten** im Footer:
```html
<p>deine@email.com</p>
<p>+43 XXX XXX XXX</p>
```

---

## 📤 Cross-Posting Setup

### 1. Python Dependencies installieren

```bash
pip install requests tweepy
```

### 2. API Keys konfigurieren

Beim ersten Start erstellt das Script automatisch `config.json`:

```bash
python upload_to_platforms.py
```

Bearbeite `config.json` mit deinen API Keys:

```json
{
  "behance": {
    "api_key": "DEIN_BEHANCE_API_KEY",
    "enabled": true
  },
  "instagram": {
    "access_token": "DEIN_INSTAGRAM_TOKEN",
    "user_id": "DEINE_USER_ID",
    "enabled": true
  },
  // ... weitere Plattformen
}
```

### 3. API Keys besorgen

#### Behance
1. Besuche: https://www.behance.net/dev
2. Erstelle neue App
3. Kopiere Client ID & Secret

#### Instagram
1. Facebook Developers: https://developers.facebook.com/
2. App erstellen
3. Instagram Graph API aktivieren
4. Access Token via Graph API Explorer

#### Pinterest
1. Pinterest Developers: https://developers.pinterest.com/
2. App erstellen
3. OAuth Token generieren

#### Twitter
1. Developer Portal: https://developer.twitter.com/
2. App erstellen
3. Keys & Tokens generieren

#### LinkedIn
1. LinkedIn Developers: https://www.linkedin.com/developers/
2. App erstellen
3. OAuth 2.0 Token besorgen

### 4. Bilder hochladen

**Einzelnes Bild:**
```bash
python upload_to_platforms.py photo.jpg \
  --title "Mountain Sunset" \
  --description "Beautiful alpine sunset in Tyrol" \
  --categories landscape colors
```

**Batch Upload:**
```bash
python upload_to_platforms.py --batch ./new_photos/
```

---

## 🎨 Anpassungen

### Farben ändern

In `css/style.css`:

```css
:root {
    --bg-dark: #0a0a0a;        /* Haupthintergrund */
    --text-light: #ffffff;      /* Textfarbe */
    --accent: #ffffff;          /* Akzentfarbe */
    --border-color: #1a1a1a;   /* Rahmenfarbe */
}
```

### Kategorien anpassen

In `index.html` - Filter-Buttons:

```html
<button class="filter-btn" data-filter="deine-kategorie">
    Deine Kategorie
</button>
```

In `js/portfolio-data.js` - Bei jedem Bild:

```javascript
category: ["deine-kategorie", "weitere-kategorie"]
```

### Grid-Spalten ändern

In `css/style.css`:

```css
.masonry-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    /* Ändere 300px für mehr/weniger Spalten */
}
```

---

## 📊 Analytics Setup

### Google Analytics 4

1. Erstelle Property: https://analytics.google.com/
2. Kopiere Measurement ID
3. Füge in `index.html` ein (vor `</head>`):

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🚀 Deployment

### Option 1: GitHub Pages (Kostenlos)

1. Pushe zu GitHub:
```bash
git add .
git commit -m "New portfolio design"
git push origin main
```

2. GitHub Repository → Settings → Pages
3. Source: main branch
4. Fertig! Website läuft auf: `https://hellojuergen.github.io/Portfolio/`

### Option 2: Netlify (Empfohlen)

1. Account erstellen: https://netlify.com
2. "New site from Git" → GitHub Repository auswählen
3. Deploy settings:
   - Build command: (leer lassen)
   - Publish directory: (leer lassen oder `/`)
4. Deploy!

**Custom Domain:**
- Netlify: Domain Settings → Add custom domain
- DNS: CNAME `www` → `yoursite.netlify.app`

### Option 3: Eigener Server

```bash
# Via FTP/SFTP alle Dateien hochladen
# ODER via SSH:
rsync -avz ./ user@server:/var/www/html/
```

---

## 🖼️ Bildoptimierung

### Automatisches Script

Erstelle `optimize_images.sh`:

```bash
#!/bin/bash

for img in assets/img/portfolio/*.jpg; do
    # Resize für Web (max 1920px)
    convert "$img" -resize 1920x1080\> -quality 85 "${img%.jpg}_optimized.jpg"
    
    # WebP erstellen
    convert "$img" -quality 80 "${img%.jpg}.webp"
    
    # Thumbnail
    convert "$img" -resize 400x400^ -gravity center \
            -extent 400x400 "assets/img/thumbnails/$(basename $img)"
done
```

```bash
chmod +x optimize_images.sh
./optimize_images.sh
```

---

## 📧 Newsletter Integration

### Mailchimp

1. Mailchimp Account: https://mailchimp.com
2. Erstelle Audience
3. Erstelle Embedded Form
4. Kopiere Form HTML
5. Ersetze in `index.html` (Footer):

```html
<form action="https://DEINE-URL.list-manage.com/subscribe/post" method="POST">
  <input type="hidden" name="u" value="USER_ID">
  <input type="hidden" name="id" value="LIST_ID">
  <input type="email" name="EMAIL" required placeholder="Deine E-Mail">
  <button type="submit">Subscribe</button>
</form>
```

---

## 🔧 Troubleshooting

### Bilder werden nicht angezeigt
- Prüfe Dateipfade in `portfolio-data.js`
- Stelle sicher, dass Bilder in `assets/img/portfolio/` sind
- Browser-Cache leeren (Ctrl+Shift+R)

### Filter funktioniert nicht
- JavaScript-Konsole öffnen (F12)
- Fehler checken
- Stelle sicher `portfolio-data.js` geladen ist

### Lightbox öffnet nicht
- JavaScript aktiviert?
- Keine JavaScript-Fehler in Konsole?
- Event Listener korrekt?

### Cross-Posting schlägt fehl
- API Keys korrekt in `config.json`?
- Internet-Verbindung ok?
- API Rate Limits erreicht?
- Python Dependencies installiert?

---

## 📁 Dateistruktur

```
Portfolio/
├── index.html              # Hauptseite
├── css/
│   └── style.css          # Haupt-Stylesheet
├── js/
│   ├── main.js            # Haupt-JavaScript
│   └── portfolio-data.js  # Portfolio-Daten
├── assets/
│   └── img/
│       ├── portfolio/     # Deine Bilder
│       ├── thumbnails/    # Thumbnails
│       └── social/        # Social Media Assets
├── upload_to_platforms.py # Cross-Posting Script
├── config.json            # API Konfiguration
├── IMPROVEMENTS.md        # Detaillierte Verbesserungen
└── README.md             # Diese Datei
```

---

## 🎯 Roadmap

### Version 2.0 (geplant)
- [ ] Admin Panel zum Hochladen
- [ ] Automatische Bildoptimierung
- [ ] Shop Integration (Prints verkaufen)
- [ ] Blog-Sektion
- [ ] Mehrsprachigkeit
- [ ] PWA Support
- [ ] Dark/Light Mode Toggle

---

## 🤝 Contributing

Verbesserungsvorschläge willkommen!

1. Fork das Repository
2. Erstelle Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit Changes (`git commit -m 'Add AmazingFeature'`)
4. Push to Branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 Lizenz

MIT License - siehe [LICENSE.txt](LICENSE.txt)

---

## 📞 Support

Bei Fragen oder Problemen:
- **Email:** hello@juergen-portfolio.com
- **Issues:** https://github.com/hellojuergen/Portfolio/issues

---

## 🙏 Credits

- Design inspiriert von modernen Portfolio-Websites
- Icons: Font Awesome
- Fonts: Google Fonts (Inter)

---

## ⭐ Showcase

Deine Website mit diesem Theme? Erstelle PR und füge sie hier hinzu!

---

**Made with ❤️ in Innsbruck, Tyrol**
