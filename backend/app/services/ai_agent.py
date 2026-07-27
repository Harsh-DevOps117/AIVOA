import os
from typing import Dict, Any, Annotated, TypedDict
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import StateGraph, END
import json
from dotenv import load_dotenv
import redis
import hashlib

load_dotenv()

redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
redis_client = redis.Redis.from_url(redis_url)

groq_api_key = os.getenv("GROQ_API_KEY")

llm = ChatGroq(
    temperature=0,
    model_name="llama-3.3-70b-versatile",
    groq_api_key=groq_api_key
) if groq_api_key and groq_api_key != "" else None

class AgentState(TypedDict):
    text: str
    existing_data: Dict[str, Any]
    parsed_data: Dict[str, Any]

def parse_complaint(state: AgentState):
    text = state["text"]
    existing_data = state.get("existing_data", {})

    if not llm:
        return {"parsed_data": {
            "issue_description": text,
            "completeness_status": "Incomplete",
            "missing_info": "No AI configured."
        }}

    system_prompt = """You are an AI assistant for a Pharmaceutical Quality Management System (QMS).
    Extract information from a customer complaint text into a FLAT JSON object. 
    DO NOT use nested objects. The JSON must have EXACTLY these top-level keys:
    
    "complaint_source": (string, e.g. Pharmacy, Hospital, Patient)
    "customer_name": (string)
    "product_name": (string)
    "product_strength": (string, e.g. 500 mg)
    "batch_number": (string)
    "affected_quantity": (string)
    "manufacturing_date": (string)
    "expiry_date": (string)
    "originating_site_block": (string, e.g. Manufacturing, Packaging)
    "impacted_npm": (string, Non-Product Material like 'Primary Packaging (Bottle)')
    "complaint_category": (string)
    "issue_description": (string, summarize the core issue)
    "severity": (string, Critical, Major, or Minor)
    "suggested_next_action": (string, e.g. 'Route to QA Investigation & Issue Replacement')
    "initial_risk_assessment": (string, e.g. 'Potential moisture ingress leading to discoloration.')
    "completeness_status": (string, 'Complete' if major fields present, 'Incomplete' otherwise)
    "missing_info": (string)

    Respond ONLY with a valid, flat JSON object. Do not include markdown formatting like ```json.
    """
    
    if existing_data:
        system_prompt += f"\n\nEXISTING QMS RECORD (Update this with the user's new instructions):\n{json.dumps(existing_data, indent=2)}\n\nOnly update the fields mentioned by the user. Keep other fields the same."

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=text)
    ]

    response = llm.invoke(messages)

    try:
        content = response.content.strip()
        if content.startswith("```json"):
            content = content[7:-3]
        elif content.startswith("```"):
            content = content[3:-3]

        parsed_data = json.loads(content)
    except Exception as e:
        print(f"Error parsing LLM response: {e}")
        parsed_data = {
            "issue_description": text,
            "completeness_status": "Incomplete",
            "missing_info": "Failed to parse AI response."
        }

    return {"parsed_data": parsed_data}

workflow = StateGraph(AgentState)
workflow.add_node("parse_complaint", parse_complaint)
workflow.set_entry_point("parse_complaint")
workflow.add_edge("parse_complaint", END)
agent = workflow.compile()

def process_complaint_text(text: str, existing_data: Dict[str, Any] = None) -> Dict[str, Any]:
    state_to_hash = {"text": text, "existing_data": existing_data or {}}
    cache_key = "qms:ai:" + hashlib.md5(json.dumps(state_to_hash, sort_keys=True).encode()).hexdigest()
    
    try:
        cached_result = redis_client.get(cache_key)
        if cached_result:
            print("CACHE HIT: Using cached AI response")
            return json.loads(cached_result)
    except Exception as e:
        print(f"Redis read error: {e}")

    print("CACHE MISS: Invoking LLM...")
    state = {"text": text, "existing_data": existing_data or {}, "parsed_data": {}}
    result = agent.invoke(state)
    parsed_data = result["parsed_data"]
    
    try:
        redis_client.setex(cache_key, 3600, json.dumps(parsed_data))
    except Exception as e:
        print(f"Redis write error: {e}")
        
    return parsed_data
