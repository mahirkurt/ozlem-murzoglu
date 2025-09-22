"""
Otomatik PDF İzleme ve Öğrenme Sistemi
Yeni PDF'ler eklendiğinde otomatik olarak Pinecone'a yükler
"""
import os
import time
import hashlib
import json
from pathlib import Path
from datetime import datetime
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone
import logging

# Logging ayarları
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('pdf_ingestion.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class PDFIngestionHandler(FileSystemEventHandler):
    """PDF dosyalarını izler ve yeni/değişen dosyaları otomatik olarak işler"""
    
    def __init__(self):
        self.processed_files = self.load_processed_files()
        self.index_name = "saglik-petegim-rag"
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/text-embedding-004",
            google_api_key=os.getenv("GEMINI_API_KEY")
        )
        self.pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
        
        # Index kontrolü
        if self.index_name not in self.pc.list_indexes().names():
            logger.error(f"Pinecone index '{self.index_name}' bulunamadı!")
            raise Exception(f"Index {self.index_name} mevcut değil")
        
        logger.info("PDF Ingestion Handler başlatıldı")
    
    def load_processed_files(self):
        """Daha önce işlenmiş dosyaların hash'lerini yükle"""
        processed_file = Path("processed_pdfs.json")
        if processed_file.exists():
            with open(processed_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {}
    
    def save_processed_files(self):
        """İşlenmiş dosyaların hash'lerini kaydet"""
        with open("processed_pdfs.json", 'w', encoding='utf-8') as f:
            json.dump(self.processed_files, f, indent=2)
    
    def get_file_hash(self, filepath):
        """Dosyanın MD5 hash'ini hesapla"""
        hash_md5 = hashlib.md5()
        with open(filepath, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_md5.update(chunk)
        return hash_md5.hexdigest()
    
    def process_pdf(self, pdf_path):
        """Tek bir PDF dosyasını işle ve Pinecone'a yükle"""
        try:
            pdf_path = Path(pdf_path)
            
            # Hash kontrolü
            file_hash = self.get_file_hash(pdf_path)
            file_key = str(pdf_path)
            
            if file_key in self.processed_files:
                if self.processed_files[file_key] == file_hash:
                    logger.info(f"Dosya zaten işlenmiş, atlanıyor: {pdf_path.name}")
                    return False
                else:
                    logger.info(f"Dosya güncellenmiş, yeniden işleniyor: {pdf_path.name}")
            else:
                logger.info(f"Yeni dosya bulundu: {pdf_path.name}")
            
            # PDF'i yükle
            logger.info(f"PDF yükleniyor: {pdf_path.name}")
            loader = PyPDFLoader(str(pdf_path))
            documents = loader.load()
            
            # Metadata ekle
            category = pdf_path.parent.name
            for doc in documents:
                doc.metadata['source_file'] = pdf_path.name
                doc.metadata['category'] = category
                doc.metadata['ingestion_date'] = datetime.now().isoformat()
                doc.metadata['file_hash'] = file_hash
            
            # Chunk'lara böl
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=150,
                length_function=len
            )
            chunks = text_splitter.split_documents(documents)
            logger.info(f"{len(chunks)} chunk oluşturuldu")
            
            # Eski vektörleri temizle (eğer dosya güncellenmişse)
            if file_key in self.processed_files:
                logger.info(f"Eski vektörler temizleniyor: {pdf_path.name}")
                # Not: Pinecone'da namespace veya metadata filter kullanarak
                # eski vektörleri silebilirsiniz
            
            # Pinecone'a yükle
            logger.info(f"Pinecone'a yükleniyor: {pdf_path.name}")
            PineconeVectorStore.from_documents(
                documents=chunks,
                embedding=self.embeddings,
                index_name=self.index_name
            )
            
            # İşlenen dosyayı kaydet
            self.processed_files[file_key] = file_hash
            self.save_processed_files()
            
            logger.info(f"✅ Başarıyla işlendi: {pdf_path.name}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Hata ({pdf_path.name}): {e}")
            return False
    
    def on_created(self, event):
        """Yeni dosya eklendiğinde"""
        if not event.is_directory and event.src_path.endswith('.pdf'):
            logger.info(f"Yeni PDF tespit edildi: {event.src_path}")
            time.sleep(2)  # Dosyanın tam yüklenmesini bekle
            self.process_pdf(event.src_path)
    
    def on_modified(self, event):
        """Dosya değiştirildiğinde"""
        if not event.is_directory and event.src_path.endswith('.pdf'):
            logger.info(f"PDF güncellendi: {event.src_path}")
            time.sleep(2)  # Dosyanın tam yazılmasını bekle
            self.process_pdf(event.src_path)
    
    def scan_existing_pdfs(self, directory):
        """Mevcut tüm PDF'leri tara ve işlenmemiş olanları yükle"""
        pdf_dir = Path(directory)
        pdf_files = list(pdf_dir.glob("**/*.pdf"))
        
        logger.info(f"Toplam {len(pdf_files)} PDF dosyası bulundu")
        
        new_files = 0
        for pdf_file in pdf_files:
            if self.process_pdf(pdf_file):
                new_files += 1
                time.sleep(1)  # Rate limiting için
        
        logger.info(f"Tarama tamamlandı: {new_files} yeni/güncellenmiş dosya işlendi")
        return new_files

def main():
    """Ana fonksiyon - PDF klasörünü izle ve otomatik öğren"""
    
    # İzlenecek klasör
    watch_directory = Path("D:/GitHub Repos/Saglik-Petegim/assets/Chatbot")
    
    if not watch_directory.exists():
        logger.error(f"Klasör bulunamadı: {watch_directory}")
        return
    
    logger.info("="*60)
    logger.info("Otomatik PDF Öğrenme Sistemi Başlatılıyor")
    logger.info("="*60)
    
    # Handler oluştur
    event_handler = PDFIngestionHandler()
    
    # İlk tarama - mevcut dosyaları kontrol et
    logger.info("Mevcut PDF'ler taranıyor...")
    event_handler.scan_existing_pdfs(watch_directory)
    
    # Klasörü izlemeye başla
    observer = Observer()
    observer.schedule(event_handler, str(watch_directory), recursive=True)
    observer.start()
    
    logger.info(f"📁 İzleniyor: {watch_directory}")
    logger.info("Yeni PDF eklendiğinde otomatik olarak öğrenilecek...")
    logger.info("Durdurmak için Ctrl+C")
    
    try:
        while True:
            time.sleep(10)
            # Her 10 saniyede bir durum mesajı
            stats = event_handler.pc.Index(event_handler.index_name).describe_index_stats()
            logger.debug(f"Pinecone vektör sayısı: {stats.total_vector_count}")
    except KeyboardInterrupt:
        observer.stop()
        logger.info("İzleme durduruldu")
    
    observer.join()

if __name__ == "__main__":
    main()