"""Seed initial data for development and testing."""

import asyncio
from datetime import date, datetime
import structlog

from app.core.database import AsyncSessionLocal, db_manager
from app.core.security import get_password_hash
from app.models.user import User, UserRole
from app.models.patient import Patient, Gender, BloodType, EmergencyContact
from app.models.vaccination import VaccinationSchedule, VaccineType

logger = structlog.get_logger()


async def seed_users():
    """Seed initial users."""
    logger.info("Seeding users...")
    
    async with AsyncSessionLocal() as db:
        # Admin user
        admin = User(
            email="admin@saglikpetegim.com",
            username="admin",
            hashed_password=get_password_hash("admin123"),
            first_name="Admin",
            last_name="User",
            role=UserRole.ADMIN,
            is_active=True,
            is_verified=True,
        )
        
        # Doctor
        doctor = User(
            email="doctor@saglikpetegim.com", 
            username="doctor",
            hashed_password=get_password_hash("doctor123"),
            first_name="Dr. Mehmet",
            last_name="Özkan",
            role=UserRole.DOCTOR,
            license_number="DOC123456",
            specialization="Pediatrics",
            years_of_experience="10",
            is_active=True,
            is_verified=True,
        )
        
        # Nurse
        nurse = User(
            email="nurse@saglikpetegim.com",
            username="nurse", 
            hashed_password=get_password_hash("nurse123"),
            first_name="Ayşe",
            last_name="Yılmaz",
            role=UserRole.NURSE,
            license_number="NUR789012",
            years_of_experience="5",
            is_active=True,
            is_verified=True,
        )
        
        # Receptionist
        receptionist = User(
            email="reception@saglikpetegim.com",
            username="reception",
            hashed_password=get_password_hash("reception123"), 
            first_name="Fatma",
            last_name="Demir",
            role=UserRole.RECEPTIONIST,
            is_active=True,
            is_verified=True,
        )
        
        # Parent
        parent = User(
            email="parent@test.com",
            username="parent",
            hashed_password=get_password_hash("parent123"),
            first_name="Ahmet",
            last_name="Kaya",
            role=UserRole.PARENT,
            phone="+90 555 123 45 67",
            is_active=True,
            is_verified=True,
        )
        
        db.add_all([admin, doctor, nurse, receptionist, parent])
        await db.commit()
        
        logger.info("Users seeded successfully")
        return {"parent_id": parent.id}


async def seed_patients(parent_id):
    """Seed initial patients."""
    logger.info("Seeding patients...")
    
    async with AsyncSessionLocal() as db:
        # Patient 1
        patient1 = Patient(
            first_name="Ali",
            last_name="Kaya", 
            date_of_birth=date(2020, 3, 15),
            gender=Gender.MALE,
            patient_number="P000001",
            blood_type=BloodType.A_POSITIVE,
            parent_id=parent_id,
            birth_weight=3.2,
            birth_length=50.0,
            gestational_age_weeks=39.0,
        )
        
        # Patient 2
        patient2 = Patient(
            first_name="Zeynep",
            last_name="Kaya",
            date_of_birth=date(2022, 8, 22),
            gender=Gender.FEMALE,
            patient_number="P000002", 
            blood_type=BloodType.O_POSITIVE,
            parent_id=parent_id,
            birth_weight=3.4,
            birth_length=52.0,
            gestational_age_weeks=40.0,
            allergies="Penicillin allergy",
        )
        
        db.add_all([patient1, patient2])
        await db.flush()
        
        # Emergency contacts
        contact1 = EmergencyContact(
            name="Fatma Kaya",
            relationship="Anne",
            phone_primary="+90 555 123 45 68",
            email="fatma.kaya@email.com",
            is_primary=True,
            can_authorize_treatment=True,
            patient_id=patient1.id,
        )
        
        contact2 = EmergencyContact(
            name="Mehmet Kaya",
            relationship="Dede",
            phone_primary="+90 555 123 45 69", 
            is_primary=False,
            can_authorize_treatment=False,
            patient_id=patient1.id,
        )
        
        db.add_all([contact1, contact2])
        await db.commit()
        
        logger.info("Patients seeded successfully")


