from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ComplaintBase(BaseModel):
    complaint_source: Optional[str] = None
    customer_name: Optional[str] = None
    product_name: Optional[str] = None
    product_strength: Optional[str] = None
    batch_number: Optional[str] = None
    affected_quantity: Optional[str] = None
    manufacturing_date: Optional[str] = None
    expiry_date: Optional[str] = None
    originating_site_block: Optional[str] = None
    impacted_npm: Optional[str] = None
    complaint_category: Optional[str] = None
    issue_description: Optional[str] = None

class ComplaintCreate(ComplaintBase):
    pass

class ComplaintAIUpdate(ComplaintBase):
    severity: Optional[str] = None
    suggested_next_action: Optional[str] = None
    initial_risk_assessment: Optional[str] = None
    completeness_status: Optional[str] = None
    missing_info: Optional[str] = None
    status: Optional[str] = "Open"

class Complaint(ComplaintAIUpdate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ProcessComplaintRequest(BaseModel):
    text: str
    complaint_id: Optional[int] = None
