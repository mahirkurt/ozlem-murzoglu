"""
PDF Document Ingestion Script for RAG System
This script loads PDF documents, splits them into chunks, and stores them in Pinecone vector database.
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone, ServerlessSpec
import time

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

def initialize_pinecone():
    """Initialize Pinecone client and create index if it doesn't exist."""
    load_dotenv()
    
    # Initialize Pinecone
    pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
    
    index_name = "saglik-petegim-rag"
    
    # Check if index exists, if not create it
    if index_name not in pc.list_indexes().names():
        print(f"Creating new Pinecone index: {index_name}")
        pc.create_index(
            name=index_name,
            dimension=768,  # Google text-embedding-004 dimension
            metric='cosine',
            spec=ServerlessSpec(
                cloud='aws',
                region=os.getenv("PINECONE_ENVIRONMENT", "us-east-1")
            )
        )
        # Wait for index to be ready
        time.sleep(10)
    else:
        print(f"Using existing Pinecone index: {index_name}")
    
    return index_name

def load_documents_from_directory(directory_path):
    """Load all PDF documents from the specified directory."""
    print(f"Loading documents from: {directory_path}")
    
    # Check if directory exists
    if not os.path.exists(directory_path):
        raise ValueError(f"Directory not found: {directory_path}")
    
    # Create a list to hold all documents
    all_documents = []
    
    # Walk through all subdirectories
    for root, dirs, files in os.walk(directory_path):
        pdf_files = [f for f in files if f.endswith('.pdf')]
        if pdf_files:
            print(f"Found {len(pdf_files)} PDF files in {root}")
            for pdf_file in pdf_files:
                file_path = os.path.join(root, pdf_file)
                print(f"  Loading: {pdf_file}")
                try:
                    loader = PyPDFLoader(file_path)
                    documents = loader.load()
                    
                    # Add metadata to each document
                    folder_name = os.path.basename(root)
                    for doc in documents:
                        doc.metadata['source_file'] = pdf_file
                        doc.metadata['category'] = folder_name
                        # Determine if it's for doctors or parents
                        if 'AAP for Doctors' in root:
                            doc.metadata['audience'] = 'doctors'
                        elif 'Parenting AAP' in root:
                            doc.metadata['audience'] = 'parents'
                        else:
                            doc.metadata['audience'] = 'general'
                    
                    all_documents.extend(documents)
                except Exception as e:
                    print(f"  Error loading {pdf_file}: {e}")
    
    return all_documents

def split_documents(documents):
    """Split documents into smaller chunks for better retrieval."""
    print(f"Splitting {len(documents)} documents into chunks...")
    
    # Create text splitter with Turkish language considerations
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1200,
        chunk_overlap=200,
        length_function=len,
        separators=["\n\n", "\n", ".", "!", "?", ",", " ", ""],
        is_separator_regex=False
    )
    
    chunks = text_splitter.split_documents(documents)
    print(f"Created {len(chunks)} document chunks")
    
    return chunks

def create_embeddings_and_store(chunks, index_name):
    """Create embeddings and store in Pinecone."""
    print("Creating embeddings and storing in Pinecone...")
    
    # Initialize embeddings model
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/text-embedding-004",
        google_api_key=os.getenv("GEMINI_API_KEY")
    )
    
    # Store in Pinecone
    print(f"Storing {len(chunks)} chunks in Pinecone index '{index_name}'...")
    
    # Split chunks into batches to avoid rate limits
    batch_size = 100
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i+batch_size]
        print(f"Processing batch {i//batch_size + 1}/{(len(chunks)-1)//batch_size + 1}")
        
        try:
            PineconeVectorStore.from_documents(
                documents=batch,
                embedding=embeddings,
                index_name=index_name
            )
            # Small delay to avoid rate limits
            time.sleep(1)
        except Exception as e:
            print(f"Error processing batch: {e}")
            continue
    
    print("Successfully stored all document chunks in Pinecone!")

def main():
    """Main function to orchestrate the document ingestion process."""
    try:
        # Load environment variables
        load_dotenv()
        
        # Initialize Pinecone and get index name
        index_name = initialize_pinecone()
        
        # Define the path to PDF documents
        # Using the assets/Chatbot directory
        base_path = Path("D:/GitHub Repos/Saglik-Petegim/assets/Chatbot")
        
        if not base_path.exists():
            print(f"Error: Directory not found: {base_path}")
            print("Please ensure the assets/Chatbot directory exists with PDF files.")
            return
        
        # Load documents
        documents = load_documents_from_directory(str(base_path))
        
        if not documents:
            print("No documents found to process.")
            return
        
        print(f"Loaded {len(documents)} document pages total")
        
        # Split documents into chunks
        chunks = split_documents(documents)
        
        # Create embeddings and store in Pinecone
        create_embeddings_and_store(chunks, index_name)
        
        print("\n✅ Document ingestion completed successfully!")
        print(f"Total documents processed: {len(documents)} pages")
        print(f"Total chunks created: {len(chunks)}")
        print(f"Index name: {index_name}")
        
    except Exception as e:
        print(f"❌ Error during document ingestion: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()