async def seed_vaccination_schedule():
    """Seed vaccination schedule templates."""
    logger.info("Seeding vaccination schedules...")
    
    vaccination_data = [
        # Birth vaccines
        {
            "vaccine_type": VaccineType.HEPATITIS_B,
            "vaccine_name": "Hepatitis B Aşısı", 
            "recommended_age_months": 0,
            "dose_number": 1,
            "route": "IM",
            "site": "Uyluk",
            "description": "Doğumda yapılan ilk hepatit B aşısı",
        },
        {
            "vaccine_type": VaccineType.BCG,
            "vaccine_name": "BCG Aşısı",
            "recommended_age_months": 0,
            "dose_number": 1, 
            "route": "ID",
            "site": "Sol kol",
            "description": "Tüberküloz koruyucu aşı",
        },
        
        # 2 months vaccines
        {
            "vaccine_type": VaccineType.DIPHTHERIA_TETANUS_PERTUSSIS,
            "vaccine_name": "DaBT-İPA-Hib Aşısı",
            "recommended_age_months": 2,
            "dose_number": 1,
            "route": "IM", 
            "site": "Uyluk",
            "description": "5'li karma aşının 1. dozu",
        },
        {
            "vaccine_type": VaccineType.PNEUMOCOCCAL,
            "vaccine_name": "KPA Aşısı",
            "recommended_age_months": 2,
            "dose_number": 1,
            "route": "IM",
            "site": "Uyluk",
            "description": "Pnömokok aşısının 1. dozu",
        },
        
        # 4 months vaccines
        {
            "vaccine_type": VaccineType.DIPHTHERIA_TETANUS_PERTUSSIS,
            "vaccine_name": "DaBT-İPA-Hib Aşısı", 
            "recommended_age_months": 4,
            "dose_number": 2,
            "route": "IM",
            "site": "Uyluk",
            "description": "5'li karma aşının 2. dozu",
        },
        {
            "vaccine_type": VaccineType.PNEUMOCOCCAL,
            "vaccine_name": "KPA Aşısı",
            "recommended_age_months": 4,
            "dose_number": 2,
            "route": "IM", 
            "site": "Uyluk",
            "description": "Pnömokok aşısının 2. dozu",
        },
        
        # 6 months vaccines
        {
            "vaccine_type": VaccineType.DIPHTHERIA_TETANUS_PERTUSSIS,
            "vaccine_name": "DaBT-İPA-Hib Aşısı",
            "recommended_age_months": 6,
            "dose_number": 3,
            "route": "IM",
            "site": "Uyluk", 
            "description": "5'li karma aşının 3. dozu",
        },
        {
            "vaccine_type": VaccineType.HEPATITIS_B,
            "vaccine_name": "Hepatitis B Aşısı",
            "recommended_age_months": 6,
            "dose_number": 3,
            "route": "IM",
            "site": "Uyluk",
            "description": "Hepatit B aşısının 3. dozu",
        },
        
        # 12 months vaccines
        {
            "vaccine_type": VaccineType.MEASLES_MUMPS_RUBELLA,
            "vaccine_name": "KKK Aşısı",
            "recommended_age_months": 12, 
            "dose_number": 1,
            "route": "SC",
            "site": "Kol",
            "description": "Kızamık, kabakulak, kızamıkçık aşısı",
        },
        {
            "vaccine_type": VaccineType.PNEUMOCOCCAL,
            "vaccine_name": "KPA Aşısı",
            "recommended_age_months": 12,
            "dose_number": 3,
            "route": "IM",
            "site": "Uyluk",
            "description": "Pnömokok aşısının rapel dozu",
        },
    ]
    
    async with AsyncSessionLocal() as db:
        schedules = []
        for data in vaccination_data:
            schedule = VaccinationSchedule(**data)
            schedules.append(schedule)
        
        db.add_all(schedules)
        await db.commit()
        
        logger.info("Vaccination schedules seeded successfully")


async def main():
    """Main seeding function."""
    try:
        logger.info("Starting data seeding...")
        
        # Check database connection
        if not await db_manager.check_connection():
            logger.error("Database connection failed")
            return
        
        # Seed data
        user_data = await seed_users()
        await seed_patients(user_data["parent_id"])
        await seed_vaccination_schedule()
        
        logger.info("Data seeding completed successfully! 🌱")
        
        # Print login credentials
        print("\n" + "="*50)
        print("🔑 Login Credentials for Testing:")
        print("="*50)
        print("Admin:        admin@saglikpetegim.com / admin123")
        print("Doctor:       doctor@saglikpetegim.com / doctor123") 
        print("Nurse:        nurse@saglikpetegim.com / nurse123")
        print("Receptionist: reception@saglikpetegim.com / reception123")
        print("Parent:       parent@test.com / parent123")
        print("="*50)
        
    except Exception as e:
        logger.error("Data seeding failed", error=str(e), exc_info=True)
        raise


if __name__ == "__main__":
    asyncio.run(main())