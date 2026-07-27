# AIVIO Copilot: AI-Powered QMS Ledger

An advanced, AI-driven Customer Complaint Management System designed specifically for the pharmaceutical manufacturing industry (API and FDF). Built with a highly premium, Anthropic-inspired editorial design language, this system leverages **LangGraph**, **Groq (llama-3.3-70b-versatile)**, and **PostgreSQL** to automate the intake, structuring, and risk assessment of unstructured complaint documents and emails.

---

## 🌟 Key Features

### 1. Intelligent Parsing Workflow
- **Multi-Modal Intake**: Drag-and-drop raw complaint PDFs, TXT files, or directly paste email chains into the intake interface.
- **Automated QMS Extraction**: The LangGraph agent seamlessly extracts 12+ highly specific QMS fields (Batch Number, Affected Quantity, Impacted Non-Product Materials, etc.) from unstructured text.

### 2. Conversational Updating (The "Green Glow")
- A standout UX feature: If the AI misses a detail or the user wants to amend a record, they can converse with the AI in the sidebar (e.g., *"Change the dosage to 500mg"*). 
- The backend injects the *existing* QMS JSON context back into the LLM, intelligently updating only the requested fields. The frontend detects this state delta and smoothly **glows the updated input fields green** to provide instant visual feedback to the investigator.

### 3. Enterprise Backend Architecture
- **Redis Caching Layer**: To minimize latency and save API tokens, LLM inputs are hashed (MD5) and cached in Redis. Identical complaint texts resolve instantly via cache hits.
- **Dockerized PostgreSQL**: Reliable, production-ready relational data storage.

### 4. Interactive Dashboard
- Alternating dark/light surface UI cards displaying critical quality metrics.
- Clicking on any complaint in the ledger opens a smooth `framer-motion` modal containing a comprehensive, highly readable summary of the complaint and the AI risk assessment.

---

## 🏆 Bonus Features Implemented

1. **Complaint Completeness Checker**: The AI determines a `completeness_status` and generates a list of missing mandatory fields (`missing_info`).
2. **CAPA Recommendation**: Generates a `suggested_next_action` (Corrective and Preventive Action) based on pharmacological context.
3. **AI Risk Classification**: Calculates `severity` (Critical, Major, Minor) and writes out an `initial_risk_assessment` paragraph.
4. **Complaint Summary**: Elegant modal summaries in the QMS Dashboard.

---

## 🛠️ Technology Stack

| Component | Technology |
| --- | --- |
| **Frontend** | React, TypeScript, Redux Toolkit, Tailwind CSS, Framer Motion |
| **Backend** | Python, FastAPI, SQLAlchemy, Pydantic |
| **AI Framework** | LangGraph, LangChain |
| **LLM Inference** | Groq (`llama-3.3-70b-versatile`) |
| **Database & Cache** | PostgreSQL 15, Redis 7 (via Docker Compose) |
| **Typography** | Google Inter (Body) & Cormorant Garamond (Display) |

---

## 🚀 Setup & Installation

### 1. Prerequisites
- Docker & Docker Compose
- Python 3.10+
- Node.js 18+

### 2. Infrastructure Setup (Database & Cache)
Start the PostgreSQL and Redis containers:
```bash
docker compose up -d
```

### 3. Backend Setup
Navigate to the `backend` directory, create a virtual environment, and install dependencies:
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn sqlalchemy psycopg2-binary redis langchain-groq langgraph pypdf python-dotenv pydantic
```

Create a `.env` file in the `backend` directory:
```env
GROQ_API_KEY="your_groq_api_key_here"
DATABASE_URL="postgresql://aivio:secretpassword@localhost:5432/aivio_qms"
REDIS_URL="redis://localhost:6380/0"
```

Start the FastAPI server:
```bash
uvicorn main:app --reload
```

### 4. Frontend Setup
In a new terminal, navigate to the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```

The application will be running at `http://localhost:5173`.

---

## 🎥 Demonstration Video
*(Insert link to YouTube/Google Drive video here)*
