"""
Test script for RAG chatbot
"""
import requests
import json

# Base URL
BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    response = requests.get(f"{BASE_URL}/health")
    print("Health Check:", response.json())
    return response.status_code == 200

def test_ask_question(question):
    """Test ask endpoint"""
    response = requests.post(
        f"{BASE_URL}/api/v1/rag/ask",
        json={"question": question}
    )
    
    if response.status_code == 200:
        result = response.json()
        print(f"\nSoru: {question}")
        print(f"Cevap: {result['answer'][:500]}...")  # First 500 chars
        if result.get('sources'):
            print(f"Kaynaklar: {len(result['sources'])} belge")
        return True
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return False

def test_topics():
    """Test topics endpoint"""
    response = requests.get(f"{BASE_URL}/api/v1/rag/topics")
    if response.status_code == 200:
        result = response.json()
        print("\nMevcut Konular:")
        for category in result['topics']:
            print(f"- {category['category']}: {', '.join(category['topics'])}")
        return True
    return False

if __name__ == "__main__":
    print("Saglik Petegim Chatbot Test\n")
    print("=" * 50)
    
    # Test health
    print("\n1. Health Check Test:")
    if not test_health():
        print("X Backend is not running!")
        exit(1)
    print("OK Backend is healthy")
    
    # Test topics
    print("\n2. Topics Test:")
    if test_topics():
        print("OK Topics endpoint working")
    
    # Test questions
    print("\n3. Question Tests:")
    print("=" * 50)
    
    test_questions = [
        "6 aylık bebek ne yemeli?",
        "Bebek ateşi nasıl düşürülür?",
        "Aşı takvimi nedir?",
        "DEHB belirtileri nelerdir?"
    ]
    
    for question in test_questions:
        if test_ask_question(question):
            print("OK Question answered successfully")
        else:
            print("X Failed to answer question")
        print("-" * 50)
    
    print("\nTest completed!")