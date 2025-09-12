import json
import os
import re

def update_json_translations():
    """JSON çeviri dosyalarını güncelle"""
    
    # Yeni çevirileri yükle
    with open('saygiyla-translations.json', 'r', encoding='utf-8') as f:
        new_translations = json.load(f)
    
    # Mevcut en.json dosyasını güncelle
    en_path = 'src/assets/i18n/en.json'
    with open(en_path, 'r', encoding='utf-8') as f:
        en_data = json.load(f)
    
    # SAYGIYLA.PIONEERS bölümünü güncelle
    if 'SAYGIYLA' not in en_data:
        en_data['SAYGIYLA'] = {}
    
    if 'PIONEERS' not in en_data['SAYGIYLA']:
        en_data['SAYGIYLA']['PIONEERS'] = {}
    
    # Yeni çevirileri ekle
    en_data['SAYGIYLA']['PIONEERS'].update(new_translations['en']['SAYGIYLA']['PIONEERS'])
    
    # Dosyayı kaydet
    with open(en_path, 'w', encoding='utf-8') as f:
        json.dump(en_data, f, ensure_ascii=False, indent=2)
    
    print(f"[OK] {en_path} guncellendi")
    
    # Mevcut tr.json dosyasını güncelle
    tr_path = 'src/assets/i18n/tr.json'
    with open(tr_path, 'r', encoding='utf-8') as f:
        tr_data = json.load(f)
    
    if 'SAYGIYLA' not in tr_data:
        tr_data['SAYGIYLA'] = {}
    
    if 'PIONEERS' not in tr_data['SAYGIYLA']:
        tr_data['SAYGIYLA']['PIONEERS'] = {}
    
    # Türkçe çevirileri ekle
    tr_data['SAYGIYLA']['PIONEERS'].update(new_translations['tr']['SAYGIYLA']['PIONEERS'])
    
    with open(tr_path, 'w', encoding='utf-8') as f:
        json.dump(tr_data, f, ensure_ascii=False, indent=2)
    
    print(f"[OK] {tr_path} guncellendi")

