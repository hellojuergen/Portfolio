# 🔄 AUTOMATISCHE MIGRATION - Ihre bisherigen Fotos einfügen

## ⚡ SCHNELLSTE METHODE (1 Befehl!)

Führen Sie das Migration-Script aus - es holt AUTOMATISCH alle Bilder und Inhalte aus Ihrem GitHub Repository:

```bash
# Im Terminal (in Ihrem Portfolio-Ordner):
python3 migrate_portfolio.py
```

**Das macht das Script:**
1. ✅ Liest alle Portfolio-Einträge aus `_portfolio/`
2. ✅ Lädt alle Bilder herunter
3. ✅ Kategorisiert automatisch (Animals, Landscape, etc.)
4. ✅ Generiert `js/portfolio-data.js` mit allen Daten
5. ✅ Aktualisiert `index.html` mit Ihren Kontaktdaten
6. ✅ **FERTIG!** Alle Ihre Bilder sind drin!

---

## 📋 Voraussetzungen

```bash
# Python Dependencies installieren:
pip3 install pyyaml requests

# ODER mit --break-system-packages falls nötig:
pip3 install --break-system-packages pyyaml requests
```

---

## 🎯 SCHRITT-FÜR-SCHRITT

### Schritt 1: Migration-Script ausführen

```bash
cd ~/Portfolio  # Ihr Portfolio-Ordner

# Migration starten:
python3 migrate_portfolio.py

# Mit anderen GitHub-Daten:
python3 migrate_portfolio.py --user IHR_USERNAME --repo IHR_REPO
```

### Schritt 2: Ergebnis prüfen

```bash
# Website lokal öffnen:
open index.html  # macOS
# oder
xdg-open index.html  # Linux
```

### Schritt 3: Online stellen

```bash
git add .
git commit -m "Migrate to new portfolio design with all images"
git push origin main
```

**FERTIG!** Ihre Website ist live mit allen Bildern! 🎉

---

## 🔧 MANUELLE METHODE (falls Script nicht funktioniert)

Falls das Script Probleme macht, hier die manuelle Alternative:

### 1. Bilder kopieren

```bash
# Alle Bilder aus dem alten Ordner kopieren:
cp -r _art/* assets/img/portfolio/
cp -r assets/img/* assets/img/portfolio/ 2>/dev/null || true

# Portfolio-spezifische Bilder:
find _portfolio -name "*.jpg" -exec cp {} assets/img/portfolio/ \;
find _portfolio -name "*.png" -exec cp {} assets/img/portfolio/ \;
```

### 2. Portfolio-Daten extrahieren

```bash
# Alle Portfolio-Dateien auflisten:
ls _portfolio/*.md

# Jede Datei manuell in js/portfolio-data.js übertragen
```

### 3. `js/portfolio-data.js` manuell bearbeiten

Öffnen Sie `js/portfolio-data.js` und fügen Sie Ihre Bilder hinzu:

```javascript
const portfolioItems = [
    {
        id: 1,
        title: "Ihr Bildtitel",
        category: ["landscape", "colors"],  // Passen Sie an
        image: "./assets/img/portfolio/ihr-bild.jpg",
        description: "Beschreibung",
        date: "2026-01",
        gridRowSpan: 35  // 20-50 für verschiedene Höhen
    },
    {
        id: 2,
        title: "Nächstes Bild",
        category: ["animals"],
        image: "./assets/img/portfolio/bild2.jpg",
        description: "...",
        date: "2026-02",
        gridRowSpan: 28
    },
    // Weitere Bilder...
];
```

---

## 🤖 NOCH EINFACHER: One-Liner Script

Speichern Sie dies als `quick_migrate.sh`:

```bash
#!/bin/bash

echo "🚀 Quick Portfolio Migration"

# Erstelle Verzeichnisse
mkdir -p assets/img/portfolio

# Kopiere alle Bilder
echo "📁 Kopiere Bilder..."
find . -name "*.jpg" -not -path "./assets/img/portfolio/*" -exec cp {} assets/img/portfolio/ \;
find . -name "*.png" -not -path "./assets/img/portfolio/*" -exec cp {} assets/img/portfolio/ \;
find . -name "*.webp" -not -path "./assets/img/portfolio/*" -exec cp {} assets/img/portfolio/ \;

echo "✅ Bilder kopiert!"
echo "📝 Jetzt js/portfolio-data.js bearbeiten"
```

