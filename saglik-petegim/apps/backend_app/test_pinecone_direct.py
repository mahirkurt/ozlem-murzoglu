"""
Test direct Pinecone upload
"""
import os
from dotenv import load_dotenv
from pinecone import Pinecone
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import uuid

# Load environment variables
load_dotenv()

# Initialize
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("saglik-petegim-rag")

print("Creating embeddings...")
embeddings = GoogleGenerativeAIEmbeddings(
    model="models/text-embedding-004",
    google_api_key=os.getenv("GEMINI_API_KEY")
)

# Create test text
test_texts = [
    "DEHB (Dikkat Eksikliği ve Hiperaktivite Bozukluğu) çocuklarda sık görülen bir nörogelişimsel bozukluktur.",
    "Bebek ateşi 38 derecenin üzerinde ise doktora başvurulmalıdır.",
    "6 aylık bebekler ek gıdaya başlayabilir. Püre haline getirilmiş sebze ve meyveler verilebilir."
]

# Create embeddings
print("Generating embeddings...")
vectors = []
for i, text in enumerate(test_texts):
    embedding = embeddings.embed_query(text)
    vectors.append({
        "id": f"test_{i}",
        "values": embedding,
        "metadata": {"text": text}
    })

# Upsert to Pinecone
print("Upserting to Pinecone...")
response = index.upsert(vectors=vectors)
print(f"Upserted count: {response['upserted_count']}")

# Check stats
import time
time.sleep(2)
stats = index.describe_index_stats()
print(f"Total vectors: {stats.total_vector_count}")

# Test query
print("\nTesting query...")
query = "DEHB nedir?"
query_embedding = embeddings.embed_query(query)
results = index.query(vector=query_embedding, top_k=3, include_metadata=True)

for match in results['matches']:
    print(f"Score: {match['score']:.3f} - {match['metadata']['text'][:100]}...")