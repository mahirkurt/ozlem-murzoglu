"""
Quick ingestion of first 3 PDFs for testing
"""
import os
from pathlib import Path
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from pinecone import Pinecone
import uuid

# Load environment variables
load_dotenv()

# Initialize
print("Initializing...")
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("saglik-petegim-rag")

embeddings = GoogleGenerativeAIEmbeddings(
    model="models/text-embedding-004",
    google_api_key=os.getenv("GEMINI_API_KEY")
)

# Get 3 PDFs for quick testing
pdf_dir = Path("D:/GitHub Repos/Saglik-Petegim/assets/Chatbot")
pdf_files = list(pdf_dir.glob("**/*.pdf"))[:3]  # Only first 3 PDFs

print(f"Processing {len(pdf_files)} PDFs for quick test:\n")

for pdf_file in pdf_files:
    print(f"Processing: {pdf_file.name}")
    
    try:
        # Load PDF (only first 10 pages for speed)
        loader = PyPDFLoader(str(pdf_file))
        documents = loader.load()[:10]
        print(f"  - Using first {len(documents)} pages")
        
        # Split into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=800,
            chunk_overlap=100
        )
        chunks = text_splitter.split_documents(documents)
        print(f"  - Created {len(chunks)} chunks")
        
        # Upload to Pinecone
        vectors = []
        for i, chunk in enumerate(chunks):
            chunk_id = f"{pdf_file.stem[:20]}_{i}_{uuid.uuid4().hex[:6]}"
            embedding = embeddings.embed_query(chunk.page_content)
            
            vectors.append({
                "id": chunk_id,
                "values": embedding,
                "metadata": {
                    "text": chunk.page_content[:500],
                    "source": pdf_file.name,
                    "category": pdf_file.parent.name
                }
            })
        
        # Upload all vectors for this PDF
        if vectors:
            response = index.upsert(vectors=vectors)
            print(f"  - Uploaded {response['upserted_count']} vectors")
        
        print(f"  ✓ Completed\n")
        
    except Exception as e:
        print(f"  ✗ Error: {e}\n")

# Final check
import time
time.sleep(3)
stats = index.describe_index_stats()
print(f"Total vectors in index: {stats.total_vector_count}")