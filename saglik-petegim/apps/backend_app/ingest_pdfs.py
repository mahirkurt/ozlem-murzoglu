"""
PDF Ingestion Script for Pinecone
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from pinecone import Pinecone
import uuid
import time

# Load environment variables
load_dotenv()

# Initialize
print("Initializing Pinecone and embeddings...")
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("saglik-petegim-rag")

embeddings = GoogleGenerativeAIEmbeddings(
    model="models/text-embedding-004",
    google_api_key=os.getenv("GEMINI_API_KEY")
)

# Get initial stats
stats = index.describe_index_stats()
print(f"Starting vectors in index: {stats.total_vector_count}")

# PDF directory
pdf_dir = Path("D:/GitHub Repos/Saglik-Petegim/assets/Chatbot")
pdf_files = list(pdf_dir.glob("**/*.pdf"))
print(f"Found {len(pdf_files)} PDF files to process\n")

# Process each PDF
total_chunks_processed = 0

for i, pdf_file in enumerate(pdf_files, 1):
    print(f"[{i}/{len(pdf_files)}] Processing: {pdf_file.name}")
    
    try:
        # Load PDF
        loader = PyPDFLoader(str(pdf_file))
        documents = loader.load()
        print(f"  - Loaded {len(documents)} pages")
        
        # Split into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=150,
            length_function=len
        )
        chunks = text_splitter.split_documents(documents)
        print(f"  - Created {len(chunks)} chunks")
        
        # Prepare vectors for upload
        vectors = []
        batch_size = 50  # Process in smaller batches
        
        for j, chunk in enumerate(chunks):
            # Create unique ID
            chunk_id = f"{pdf_file.stem}_{j}_{uuid.uuid4().hex[:8]}"
            
            # Get embedding
            try:
                embedding = embeddings.embed_query(chunk.page_content)
                
                # Prepare vector
                vectors.append({
                    "id": chunk_id,
                    "values": embedding,
                    "metadata": {
                        "text": chunk.page_content[:1000],  # Limit metadata size
                        "source": pdf_file.name,
                        "category": pdf_file.parent.name,
                        "page": chunk.metadata.get('page', 0)
                    }
                })
                
                # Upload in batches
                if len(vectors) >= batch_size:
                    response = index.upsert(vectors=vectors)
                    print(f"  - Uploaded batch: {response['upserted_count']} vectors")
                    vectors = []
                    time.sleep(1)  # Rate limiting
                    
            except Exception as e:
                print(f"  - Error embedding chunk {j}: {e}")
                continue
        
        # Upload remaining vectors
        if vectors:
            response = index.upsert(vectors=vectors)
            print(f"  - Uploaded final batch: {response['upserted_count']} vectors")
        
        total_chunks_processed += len(chunks)
        print(f"  ✓ Completed {pdf_file.name}")
        time.sleep(2)  # Pause between files
        
    except Exception as e:
        print(f"  ✗ Error processing {pdf_file.name}: {e}")
        continue

# Final stats
print("\n" + "="*50)
print("Ingestion complete!")
time.sleep(5)  # Wait for index to update
stats = index.describe_index_stats()
print(f"Total vectors in index: {stats.total_vector_count}")
print(f"Total chunks processed: {total_chunks_processed}")