Ausführen:
```bash
chmod +x quick_migrate.sh
./quick_migrate.sh
```

---

## 📊 KATEGORIEN-GUIDE

Für jedes Bild in `js/portfolio-data.js` können Sie folgende Kategorien verwenden:

- **`animals`** - Tiere, Wildlife, Haustiere
- **`landscape`** - Landschaft, Natur, Berge
- **`colors`** - Farbige, bunte Bilder
- **`bw`** - Schwarz-Weiß
- **`woman`** - Frauenporträts
- **`man`** - Männerporträts
- **`editorial`** - Editorial, Mode
- **`adv`** - Werbung, Commercial

**Mehrere Kategorien kombinieren:**
```javascript
category: ["landscape", "colors", "editorial"]
```

---

## 🎨 GRID-HÖHEN optimal einstellen

Die `gridRowSpan` bestimmt die Höhe im Masonry Grid:

- **20-25**: Klein (z.B. quadratische Bilder)
- **28-35**: Medium (Standard)
- **38-45**: Groß (Hochformat, auffällig)
- **48-50**: Sehr groß (Hero-Bilder)

**Tipp:** Variieren Sie die Höhen für ein dynamisches Layout!

---

## ❓ TROUBLESHOOTING

### "ModuleNotFoundError: No module named 'yaml'"
```bash
pip3 install pyyaml
```

### "Permission denied"
```bash
chmod +x migrate_portfolio.py
```

### "Network error / Cannot connect to GitHub"
→ Verwenden Sie die **MANUELLE METHODE** oben

### Bilder werden nicht angezeigt
1. Prüfen Sie Pfade in `js/portfolio-data.js`
2. Stellen Sie sicher, Bilder sind in `assets/img/portfolio/`
3. Browser-Cache leeren (Strg+Shift+R)

---

## 🎯 NACH DER MIGRATION

### 1. Optimieren Sie die Bildgrößen:

```bash
# Bilder für Web optimieren (benötigt ImageMagick):
for img in assets/img/portfolio/*.jpg; do
    convert "$img" -resize 1920x1080\> -quality 85 "${img}_optimized.jpg"
    mv "${img}_optimized.jpg" "$img"
done
```

### 2. WebP-Versionen erstellen (optional):

```bash
for img in assets/img/portfolio/*.jpg; do
    convert "$img" -quality 80 "${img%.jpg}.webp"
done
```

### 3. Kategorien verfeinern

Öffnen Sie `js/portfolio-data.js` und passen Sie die Kategorien an Ihre Bedürfnisse an.

### 4. Texte personalisieren

In `index.html`:
- Logo-Buchstabe
- Hero-Titel und Untertitel
- Kontaktdaten
- Social Media Links

---

## ✅ ERFOLGSKONTROLLE

Nach der Migration sollten Sie sehen:

1. ✅ Alle Bilder in `assets/img/portfolio/`
2. ✅ `js/portfolio-data.js` mit allen Einträgen
3. ✅ Website zeigt alle Bilder im Browser
4. ✅ Filter funktionieren
5. ✅ Lightbox funktioniert

---

## 🚀 NÄCHSTE SCHRITTE

```bash
# Website lokal testen
open index.html

# Alles gut? → Online stellen!
git add .
git commit -m "✨ New portfolio with all migrated images"
git push origin main

# GitHub Pages wird automatisch aktualisiert!
```

**Website live in ~2 Minuten!** 🎉

---

## 💡 TIPPS

1. **Backup erstellen** vor Migration:
   ```bash
   cp -r . ../Portfolio_backup
   ```

2. **Schrittweise vorgehen:**
   - Erst 5 Bilder migrieren
   - Testen
   - Dann alle migrieren

3. **Bildnamen** sollten keine Leerzeichen enthalten:
   ```bash
   # Leerzeichen ersetzen:
   for f in *\ *; do mv "$f" "${f// /_}"; done
   ```

---

Fragen? Schauen Sie in **README.md** oder **IMPROVEMENTS.md**!
