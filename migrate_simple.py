#!/usr/bin/env python3
"""
Vereinfachte Portfolio-Migration - OHNE externe Dependencies
Nutzt nur Python Standard-Bibliotheken
"""

import os
import json
import re
from pathlib import Path
from datetime import datetime
import urllib.request
import urllib.error

class SimpleMigrator:
    """Einfache Migration mit Standard-Python"""
    
    def __init__(self, github_user="hellojuergen", repo_name="Portfolio"):
        self.github_user = github_user
        self.repo_name = repo_name
        self.raw_url = f"https://raw.githubusercontent.com/{github_user}/{repo_name}/master"
        
    def get_url(self, url):
        """Einfacher URL-Abruf"""
        try:
            with urllib.request.urlopen(url, timeout=10) as response:
                return response.read().decode('utf-8')
        except urllib.error.URLError as e:
            print(f"❌ URL-Fehler: {e}")
            return None
    
    def download_file(self, url, output_path):
        """Datei herunterladen"""
        try:
            urllib.request.urlretrieve(url, output_path)
            return True
        except Exception as e:
            print(f"❌ Download-Fehler: {e}")
            return False
    
    def parse_yaml_simple(self, text):
        """Sehr einfacher YAML-Parser (nur für Front Matter)"""
        data = {}
        lines = text.split('\n')
        
        for line in lines:
            if ':' in line:
                key, value = line.split(':', 1)
                key = key.strip()
                value = value.strip().strip('"\'')
                
                # Listen erkennen
                if value.startswith('[') and value.endswith(']'):
                    value = [v.strip().strip('"\'') for v in value[1:-1].split(',')]
                
                data[key] = value
        
        return data
    
    def get_local_images(self):
        """Hole Bilder aus lokalem Verzeichnis"""
        image_dirs = [
            Path('_art'),
            Path('assets/img'),
            Path('assets/img/portfolio'),
            Path('img'),
        ]
        
        all_images = []
        
        for img_dir in image_dirs:
            if img_dir.exists():
                for ext in ['*.jpg', '*.jpeg', '*.png', '*.gif', '*.webp']:
                    all_images.extend(img_dir.glob(ext))
        
        return all_images
    
    def get_local_portfolio_files(self):
        """Hole Portfolio-Dateien aus lokalem Verzeichnis"""
        portfolio_dir = Path('_portfolio')
        
        if not portfolio_dir.exists():
            print(f"⚠️  {portfolio_dir} nicht gefunden!")
            return []
        
        md_files = list(portfolio_dir.glob('*.md'))
        print(f"✅ Gefunden: {len(md_files)} Portfolio-Dateien")
        return md_files
    
    def parse_portfolio_file_local(self, filepath):
        """Parse Portfolio-Datei (Markdown mit YAML Front Matter)"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extrahiere YAML Front Matter
            yaml_match = re.match(r'^---\n(.*?)\n---\n(.*)$', content, re.DOTALL)
            
            if not yaml_match:
                print(f"⚠️  Kein YAML in {filepath.name}")
                return None
            
            yaml_content = yaml_match.group(1)
            markdown_content = yaml_match.group(2).strip()
            
            # Parse YAML (einfach)
            data = self.parse_yaml_simple(yaml_content)
            
            # Erstelle Item
            item = {
                'title': data.get('title', filepath.stem),
                'subtitle': data.get('subtitle', ''),
                'image': data.get('image', data.get('thumbnail', '')),
                'description': markdown_content[:200],  # Erste 200 Zeichen
                'project-date': data.get('project-date', ''),
                'category': data.get('category', []),
            }
            
            return item
            
        except Exception as e:
            print(f"❌ Fehler bei {filepath.name}: {e}")
            return None
    
    def categorize_image(self, item):
        """Auto-Kategorisierung"""
        categories = []
        text = f"{item.get('title', '')} {item.get('subtitle', '')} {item.get('description', '')}".lower()
        
        # Kategorien
        keywords = {
            'animals': ['animal', 'dog', 'cat', 'bird', 'wildlife', 'pet', 'tier', 'hund', 'katze'],
            'landscape': ['landscape', 'mountain', 'forest', 'nature', 'outdoor', 'landschaft', 'berg', 'wald'],
            'woman': ['woman', 'female', 'girl', 'frau', 'portrait'],
            'man': ['man', 'male', 'boy', 'mann'],
            'editorial': ['editorial', 'magazine', 'fashion', 'mode'],
            'colors': ['color', 'colourful', 'vibrant', 'farbe', 'bunt'],
            'bw': ['black and white', 'b&w', 'bw', 'monochrome', 'schwarz weiß'],
            'adv': ['advertising', 'commercial', 'product', 'werbung'],
        }
        
        for cat, words in keywords.items():
            if any(word in text for word in words):
                categories.append(cat)
        
        # Fallback
        if not categories:
            categories = ['colors']
        
        return categories
    
    def copy_images_to_portfolio(self):
        """Kopiere alle Bilder ins Portfolio-Verzeichnis"""
        output_dir = Path('./assets/img/portfolio')
        output_dir.mkdir(parents=True, exist_ok=True)
        
        images = self.get_local_images()
        copied = 0
        
        print(f"\n📁 Kopiere {len(images)} Bilder...")
        
        for img in images:
            dest = output_dir / img.name
            if not dest.exists():
                import shutil
                shutil.copy2(img, dest)
                copied += 1
                print(f"   ✓ {img.name}")
        
        print(f"✅ {copied} neue Bilder kopiert!")
        return copied
    
    def migrate_local(self):
        """Migration aus lokalem Repository"""
        print("\n" + "="*60)
        print("🚀 LOKALE PORTFOLIO MIGRATION")
        print("="*60 + "\n")
        
        # 1. Bilder kopieren
        print("📸 Schritt 1: Bilder kopieren...")
        self.copy_images_to_portfolio()
        
        # 2. Portfolio-Dateien lesen
        print("\n📂 Schritt 2: Portfolio-Dateien lesen...")
        portfolio_files = self.get_local_portfolio_files()
        
        portfolio_items = []
        for filepath in portfolio_files:
            item = self.parse_portfolio_file_local(filepath)
            if item:
                portfolio_items.append(item)
                print(f"   ✓ {item['title']}")
        
        print(f"\n✅ {len(portfolio_items)} Items geparst")
        
        # 3. Generiere portfolio-data.js
        print("\n📄 Schritt 3: Generiere portfolio-data.js...")
        self.generate_portfolio_data(portfolio_items)
        
        # 4. Update index.html
        print("\n🔧 Schritt 4: Update index.html...")
        self.update_index_html()
        
        print("\n" + "="*60)
        print("✅ MIGRATION ABGESCHLOSSEN!")
        print("="*60)
        print(f"\n📊 Statistik:")
        print(f"   - Portfolio Items: {len(portfolio_items)}")
        print(f"\n💡 Nächste Schritte:")
        print(f"   1. open index.html")
        print(f"   2. Prüfen Sie die Kategorien")
        print(f"   3. git commit && git push")
        print("")
    
    def generate_portfolio_data(self, items):
        """Generiere portfolio-data.js"""
        output_file = Path('./js/portfolio-data.js')
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        js_items = []
        
        for idx, item in enumerate(items, start=1):
            # Bildpfad
            image_name = Path(item['image']).name if item['image'] else 'placeholder.jpg'
            image_path = f"./assets/img/portfolio/{image_name}"
            
            # Kategorien
            categories = self.categorize_image(item)
            
            # Grid-Höhe
            import random
            grid_height = random.randint(28, 45)
            
            js_item = {
                'id': idx,
                'title': item['title'],
                'category': categories,
                'image': image_path,
                'description': item['description'],
                'date': item.get('project-date', datetime.now().strftime('%Y-%m')),
                'gridRowSpan': grid_height
            }
            
            js_items.append(js_item)
        
        # JavaScript generieren
        js_content = "// Portfolio Daten - Automatisch migriert\n"
        js_content += "const portfolioItems = " + json.dumps(js_items, indent=4, ensure_ascii=False) + ";\n\n"
        js_content += "// Export\n"
        js_content += "if (typeof module !== 'undefined' && module.exports) {\n"
        js_content += "    module.exports = portfolioItems;\n"
        js_content += "}\n"
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(js_content)
        
        print(f"✅ {output_file} mit {len(js_items)} Items erstellt")
    
    def update_index_html(self):
        """Update index.html mit echten Daten"""
        index_file = Path('./index.html')
        
        if not index_file.exists():
            print("⚠️  index.html nicht gefunden")
            return
        
        # Lese _config.yml falls vorhanden
        config_file = Path('./_config.yml')
        if config_file.exists():
            try:
                with open(config_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Extrahiere Werte (einfach)
                email_match = re.search(r'email:\s*([^\n]+)', content)
                title_match = re.search(r'title:\s*([^\n]+)', content)
                
                with open(index_file, 'r', encoding='utf-8') as f:
                    html = f.read()
                
                # Update
                if email_match:
                    email = email_match.group(1).strip()
                    html = html.replace('hello@juergen-portfolio.com', email)
                
                if title_match:
                    title = title_match.group(1).strip()
                    html = re.sub(
                        r'<h1 class="hero-title">.*?</h1>',
                        f'<h1 class="hero-title">{title}</h1>',
                        html
                    )
                
                with open(index_file, 'w', encoding='utf-8') as f:
                    f.write(html)
                
                print("✅ index.html aktualisiert")
            except:
                print("⚠️  Konnte _config.yml nicht lesen")


def main():
    """Hauptprogramm"""
    print("\n🎨 PORTFOLIO MIGRATION - Vereinfachte Version")
    print("📦 Nutzt nur Python Standard-Bibliotheken\n")
    
    migrator = SimpleMigrator()
    migrator.migrate_local()


if __name__ == '__main__':
    main()
