import json
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(120), unique=True, index=True, nullable=True)
    mobile_number = Column(String(30), unique=True, index=True, nullable=True)
    full_name = Column(String(100), nullable=True)
    password_hash = Column(String(256), nullable=True)
    auth_provider = Column(String(50), default="local")  # 'mobile', 'email', 'google'
    is_verified = Column(Boolean, default=False)
    avatar = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    profiles = relationship("Profile", back_populates="user", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "mobile_number": self.mobile_number,
            "full_name": self.full_name or (self.email.split('@')[0] if self.email else self.mobile_number or "Mother"),
            "auth_provider": self.auth_provider,
            "is_verified": self.is_verified,
            "avatar": self.avatar,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class OTPRecord(Base):
    __tablename__ = "otp_records"

    id = Column(Integer, primary_key=True, index=True)
    identifier = Column(String(120), index=True, nullable=False)  # email or phone number
    otp = Column(String(10), nullable=False)
    purpose = Column(String(50), default="verification")  # 'signup', 'login'
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "identifier": self.identifier,
            "purpose": self.purpose,
            "expires_at": self.expires_at.isoformat() if self.expires_at else None,
            "is_used": self.is_used
        }


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    # Personal Information
    full_name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    city = Column(String(80), nullable=False)
    state = Column(String(80), nullable=False)

    # Education
    education_level = Column(String(80), nullable=False)
    qualification = Column(String(120), nullable=True)

    # Skills (stored as comma-separated or JSON list string)
    skills = Column(Text, nullable=False)

    # Experience
    years_of_experience = Column(Float, default=0.0)

    # Work Preferences
    preferred_job_type = Column(String(50), nullable=False)  # Remote, On-site, Hybrid
    available_hours = Column(Integer, nullable=False)       # 2, 4, 6, 8 hours

    # Career Preference
    career_preference = Column(String(80), nullable=False)

    # Child Information
    number_of_children = Column(Integer, default=1)
    child_age = Column(Integer, nullable=False)

    # Optional financial preferences
    monthly_income = Column(String(50), nullable=True)
    preferred_salary = Column(String(50), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profiles")

    def get_skills_list(self):
        if not self.skills:
            return []
        try:
            parsed = json.loads(self.skills)
            if isinstance(parsed, list):
                return [s.strip() for s in parsed if s.strip()]
        except Exception:
            pass
        return [s.strip() for s in self.skills.split(",") if s.strip()]

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "full_name": self.full_name,
            "age": self.age,
            "city": self.city,
            "state": self.state,
            "education_level": self.education_level,
            "qualification": self.qualification,
            "skills": self.get_skills_list(),
            "years_of_experience": self.years_of_experience,
            "preferred_job_type": self.preferred_job_type,
            "available_hours": self.available_hours,
            "career_preference": self.career_preference,
            "number_of_children": self.number_of_children,
            "child_age": self.child_age,
            "monthly_income": self.monthly_income,
            "preferred_salary": self.preferred_salary,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False, index=True)
    organization = Column(String(150), nullable=False)
    location = Column(String(100), nullable=False)
    job_type = Column(String(50), nullable=False)  # Remote, On-site, Hybrid
    required_skills = Column(Text, nullable=False)
    required_hours = Column(Integer, nullable=False)
    minimum_experience = Column(Float, default=0.0)
    salary = Column(String(80), nullable=False)
    description = Column(Text, nullable=False)
    career_category = Column(String(80), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    def get_skills_list(self):
        if not self.required_skills:
            return []
        try:
            parsed = json.loads(self.required_skills)
            if isinstance(parsed, list):
                return [s.strip() for s in parsed if s.strip()]
        except Exception:
            pass
        return [s.strip() for s in self.required_skills.split(",") if s.strip()]

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "organization": self.organization,
            "location": self.location,
            "job_type": self.job_type,
            "required_skills": self.get_skills_list(),
            "required_hours": self.required_hours,
            "minimum_experience": self.minimum_experience,
            "salary": self.salary,
            "description": self.description,
            "career_category": self.career_category,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    provider = Column(String(120), nullable=False)
    skill_category = Column(String(80), nullable=False)
    duration = Column(String(50), nullable=False)
    level = Column(String(50), nullable=False)
    mode = Column(String(50), nullable=False)
    description = Column(Text, nullable=False)
    url = Column(String(255), nullable=True)
    is_free = Column(Boolean, default=True)
    rating = Column(Float, default=4.8)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "provider": self.provider,
            "skill_category": self.skill_category,
            "duration": self.duration,
            "level": self.level,
            "mode": self.mode,
            "description": self.description,
            "url": self.url,
            "is_free": self.is_free,
            "rating": self.rating,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class Scheme(Base):
    __tablename__ = "schemes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(180), nullable=False)
    description = Column(Text, nullable=False)
    who_it_helps = Column(Text, nullable=False)
    eligibility = Column(Text, nullable=False)
    required_documents = Column(Text, nullable=False)
    official_url = Column(String(255), nullable=False)
    category = Column(String(100), default="General Women Empowerment")
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "who_it_helps": self.who_it_helps,
            "eligibility": self.eligibility,
            "required_documents": self.required_documents,
            "official_url": self.official_url,
            "category": self.category,
            "disclaimer": "Eligibility shown here is indicative. Please verify current eligibility and requirements on the official government website.",
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class ChildcareCenter(Base):
    __tablename__ = "childcare_centers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    location = Column(String(100), nullable=False)
    address = Column(Text, nullable=False)
    contact = Column(String(100), nullable=False)
    services = Column(Text, nullable=False)
    opening_hours = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "location": self.location,
            "address": self.address,
            "contact": self.contact,
            "services": self.services,
            "opening_hours": self.opening_hours,
            "is_demo": self.is_demo,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class RecommendationRecord(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=False)
    recommendations_data = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "profile_id": self.profile_id,
            "recommendations": json.loads(self.recommendations_data) if self.recommendations_data else {},
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
