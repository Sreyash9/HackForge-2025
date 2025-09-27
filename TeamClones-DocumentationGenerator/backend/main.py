# backend/main.py
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, HTTPException
import requests

app = FastAPI(title="Simple Doc Gen")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def comment_code_with_llm(code: str) -> str:
    prompt = f"""You are a senior Python developer. Add clear, concise Google-style docstrings and inline comments to this code. Also
    extract the classes, the functions and their arguments with types and return types. Do not change the code logic.
Only return the improved code — no extra text.

Code:
{code}
"""
    
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "phi3",
                "prompt": prompt,
                "stream": False,
                "options": {"temperature": 0.2}
            },
            timeout=60
        )
        response.raise_for_status()  # ← This will raise HTTP errors
        return response.json()["response"]
        
    except requests.exceptions.RequestException as e:
        # Log the real error
        print(f"[LLM ERROR] {e}")
        print(f"[LLM ERROR] Response: {getattr(e.response, 'text', 'No response')}")
        return f"# ERROR: LLM unavailable — {str(e)}"
    except Exception as e:
        print(f"[LLM UNKNOWN ERROR] {e}")
        return f"# ERROR: LLM failed — {str(e)}"

@app.post("/comment")
async def comment_code(file: UploadFile):
    # REPAIRED LINE 44: Check that file.filename is not None before using .endswith()
    if file.filename is None or not file.filename.endswith(".py"):
        raise HTTPException(status_code=400, detail="Only .py files allowed")
    
    code = (await file.read()).decode("utf-8")
    commented = comment_code_with_llm(code)
    return {"commented_code": commented}