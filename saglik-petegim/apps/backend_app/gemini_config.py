"""
Gemini 1.5 Pro configuration for optimal medical chatbot performance.
"""

from dataclasses import dataclass
from typing import Dict, Any, Optional

@dataclass
class GeminiConfig:
    """Configuration class for Gemini 1.5 Pro model settings."""
    
    # Model Configuration
    model_name: str = "gemini-1.5-pro-latest"
    
    # Generation Settings for Medical Chatbot
    temperature: float = 0.7  # Balanced creativity and accuracy for medical advice
    max_output_tokens: int = 4096  # Allow for detailed, comprehensive responses
    top_p: float = 0.95  # Good diversity while maintaining quality
    top_k: int = 40  # Reasonable token selection range
    
    # Safety Settings (keep high for medical content)
    safety_settings: Optional[Dict[str, Any]] = None
    
    # System Configuration
    convert_system_message_to_human: bool = True
    request_timeout: int = 90  # Seconds - longer timeout for detailed responses
    max_retries: int = 3
    
    # Specific settings for different use cases
    medical_advice_temperature: float = 0.6  # More conservative for direct medical advice
    general_info_temperature: float = 0.7  # Balanced for general health information
    emergency_temperature: float = 0.3  # Very conservative for emergency situations
    
    def get_medical_config(self) -> Dict[str, Any]:
        """Get configuration optimized for medical advice."""
        return {
            "temperature": self.medical_advice_temperature,
            "max_output_tokens": self.max_output_tokens,
            "top_p": 0.9,  # Slightly more focused
            "top_k": 30,
            "convert_system_message_to_human": self.convert_system_message_to_human
        }
    
    def get_general_config(self) -> Dict[str, Any]:
        """Get configuration for general health information."""
        return {
            "temperature": self.general_info_temperature,
            "max_output_tokens": self.max_output_tokens,
            "top_p": self.top_p,
            "top_k": self.top_k,
            "convert_system_message_to_human": self.convert_system_message_to_human
        }
    
    def get_emergency_config(self) -> Dict[str, Any]:
        """Get configuration for emergency-related queries."""
        return {
            "temperature": self.emergency_temperature,
            "max_output_tokens": 2048,  # Shorter, more focused responses
            "top_p": 0.8,  # More focused
            "top_k": 20,
            "convert_system_message_to_human": self.convert_system_message_to_human
        }

# Default configuration instance
GEMINI_CONFIG = GeminiConfig()

# Prompt templates for different scenarios
SYSTEM_PROMPTS = {
    "medical_expert": """Sen, Sağlık Peteğim uygulamasının uzman sağlık asistanısın. American Academy of Pediatrics (AAP), 
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

{patient_name} İÇİN DETAYLI VE KİŞİSELLEŞTİRİLMİŞ CEVAP:""",

    "emergency": """ACIL DURUM ASISTANI - Sen acil sağlık durumları için özel olarak eğitilmiş bir asistansın.

HASTA BİLGİLERİ:
- Hasta Adı: {patient_name}
- Yaş: {patient_age}

ACİL DURUM PROTOKOLÜ:
1. ÖNCE güvenlik ve acil durum değerlendirmesi yap
2. Hemen yapılması gerekenler listele
3. 112 aranması gereken durumları net şekilde belirt
4. Beklerken yapılabilecek ilk yardım önerilerini sun

BAĞLAM:
{context}

ACİL SORU:
{question}

ACİL YANIT VE TAVSİYELER:""",

    "general_health": """Sen, aileler için sağlık bilgisi sağlayan dostane ve bilgili bir asistansın.

GÖREV:
{patient_name} ({patient_age}) için genel sağlık bilgisi ver.

YAKLAŞIM:
- Anlaşılır ve destekleyici dil kullan
- Pratik öneriler sun
- Ebeveynlerin endişelerini gider
- Pozitif ve motive edici ol

BAĞLAM:
{context}

SORU:
{question}

GENEL SAĞLIK TAVSİYELERİ:"""
}

def get_prompt_template(scenario: str = "medical_expert") -> str:
    """Get appropriate prompt template for the given scenario."""
    return SYSTEM_PROMPTS.get(scenario, SYSTEM_PROMPTS["medical_expert"])

def get_model_config(scenario: str = "general", config: GeminiConfig = GEMINI_CONFIG) -> Dict[str, Any]:
    """Get model configuration for the given scenario."""
    if scenario == "medical":
        return config.get_medical_config()
    elif scenario == "emergency":
        return config.get_emergency_config()
    else:
        return config.get_general_config()