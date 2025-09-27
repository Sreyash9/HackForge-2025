# git_integration_lmstudio.py
import os
import subprocess
from pathlib import Path

class GitDocumentationManager:
    def __init__(self, lmstudio_url="http://localhost:1234"):
        self.lmstudio_url = lmstudio_url
    
    def setup_git_hooks(self):
        """Set up pre-commit hook for automatic documentation generation"""
        # Create .git/hooks directory if it doesn't exist
        hooks_dir = Path(".git/hooks")
        hooks_dir.mkdir(parents=True, exist_ok=True)
        
        # Create pre-commit hook content
        pre_commit_content = f"""#!/usr/bin/env python3
import os
import sys
import subprocess
import requests
from pathlib import Path

# Configuration
LM_STUDIO_URL = "{self.lmstudio_url}"
MODEL_ID = "qwen/qwen3-4b-2507"

def get_staged_files():
    \"\"\"Get list of staged files to analyze\"\"\"
    result = subprocess.run(
        ["git", "diff", "--name-only", "--cached", "--diff-filter=ACMR"],
        capture_output=True, text=True
    )
    return [f for f in result.stdout.strip().split('\\n') if f and Path(f).is_file()]

def analyze_with_lm_studio(content, filename):
    \"\"\"Send code to LM Studio for analysis\"\"\"
    prompt = f\"\"\"Analyze this code for potential issues:
- Logic errors
- Security vulnerabilities
- Performance bottlenecks
- Style violations
- Best practice deviations
- Maintainability issues

Be concise and specific. If issues are found, provide line numbers and brief explanations.
If no issues are found, respond with 'No issues detected'.

File: {{filename}}
Language: {{filename.split('.')[-1]}}

Code:
```{{filename.split('.')[-1]}}
{{content}}
```\"\"\"

    payload = {{
        "model": MODEL_ID,
        "messages": [
            {{
                "role": "system",
                "content": "You are an expert code reviewer. Provide specific, actionable feedback. Focus on correctness, security, and maintainability."
            }},
            {{
                "role": "user",
                "content": prompt
            }}
        ],
        "temperature": 0.2,
        "max_tokens": 500,
        "top_p": 0.9,
        "frequency_penalty": 0.2,
        "presence_penalty": 0.2
    }}
    
    try:
        response = requests.post(
            f"{{LM_STUDIO_URL}}/v1/chat/completions",
            json=payload,
            timeout=30
        )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
    except requests.exceptions.ConnectionError:
        print(f"Error: Cannot connect to LM Studio at {{LM_STUDIO_URL}}")
        print("Make sure LM Studio is running with API enabled")
        sys.exit(1)
    except requests.exceptions.RequestException as e:
        print(f"Error: LM Studio API Error: {{e}}")
        sys.exit(1)

def main():
    # Simplified server check - try to get models
    try:
        # Try the models endpoint first
        models_response = requests.get(f"{{LM_STUDIO_URL}}/v1/models", timeout=5)
        if models_response.status_code != 200:
            # If models endpoint doesn't work, try a simple GET to the base URL
            base_response = requests.get(f"{{LM_STUDIO_URL}}/", timeout=5)
            if base_response.status_code != 200:
                print(f"Error: LM Studio server not accessible at {{LM_STUDIO_URL}}")
                print("Make sure LM Studio is running with API enabled")
                sys.exit(1)
    except requests.exceptions.ConnectionError:
        print(f"Error: LM Studio server not accessible at {{LM_STUDIO_URL}}")
        print("Make sure LM Studio is running with API enabled")
        sys.exit(1)
    
    staged_files = get_staged_files()
    if not staged_files:
        sys.exit(0)
    
    issues_found = False
    for file_path in staged_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except UnicodeDecodeError:
            print(f"Warning: Skipping binary file: {{file_path}}")
            continue
        
        findings = analyze_with_lm_studio(content, file_path)
        
        if findings.strip() and "no issues detected" not in findings.lower():
            print(f"LLM Analysis found issues in {{file_path}}:")
            print(findings)
            print()
            issues_found = True
    
    if issues_found:
        print("LLM analysis detected issues. Please review before committing.")
        sys.exit(1)
    
    sys.exit(0)

if __name__ == "__main__":
    main()
"""

        # Write pre-commit hook
        pre_commit_path = hooks_dir / "pre-commit"
        with open(pre_commit_path, 'w', encoding='utf-8') as f:
            f.write(pre_commit_content)
        
        # Make executable on Unix systems
        if os.name != 'nt':  # Not Windows
            os.chmod(pre_commit_path, 0o755)
        
        print("Git pre-commit hook has been set up successfully")
    
    def commit_documentation(self):
        """Commit generated documentation to git"""
        try:
            # Check if we're in a git repository
            result = subprocess.run(["git", "rev-parse", "--is-inside-work-tree"], 
                                  capture_output=True, text=True)
            if result.returncode != 0:
                print("Not in a git repository")
                return
            
            # Add all documentation files
            subprocess.run(["git", "add", "docs/"], check=True)
            
            # Commit documentation
            subprocess.run(["git", "commit", "-m", "Update documentation generated by LM Studio"], check=True)
            
            print("Documentation committed successfully")
            
        except subprocess.CalledProcessError as e:
            print(f"Error committing documentation: {e}")