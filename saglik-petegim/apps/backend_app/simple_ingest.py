"""
Simple PDF ingestion script for Pinecone
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone
import time

# Load environment variables
load_dotenv()

# Initialize Pinecone
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index_name = "saglik-petegim-rag"

# Check if index exists
if index_name in pc.list_indexes().names():
    print(f"Using existing index: {index_name}")
    index = pc.Index(index_name)
    stats = index.describe_index_stats()
    print(f"Current vectors in index: {stats.total_vector_count}")
else:
    print(f"Index {index_name} not found!")
    sys.exit(1)

# Initialize embeddings
print("Initializing Google embeddings...")
embeddings = GoogleGenerativeAIEmbeddings(
    model="models/text-embedding-004",
    google_api_key=os.getenv("GEMINI_API_KEY")
)

# PDF directory
pdf_dir = Path("D:/GitHub Repos/Saglik-Petegim/assets/Chatbot")

# Get all PDF files
pdf_files = list(pdf_dir.glob("**/*.pdf"))
print(f"Found {len(pdf_files)} PDF files")

# Process each PDF file one by one
for i, pdf_file in enumerate(pdf_files, 1):
    print(f"\n[{i}/{len(pdf_files)}] Processing: {pdf_file.name}")
    
    try:
        # Load PDF
        loader = PyPDFLoader(str(pdf_file))
        documents = loader.load()
        print(f"  Loaded {len(documents)} pages")
        
        # Add metadata
        for doc in documents:
            doc.metadata['source_file'] = pdf_file.name
            doc.metadata['category'] = pdf_file.parent.name
        
        # Split into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=150,
            length_function=len
        )
        chunks = text_splitter.split_documents(documents)
        print(f"  Created {len(chunks)} chunks")
        
        # Store in Pinecone
        print(f"  Storing in Pinecone...")
        PineconeVectorStore.from_documents(
            documents=chunks,
            embedding=embeddings,
            index_name=index_name
        )
        
        print(f"  ✓ Successfully processed {pdf_file.name}")
        
        # Small delay to avoid rate limits
        time.sleep(2)
        
    except Exception as e:
        print(f"  ✗ Error processing {pdf_file.name}: {e}")
        continue

# Final stats
print("\n" + "="*50)
print("Ingestion complete!")
index = pc.Index(index_name)
stats = index.describe_index_stats()
print(f"Total vectors in index: {stats.total_vector_count}")