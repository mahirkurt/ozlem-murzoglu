"""
Standalone RAG server for health assistant chatbot
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import os
import json
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_pinecone import PineconeVectorStore
from langchain.prompts import PromptTemplate
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
import logging
import uvicorn

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(title="Sağlık Peteğim RAG API", version="1.0.0")

# Add CORS middleware
# Enhanced CORS configuration for production
allowed_origins = [
    "http://localhost:*",
    "https://saglikpetegim.web.app",
    "https://saglikpetegim.firebaseapp.com",
    "https://saglik-petegim.web.app",
    "https://saglik-petegim-rag-backend-606186690780.us-central1.run.app",
    # Allow all origins during development - remove in production
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,
)

# Request/Response models
class QueryRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=1000, description="The question to ask")
    patient_id: Optional[str] = Field(None, description="Patient ID for personalized responses")
    include_patient_data: Optional[bool] = Field(False, description="Include patient health data in response")
    
class QueryResponse(BaseModel):
    answer: str = Field(..., description="The assistant's response")
    sources: Optional[List[Dict[str, Any]]] = Field(None, description="Source documents")

# Import Firebase for patient data
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timedelta

# Initialize Firebase
db = None
try:
    if not firebase_admin._apps:
        firebase_config = os.getenv("FIREBASE_ADMIN_SDK", "")
        if firebase_config and firebase_config != "{}":
            cred = credentials.Certificate(json.loads(firebase_config))
            firebase_admin.initialize_app(cred)
            db = firestore.client()
            logger.info("Firebase initialized successfully")
        else:
            logger.warning("Firebase admin SDK not configured, patient data features will be disabled")
except Exception as e:
    logger.warning(f"Failed to initialize Firebase: {e}. Patient data features will be disabled")
    db = None

# Initialize RAG components
try:
    logger.info("Initializing RAG components...")
    
    # Initialize embeddings
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/text-embedding-004",
        google_api_key=os.getenv("GEMINI_API_KEY")
    )
    
    # Initialize LLM with optimized settings for detailed responses
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-pro-latest",
        google_api_key=os.getenv("GEMINI_API_KEY"),
        temperature=0.2,  # Lower temperature for more consistent, factual responses
        max_output_tokens=4096,  # Increased for more detailed responses
        convert_system_message_to_human=True
    )
    
    # Initialize vector store
    index_name = "saglik-petegim-rag"
    vectorstore = PineconeVectorStore(
        index_name=index_name,
        embedding=embeddings,
        pinecone_api_key=os.getenv("PINECONE_API_KEY")
    )
    
    # Create retriever with more results for better context
    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={'k': 15}  # Increased to 15 for comprehensive context
    )
    
    # Create prompt template
    prompt_template = """Sen Dr. Özlem Murzoğlu'nun deneyimli pediatrik sağlık uzmanısın. American Academy of Pediatrics (AAP) 
    rehberlerine ve Türkiye Sağlık Bakanlığı protokollerine göre bilgi veriyorsun.
    
    KAYNAK BİLGİLER:
    {context}
    
    SORU: {question}
    
    Soruya net, anlaşılır ve yararlı bir şekilde cevap ver. 
    
    Yaş gruplarına göre özelleştir (gerekiyorsa):
    - Yenidoğan (0-28 gün)
    - Bebek (1-12 ay)
    - Küçük çocuk (1-3 yaş)
    - Okul öncesi (3-6 yaş)
    - Okul çağı (6-12 yaş)
    
    Önemli bilgileri vurgula:
    - Tehlike işaretleri
    - Ne zaman doktora başvurulmalı
    - Pratik öneriler
    - Dikkat edilecek noktalar
    
    Gereksiz başlıklar kullanma, doğal bir dille açıkla.
    
    YANITINIZ:"""
    
    PROMPT = PromptTemplate(
        template=prompt_template,
        input_variables=["context", "question"]
    )
    
    # Function to format documents
    def format_docs(docs):
        return "\n\n".join([d.page_content for d in docs])
    
    # Create RAG chain with proper document formatting
    rag_chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | PROMPT
        | llm
        | StrOutputParser()
    )
    
    logger.info("RAG system initialized successfully!")
    
except Exception as e:
    logger.error(f"Failed to initialize RAG system: {e}")
    rag_chain = None
    retriever = None

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Sağlık Peteğim RAG API is running"}

@app.get("/health")
async def health_check():
    """Check if the RAG system is operational"""
    if rag_chain is None:
        raise HTTPException(status_code=503, detail="RAG system is not available")
    return {
        "status": "healthy",
        "index_name": "saglik-petegim-rag",
        "model": "gemini-1.5-pro-latest"
    }

@app.post("/api/v1/rag/ask")
async def ask_question(request: Request):
    """Process a health-related question"""
    
    # Parse JSON body manually to handle encoding issues
    try:
        body = await request.json()
    except Exception as e:
        logger.error(f"Error parsing JSON: {e}")
        # Try to get raw body and decode with different encodings
        try:
            raw_body = await request.body()
            # Try different encodings
            for encoding in ['utf-8', 'latin-1', 'cp1254', 'iso-8859-9']:
                try:
                    body_str = raw_body.decode(encoding)
                    body = json.loads(body_str)
                    break
                except:
                    continue
            else:
                # If all encodings fail, use utf-8 with errors='ignore'
                body_str = raw_body.decode('utf-8', errors='ignore')
                body = json.loads(body_str)
        except Exception as e2:
            logger.error(f"Error parsing raw body: {e2}")
            # Last resort: accept simple ASCII-only questions
            body = {"question": "test"}
    
    if rag_chain is None:
        raise HTTPException(
            status_code=503,
            detail="Sağlık asistanı şu anda hizmet veremiyor. Lütfen daha sonra tekrar deneyin."
        )
    
    question = body.get("question", "").strip()
    if not question:
        raise HTTPException(status_code=400, detail="Soru boş olamaz")
    
    patient_id = body.get("patient_id", None)
    include_patient_data = body.get("include_patient_data", False)
    
    # Get patient context if requested
    patient_context = ""
    if patient_id and include_patient_data and db:
        try:
            # Get patient basic info
            patient_doc = db.collection('patients').document(patient_id).get()
            if patient_doc.exists:
                patient_data = patient_doc.to_dict()
                birth_date = patient_data.get('birthDate')
                if birth_date:
                    age_months = (datetime.now() - birth_date).days // 30
                    age_years = age_months // 12
                    patient_context += f"\n\n**HASTA BİLGİLERİ:**\n"
                    patient_context += f"- Yaş: {age_years} yıl {age_months % 12} ay\n"
                    patient_context += f"- Cinsiyet: {patient_data.get('gender', 'Belirtilmemiş')}\n"
                    patient_context += f"- Kan Grubu: {patient_data.get('bloodType', 'Belirtilmemiş')}\n"
                
                # Get recent growth measurements
                growth_docs = db.collection('growthMeasurements').where(
                    'patientId', '==', patient_id
                ).order_by('measurementDate', direction=firestore.Query.DESCENDING).limit(3).get()
                
                if growth_docs:
                    patient_context += "\n**SON BÜYÜME ÖLÇÜMLERİ:**\n"
                    for doc in growth_docs:
                        growth = doc.to_dict()
                        date = growth.get('measurementDate')
                        if date:
                            patient_context += f"- {date.strftime('%d.%m.%Y')}: "
                            if growth.get('weight'):
                                patient_context += f"Kilo: {growth['weight']} kg, "
                            if growth.get('height'):
                                patient_context += f"Boy: {growth['height']} cm, "
                            if growth.get('headCircumference'):
                                patient_context += f"Baş çevresi: {growth['headCircumference']} cm"
                            patient_context += "\n"
                
                # Get recent vaccinations
                vacc_docs = db.collection('vaccinations').where(
                    'patientId', '==', patient_id
                ).order_by('date', direction=firestore.Query.DESCENDING).limit(5).get()
                
                if vacc_docs:
                    patient_context += "\n**SON AŞILAR:**\n"
                    for doc in vacc_docs:
                        vacc = doc.to_dict()
                        date = vacc.get('date')
                        if date:
                            patient_context += f"- {date.strftime('%d.%m.%Y')}: {vacc.get('vaccine', 'Belirtilmemiş')} (Doz {vacc.get('dose', '?')})\n"
                
                # Get active diagnoses
                diagnosis_docs = db.collection('diagnoses').where(
                    'patientId', '==', patient_id
                ).where('status', '==', 'active').limit(5).get()
                
                if diagnosis_docs:
                    patient_context += "\n**AKTİF TANILAR:**\n"
                    for doc in diagnosis_docs:
                        diag = doc.to_dict()
                        patient_context += f"- {diag.get('diagnosisName', 'Belirtilmemiş')} (ICD: {diag.get('icdCode', 'N/A')})\n"
                
                # Get recent health records
                health_docs = db.collection('health_records').where(
                    'patientId', '==', patient_id
                ).order_by('visitDate', direction=firestore.Query.DESCENDING).limit(3).get()
                
                if health_docs:
                    patient_context += "\n**SON MUAYENELER:**\n"
                    for doc in health_docs:
                        record = doc.to_dict()
                        date = record.get('visitDate')
                        if date:
                            patient_context += f"- {date.strftime('%d.%m.%Y')}: "
                            if record.get('chiefComplaint'):
                                patient_context += f"Şikayet: {record['chiefComplaint'][:50]}..., "
                            if record.get('diagnosis'):
                                patient_context += f"Tanı: {record['diagnosis'][:50]}..."
                            patient_context += "\n"
                            
        except Exception as e:
            logger.error(f"Error fetching patient data: {e}")
            # Continue without patient context
    
    try:
        logger.info(f"Processing question: {question[:100]}...")
        
        # Get answer from RAG chain with patient context
        enriched_question = question
        if patient_context:
            enriched_question = f"{question}\n{patient_context}"
        
        answer = rag_chain.invoke(enriched_question)
        
        # Get source documents
        source_docs = retriever.get_relevant_documents(question)
        sources = []
        
        if source_docs:
            for doc in source_docs[:3]:
                sources.append({
                    "content": doc.page_content[:200] + "...",
                    "metadata": doc.metadata
                })
        
        logger.info("Successfully generated answer")
        
        # Add disclaimer if not already present
        if "⚠️ Önemli:" not in answer:
            answer += "\n\n⚠️ Önemli: Bu bilgiler sadece genel bilgilendirme amaçlıdır ve tıbbi tavsiye yerine geçmez. Tanı ve tedavi için Dr. Özlem Murzoğlu Kliniği'ne başvurunuz."
        
        return {
            "answer": answer,
            "sources": sources if sources else []
        }
        
    except Exception as e:
        logger.error(f"Error processing question: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Cevap oluşturulurken bir hata oluştu: {str(e)}"
        )

@app.get("/api/v1/rag/topics")
async def get_topics():
    """Get available health topics"""
    topics = [
        {
            "category": "Bebek Bakımı",
            "topics": [
                "Yenidoğan bakımı",
                "Emzirme ve beslenme",
                "Uyku düzeni",
                "Bebek gelişimi"
            ]
        },
        {
            "category": "Çocuk Sağlığı",
            "topics": [
                "Aşı takvimi",
                "Büyüme ve gelişim",
                "Çocukluk hastalıkları",
                "Beslenme önerileri"
            ]
        },
        {
            "category": "Davranış ve Gelişim",
            "topics": [
                "DEHB (Dikkat Eksikliği)",
                "Otizm spektrum bozukluğu",
                "Öğrenme güçlükleri",
                "Davranış sorunları"
            ]
        }
    ]
    
    return {
        "topics": topics,
        "disclaimer": "Bu konular hakkında genel bilgi verebilirim. Spesifik tıbbi durumlar için mutlaka doktorunuza danışın."
    }

@app.post("/api/v1/rag/feedback")
async def submit_feedback(
    question: str,
    answer: str,
    helpful: bool,
    feedback_text: Optional[str] = None
):
    """Submit feedback about answer quality"""
    logger.info(f"Feedback received - Helpful: {helpful}, Question: {question[:50]}...")
    return {
        "status": "success",
        "message": "Geri bildiriminiz için teşekkür ederiz"
    }

if __name__ == "__main__":
    # Run the server - use PORT environment variable for Cloud Run
    import os
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port, reload=False)