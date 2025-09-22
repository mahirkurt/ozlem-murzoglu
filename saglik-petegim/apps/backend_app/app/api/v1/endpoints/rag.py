"""
RAG (Retrieval-Augmented Generation) API endpoints for health assistant chatbot.
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import os
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_pinecone import PineconeVectorStore
from langchain.prompts import PromptTemplate
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
import logging
from ....gemini_config import GEMINI_CONFIG, get_model_config, get_prompt_template

# Load environment variables
load_dotenv()

# Set up logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()

# Request/Response models
class QueryRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=1000, description="The question to ask the health assistant")
    patient_id: Optional[str] = Field(None, description="Patient ID for personalized context")
    user_id: Optional[str] = Field(None, description="User ID for authentication")
    child_name: Optional[str] = Field(None, description="Child name for personalized responses")
    child_age: Optional[str] = Field(None, description="Child age for age-appropriate advice")
    conversation_id: Optional[str] = Field(None, description="Optional conversation ID for context")
    patient_context: Optional[Dict[str, Any]] = Field(None, description="Additional patient medical history context")
    
class QueryResponse(BaseModel):
    answer: str = Field(..., description="The assistant's response")
    sources: Optional[List[Dict[str, Any]]] = Field(None, description="Source documents used for the answer")
    conversation_id: Optional[str] = Field(None, description="Conversation ID for maintaining context")

class HealthStatus(BaseModel):
    status: str = Field(..., description="Health check status")
    index_name: str = Field(..., description="Pinecone index being used")
    model: str = Field(..., description="LLM model being used")

# Initialize RAG components globally for better performance
try:
    # Initialize embeddings
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/text-embedding-004",
        google_api_key=os.getenv("GEMINI_API_KEY")
    )
    
    # Initialize LLM with optimized settings from configuration
    model_config = get_model_config("general", GEMINI_CONFIG)
    llm = ChatGoogleGenerativeAI(
        model=GEMINI_CONFIG.model_name,
        google_api_key=os.getenv("GEMINI_API_KEY"),
        **model_config
    )
    
    # Initialize vector store
    index_name = "saglik-petegim-rag"
    vectorstore = PineconeVectorStore(
        index_name=index_name,
        embedding=embeddings,
        pinecone_api_key=os.getenv("PINECONE_API_KEY")
    )
    
    # Create retriever with optimized settings
    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={
            'k': 5,  # Retrieve top 5 most relevant chunks
            'fetch_k': 20  # Fetch 20 candidates before filtering to 5
        }
    )
    
    # Create a comprehensive prompt template with patient context
    prompt_template = """Sen, Sağlık Peteğim uygulamasının uzman sağlık asistanısın. American Academy of Pediatrics (AAP), 
    CDC, WHO ve diğer güvenilir tıbbi kaynaklardan alınan en güncel pediatri bilgileriyle donatılmışsın.
    
    HASTA BİLGİLERİ:
    - Hasta Adı: {patient_name}
    - Yaş: {patient_age}
    - Ek Bilgiler: {patient_info}
    
    GÖREV:
    Sağlanan akademik bağlamı ve tıbbi bilgileri kullanarak, HASTA-SPESİFİK detaylı, bilgilendirici ve faydalı bir cevap ver.
    
    ÖNEMLİ TALİMATLAR:
    1. HER ZAMAN bağlamda verilen bilgileri kullanarak ZENGİN ve DETAYLI cevaplar üret
    2. Konuyu derinlemesine açıkla - belirtiler, nedenler, tedavi yaklaşımları ve öneriler sun
    3. Hastanın YAŞ ve KİŞİSEL durumuna uygun tavsiyeler ver
    4. Pratik öneriler, ev bakımı yöntemleri ve ne zaman doktora başvurulması gerektiğini belirt
    5. Tıbbi terimleri kullanırken parantez içinde Türkçe açıklamalar ekle
    6. Madde işaretleri, numaralandırma ve başlıklar kullanarak organize et
    7. Hastanın adını kullanarak kişiselleştirilmiş tavsiyelerde bulun
    
    CEVAP YAPISI:
    - Önce konuyu tanımla ve {patient_name} için önemini açıkla
    - Belirtileri veya durumu detaylandır
    - Yaş grubuna özgü özellikleri belirt
    - Olası nedenleri listele
    - Ev bakımı önerilerini sun
    - Ne zaman doktora başvurulması gerektiğini belirt
    - Önleyici tedbirlerden bahset
    
    ASLA YAPMA:
    - "Bilgi bulamadım" deme - her zaman bağlamdaki bilgileri kullan
    - Kısa, yetersiz cevaplar verme
    - Sadece "doktora gidin" deme - önce faydalı bilgiler ver
    - Genel cevaplar ver - her zaman hastaya özel tavsiyelerde bulun
    
    BAĞLAM (AAP, CDC, WHO kaynaklarından):
    {context}
    
    KULLANICI SORUSU:
    {question}
    
    {patient_name} İÇİN DETAYLI VE KİŞİSELLEŞTİRİLMİŞ CEVAP:"""
    
    # Get prompt template from configuration
    configured_prompt_template = get_prompt_template("medical_expert")
    
    PROMPT = PromptTemplate(
        template=configured_prompt_template,
        input_variables=["context", "question", "patient_name", "patient_age", "patient_info"]
    )
    
    # Create the RAG chain - will be updated per request with patient context
    def create_personalized_chain(patient_name="", patient_age="", patient_info=""):
        return (
            {"context": retriever, "question": RunnablePassthrough(), 
             "patient_name": lambda x: patient_name, 
             "patient_age": lambda x: patient_age,
             "patient_info": lambda x: patient_info}
            | PROMPT
            | llm
            | StrOutputParser()
        )
    
    # Default chain for health checks
    rag_chain = create_personalized_chain()
    
    # Store for conversation memories (in production, use Redis or database)
    conversation_memories = {}
    
    logger.info(f"RAG system initialized successfully with index: {index_name}")
    
except Exception as e:
    logger.error(f"Failed to initialize RAG system: {e}")
    rag_chain = None
    retriever = None

@router.get("/health", response_model=HealthStatus)
async def health_check():
    """Check if the RAG system is operational."""
    if rag_chain is None:
        raise HTTPException(
            status_code=503,
            detail="Sağlık asistanı servisi şu anda kullanılamıyor"
        )
    
    return HealthStatus(
        status="healthy",
        index_name="saglik-petegim-rag",
        model="gemini-1.5-pro-latest"
    )

@router.post("/ask", response_model=QueryResponse)
async def ask_question(request: QueryRequest):
    """
    Process a health-related question and return an AI-generated answer.
    
    Args:
        request: QueryRequest containing the question and optional conversation ID
        
    Returns:
        QueryResponse with the answer and source information
    """
    if rag_chain is None:
        raise HTTPException(
            status_code=503,
            detail="Sağlık asistanı şu anda hizmet veremiyor. Lütfen daha sonra tekrar deneyin."
        )
    
    # Validate question
    question = request.question.strip()
    if not question:
        raise HTTPException(
            status_code=400,
            detail="Soru boş olamaz"
        )
    
    try:
        # Extract patient context for personalization
        patient_name = request.child_name or "çocuğunuz"
        patient_age = request.child_age or "belirtilmemiş yaş"
        patient_info = ""
        
        # Add patient context if available
        if request.patient_context:
            patient_info = f"Ek bilgiler: {', '.join([f'{k}: {v}' for k, v in request.patient_context.items()])}"
        else:
            patient_info = "Ek tıbbi bilgi mevcut değil"
        
        # Create personalized RAG chain
        personalized_chain = create_personalized_chain(patient_name, patient_age, patient_info)
        
        # Add safety check for medical advice disclaimer
        safety_suffix = f"""
        
