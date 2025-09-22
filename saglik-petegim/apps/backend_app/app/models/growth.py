"""Growth tracking and percentile models."""

import enum
from typing import TYPE_CHECKING, Optional
from sqlalchemy import (
    Column, Date, Enum, ForeignKey, 
    Integer, Numeric, String
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.models.base import BaseModel

if TYPE_CHECKING:
    from app.models.patient import Patient
    from app.models.user import User


class MeasurementType(enum.Enum):
    """Growth measurement type enumeration."""
    
    WEIGHT = "weight"
    HEIGHT = "height"
    HEAD_CIRCUMFERENCE = "head_circumference"
    BMI = "bmi"


class GrowthMeasurement(BaseModel):
    """Growth measurement records for patients."""
    
    __tablename__ = "growth_measurements"
    
    # Measurement Details
    measurement_date = Column(Date, nullable=False, index=True)
    age_in_months = Column(Integer, nullable=False, index=True)
    
    # Measurements (in standard units)
    weight = Column(Numeric(5, 2), nullable=True)  # kg
    height = Column(Numeric(5, 1), nullable=True)  # cm
    head_circumference = Column(Numeric(4, 1), nullable=True)  # cm
    bmi = Column(Numeric(4, 1), nullable=True)  # calculated
    
    # Percentiles
    weight_percentile = Column(Numeric(5, 2), nullable=True)
    height_percentile = Column(Numeric(5, 2), nullable=True)
    head_circumference_percentile = Column(Numeric(5, 2), nullable=True)
    bmi_percentile = Column(Numeric(5, 2), nullable=True)
    
    # Z-scores (WHO standards)
    weight_z_score = Column(Numeric(5, 2), nullable=True)
    height_z_score = Column(Numeric(5, 2), nullable=True)
    head_circumference_z_score = Column(Numeric(5, 2), nullable=True)
    bmi_z_score = Column(Numeric(5, 2), nullable=True)
    
    # Growth Velocity (since last measurement)
    weight_velocity_per_month = Column(Numeric(5, 2), nullable=True)  # kg/month
    height_velocity_per_month = Column(Numeric(4, 1), nullable=True)  # cm/month
    
    # Notes and Context
    notes = Column(String(1000), nullable=True)
    measurement_context = Column(String(200), nullable=True)  # routine checkup, sick visit, etc.
    
    # Relationships
    patient_id = Column(
        UUID(as_uuid=True),
        ForeignKey("patients.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    
    measured_by_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )
    
    patient: "Patient" = relationship(
        "Patient",
        back_populates="growth_measurements",
        foreign_keys=[patient_id],
    )
    
    measured_by: "User" = relationship(
        "User",
        foreign_keys=[measured_by_id],
    )
    
    def __repr__(self) -> str:
        """String representation."""
        return (
            f"<GrowthMeasurement(id={self.id}, patient={self.patient_id}, "
            f"date={self.measurement_date}, age={self.age_in_months}mo)>"
        )
    
    @property
    def bmi_calculated(self) -> Optional[float]:
        """Calculate BMI from weight and height."""
        if self.weight and self.height:
            height_m = float(self.height) / 100  # Convert cm to meters
            return round(float(self.weight) / (height_m ** 2), 1)
        return None
    
    @property
    def weight_category(self) -> str:
        """Get weight category based on percentile."""
        if not self.weight_percentile:
            return "unknown"
        
        percentile = float(self.weight_percentile)
        if percentile < 3:
            return "underweight"
        elif percentile < 85:
            return "normal"
        elif percentile < 95:
            return "overweight"
        else:
            return "obese"
    
    @property
    def height_category(self) -> str:
        """Get height category based on percentile."""
        if not self.height_percentile:
            return "unknown"
        
        percentile = float(self.height_percentile)
        if percentile < 3:
            return "short"
        elif percentile < 97:
            return "normal"
        else:
            return "tall"
    
    @property
    def has_growth_concerns(self) -> bool:
        """Check if measurement indicates potential growth concerns."""
        concerns = []
        
        # Check for extreme percentiles
        if self.weight_percentile and (self.weight_percentile < 3 or self.weight_percentile > 97):
            concerns.append("weight_extreme")
        
        if self.height_percentile and (self.height_percentile < 3 or self.height_percentile > 97):
            concerns.append("height_extreme")
        
        # Check for concerning Z-scores
        if self.weight_z_score and abs(self.weight_z_score) > 2:
            concerns.append("weight_z_score")
        
        if self.height_z_score and abs(self.height_z_score) > 2:
            concerns.append("height_z_score")
        
        return len(concerns) > 0
    
    @property
    def growth_status_summary(self) -> dict:
        """Get summary of growth status."""
        return {
            "weight_category": self.weight_category,
            "height_category": self.height_category,
            "has_concerns": self.has_growth_concerns,
            "weight_percentile": float(self.weight_percentile) if self.weight_percentile else None,
            "height_percentile": float(self.height_percentile) if self.height_percentile else None,
        }


class GrowthPercentile(BaseModel):
    """WHO growth percentile reference data."""
    
    __tablename__ = "growth_percentiles"
    
    # Reference Information
    age_in_months = Column(Integer, nullable=False, index=True)
    gender = Column(String(10), nullable=False, index=True)  # male/female
    measurement_type = Column(Enum(MeasurementType), nullable=False, index=True)
    
    # Percentile Values
    p3 = Column(Numeric(6, 2), nullable=True)   # 3rd percentile
    p5 = Column(Numeric(6, 2), nullable=True)   # 5th percentile
    p10 = Column(Numeric(6, 2), nullable=True)  # 10th percentile
    p25 = Column(Numeric(6, 2), nullable=True)  # 25th percentile
    p50 = Column(Numeric(6, 2), nullable=True)  # 50th percentile (median)
    p75 = Column(Numeric(6, 2), nullable=True)  # 75th percentile
    p85 = Column(Numeric(6, 2), nullable=True)  # 85th percentile
    p90 = Column(Numeric(6, 2), nullable=True)  # 90th percentile
    p95 = Column(Numeric(6, 2), nullable=True)  # 95th percentile
    p97 = Column(Numeric(6, 2), nullable=True)  # 97th percentile
    
    # Z-score parameters (for WHO standards)
    mean = Column(Numeric(6, 2), nullable=True)  # Mean (L)
    coefficient_variation = Column(Numeric(6, 4), nullable=True)  # Coefficient of variation (S)
    skewness = Column(Numeric(6, 4), nullable=True)  # Skewness (L)
    
    # Metadata
    data_source = Column(String(100), default="WHO", nullable=False)
    reference_year = Column(Integer, default=2006, nullable=False)
    
    def __repr__(self) -> str:
        """String representation."""
        return (
            f"<GrowthPercentile(age={self.age_in_months}mo, "
            f"gender={self.gender}, type={self.measurement_type.value})>"
        )
    
    def get_percentile(self, value: float) -> Optional[float]:
        """Calculate percentile for a given measurement value."""
        percentiles = [
            (self.p3, 3), (self.p5, 5), (self.p10, 10), (self.p25, 25),
            (self.p50, 50), (self.p75, 75), (self.p85, 85), 
            (self.p90, 90), (self.p95, 95), (self.p97, 97)
        ]
        
        # Find where the value fits
        for percentile_value, percentile in percentiles:
            if percentile_value and value <= percentile_value:
                return float(percentile)
        
        # If value is above 97th percentile
        return 99.0
    
    def calculate_z_score(self, value: float) -> Optional[float]:
        """Calculate WHO Z-score for a given measurement value."""
        if not all([self.mean, self.coefficient_variation, self.skewness]):
            return None
        
        try:
            import math
            L = float(self.skewness)
            M = float(self.mean)
            S = float(self.coefficient_variation)
            
            if L != 0:
                z_score = (((value / M) ** L) - 1) / (L * S)
            else:
                z_score = math.log(value / M) / S
            
            return round(z_score, 2)
        except (ValueError, ZeroDivisionError, OverflowError):
            return None