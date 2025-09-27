import os
import subprocess
import shutil
from pathlib import Path
import tempfile

def upload_docs_to_git(docs_dir="docs", git_repo_url="https://github.com/arebirdsreal/documents.git", git_branch="main"):
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

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description='Upload documentation to git repository')
    parser.add_argument('--docs-dir', default='docs', help='Directory containing documentation')
    parser.add_argument('--git-repo-url', help='Git repository URL for documentation')
    parser.add_argument('--branch', default='main', help='Git branch to push to')
    
    args = parser.parse_args()
    
    # Use environment variable if URL not provided
    git_repo_url = args.git_repo_url or os.getenv('GITHUB_DOCS_REPO')
    
    success = upload_docs_to_git(
        docs_dir=args.docs_dir,
        git_repo_url=git_repo_url,
        git_branch=args.branch
    )
    
    if success:
        print("Upload completed successfully!")
    else:
        print("Upload failed!")
        exit(1)