⚠️ **Önemli:** Bu bilgiler {patient_name} için sadece genel bilgilendirme amaçlıdır ve tıbbi tavsiye yerine geçmez. 
Tanı ve tedavi için Dr. Özlem Murzoğlu Kliniği'ne başvurunuz.
📞 Acil durumlarda 112'yi arayın."""
        
        # Get answer from personalized RAG chain
        logger.info(f"Processing question for {patient_name} ({patient_age}): {question[:100]}...")
        answer = personalized_chain.invoke(question)
        
        # Retrieve source documents for transparency
        source_docs = retriever.get_relevant_documents(question)
        sources = []
        
        if source_docs:
            for doc in source_docs[:3]:  # Include top 3 sources
                sources.append({
                    "content": doc.page_content[:200] + "...",
                    "metadata": doc.metadata
                })
        
        # Format the final answer with disclaimer at the end
        formatted_answer = answer + safety_suffix
        
        logger.info(f"Successfully generated personalized answer for {patient_name}")
        
        return QueryResponse(
            answer=formatted_answer,
            sources=sources if sources else None,
            conversation_id=request.conversation_id
        )
        
    except Exception as e:
        logger.error(f"Error processing question: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Cevap oluşturulurken bir hata oluştu: {str(e)}"
        )

@router.post("/feedback")
async def submit_feedback(
    question: str = Field(..., description="The original question"),
    answer: str = Field(..., description="The provided answer"),
    helpful: bool = Field(..., description="Whether the answer was helpful"),
    feedback_text: Optional[str] = Field(None, description="Additional feedback")
):
    """
    Submit feedback about an answer quality.
    This can be used to improve the system over time.
    """
    try:
        # In production, store this in a database for analysis
        logger.info(f"Feedback received - Helpful: {helpful}, Question: {question[:50]}...")
        
        return {
            "status": "success",
            "message": "Geri bildiriminiz için teşekkür ederiz"
        }
    except Exception as e:
        logger.error(f"Error processing feedback: {e}")
        raise HTTPException(
            status_code=500,
            detail="Geri bildirim kaydedilemedi"
        )

@router.get("/topics")
async def get_available_topics():
    """
    Get a list of available health topics that the assistant can help with.
    """
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
        },
        {
            "category": "Alerji ve Astım",
            "topics": [
                "Besin alerjileri",
                "Astım yönetimi",
                "Mevsimsel alerjiler",
                "Egzama"
            ]
        },
        {
            "category": "Acil Durumlar",
            "topics": [
                "Ateş yönetimi",
                "İlk yardım",
                "Zehirlenme",
                "Yaralanmalar"
            ]
        }
    ]
    
    return {
        "topics": topics,
        "disclaimer": "Bu konular hakkında genel bilgi verebilirim. Spesifik tıbbi durumlar için mutlaka doktorunuza danışın."
    }