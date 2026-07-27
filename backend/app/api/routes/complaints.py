from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.complaint import Complaint
from app.schemas.complaint import ProcessComplaintRequest, Complaint as ComplaintSchema, ComplaintCreate
from app.services.ai_agent import process_complaint_text
from typing import List

router = APIRouter()

@router.post("/process", response_model=ComplaintSchema)
def process_complaint(request: ProcessComplaintRequest, db: Session = Depends(get_db)):
    existing_dict = None
    db_complaint = None
    
    if request.complaint_id:
        db_complaint = db.query(Complaint).filter(Complaint.id == request.complaint_id).first()
        if db_complaint:
            existing_dict = {c.name: getattr(db_complaint, c.name) for c in Complaint.__table__.columns if getattr(db_complaint, c.name) is not None}
            
    parsed_data = process_complaint_text(request.text, existing_dict)
    
    valid_columns = {c.name for c in Complaint.__table__.columns}
    filtered_data = {k: v for k, v in parsed_data.items() if k in valid_columns}
    
    if db_complaint:
        for key, value in filtered_data.items():
            setattr(db_complaint, key, value)
    else:
        db_complaint = Complaint(**filtered_data)
        db.add(db_complaint)
        
    db.commit()
    db.refresh(db_complaint)
    return db_complaint

@router.post("/upload", response_model=ComplaintSchema)
async def upload_complaint(file: UploadFile = File(...), complaint_id: int = None, db: Session = Depends(get_db)):
    content = await file.read()
    
    try:
        if file.filename.endswith(".pdf"):
            import pypdf
            import io
            reader = pypdf.PdfReader(io.BytesIO(content))
            text = ""
            for page in reader.pages:
                text += page.extract_text()
        else:
            text = content.decode("utf-8")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not read file: {str(e)}")

    existing_dict = None
    db_complaint = None
    
    if complaint_id:
        db_complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
        if db_complaint:
            existing_dict = {c.name: getattr(db_complaint, c.name) for c in Complaint.__table__.columns if getattr(db_complaint, c.name) is not None}

    parsed_data = process_complaint_text(text, existing_dict)
    
    valid_columns = {c.name for c in Complaint.__table__.columns}
    filtered_data = {k: v for k, v in parsed_data.items() if k in valid_columns}
    
    if db_complaint:
        for key, value in filtered_data.items():
            setattr(db_complaint, key, value)
    else:
        db_complaint = Complaint(**filtered_data)
        db.add(db_complaint)
        
    db.commit()
    db.refresh(db_complaint)
    return db_complaint

@router.get("/", response_model=List[ComplaintSchema])
def get_complaints(db: Session = Depends(get_db)):
    return db.query(Complaint).order_by(Complaint.created_at.desc()).all()

@router.get("/{complaint_id}", response_model=ComplaintSchema)
def get_complaint(complaint_id: int, db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return complaint

@router.put("/{complaint_id}", response_model=ComplaintSchema)
def update_complaint(complaint_id: int, complaint_update: ComplaintCreate, db: Session = Depends(get_db)):
    db_complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not db_complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
        
    update_data = complaint_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_complaint, key, value)
        
    db.commit()
    db.refresh(db_complaint)
    return db_complaint
