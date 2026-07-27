from sqlalchemy import Column, Integer, String, Text, DateTime
from app.core.database import Base
import datetime

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    complaint_source = Column(String, nullable=True)
    customer_name = Column(String, index=True, nullable=True)
    
    product_name = Column(String, index=True, nullable=True)
    product_strength = Column(String, nullable=True)
    batch_number = Column(String, index=True, nullable=True)
    affected_quantity = Column(String, nullable=True)
    manufacturing_date = Column(String, nullable=True)
    expiry_date = Column(String, nullable=True)
    
    originating_site_block = Column(String, nullable=True)
    impacted_npm = Column(String, nullable=True)
    
    complaint_category = Column(String, nullable=True)
    issue_description = Column(Text, nullable=True)
    
    severity = Column(String, nullable=True)
    suggested_next_action = Column(Text, nullable=True)
    initial_risk_assessment = Column(Text, nullable=True)
    
    status = Column(String, default="Open")
    completeness_status = Column(String, nullable=True)
    missing_info = Column(Text, nullable=True)
