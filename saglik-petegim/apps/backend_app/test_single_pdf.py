"""
Test ingestion with a single PDF
"""
import os
from pathlib import Path
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone

# Load environment variables
load_dotenv()

# Initialize
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index_name = "saglik-petegim-rag"

print("Initializing embeddings...")
embeddings = GoogleGenerativeAIEmbeddings(
    model="models/text-embedding-004",
    google_api_key=os.getenv("GEMINI_API_KEY")
)

# Test with one PDF
pdf_path = "D:/GitHub Repos/Saglik-Petegim/assets/Chatbot/Parenting AAP/ADHD What Every Parent Needs to Know.pdf"
print(f"Loading PDF: {pdf_path}")

# Load PDF
loader = PyPDFLoader(pdf_path)
documents = loader.load()
print(f"Loaded {len(documents)} pages")

# Take only first 5 pages for testing
documents = documents[:5]

# Split into chunks
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=150
)
chunks = text_splitter.split_documents(documents)
print(f"Created {len(chunks)} chunks")

# Add metadata
for chunk in chunks:
    chunk.metadata['source_file'] = 'ADHD What Every Parent Needs to Know.pdf'
    chunk.metadata['category'] = 'Parenting AAP'

print("Storing in Pinecone...")
vectorstore = PineconeVectorStore.from_documents(
    documents=chunks,
    embedding=embeddings,
    index_name=index_name
)

print("Done! Checking index...")
index = pc.Index(index_name)
stats = index.describe_index_stats()
print(f"Total vectors: {stats.total_vector_count}")