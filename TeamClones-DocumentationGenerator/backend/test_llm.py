import requests
res = requests.post("http://localhost:11434/api/generate", json={
    "model": "phi3",
    "prompt": "What is documentation?",
    "stream": False
})
print(res.json()["response"])