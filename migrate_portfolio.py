#!/usr/bin/env python3
"""
Automatische Portfolio-Migration
Extrahiert alle Bilder und Inhalte aus dem Jekyll Agency Theme
und migriert sie zur neuen Masonry-Grid Website
"""

import os
import json
import re
import requests
from pathlib import Path
from datetime import datetime
import yaml

class PortfolioMigrator:
    """Migriert Portfolio vom Jekyll Theme zur neuen Website"""
    
    def __init__(self, github_user="hellojuergen", repo_name="Portfolio"):
        self.github_user = github_user
        self.repo_name = repo_name
        self.base_url = f"https://api.github.com/repos/{github_user}/{repo_name}"
        self.raw_url = f"https://raw.githubusercontent.com/{github_user}/{repo_name}/master"
        self.portfolio_items = []
        
    def get_portfolio_files(self):
        """Hole alle Portfolio-Dateien aus dem _portfolio Ordner"""
        url = f"{self.base_url}/contents/_portfolio"
        
        try:
            response = requests.get(url)
            if response.status_code == 200:
                files = response.json()
                print(f"✅ Gefunden: {len(files)} Portfolio-Dateien")
                return files
            else:
                print(f"❌ Fehler beim Abrufen der Portfolio-Dateien: {response.status_code}")
                return []
        except Exception as e:
            print(f"❌ Fehler: {e}")
            return []
    
    def parse_portfolio_file(self, file_info):
        """Parse eine einzelne Portfolio-Datei (Markdown mit YAML Front Matter)"""
        try:
            file_url = file_info['download_url']
            response = requests.get(file_url)
            
            if response.status_code != 200:
                return None
            
            content = response.text
            
            # Extrahiere YAML Front Matter
            yaml_match = re.match(r'^---\n(.*?)\n---\n(.*)$', content, re.DOTALL)
            
            if not yaml_match:
                print(f"⚠️  Kein YAML Front Matter gefunden in {file_info['name']}")
                return None
            
            yaml_content = yaml_match.group(1)
            markdown_content = yaml_match.group(2).strip()
            
            # Parse YAML
            try:
                data = yaml.safe_load(yaml_content)
            except:
                print(f"⚠️  YAML Parse Fehler in {file_info['name']}")
                return None
            
            # Erstelle Portfolio Item
            item = {
                'title': data.get('title', 'Untitled'),
                'subtitle': data.get('subtitle', ''),
                'image': data.get('image', data.get('thumbnail', '')),
                'alt': data.get('alt', data.get('title', '')),
                'project-date': data.get('project-date', ''),
                'client': data.get('client', ''),
                'category': data.get('category', []),
                'description': markdown_content,
                'caption': data.get('caption', {}),
            }
            
            return item
            
        except Exception as e:
            print(f"❌ Fehler beim Parsen von {file_info['name']}: {e}")
            return None
    
    def get_image_files(self):
        """Hole alle Bilder aus dem assets Ordner"""
        # Versuche verschiedene Pfade
        image_paths = [
            'assets/img/portfolio',
            'assets/img',
            '_art',
            'img',
        ]
        
        all_images = []
        
        for path in image_paths:
            url = f"{self.base_url}/contents/{path}"
            try:
                response = requests.get(url)
                if response.status_code == 200:
                    files = response.json()
                    # Filtere nur Bilder
                    images = [f for f in files if f['name'].lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp'))]
                    all_images.extend(images)
                    print(f"✅ Gefunden: {len(images)} Bilder in {path}")
            except:
                continue
        
        return all_images
    
    def download_image(self, image_info, output_dir='./assets/img/portfolio'):
        """Lade ein Bild herunter"""
        Path(output_dir).mkdir(parents=True, exist_ok=True)
        
        filename = image_info['name']
        download_url = image_info['download_url']
        output_path = Path(output_dir) / filename
        
        try:
            response = requests.get(download_url)
            if response.status_code == 200:
                with open(output_path, 'wb') as f:
                    f.write(response.content)
                print(f"✅ Heruntergeladen: {filename}")
                return str(output_path)
            else:
                print(f"❌ Fehler beim Herunterladen: {filename}")
                return None
        except Exception as e:
            print(f"❌ Fehler: {e}")
            return None
    
    def categorize_image(self, item):
        """Bestimme Kategorien basierend auf Titel und Beschreibung"""
        categories = []
        
        text = f"{item.get('title', '')} {item.get('subtitle', '')} {item.get('description', '')}".lower()
        
        # Kategorisierungs-Regeln
        if any(word in text for word in ['animal', 'dog', 'cat', 'bird', 'wildlife', 'pet', 'tier']):
            categories.append('animals')
        
        if any(word in text for word in ['landscape', 'mountain', 'forest', 'nature', 'outdoor', 'landschaft', 'berg']):
            categories.append('landscape')
        
        if any(word in text for word in ['portrait', 'people', 'person', 'model', 'fashion', 'porträt']):
            if any(word in text for word in ['woman', 'female', 'girl', 'frau']):
                categories.append('woman')
            elif any(word in text for word in ['man', 'male', 'boy', 'mann']):
                categories.append('man')
            else:
                categories.append('woman')  # Default
        
        if any(word in text for word in ['editorial', 'magazine', 'fashion']):
            categories.append('editorial')
        
        if any(word in text for word in ['color', 'colourful', 'vibrant', 'farbe', 'bunt']):
            categories.append('colors')
        
        if any(word in text for word in ['black and white', 'b&w', 'bw', 'monochrome', 'schwarz weiß']):
            categories.append('bw')
        
        if any(word in text for word in ['advertising', 'commercial', 'product', 'werbung']):
            categories.append('adv')
        
        # Fallback
        if not categories:
            categories = ['colors']
        
        return categories
    
    def migrate(self):
        """Hauptfunktion: Migriere alles"""
        print("\n" + "="*60)
        print("🚀 PORTFOLIO MIGRATION GESTARTET")
        print("="*60 + "\n")
        
        # 1. Hole Portfolio-Dateien
        print("📂 Schritt 1: Hole Portfolio-Dateien...")
        portfolio_files = self.get_portfolio_files()
        
        # 2. Parse Portfolio-Dateien
        print("\n📝 Schritt 2: Parse Portfolio-Einträge...")
        for file_info in portfolio_files:
            item = self.parse_portfolio_file(file_info)
            if item:
                self.portfolio_items.append(item)
                print(f"   ✓ {item['title']}")
        
        print(f"\n✅ {len(self.portfolio_items)} Portfolio-Items geparst")
        
        # 3. Hole Bilder
        print("\n🖼️  Schritt 3: Hole Bilder...")
        images = self.get_image_files()
        
        # 4. Download Bilder
        print("\n📥 Schritt 4: Download Bilder...")
        downloaded_images = []
        for img in images:
            path = self.download_image(img)
            if path:
                downloaded_images.append({
                    'name': img['name'],
                    'path': path,
                    'url': img['download_url']
                })
        
        # 5. Generiere portfolio-data.js
        print("\n📄 Schritt 5: Generiere portfolio-data.js...")
        self.generate_portfolio_data()
        
        # 6. Update index.html mit echten Daten
        print("\n🔧 Schritt 6: Update index.html...")
        self.update_index_html()
        
        print("\n" + "="*60)
        print("✅ MIGRATION ABGESCHLOSSEN!")
        print("="*60)
        print(f"\n📊 Statistik:")
        print(f"   - Portfolio Items: {len(self.portfolio_items)}")
        print(f"   - Bilder: {len(downloaded_images)}")
        print(f"\n💡 Nächste Schritte:")
        print(f"   1. Öffne index.html im Browser")
        print(f"   2. Prüfe die Bilder und Kategorien")
        print(f"   3. Passe js/portfolio-data.js bei Bedarf an")
        print(f"   4. Git commit und push!")
        print("")
    
    def generate_portfolio_data(self):
        """Generiere portfolio-data.js mit echten Daten"""
        
        output_file = Path('./js/portfolio-data.js')
        
        js_items = []
        
        for idx, item in enumerate(self.portfolio_items, start=1):
            # Bestimme Bildpfad
            image_name = Path(item['image']).name if item['image'] else 'placeholder.jpg'
            image_path = f"./assets/img/portfolio/{image_name}"
            
            # Kategorien
            categories = self.categorize_image(item)
            
            # Zufällige Höhe für Masonry Grid
            import random
            grid_height = random.randint(28, 45)
            
            # Datum
            date_str = item.get('project-date', datetime.now().strftime('%Y-%m'))
            
            js_item = {
                'id': idx,
                'title': item['title'],
                'category': categories,
                'image': image_path,
                'description': item.get('description', '')[:200],  # Kürzen
                'date': date_str,
                'gridRowSpan': grid_height
            }
            
            js_items.append(js_item)
        
        # Schreibe JavaScript-Datei
        js_content = "// Portfolio Daten - Automatisch migriert vom Jekyll Theme\n"
        js_content += "const portfolioItems = " + json.dumps(js_items, indent=4, ensure_ascii=False) + ";\n\n"
        js_content += "// Exportiere für Verwendung in main.js\n"
        js_content += "if (typeof module !== 'undefined' && module.exports) {\n"
        js_content += "    module.exports = portfolioItems;\n"
        js_content += "}\n"
        
        output_file.parent.mkdir(parents=True, exist_ok=True)
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(js_content)
        
        print(f"✅ {output_file} erstellt mit {len(js_items)} Items")
    
    def update_index_html(self):
        """Update index.html mit echten Kontaktdaten etc."""
        index_file = Path('./index.html')
        
        if not index_file.exists():
            print("⚠️  index.html nicht gefunden")
            return
        
        with open(index_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Hole _config.yml für echte Daten
        try:
            config_url = f"{self.raw_url}/_config.yml"
            response = requests.get(config_url)
            if response.status_code == 200:
                config = yaml.safe_load(response.text)
                
                # Update Titel
                if 'title' in config:
                    content = re.sub(
                        r'<h1 class="hero-title">.*?</h1>',
                        f'<h1 class="hero-title">{config["title"]}</h1>',
                        content
                    )
                
                # Update Email
                if 'email' in config:
                    content = content.replace(
                        'hello@juergen-portfolio.com',
                        config['email']
                    )
                
                print("✅ index.html mit echten Daten aktualisiert")
        except:
            print("⚠️  _config.yml nicht gefunden, verwende Defaults")
        
        # Speichere
        with open(index_file, 'w', encoding='utf-8') as f:
            f.write(content)


def main():
    """Hauptprogramm"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Migriere Portfolio vom Jekyll Theme')
    parser.add_argument('--user', default='hellojuergen', help='GitHub Username')
    parser.add_argument('--repo', default='Portfolio', help='Repository Name')
    parser.add_argument('--dry-run', action='store_true', help='Nur anzeigen, nicht herunterladen')
    
    args = parser.parse_args()
    
    migrator = PortfolioMigrator(args.user, args.repo)
    migrator.migrate()


if __name__ == '__main__':
    main()
