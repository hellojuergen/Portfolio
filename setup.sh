#!/bin/bash

# Portfolio Setup Script
# Automatische Installation und Konfiguration

echo "================================================"
echo "🚀 Portfolio Website Setup"
echo "================================================"
echo ""

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funktion für Success-Messages
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Funktion für Error-Messages
error() {
    echo -e "${RED}❌ $1${NC}"
}

# Funktion für Info-Messages
info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check ob Python installiert ist
echo "Checking dependencies..."
if ! command -v python3 &> /dev/null; then
    error "Python 3 ist nicht installiert!"
    echo "Installiere Python 3: https://www.python.org/downloads/"
    exit 1
fi
success "Python 3 gefunden"

# Check ob pip installiert ist
if ! command -v pip3 &> /dev/null; then
    error "pip3 ist nicht installiert!"
    exit 1
fi
success "pip3 gefunden"

echo ""
echo "================================================"
echo "📦 Installiere Dependencies"
echo "================================================"
echo ""

# Installiere Python-Pakete
pip3 install requests Pillow tweepy 2>&1 | grep -v "already satisfied" || true
success "Python-Pakete installiert"

echo ""
echo "================================================"
echo "🖼️  Erstelle Placeholder-Bilder"
echo "================================================"
echo ""

# Erstelle Verzeichnis-Struktur
mkdir -p assets/img/portfolio
mkdir -p assets/img/thumbnails
mkdir -p assets/img/social
mkdir -p css
mkdir -p js

success "Verzeichnisse erstellt"

# Generiere Placeholder-Bilder
info "Generiere Placeholder-Bilder..."
python3 generate_placeholders.py

echo ""
echo "================================================"
echo "⚙️  Konfiguration"
echo "================================================"
echo ""

# Erstelle config.json wenn nicht vorhanden
if [ ! -f "config.json" ]; then
    info "Erstelle config.json Template..."
    python3 upload_to_platforms.py --help > /dev/null 2>&1 || true
    success "config.json Template erstellt"
else
    info "config.json existiert bereits"
fi

# Generiere Sitemap
info "Generiere sitemap.xml..."
python3 generate_sitemap.py
success "Sitemap erstellt"

echo ""
echo "================================================"
echo "🎨 Personalisierung"
echo "================================================"
echo ""

# Frage nach Personalisierung
echo "Möchtest du die Website jetzt personalisieren? (j/n)"
read -r personalize

if [ "$personalize" = "j" ] || [ "$personalize" = "J" ]; then
    echo ""
    echo "Name/Initial für Logo (z.B. 'J'):"
    read -r logo_initial
    
    echo "Titel für Hero-Section:"
    read -r hero_title
    
    echo "Untertitel:"
    read -r hero_subtitle
    
    echo "E-Mail Adresse:"
    read -r email
    
    # Ersetze in index.html
    if [ "$(uname)" = "Darwin" ]; then
        # macOS
        sed -i '' "s/<div class=\"logo-circle\">J<\/div>/<div class=\"logo-circle\">$logo_initial<\/div>/g" index.html
        sed -i '' "s/<h1 class=\"hero-title\">Kreative Visionen<\/h1>/<h1 class=\"hero-title\">$hero_title<\/h1>/g" index.html
        sed -i '' "s/<p class=\"hero-subtitle\">Fotografie & Design Portfolio<\/p>/<p class=\"hero-subtitle\">$hero_subtitle<\/p>/g" index.html
        sed -i '' "s/hello@juergen-portfolio.com/$email/g" index.html
    else
        # Linux
        sed -i "s/<div class=\"logo-circle\">J<\/div>/<div class=\"logo-circle\">$logo_initial<\/div>/g" index.html
        sed -i "s/<h1 class=\"hero-title\">Kreative Visionen<\/h1>/<h1 class=\"hero-title\">$hero_title<\/h1>/g" index.html
        sed -i "s/<p class=\"hero-subtitle\">Fotografie & Design Portfolio<\/p>/<p class=\"hero-subtitle\">$hero_subtitle<\/p>/g" index.html
        sed -i "s/hello@juergen-portfolio.com/$email/g" index.html
    fi
    
    success "Website personalisiert!"
fi

echo ""
echo "================================================"
echo "✅ Setup Abgeschlossen!"
echo "================================================"
echo ""

success "Alle Dateien sind bereit!"
echo ""
info "Nächste Schritte:"
echo ""
echo "1. Öffne index.html in einem Browser:"
echo "   open index.html  # macOS"
echo "   xdg-open index.html  # Linux"
echo ""
echo "2. Ersetze Placeholder-Bilder in assets/img/portfolio/"
echo ""
echo "3. Bearbeite js/portfolio-data.js mit deinen Bildern"
echo ""
echo "4. Konfiguriere API-Keys in config.json für Cross-Posting"
echo ""
echo "5. Deploye auf GitHub Pages, Netlify oder eigenem Server"
echo ""
echo "📖 Weitere Infos: README.md"
echo "📊 Verbesserungen: IMPROVEMENTS.md"
echo ""
echo "================================================"
echo "🎉 Viel Erfolg mit deinem Portfolio!"
echo "================================================"
