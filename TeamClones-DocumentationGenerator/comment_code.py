# comment_code.py
import requests

def comment_code_with_llm(code: str) -> str:
    prompt = f"""You are a senior Python developer. Add clear, concise docstrings and comments to this code. 
Only return the improved code — no extra text.

Code:
{code}
"""

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "phi3",
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": 0.2}
        }
    )
    return response.json()["response"]

# Example usage
if __name__ == "__main__":
    with open("input.py", "r") as f:
        code = f.read()
    
    commented = comment_code_with_llm(code)
    
    with open("output.py", "w") as f:
        f.write(commented)
    
    print("✅ Done! See output.py")