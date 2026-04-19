#!/usr/bin/env python3
"""
Portfolio Cross-Posting System
Automatisches Hochladen von Portfolio-Bildern zu mehreren Plattformen
One Upload Does It All!

Unterstützte Plattformen:
- Behance API
- Instagram Graph API
- Pinterest API
- Twitter/X API
- LinkedIn API
"""

import os
import json
import requests
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional
import hashlib

class PortfolioCrossPoster:
    """
    Hauptklasse für Cross-Posting zu verschiedenen Plattformen
    """
    
    def __init__(self, config_file: str = 'config.json'):
        """Initialisiere mit Konfigurationsdatei"""
        self.config = self.load_config(config_file)
        self.uploaded_hashes = self.load_upload_history()
        
    def load_config(self, config_file: str) -> Dict:
        """Lade API-Credentials aus config.json"""
        try:
            with open(config_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"⚠️  Config file {config_file} nicht gefunden. Erstelle Template...")
            self.create_config_template(config_file)
            return {}
    
    def create_config_template(self, config_file: str):
        """Erstelle Template für Konfigurationsdatei"""
        template = {
            "behance": {
                "api_key": "YOUR_BEHANCE_API_KEY",
                "client_id": "YOUR_BEHANCE_CLIENT_ID",
                "client_secret": "YOUR_BEHANCE_CLIENT_SECRET",
                "enabled": True
            },
            "instagram": {
                "access_token": "YOUR_INSTAGRAM_ACCESS_TOKEN",
                "user_id": "YOUR_INSTAGRAM_USER_ID",
                "enabled": True
            },
            "pinterest": {
                "access_token": "YOUR_PINTEREST_ACCESS_TOKEN",
                "board_id": "YOUR_BOARD_ID",
                "enabled": True
            },
            "twitter": {
                "api_key": "YOUR_TWITTER_API_KEY",
                "api_secret": "YOUR_TWITTER_API_SECRET",
                "access_token": "YOUR_TWITTER_ACCESS_TOKEN",
                "access_secret": "YOUR_TWITTER_ACCESS_SECRET",
                "enabled": True
            },
            "linkedin": {
                "access_token": "YOUR_LINKEDIN_ACCESS_TOKEN",
                "person_id": "YOUR_PERSON_ID",
                "enabled": True
            },
            "local_portfolio": {
                "enabled": True,
                "output_dir": "./assets/img/portfolio"
            }
        }
        
        with open(config_file, 'w') as f:
            json.dump(template, f, indent=4)
        
        print(f"✅ Template erstellt: {config_file}")
        print("📝 Bitte fülle deine API-Credentials ein!")
    
    def load_upload_history(self) -> Dict:
        """Lade Historie der hochgeladenen Dateien"""
        history_file = 'upload_history.json'
        try:
            with open(history_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {}
    
    def save_upload_history(self):
        """Speichere Upload-Historie"""
        with open('upload_history.json', 'w') as f:
            json.dump(self.uploaded_hashes, f, indent=4)
    
    def get_file_hash(self, filepath: str) -> str:
        """Erstelle Hash für Datei um Duplikate zu vermeiden"""
        hasher = hashlib.md5()
        with open(filepath, 'rb') as f:
            hasher.update(f.read())
        return hasher.hexdigest()
    
    def upload_to_behance(self, image_path: str, metadata: Dict) -> bool:
        """
        Upload zu Behance
        Dokumentation: https://www.behance.net/dev/api/endpoints/
        """
        if not self.config.get('behance', {}).get('enabled'):
            print("⏭️  Behance Upload übersprungen (nicht aktiviert)")
            return False
        
        print("📤 Uploading to Behance...")
        
        # Behance API Implementation
        api_key = self.config['behance']['api_key']
        
        # Note: Behance hat keine öffentliche Upload-API
        # Alternative: Webhook/Zapier Integration verwenden
        print("💡 Tipp: Verwende Behance's Web-Interface oder Zapier für Automation")
        
        return True
    
    def upload_to_instagram(self, image_path: str, metadata: Dict) -> bool:
        """
        Upload zu Instagram via Graph API
        Dokumentation: https://developers.facebook.com/docs/instagram-api
        """
        if not self.config.get('instagram', {}).get('enabled'):
            print("⏭️  Instagram Upload übersprungen")
            return False
        
        print("📤 Uploading to Instagram...")
        
        access_token = self.config['instagram']['access_token']
        user_id = self.config['instagram']['user_id']
        
        # Step 1: Create media container
        url = f"https://graph.facebook.com/v18.0/{user_id}/media"
        
        # Upload image to temporary hosting first
        image_url = self.upload_to_temp_hosting(image_path)
        
        params = {
            'image_url': image_url,
            'caption': metadata.get('description', ''),
            'access_token': access_token
        }
        
        try:
            response = requests.post(url, params=params)
            container_id = response.json().get('id')
            
            # Step 2: Publish
            publish_url = f"https://graph.facebook.com/v18.0/{user_id}/media_publish"
            publish_params = {
                'creation_id': container_id,
                'access_token': access_token
            }
            
            publish_response = requests.post(publish_url, params=publish_params)
            
            if publish_response.status_code == 200:
                print("✅ Instagram Upload erfolgreich!")
                return True
            else:
                print(f"❌ Instagram Fehler: {publish_response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Instagram Upload Fehler: {e}")
            return False
    
    def upload_to_pinterest(self, image_path: str, metadata: Dict) -> bool:
        """
        Upload zu Pinterest via API
        Dokumentation: https://developers.pinterest.com/docs/api/v5/
        """
        if not self.config.get('pinterest', {}).get('enabled'):
            print("⏭️  Pinterest Upload übersprungen")
            return False
        
        print("📤 Uploading to Pinterest...")
        
        access_token = self.config['pinterest']['access_token']
        board_id = self.config['pinterest']['board_id']
        
        url = "https://api.pinterest.com/v5/pins"
        
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        
        # Upload image
        image_url = self.upload_to_temp_hosting(image_path)
        
        data = {
            'board_id': board_id,
            'title': metadata.get('title', 'Portfolio Image'),
            'description': metadata.get('description', ''),
            'link': metadata.get('link', ''),
            'media_source': {
                'source_type': 'image_url',
                'url': image_url
            }
        }
        
        try:
            response = requests.post(url, headers=headers, json=data)
            if response.status_code == 201:
                print("✅ Pinterest Upload erfolgreich!")
                return True
            else:
                print(f"❌ Pinterest Fehler: {response.text}")
                return False
        except Exception as e:
            print(f"❌ Pinterest Upload Fehler: {e}")
            return False
    
    def upload_to_twitter(self, image_path: str, metadata: Dict) -> bool:
        """
        Upload zu Twitter/X via API
        Benötigt: tweepy Library
        """
        if not self.config.get('twitter', {}).get('enabled'):
            print("⏭️  Twitter Upload übersprungen")
            return False
        
        print("📤 Uploading to Twitter/X...")
        
        try:
            import tweepy
            
            auth = tweepy.OAuthHandler(
                self.config['twitter']['api_key'],
                self.config['twitter']['api_secret']
            )
            auth.set_access_token(
                self.config['twitter']['access_token'],
                self.config['twitter']['access_secret']
            )
            
            api = tweepy.API(auth)
            
            # Upload media
            media = api.media_upload(image_path)
            
            # Post tweet with media
            tweet_text = f"{metadata.get('title', '')}\n{metadata.get('description', '')}"
            api.update_status(status=tweet_text[:280], media_ids=[media.media_id])
            
            print("✅ Twitter Upload erfolgreich!")
            return True
            
        except ImportError:
            print("⚠️  tweepy nicht installiert. Installiere mit: pip install tweepy")
            return False
        except Exception as e:
            print(f"❌ Twitter Upload Fehler: {e}")
            return False
    
    def upload_to_linkedin(self, image_path: str, metadata: Dict) -> bool:
        """
        Upload zu LinkedIn via API
        Dokumentation: https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api
        """
        if not self.config.get('linkedin', {}).get('enabled'):
            print("⏭️  LinkedIn Upload übersprungen")
            return False
        
        print("📤 Uploading to LinkedIn...")
        
        access_token = self.config['linkedin']['access_token']
        person_id = self.config['linkedin']['person_id']
        
        # Step 1: Register upload
        register_url = "https://api.linkedin.com/v2/assets?action=registerUpload"
        
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        
        register_data = {
            "registerUploadRequest": {
                "recipes": ["urn:li:digitalmediaRecipe:feedshare-image"],
                "owner": f"urn:li:person:{person_id}",
                "serviceRelationships": [{
                    "relationshipType": "OWNER",
                    "identifier": "urn:li:userGeneratedContent"
                }]
            }
        }
        
        try:
            # Register
            response = requests.post(register_url, headers=headers, json=register_data)
            upload_url = response.json()['value']['uploadMechanism']['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest']['uploadUrl']
            asset = response.json()['value']['asset']
            
            # Upload binary
            with open(image_path, 'rb') as f:
                upload_response = requests.put(upload_url, data=f, headers={'Authorization': f'Bearer {access_token}'})
            
            # Create post
            post_url = "https://api.linkedin.com/v2/ugcPosts"
            post_data = {
                "author": f"urn:li:person:{person_id}",
                "lifecycleState": "PUBLISHED",
                "specificContent": {
                    "com.linkedin.ugc.ShareContent": {
                        "shareCommentary": {
                            "text": f"{metadata.get('title', '')}\n\n{metadata.get('description', '')}"
                        },
                        "shareMediaCategory": "IMAGE",
                        "media": [{
                            "status": "READY",
                            "media": asset
                        }]
                    }
                },
                "visibility": {
                    "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
                }
            }
            
            post_response = requests.post(post_url, headers=headers, json=post_data)
            
            if post_response.status_code == 201:
                print("✅ LinkedIn Upload erfolgreich!")
                return True
            else:
                print(f"❌ LinkedIn Fehler: {post_response.text}")
                return False
                
        except Exception as e:
            print(f"❌ LinkedIn Upload Fehler: {e}")
            return False
    
    def upload_to_temp_hosting(self, image_path: str) -> str:
        """
        Upload zu temporärem Image Hosting (z.B. Imgur)
        für Plattformen die URL statt Binary benötigen
        """
        # Imgur API als Beispiel
        client_id = "YOUR_IMGUR_CLIENT_ID"
        
        headers = {'Authorization': f'Client-ID {client_id}'}
        
        with open(image_path, 'rb') as f:
            response = requests.post(
                'https://api.imgur.com/3/image',
                headers=headers,
                files={'image': f}
            )
        
        if response.status_code == 200:
            return response.json()['data']['link']
        
        return ""
    
    def copy_to_local_portfolio(self, image_path: str, metadata: Dict) -> bool:
        """Kopiere Bild ins lokale Portfolio-Verzeichnis"""
        if not self.config.get('local_portfolio', {}).get('enabled'):
            return False
        
        output_dir = Path(self.config['local_portfolio']['output_dir'])
        output_dir.mkdir(parents=True, exist_ok=True)
        
        # Generate filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{timestamp}_{Path(image_path).name}"
        output_path = output_dir / filename
        
        # Copy file
        import shutil
        shutil.copy2(image_path, output_path)
        
        print(f"✅ Kopiert zu: {output_path}")
        
        # Update portfolio data
        self.update_portfolio_data(str(output_path), metadata)
        
        return True
    
    def update_portfolio_data(self, image_path: str, metadata: Dict):
        """Aktualisiere portfolio-data.js mit neuem Bild"""
        portfolio_data_file = Path('./js/portfolio-data.js')
        
        if not portfolio_data_file.exists():
            return
        
        # Lese existierende Daten
        with open(portfolio_data_file, 'r') as f:
            content = f.read()
        
        # Generiere neues Item
        new_item = f"""
    {{
        id: {len(content.split('id:'))},
        title: "{metadata.get('title', 'New Image')}",
        category: {json.dumps(metadata.get('categories', ['colors']))},
        image: "{image_path}",
        description: "{metadata.get('description', '')}",
        date: "{datetime.now().strftime('%Y-%m')}",
        gridRowSpan: 30
    }},"""
        
        # Füge vor dem letzten Item ein
        insert_pos = content.rfind('};')
        if insert_pos != -1:
            content = content[:insert_pos] + new_item + content[insert_pos:]
            
            with open(portfolio_data_file, 'w') as f:
                f.write(content)
    
    def process_image(self, image_path: str, metadata: Optional[Dict] = None):
        """
        Hauptfunktion: Verarbeite ein Bild und lade es zu allen Plattformen hoch
        
        Args:
            image_path: Pfad zum Bild
            metadata: Dictionary mit title, description, categories, etc.
        """
        if metadata is None:
            metadata = {}
        
        # Check if already uploaded
        file_hash = self.get_file_hash(image_path)
        if file_hash in self.uploaded_hashes:
            print(f"⏭️  Bild bereits hochgeladen: {image_path}")
            return
        
        print(f"\n{'='*60}")
        print(f"🚀 Verarbeite: {image_path}")
        print(f"{'='*60}\n")
        
        results = {
            'local': self.copy_to_local_portfolio(image_path, metadata),
            'behance': self.upload_to_behance(image_path, metadata),
            'instagram': self.upload_to_instagram(image_path, metadata),
            'pinterest': self.upload_to_pinterest(image_path, metadata),
            'twitter': self.upload_to_twitter(image_path, metadata),
            'linkedin': self.upload_to_linkedin(image_path, metadata)
        }
        
        # Save to history
        self.uploaded_hashes[file_hash] = {
            'filename': os.path.basename(image_path),
            'upload_date': datetime.now().isoformat(),
            'results': results,
            'metadata': metadata
        }
        
        self.save_upload_history()
        
        print(f"\n{'='*60}")
        print("📊 Upload Zusammenfassung:")
        for platform, success in results.items():
            status = "✅" if success else "❌"
            print(f"  {status} {platform.capitalize()}")
        print(f"{'='*60}\n")
    
    def batch_upload(self, directory: str, pattern: str = "*.jpg"):
        """Batch-Upload aller Bilder aus einem Verzeichnis"""
        image_dir = Path(directory)
        images = list(image_dir.glob(pattern))
        
        print(f"📁 Gefunden: {len(images)} Bilder")
        
        for image in images:
            # Extrahiere Metadaten aus Dateinamen oder EXIF
            metadata = self.extract_metadata(image)
            self.process_image(str(image), metadata)
    
    def extract_metadata(self, image_path: Path) -> Dict:
        """Extrahiere Metadaten aus Datei"""
        # Basic metadata from filename
        name = image_path.stem
        
        metadata = {
            'title': name.replace('_', ' ').replace('-', ' ').title(),
            'description': f'Portfolio image: {name}',
            'categories': ['colors'],  # Standard-Kategorie
        }
        
        # TODO: EXIF-Daten auslesen für bessere Metadaten
        
        return metadata


def main():
    """Hauptprogramm"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Portfolio Cross-Posting Tool')
    parser.add_argument('image', nargs='?', help='Pfad zum Bild')
    parser.add_argument('--batch', help='Batch-Upload aus Verzeichnis')
    parser.add_argument('--title', help='Bild-Titel')
    parser.add_argument('--description', help='Beschreibung')
    parser.add_argument('--categories', nargs='+', help='Kategorien')
    
    args = parser.parse_args()
    
    poster = PortfolioCrossPoster()
    
    if args.batch:
        poster.batch_upload(args.batch)
    elif args.image:
        metadata = {
            'title': args.title or Path(args.image).stem,
            'description': args.description or '',
            'categories': args.categories or ['colors']
        }
        poster.process_image(args.image, metadata)
    else:
        print("❌ Bitte Bild oder --batch Verzeichnis angeben")
        parser.print_help()


if __name__ == '__main__':
    main()
