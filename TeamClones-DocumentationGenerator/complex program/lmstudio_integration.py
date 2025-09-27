import subprocess
import requests
import time
from pathlib import Path

class LMStudioManager:
    def __init__(self, host="localhost", port=1234):
        self.host = host
        self.port = port
        self.url = f"http://{host}:{port}"
    
    def check_lmstudio_connection(self) -> bool:
        """Check if LM Studio server is running"""
        try:
            response = requests.get(f"{self.url}/v1/models", timeout=10)
            return response.status_code == 200
        except:
            return False
    
    def start_lmstudio_server(self, model_path: str = None):
        """Start LM Studio server (this is a placeholder - actual implementation depends on your setup)"""
        print("Please ensure LM Studio is running with the Qwen/Qwen3-4B-2507 model loaded.")
        print(f"Expected URL: {self.url}")
        print("You can start LM Studio manually or through the GUI.")
    
    def load_model(self, model_name: str):
        """Load specific model (if supported by your LM Studio setup)"""
        # This would depend on your specific LM Studio implementation
        print(f"Please load the model '{model_name}' in LM Studio GUI")