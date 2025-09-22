"""
Enhanced RAG server with patient-specific health data integration
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import os
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_pinecone import PineconeVectorStore
from langchain.prompts import PromptTemplate
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
import logging
import uvicorn
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timedelta
import asyncio
from concurrent.futures import ThreadPoolExecutor

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Firebase Admin
if not firebase_admin._apps:
    cred = credentials.Certificate(os.getenv("FIREBASE_ADMIN_SDK_PATH", "serviceAccountKey.json"))
    firebase_admin.initialize_app(cred)

db = firestore.client()

# Create FastAPI app
app = FastAPI(title="Sağlık Peteğim Enhanced RAG API", version="2.0.0")

# Add CORS middleware
allowed_origins = [
    "http://localhost:*",
    "https://saglikpetegim.web.app",
    "https://saglikpetegim.firebaseapp.com",
    "https://saglik-petegim.web.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Request/Response models
class QueryRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=1000, description="The question to ask")
    patient_id: Optional[str] = Field(None, description="Patient ID for personalized responses")
    include_health_data: bool = Field(True, description="Include patient health data in context")
    
class QueryResponse(BaseModel):
    answer: str = Field(..., description="The assistant's response")
    sources: Optional[List[Dict[str, Any]]] = Field(None, description="Source documents")
    patient_context: Optional[Dict[str, Any]] = Field(None, description="Patient context used")

# Thread pool for async operations
executor = ThreadPoolExecutor(max_workers=3)

class PatientDataService:
    """Service to fetch and process patient health data"""
    
    @staticmethod
    async def get_patient_context(patient_id: str) -> Dict[str, Any]:
        """Fetch comprehensive patient health context from Firestore"""
        try:
            context = {
                "patient_id": patient_id,
                "health_summary": "",
                "recent_appointments": [],
                "active_medications": [],
                "allergies": [],
                "vaccinations": [],
                "recent_measurements": [],
                "medical_notes": []
            }
            
            # Fetch patient basic info
            patient_doc = db.collection('patients').document(patient_id).get()
            if patient_doc.exists:
                patient_data = patient_doc.to_dict()
                context["patient_name"] = patient_data.get("patientName", "")
                context["birth_date"] = patient_data.get("birthDate", "")
                context["blood_type"] = patient_data.get("bloodType", "")
                
                # Calculate age
                if context["birth_date"]:
                    birth_date = datetime.fromisoformat(context["birth_date"].replace('Z', '+00:00'))
                    age = (datetime.now() - birth_date).days // 365
                    context["age_years"] = age
                    context["age_months"] = ((datetime.now() - birth_date).days % 365) // 30
            
            # Fetch recent appointments (last 3)
            appointments = db.collection('appointments')\
                .where('patientId', '==', patient_id)\
                .order_by('date', direction=firestore.Query.DESCENDING)\
                .limit(3)\
                .get()
            
            for apt in appointments:
                apt_data = apt.to_dict()
                context["recent_appointments"].append({
                    "date": apt_data.get("date"),
                    "reason": apt_data.get("reason", ""),
                    "notes": apt_data.get("notes", "")
                })
            
            # Fetch active medications
            medications = db.collection('medications')\
                .where('patientId', '==', patient_id)\
                .where('isActive', '==', True)\
                .get()
            
            for med in medications:
                med_data = med.to_dict()
                context["active_medications"].append({
                    "name": med_data.get("name"),
                    "dosage": med_data.get("dosage"),
                    "frequency": med_data.get("frequency"),
                    "startDate": med_data.get("startDate")
                })
            
            # Fetch allergies
            allergies = db.collection('allergies')\
                .where('patientId', '==', patient_id)\
                .get()
            
            for allergy in allergies:
                allergy_data = allergy.to_dict()
                context["allergies"].append({
                    "allergen": allergy_data.get("allergen"),
                    "severity": allergy_data.get("severity"),
                    "reaction": allergy_data.get("reaction")
                })
            
            # Fetch recent vaccinations
            vaccinations = db.collection('vaccinations')\
                .where('patientId', '==', patient_id)\
                .order_by('date', direction=firestore.Query.DESCENDING)\
                .limit(5)\
                .get()
            
            for vac in vaccinations:
                vac_data = vac.to_dict()
                context["vaccinations"].append({
                    "name": vac_data.get("name"),
                    "date": vac_data.get("date"),
                    "isCompleted": vac_data.get("isCompleted")
                })
            
            # Fetch recent growth measurements (for children)
            if context.get("age_years", 18) < 18:
                measurements = db.collection('growthMeasurements')\
                    .where('patientId', '==', patient_id)\
                    .order_by('date', direction=firestore.Query.DESCENDING)\
                    .limit(3)\
                    .get()
                
                for measure in measurements:
                    measure_data = measure.to_dict()
                    context["recent_measurements"].append({
                        "date": measure_data.get("date"),
                        "height": measure_data.get("height"),
                        "weight": measure_data.get("weight"),
                        "headCircumference": measure_data.get("headCircumference")
                    })
            
            # Create health summary
            context["health_summary"] = PatientDataService._create_health_summary(context)
            
            return context
            
        except Exception as e:
            logger.error(f"Error fetching patient context: {e}")
            return {}
    
    @staticmethod
    def _create_health_summary(context: Dict[str, Any]) -> str:
        """Create a natural language summary of patient health data"""
        summary_parts = []
        
        # Basic info
        if context.get("patient_name"):
            age_str = ""
            if context.get("age_years") is not None:
                years = context["age_years"]
                months = context.get("age_months", 0)
                if years < 2:
                    age_str = f"{years * 12 + months} aylık"
                else:
                    age_str = f"{years} yaşında"
            summary_parts.append(f"Hasta: {context['patient_name']}, {age_str}")
        
        # Allergies
        if context["allergies"]:
            allergy_list = ", ".join([a["allergen"] for a in context["allergies"]])
            summary_parts.append(f"Bilinen alerjiler: {allergy_list}")
        
        # Active medications
        if context["active_medications"]:
            med_list = ", ".join([f"{m['name']} ({m['dosage']})" for m in context["active_medications"]])
            summary_parts.append(f"Kullanılan ilaçlar: {med_list}")
        
        # Recent measurements (for children)
        if context["recent_measurements"]:
            latest = context["recent_measurements"][0]
            summary_parts.append(f"Son ölçümler: Boy {latest['height']}cm, Kilo {latest['weight']}kg")
        
        # Recent appointments
        if context["recent_appointments"]:
            summary_parts.append(f"Son {len(context['recent_appointments'])} randevusu var")
        
        return " | ".join(summary_parts) if summary_parts else "Hasta bilgisi mevcut değil"

# Initialize RAG components
try:
    logger.info("Initializing Enhanced RAG components...")
    
    # Initialize embeddings
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/text-embedding-004",
        google_api_key=os.getenv("GEMINI_API_KEY")
    )
    
    # Initialize LLM
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-pro-latest",
        google_api_key=os.getenv("GEMINI_API_KEY"),
        temperature=0.3,
        max_output_tokens=2048,
        convert_system_message_to_human=True
    )
    
    # Initialize vector store
    index_name = "saglik-petegim-rag"
    vectorstore = PineconeVectorStore(
        index_name=index_name,
        embedding=embeddings,
        pinecone_api_key=os.getenv("PINECONE_API_KEY")
    )
    
    # Create retriever
    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={'k': 5}
    )
    
    # Create enhanced prompt template with patient context
    enhanced_prompt_template = """Sen, Sağlık Peteğim uygulamasının yardımsever ve bilgili sağlık asistanısın. 
    Pediatri (çocuk sağlığı) konusunda uzmanlaşmış bir asistansın.
    
    HASTA BİLGİLERİ:
    {patient_context}
    
    GÖREV:
    - Hastanın mevcut sağlık durumunu ve geçmişini dikkate alarak kişiye özel tavsiyeler ver
    - Sana verilen bağlamı ve hasta bilgilerini kullanarak soruyu cevapla
    - Alerjileri, kullandığı ilaçları ve tıbbi geçmişi göz önünde bulundur
    - Yaşa uygun ve kişiye özel öneriler sun
    
    KURALLAR:
    1. Hasta bilgilerini gizli tut, sadece gerekli durumlarda referans ver
    2. Alerjisi olan maddeleri asla önerme
    3. Kullandığı ilaçlarla etkileşime girebilecek önerilerde bulunma
    4. Her zaman Türkçe cevap ver
    5. Cevabın sonuna şunu MUTLAKA ekle: "\n\n⚠️ Önemli: Bu bilgiler kişiye özel hazırlanmış genel bilgilendirmedir. Kesin tanı ve tedavi için Dr. Özlem Murzoğlu Kliniği'ne başvurunuz."
    
    TIBBİ BAĞLAM:
    {context}
    
    KULLANICI SORUSU:
    {question}
    
    KİŞİYE ÖZEL YARDIMCI CEVAP:"""
    
    ENHANCED_PROMPT = PromptTemplate(
        template=enhanced_prompt_template,
        input_variables=["patient_context", "context", "question"]
    )
    
    # Patient data service
    patient_service = PatientDataService()
    
    logger.info("Enhanced RAG system initialized successfully!")
    
except Exception as e:
    logger.error(f"Failed to initialize Enhanced RAG system: {e}")
    retriever = None
    patient_service = None

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Sağlık Peteğim Enhanced RAG API is running", "version": "2.0.0"}

@app.get("/health")
async def health_check():
    """Check if the RAG system is operational"""
    if retriever is None:
        raise HTTPException(status_code=503, detail="RAG system is not available")
    return {
        "status": "healthy",
        "index_name": "saglik-petegim-rag",
        "model": "gemini-1.5-pro-latest",
        "features": ["patient_context", "auto_learning", "personalized_advice"]
    }

@app.post("/api/v2/rag/ask", response_model=QueryResponse)
async def ask_question_with_context(request: QueryRequest):
    """Process a health-related question with patient context"""
    if retriever is None:
        raise HTTPException(
            status_code=503,
            detail="Sağlık asistanı şu anda hizmet veremiyor. Lütfen daha sonra tekrar deneyin."
        )
    
    question = request.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Soru boş olamaz")
    
    try:
        logger.info(f"Processing personalized question: {question[:100]}...")
        
        # Fetch patient context if patient_id is provided
        patient_context_str = "Hasta bilgisi mevcut değil"
        patient_context_dict = {}
        
        if request.patient_id and request.include_health_data:
            patient_context_dict = await patient_service.get_patient_context(request.patient_id)
            patient_context_str = patient_context_dict.get("health_summary", "Hasta bilgisi mevcut değil")
            logger.info(f"Patient context loaded for: {request.patient_id}")
        
        # Get relevant documents
        relevant_docs = retriever.get_relevant_documents(question)
        context = "\n\n".join([doc.page_content for doc in relevant_docs])
        
        # Create personalized chain
        enhanced_chain = (
            {
                "patient_context": lambda x: patient_context_str,
                "context": lambda x: context,
                "question": RunnablePassthrough()
            }
            | ENHANCED_PROMPT
            | llm
            | StrOutputParser()
        )
        
        # Get personalized answer
        answer = enhanced_chain.invoke(question)
        
        # Prepare sources
        sources = []
        if relevant_docs:
            for doc in relevant_docs[:3]:
                sources.append({
                    "content": doc.page_content[:200] + "...",
                    "metadata": doc.metadata
                })
        
        # Log the interaction for continuous learning
        if request.patient_id:
            await log_interaction(request.patient_id, question, answer)
        
        logger.info("Successfully generated personalized answer")
        
        return QueryResponse(
            answer=answer,
            sources=sources if sources else None,
            patient_context={
                "used": request.include_health_data and bool(request.patient_id),
                "summary": patient_context_str if request.patient_id else None
            }
        )
        
    except Exception as e:
        logger.error(f"Error processing personalized question: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Cevap oluşturulurken bir hata oluştu: {str(e)}"
        )

async def log_interaction(patient_id: str, question: str, answer: str):
    """Log chatbot interactions for continuous learning"""
    try:
        interaction_data = {
            "patientId": patient_id,
            "question": question,
            "answer": answer,
            "timestamp": firestore.SERVER_TIMESTAMP,
            "feedback": None  # Will be updated when user provides feedback
        }
        
        # Store in Firestore for future training
        db.collection('chatbot_interactions').add(interaction_data)
        logger.info(f"Logged interaction for patient: {patient_id}")
        
    except Exception as e:
        logger.error(f"Failed to log interaction: {e}")

@app.post("/api/v2/rag/feedback")
async def submit_feedback_enhanced(
    patient_id: str,
    interaction_id: str,
    helpful: bool,
    feedback_text: Optional[str] = None
):
    """Submit feedback for continuous learning"""
    try:
        # Update the interaction with feedback
        db.collection('chatbot_interactions').document(interaction_id).update({
            "feedback": {
                "helpful": helpful,
                "text": feedback_text,
                "timestamp": firestore.SERVER_TIMESTAMP
            }
        })
        
        logger.info(f"Feedback received for interaction: {interaction_id}")
        
        return {
            "status": "success",
            "message": "Geri bildiriminiz kaydedildi ve öğrenme sürecine dahil edilecek"
        }
        
    except Exception as e:
        logger.error(f"Failed to save feedback: {e}")
        raise HTTPException(status_code=500, detail="Geri bildirim kaydedilemedi")

@app.post("/api/v2/rag/learn-from-record")
async def learn_from_health_record(
    patient_id: str,
    record_type: str,
    record_data: Dict[str, Any]
):
    """Process new health records for continuous learning"""
    try:
        # Create a learning entry
        learning_data = {
            "patientId": patient_id,
            "recordType": record_type,
            "recordData": record_data,
            "timestamp": firestore.SERVER_TIMESTAMP,
            "processed": False
        }
        
        # Queue for processing
        db.collection('learning_queue').add(learning_data)
        
        logger.info(f"Queued health record for learning: {record_type} for patient {patient_id}")
        
        # Trigger async processing (in production, this would be a background job)
        asyncio.create_task(process_learning_queue())
        
        return {
            "status": "success",
            "message": "Sağlık kaydı öğrenme kuyruğuna eklendi"
        }
        
    except Exception as e:
        logger.error(f"Failed to queue learning: {e}")
        raise HTTPException(status_code=500, detail="Öğrenme işlemi başlatılamadı")

async def process_learning_queue():
    """Background task to process learning queue"""
    try:
        # Get unprocessed items
        unprocessed = db.collection('learning_queue')\
            .where('processed', '==', False)\
            .limit(10)\
            .get()
        
        for item in unprocessed:
            item_data = item.to_dict()
            
            # Process the health record
            # In production, this would update the vector store with new information
            logger.info(f"Processing learning item: {item.id}")
            
            # Mark as processed
            db.collection('learning_queue').document(item.id).update({
                "processed": True,
                "processedAt": firestore.SERVER_TIMESTAMP
            })
            
    except Exception as e:
        logger.error(f"Error processing learning queue: {e}")

if __name__ == "__main__":
    # Run the server
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port, reload=False)