"""
Test data factories for creating consistent test data.

These factories use the Factory Boy pattern to create test objects
with realistic data while allowing customization for specific test scenarios.
"""

import factory
import factory.fuzzy
from datetime import datetime, date, timedelta
from typing import Optional
import uuid

from app.models.user import User, UserRole
from app.models.patient import Patient, Gender, BloodType
from app.models.appointment import Appointment, AppointmentType, AppointmentStatus
from app.models.medical_record import MedicalRecord
from app.models.growth import GrowthRecord
from app.models.vaccination import VaccinationRecord
from app.models.prescription import Prescription
from app.models.notification import Notification


class BaseFactory(factory.Factory):
    """Base factory with common configurations."""
    
    class Meta:
        abstract = True
    
    id = factory.LazyFunction(lambda: str(uuid.uuid4()))
    created_at = factory.LazyFunction(datetime.utcnow)
    updated_at = factory.LazyFunction(datetime.utcnow)


class UserFactory(BaseFactory):
    """Factory for creating User instances."""
    
    class Meta:
        model = User
    
    email = factory.Sequence(lambda n: f"user{n}@test.com")
    username = factory.LazyAttribute(lambda obj: obj.email.split('@')[0])
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    hashed_password = "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW"  # "secret"
    phone_number = factory.Faker('phone_number')
    date_of_birth = factory.Faker('date_of_birth', minimum_age=18, maximum_age=80)
    role = UserRole.PARENT
    is_active = True
    is_verified = True
    
    @factory.post_generation
    def set_role_specific_fields(obj, create, extracted, **kwargs):
        """Set role-specific fields after creation."""
        if obj.role == UserRole.DOCTOR:
            obj.specialization = factory.Faker('random_element', elements=[
                'Pediatrics', 'Family Medicine', 'Internal Medicine', 'Cardiology'
            ]).generate()
            obj.license_number = f"DOC{factory.Faker('random_int', min=100000, max=999999).generate()}"


class DoctorUserFactory(UserFactory):
    """Factory specifically for Doctor users."""
    
    role = UserRole.DOCTOR
    specialization = factory.Faker('random_element', elements=[
        'Pediatrics', 'Family Medicine', 'Internal Medicine', 'Cardiology', 'Dermatology'
    ])
    license_number = factory.Sequence(lambda n: f"DOC{n:06d}")


class ParentUserFactory(UserFactory):
    """Factory specifically for Parent users."""
    
    role = UserRole.PARENT


class AdminUserFactory(UserFactory):
    """Factory specifically for Admin users."""
    
    role = UserRole.ADMIN


class PatientFactory(BaseFactory):
    """Factory for creating Patient instances."""
    
    class Meta:
        model = Patient
    
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    date_of_birth = factory.Faker('date_of_birth', minimum_age=0, maximum_age=18)
    gender = factory.Faker('random_element', elements=[Gender.MALE, Gender.FEMALE])
    blood_type = factory.Faker('random_element', elements=list(BloodType))
    patient_number = factory.Sequence(lambda n: f"P{n:06d}")
    parent_id = factory.SubFactory(ParentUserFactory)
    emergency_contact = factory.Faker('phone_number')
    allergies = factory.List([
        factory.Faker('random_element', elements=[
            'Peanuts', 'Dairy', 'Eggs', 'Shellfish', 'None'
        ])
    ], size=factory.Faker('random_int', min=0, max=3))
    medical_conditions = factory.List([
        factory.Faker('random_element', elements=[
            'Asthma', 'Diabetes', 'Allergies', 'None'
        ])
    ], size=factory.Faker('random_int', min=0, max=2))
    is_active = True


class AppointmentFactory(BaseFactory):
    """Factory for creating Appointment instances."""
    
    class Meta:
        model = Appointment
    
    patient_id = factory.SubFactory(PatientFactory)
    doctor_id = factory.SubFactory(DoctorUserFactory)
    scheduled_at = factory.LazyFunction(
        lambda: datetime.utcnow() + timedelta(days=factory.Faker('random_int', min=1, max=30).generate())
    )
    duration_minutes = factory.Faker('random_element', elements=[30, 45, 60])
    appointment_type = factory.Faker('random_element', elements=list(AppointmentType))
    status = AppointmentStatus.SCHEDULED
    notes = factory.Faker('text', max_nb_chars=200)
    reminder_sent = False


class CompletedAppointmentFactory(AppointmentFactory):
    """Factory for completed appointments."""
    
    status = AppointmentStatus.COMPLETED
    scheduled_at = factory.LazyFunction(
        lambda: datetime.utcnow() - timedelta(days=factory.Faker('random_int', min=1, max=90).generate())
    )


