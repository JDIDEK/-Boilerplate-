#!/usr/bin/env python3
"""
Script pour réparer le site capturé avec HTTrack.
Remplace les URLs absolues par des chemins relatifs.
"""
import os
import re
from pathlib import Path

def fix_html_file(filepath):
    """Corrige un fichier HTML en remplaçant les URLs absolues."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_size = len(content)
        
        # Pattern 1: home_url:"https:\/\/jasminegunarto.com" (avec slashes échappés)
        content = re.sub(
            r'home_url:"https:\\/\\/jasminegunarto\.com"',
            'home_url:"/"',
            content
        )
        
        # Pattern 2: https://jasminegunarto.com/ (normal)
        content = re.sub(
            r'https://jasminegunarto\.com/',
            '',
            content
        )
        
        # Pattern 3: ajax_url:"https:\/\/jasminegunarto\.com\/wp-admin
        content = re.sub(
            r'ajax_url:"https:\\/\\/jasminegunarto\.com\\/wp-admin',
            'ajax_url":"wp-admin',
            content
        )
        
        # Pattern 4: rest_url:"https:\/\/jasminegunarto\.com\/wp-json
        content = re.sub(
            r'rest_url:"https:\\/\\/jasminegunarto\.com\\/wp-json',
            'rest_url":"wp-json',
            content
        )
        
        # Pattern 5: permalink:"https:\/\/jasminegunarto.com\/"
        content = re.sub(
            r'permalink":"https:\\/\\/jasminegunarto\.com\\/"',
            'permalink":"/"',
            content
        )
        
        # Pattern 6: Supprimer les préconnexions Google Fonts
        content = re.sub(
            r'<link rel="preconnect" href="https://fonts\.googleapis\.com/"><link rel="preconnect" href="https://fonts\.gstatic\.com/" crossorigin>',
            '',
            content
        )
        
        # Pattern 7: Remove oEmbed links
        content = re.sub(
            r'<link rel="alternate" title="oEmbed \((?:JSON|XML)\)" [^>]*href="wp-json/oembed/[^>]*url=https%3A%2F%2Fjasminegunarto\.com[^>]*" />',
            '',
            content
        )
        
        # Pattern 8: Ajouter un CSS pour masquer le preloader en cas de problème
        # Cherche le <style data-css-global type="text/css">:root{ et ajoute une règle
        if '.preloader' not in content and '<style data-css-global' in content:
            # Ajouter un style pour masquer le preloader après 5 secondes
            css_fix = '</style><style>@media screen { .preloader { display: none !important; pointer-events: none !important; } }</style><style data-css-global'
            content = content.replace('<style data-css-global', css_fix, 1)
        
        new_size = len(content)
        
        if new_size != original_size:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True, original_size, new_size
        return False, original_size, new_size
    
    except Exception as e:
        return None, str(e), None

def main():
    base_path = Path(r'c:\Users\josselin.didek\Documents\test\Boilerplate\boilerplate\target\site')
    
    if not base_path.exists():
        print(f"❌ Chemin introuvable: {base_path}")
        return
    
    print(f"🔧 Réparation du site dans: {base_path}")
    print("=" * 60)
    
    # Traiter tous les fichiers HTML
    html_files = list(base_path.rglob('*.html'))
    print(f"📄 {len(html_files)} fichiers HTML trouvés")
    
    fixed_count = 0
    for html_file in html_files:
        relative_path = html_file.relative_to(base_path)
        result, original_size, new_size = fix_html_file(html_file)
        
        if result is None:
            print(f"  ⚠️  {relative_path}: Erreur - {original_size}")
        elif result:
            print(f"  ✅ {relative_path}")
            print(f"     └─ {original_size:,} → {new_size:,} bytes")
            fixed_count += 1
    
    print("=" * 60)
    print(f"✨ {fixed_count} fichiers réparés")
    print("\n🚀 Vous pouvez maintenant lancer:")
    print(f"   cd {base_path}")
    print("   python -m http.server 8000")
    print("\nPuis accédez à: http://localhost:8000/jasminegunarto.com/")

if __name__ == '__main__':
    main()
