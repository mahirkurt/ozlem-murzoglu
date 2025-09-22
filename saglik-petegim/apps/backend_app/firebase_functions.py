"""
Firebase Cloud Functions for RAG backend
"""

import functions_framework
from flask import jsonify
from rag_server import app as rag_app

@functions_framework.http
def rag_backend(request):
    """HTTP Cloud Function for RAG backend"""
    # Forward the request to the FastAPI app
    with rag_app.test_client() as client:
        if request.path == '/':
            return jsonify({"message": "Sağlık Peteğim RAG API is running on Firebase"})
        elif request.path == '/health':
            return jsonify({
                "status": "healthy",
                "index_name": "saglik-petegim-rag",
                "model": "gemini-1.5-pro-latest"
            })
        elif request.path == '/api/v1/rag/ask' and request.method == 'POST':
            # Forward to FastAPI endpoint
            response = client.post('/api/v1/rag/ask', json=request.get_json())
            return response.get_json()
        elif request.path == '/api/v1/rag/topics':
            response = client.get('/api/v1/rag/topics')
            return response.get_json()
        else:
            return jsonify({"error": "Not found"}), 404