class MedicalRecordFactory(BaseFactory):
    """Factory for creating Medical Record instances."""
    
    class Meta:
        model = MedicalRecord
    
    patient_id = factory.SubFactory(PatientFactory)
    doctor_id = factory.SubFactory(DoctorUserFactory)
    appointment_id = factory.SubFactory(AppointmentFactory)
    visit_date = factory.LazyFunction(datetime.utcnow)
    chief_complaint = factory.Faker('sentence')
    present_illness = factory.Faker('text', max_nb_chars=500)
    physical_examination = factory.Faker('text', max_nb_chars=400)
    diagnosis = factory.Faker('sentence')
    treatment_plan = factory.Faker('text', max_nb_chars=300)
    prescription_notes = factory.Faker('text', max_nb_chars=200)
    follow_up_notes = factory.Faker('text', max_nb_chars=200)
    vital_signs = factory.Dict({
        'temperature': factory.Faker('pyfloat', left_digits=2, right_digits=1, min_value=36.0, max_value=39.0),
        'heart_rate': factory.Faker('random_int', min=60, max=120),
        'blood_pressure_systolic': factory.Faker('random_int', min=90, max=140),
        'blood_pressure_diastolic': factory.Faker('random_int', min=60, max=90),
        'respiratory_rate': factory.Faker('random_int', min=12, max=24),
        'oxygen_saturation': factory.Faker('random_int', min=95, max=100),
    })


class GrowthRecordFactory(BaseFactory):
    """Factory for creating Growth Record instances."""
    
    class Meta:
        model = GrowthRecord
    
    patient_id = factory.SubFactory(PatientFactory)
    recorded_at = factory.LazyFunction(datetime.utcnow)
    age_months = factory.Faker('random_int', min=0, max=216)  # 0-18 years
    height_cm = factory.LazyAttribute(
        lambda obj: 50 + (obj.age_months * 0.6) + factory.Faker('pyfloat', left_digits=1, right_digits=1, min_value=-5, max_value=5).generate()
    )
    weight_kg = factory.LazyAttribute(
        lambda obj: 3.5 + (obj.age_months * 0.2) + factory.Faker('pyfloat', left_digits=1, right_digits=1, min_value=-2, max_value=2).generate()
    )
    head_circumference_cm = factory.LazyAttribute(
        lambda obj: 35 + (obj.age_months * 0.1) + factory.Faker('pyfloat', left_digits=1, right_digits=1, min_value=-2, max_value=2).generate()
    )
    percentile_height = factory.Faker('random_int', min=5, max=95)
    percentile_weight = factory.Faker('random_int', min=5, max=95)
    percentile_head_circumference = factory.Faker('random_int', min=5, max=95)
    notes = factory.Faker('sentence')


class VaccinationRecordFactory(BaseFactory):
    """Factory for creating Vaccination Record instances."""
    
    class Meta:
        model = VaccinationRecord
    
    patient_id = factory.SubFactory(PatientFactory)
    vaccine_name = factory.Faker('random_element', elements=[
        'DTaP', 'IPV', 'MMR', 'Varicella', 'HepB', 'Hib', 'PCV13', 'Rotavirus'
    ])
    administered_at = factory.LazyFunction(datetime.utcnow)
    dose_number = factory.Faker('random_int', min=1, max=4)
    next_due_date = factory.LazyAttribute(
        lambda obj: obj.administered_at + timedelta(days=factory.Faker('random_int', min=30, max=365).generate())
    )
    administered_by = factory.SubFactory(DoctorUserFactory)
    batch_number = factory.Sequence(lambda n: f"BATCH{n:08d}")
    manufacturer = factory.Faker('random_element', elements=[
        'Pfizer', 'GSK', 'Merck', 'Sanofi', 'Johnson & Johnson'
    ])
    site_administered = factory.Faker('random_element', elements=[
        'Left arm', 'Right arm', 'Left thigh', 'Right thigh'
    ])
    adverse_reactions = factory.List([
        factory.Faker('random_element', elements=[
            'None', 'Mild fever', 'Soreness at injection site', 'Mild irritability'
        ])
    ], size=factory.Faker('random_int', min=1, max=2))
    notes = factory.Faker('sentence')


class PrescriptionFactory(BaseFactory):
    """Factory for creating Prescription instances."""
    
    class Meta:
        model = Prescription
    
    patient_id = factory.SubFactory(PatientFactory)
    doctor_id = factory.SubFactory(DoctorUserFactory)
    medical_record_id = factory.SubFactory(MedicalRecordFactory)
    prescription_date = factory.LazyFunction(datetime.utcnow)
    medications = factory.List([
        factory.Dict({
            'name': factory.Faker('random_element', elements=[
                'Amoxicillin', 'Ibuprofen', 'Acetaminophen', 'Albuterol', 'Prednisolone'
            ]),
            'dosage': factory.Faker('random_element', elements=[
                '250mg', '500mg', '125mg', '100mg', '200mg'
            ]),
            'frequency': factory.Faker('random_element', elements=[
                'Once daily', 'Twice daily', 'Three times daily', 'Four times daily', 'As needed'
            ]),
            'duration': factory.Faker('random_element', elements=[
                '5 days', '7 days', '10 days', '14 days', '21 days'
            ]),
            'instructions': factory.Faker('sentence')
        })
    ], size=factory.Faker('random_int', min=1, max=3))
    instructions = factory.Faker('text', max_nb_chars=300)
    pharmacy_notes = factory.Faker('text', max_nb_chars=200)
    is_active = True


