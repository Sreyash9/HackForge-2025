
## 2. Updated `deploy_docs_lmstudio.py` with Upload Feature


import os
import subprocess
import shutil
from pathlib import Path
import argparse
import requests
import json

def upload_to_webpage(docs_dir, webpage_url, api_key=None):
    """Upload documentation files to a webpage"""
    docs_path = Path(docs_dir)
    if not docs_path.exists():
        print(f"Error: Documentation directory {docs_dir} does not exist")
        return
    
    # This is a placeholder - you'll need to customize this based on your webpage's API
    headers = {'Content-Type': 'application/json'}
    if api_key:
        headers['Authorization'] = f'Bearer {api_key}'
    
    for doc_file in docs_path.rglob("*.md"):
        with open(doc_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Prepare upload data
        upload_data = {
            'filename': doc_file.name,
            'content': content,
            'path': str(doc_file.relative_to(docs_path))
        }
        
        try:
            response = requests.post(
                f"{webpage_url}/upload",
                json=upload_data,
                headers=headers
            )
            
            if response.status_code == 200:
                print(f"Successfully uploaded {doc_file.name}")
            else:
                print(f"Failed to upload {doc_file.name}: {response.status_code}")
        except Exception as e:
            print(f"Error uploading {doc_file.name}: {str(e)}")

def main():
    parser = argparse.ArgumentParser(description='LM Studio Code Documentation Generator')
    parser.add_argument('--directory', default='.', help='Directory to process')
    parser.add_argument('--output', default='docs', help='Output directory for docs')
    parser.add_argument('--lmstudio-url', default='http://localhost:1234', help='LM Studio URL')
    parser.add_argument('--auto', action='store_true', help='Auto mode for git hooks')
    parser.add_argument('--serve', action='store_true', help='Start web server')
    parser.add_argument('--check-connection', action='store_true', help='Check LM Studio connection')
    parser.add_argument('--upload', action='store_true', help='Upload docs to webpage')
    parser.add_argument('--webpage-url', default='http://your-webpage.com', help='Webpage URL for upload')
    parser.add_argument('--api-key', help='API key for webpage upload')
    
    args = parser.parse_args()
    
    if args.check_connection:
        import requests
        try:
            response = requests.get(f"{args.lmstudio_url}/v1/models", timeout=10)
            if response.status_code == 200:
                print("LM Studio is connected and running")
            else:
                print("Could not connect to LM Studio. Please ensure it's running at:", args.lmstudio_url)
        except Exception:
            print("Could not connect to LM Studio. Please ensure it's running at:", args.lmstudio_url)
        return
    
    if args.serve:
        print("Web server functionality not implemented yet")
    else:
        from documentation_generator_lmstudio import process_code_files
        processed = process_code_files(args.directory, args.output, args.lmstudio_url)
        
        if not args.auto:
            # Only try to set up git hooks if we're in a git repository
            try:
                # Check if we're in a git repository
                result = subprocess.run(["git", "rev-parse", "--is-inside-work-tree"], 
                                      capture_output=True, text=True)
                
                if result.returncode == 0:
                    from git_integration_lmstudio import GitDocumentationManager
                    git_manager = GitDocumentationManager(lmstudio_url=args.lmstudio_url)
                    git_manager.setup_git_hooks()
                    
                    # Only commit if there are files to commit
                    if processed:
                        git_manager.commit_documentation()
                else:
                    print("Not in a git repository. Skipping git operations.")
            except Exception as e:
                print(f"Git operation failed: {e}")
                print("Continuing without git integration...")
        
        print(f"Processed {len(processed)} files using LM Studio")
        
        # Upload to webpage if requested
        if args.upload:
            print(f"Uploading documentation to {args.webpage_url}")
            upload_to_webpage(args.output, args.webpage_url, args.api_key)

if __name__ == "__main__":
    main()

# Add this function to your existing deploy_docs_lmstudio.py
def upload_docs_to_git(docs_dir="docs", git_repo_url=None, git_branch="main"):
    """
    Upload documentation files to a git repository (for web hosting)
    """
    docs_path = Path(docs_dir)
    if not docs_path.exists():
        print(f"Error: Documentation directory {docs_dir} does not exist")
        return False
    
    if not git_repo_url:
        print("No git repository URL provided. Please set GITHUB_DOCS_REPO environment variable or pass --git-repo-url")
        return False
    
    # Create a temporary directory for the git repo
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_path = Path(temp_dir)
        
        try:
            print(f"Cloning documentation repository: {git_repo_url}")
            # Clone the documentation repository
            subprocess.run([
                "git", "clone", git_repo_url, str(temp_path / "docs_repo")
            ], check=True, capture_output=True)
            
            docs_repo_path = temp_path / "docs_repo"
            
            # Copy documentation files to the git repo
            target_docs_dir = docs_repo_path / "docs"
            target_docs_dir.mkdir(exist_ok=True)
            
            for doc_file in docs_path.rglob("*"):
                if doc_file.is_file():
                    target_path = target_docs_dir / doc_file.relative_to(docs_path)
                    target_path.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(doc_file, target_path)
                    print(f"Copied {doc_file.name} to documentation repo")
            
            # Commit and push changes
            original_cwd = os.getcwd()
            os.chdir(docs_repo_path)
            
            subprocess.run(["git", "add", "."], check=True, capture_output=True)
            
            # Check if there are changes to commit
            result = subprocess.run(["git", "status", "--porcelain"], 
                                  capture_output=True, text=True)
            if result.stdout.strip():
                subprocess.run([
                    "git", "commit", "-m", 
                    f"Auto-update documentation - {Path.cwd().name}"
                ], check=True, capture_output=True)
                
                subprocess.run([
                    "git", "push", "origin", git_branch
                ], check=True, capture_output=True)
                
                print(f"Documentation successfully uploaded to {git_repo_url}")
                os.chdir(original_cwd)
                return True
            else:
                print("No changes to commit in documentation repository")
                os.chdir(original_cwd)
                return True
                
        except subprocess.CalledProcessError as e:
            print(f"Error uploading to git repository: {e}")
            if 'original_cwd' in locals():
                os.chdir(original_cwd)
            return False
        except Exception as e:
            print(f"Unexpected error: {e}")
            if 'original_cwd' in locals():
                os.chdir(original_cwd)
            return False