def create_html_update_script():
    """HTML dosyalarını güncellemek için script oluştur"""
    
    updates = [
        {
            'file': 'jonas-salk',
            'replacements': [
                ('Dr. Jonas Salk', "{{ 'SAYGIYLA.PIONEERS.JONAS_SALK.NAME' | translate }}"),
                ('Güneşi Patentlemeyen Adam', "{{ 'SAYGIYLA.PIONEERS.JONAS_SALK.SUBTITLE' | translate }}"),
                ('1914 - 1995', "{{ 'SAYGIYLA.PIONEERS.JONAS_SALK.LIFESPAN' | translate }}"),
                ('Ana Sayfa', "{{ 'SAYGIYLA.PIONEERS.JONAS_SALK.BREADCRUMB_HOME' | translate }}"),
                ('Saygıyla', "{{ 'SAYGIYLA.PIONEERS.JONAS_SALK.BREADCRUMB_SAYGIYLA' | translate }}"),
                ('Güneşi patentleyebilir misiniz?', "{{ 'SAYGIYLA.PIONEERS.JONAS_SALK.QUOTE_PATENT' | translate }}"),
                ('Yaşam Öyküsü', "{{ 'SAYGIYLA.PIONEERS.JONAS_SALK.SECTION_BIOGRAPHY' | translate }}"),
            ]
        },
        {
            'file': 'louis-pasteur',
            'replacements': [
                ('Louis Pasteur', "{{ 'SAYGIYLA.PIONEERS.LOUIS_PASTEUR.NAME' | translate }}"),
                ('Mikrobiyolojinin Babası', "{{ 'SAYGIYLA.PIONEERS.LOUIS_PASTEUR.SUBTITLE' | translate }}"),
                ('1822 - 1895', "{{ 'SAYGIYLA.PIONEERS.LOUIS_PASTEUR.LIFESPAN' | translate }}"),
            ]
        },
        {
            'file': 'virginia-apgar',
            'replacements': [
                ('Dr. Virginia Apgar', "{{ 'SAYGIYLA.PIONEERS.VIRGINIA_APGAR.NAME' | translate }}"),
                ('Yenidoğanların Kurtarıcısı', "{{ 'SAYGIYLA.PIONEERS.VIRGINIA_APGAR.SUBTITLE' | translate }}"),
                ('1909 - 1974', "{{ 'SAYGIYLA.PIONEERS.VIRGINIA_APGAR.LIFESPAN' | translate }}"),
            ]
        },
        {
            'file': 'ihsan-dogramaci',
            'replacements': [
                ('Prof. Dr. İhsan Doğramacı', "{{ 'SAYGIYLA.PIONEERS.IHSAN_DOGRAMACI.NAME' | translate }}"),
                ('Modern Tıbbın Türkiye\'deki Öncüsü', "{{ 'SAYGIYLA.PIONEERS.IHSAN_DOGRAMACI.SUBTITLE' | translate }}"),
                ('1915 - 2010', "{{ 'SAYGIYLA.PIONEERS.IHSAN_DOGRAMACI.LIFESPAN' | translate }}"),
            ]
        },
        {
            'file': 'turkan-saylan',
            'replacements': [
                ('Prof. Dr. Türkan Saylan', "{{ 'SAYGIYLA.PIONEERS.TURKAN_SAYLAN.NAME' | translate }}"),
                ('Halk Sağlığı ve Eğitimin Savunucusu', "{{ 'SAYGIYLA.PIONEERS.TURKAN_SAYLAN.SUBTITLE' | translate }}"),
                ('1935 - 2009', "{{ 'SAYGIYLA.PIONEERS.TURKAN_SAYLAN.LIFESPAN' | translate }}"),
            ]
        },
        {
            'file': 'malala-yousafzai',
            'replacements': [
                ('Malala Yousafzai', "{{ 'SAYGIYLA.PIONEERS.MALALA_YOUSAFZAI.NAME' | translate }}"),
                ('Eğitimin Sesi', "{{ 'SAYGIYLA.PIONEERS.MALALA_YOUSAFZAI.SUBTITLE' | translate }}"),
                ('1997 - Günümüz', "{{ 'SAYGIYLA.PIONEERS.MALALA_YOUSAFZAI.LIFESPAN' | translate }}"),
            ]
        },
        {
            'file': 'ursula-leguin',
            'replacements': [
                ('Ursula K. Le Guin', "{{ 'SAYGIYLA.PIONEERS.URSULA_LEGUIN.NAME' | translate }}"),
                ('Vizyoner Yazar ve Düşünür', "{{ 'SAYGIYLA.PIONEERS.URSULA_LEGUIN.SUBTITLE' | translate }}"),
                ('1929 - 2018', "{{ 'SAYGIYLA.PIONEERS.URSULA_LEGUIN.LIFESPAN' | translate }}"),
            ]
        }
    ]
    
    print("\nHTML Guncelleme Komutlari:")
    print("=" * 60)
    
    for update in updates:
        file_path = f"src/app/pages/saygiyla/{update['file']}/{update['file']}.component.html"
        print(f"\n[FILE] {update['file']}.component.html icin:")
        print(f"   Dosya: {file_path}")
        print(f"   {len(update['replacements'])} degisiklik yapilacak")
    
    return updates

def main():
    print("Saygiyla Bolumu Ceviri Guncellemesi Basliyor...")
    print("=" * 60)
    
    # JSON dosyalarını güncelle
    print("\n1. JSON Dosyalari Guncelleniyor...")
    update_json_translations()
    
    # HTML güncelleme scriptini oluştur
    print("\n2. HTML Dosya Guncellemeleri Hazirlaniyor...")
    html_updates = create_html_update_script()
    
    print("\n" + "=" * 60)
    print("Islem Tamamlandi!")
    print("\nSonraki adimlar:")
    print("1. HTML dosyalarini manuel olarak guncelleyin")
    print("2. npm run start ile uygulamayi baslatin")
    print("3. Cevirileri test edin")

if __name__ == "__main__":
    main()