class NotificationFactory(BaseFactory):
    """Factory for creating Notification instances."""
    
    class Meta:
        model = Notification
    
    user_id = factory.SubFactory(UserFactory)
    title = factory.Faker('sentence', nb_words=4)
    message = factory.Faker('text', max_nb_chars=200)
    notification_type = factory.Faker('random_element', elements=[
        'appointment_reminder', 'vaccination_due', 'prescription_ready', 'test_results'
    ])
    scheduled_for = factory.LazyFunction(
        lambda: datetime.utcnow() + timedelta(hours=factory.Faker('random_int', min=1, max=24).generate())
    )
    sent_at = None
    is_read = False
    metadata = factory.Dict({
        'related_id': factory.LazyFunction(lambda: str(uuid.uuid4())),
        'priority': factory.Faker('random_element', elements=['low', 'medium', 'high'])
    })


# Factory sequences for creating related objects
class PatientWithRecordsFactory(PatientFactory):
    """Factory that creates a patient with associated records."""
    
    @factory.post_generation
    def create_records(obj, create, extracted, **kwargs):
        """Create associated records after patient creation."""
        if not create:
            return
        
        # Create growth records
        for i in range(3):
            GrowthRecordFactory(
                patient_id=obj,
                age_months=obj.age_in_months - (i * 3),
                recorded_at=datetime.utcnow() - timedelta(days=i * 90)
            )
        
        # Create vaccination records
        vaccines = ['DTaP', 'IPV', 'MMR']
        for vaccine in vaccines:
            VaccinationRecordFactory(patient_id=obj, vaccine_name=vaccine)
        
        # Create appointments
        for i in range(2):
            AppointmentFactory(
                patient_id=obj,
                scheduled_at=datetime.utcnow() + timedelta(days=i * 14)
            )


# Utility functions for test data creation
def create_test_family(num_children: int = 2) -> tuple:
    """Create a complete test family with parent and children."""
    parent = ParentUserFactory()
    children = [PatientFactory(parent_id=parent) for _ in range(num_children)]
    return parent, children


def create_test_appointment_with_record(completed: bool = True) -> tuple:
    """Create an appointment with associated medical record."""
    patient = PatientFactory()
    doctor = DoctorUserFactory()
    
    if completed:
        appointment = CompletedAppointmentFactory(
            patient_id=patient,
            doctor_id=doctor
        )
        medical_record = MedicalRecordFactory(
            patient_id=patient,
            doctor_id=doctor,
            appointment_id=appointment
        )
        return appointment, medical_record
    else:
        appointment = AppointmentFactory(
            patient_id=patient,
            doctor_id=doctor
        )
        return appointment, None


def create_test_vaccination_schedule(patient: Patient) -> list:
    """Create a complete vaccination schedule for a patient."""
    vaccines = [
        'DTaP', 'IPV', 'MMR', 'Varicella', 'HepB', 'Hib', 'PCV13', 'Rotavirus'
    ]
    
    records = []
    for i, vaccine in enumerate(vaccines):
        record = VaccinationRecordFactory(
            patient_id=patient,
            vaccine_name=vaccine,
            administered_at=patient.date_of_birth + timedelta(days=30 * (i + 2))
        )
        records.append(record)
    
    return records


def create_bulk_test_data(num_families: int = 10) -> dict:
    """Create bulk test data for performance testing."""
    data = {
        'parents': [],
        'doctors': [],
        'patients': [],
        'appointments': [],
        'medical_records': []
    }
    
    # Create doctors
    doctors = [DoctorUserFactory() for _ in range(5)]
    data['doctors'] = doctors
    
    # Create families
    for _ in range(num_families):
        parent, children = create_test_family(num_children=factory.Faker('random_int', min=1, max=4).generate())
        data['parents'].append(parent)
        data['patients'].extend(children)
        
        # Create appointments for each child
        for child in children:
            doctor = factory.Faker('random_element', elements=doctors).generate()
            appointment = AppointmentFactory(patient_id=child, doctor_id=doctor)
            data['appointments'].append(appointment)
            
            # 50% chance of completed appointment with medical record
            if factory.Faker('boolean', chance_of_getting_true=50).generate():
                appointment.status = AppointmentStatus.COMPLETED
                medical_record = MedicalRecordFactory(
                    patient_id=child,
                    doctor_id=doctor,
                    appointment_id=appointment
                )
                data['medical_records'].append(medical_record)
    
    return data