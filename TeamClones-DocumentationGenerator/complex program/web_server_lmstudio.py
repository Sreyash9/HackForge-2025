# web_server_lmstudio.py
from flask import Flask, render_template, send_from_directory, jsonify
import os
from pathlib import Path
import markdown
from datetime import datetime

app = Flask(__name__)

class DocumentationWebServer:
    def __init__(self, docs_dir="docs", port=5000):
        self.docs_dir = Path(docs_dir)
        self.port = port
        self.setup_routes()
    
    def setup_routes(self):
        @app.route('/')
        def index():
            docs_files = list(self.docs_dir.glob("*.md"))
            return render_template('index.html', docs_files=docs_files)
        
        @app.route('/docs/<path:filename>')
        def serve_doc(filename):
            if filename.endswith('.md'):
                md_path = self.docs_dir / filename
                if md_path.exists():
                    with open(md_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    html_content = markdown.markdown(content, extensions=['tables', 'fenced_code'])
                    return render_template('doc_viewer.html', content=html_content, title=filename)
                else:
                    return "Documentation not found", 404
            else:
                return send_from_directory(self.docs_dir, filename)
    
    def start_server(self):
        """Start the web server"""
        app.run(host='0.0.0.0', port=self.port, debug=False)

def create_templates():
    """Create template files"""
    templates_dir = Path('templates')
    templates_dir.mkdir(exist_ok=True)
    
    index_html = """<!DOCTYPE html>
<html>
<head>
    <title>LM Studio Code Documentation</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 30px; }
        .doc-list { list-style-type: none; padding: 0; }
        .doc-item { margin: 10px 0; padding: 15px; border: 1px solid #ddd; 
                   background-color: white; border-radius: 5px; }
        .doc-link { text-decoration: none; color: #007bff; font-weight: bold; }
        .doc-link:hover { text-decoration: underline; }
        .stats { background-color: #e9ecef; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Generated Code Documentation</h1>
            <p>Powered by LM Studio (Qwen/Qwen3-4B-2507)</p>
        </div>
        
        <div class="stats">
            <h3>Documentation Statistics</h3>
            <p>Total documents: {{ docs_files|length }}</p>
        </div>
        
        <ul class="doc-list">
            {% for doc_file in docs_files %}
            <li class="doc-item">
                <a href="/docs/{{ doc_file.name }}" class="doc-link">{{ doc_file.name }}</a>
                <small style="color: #666;">- {{ doc_file.stat().st_size }} bytes</small>
            </li>
            {% endfor %}
        </ul>
    </div>
</body>
</html>"""

    doc_viewer_html = """<!DOCTYPE html>
<html>
<head>
    <title>{{ title }} - LM Studio Documentation</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .container { max-width: 1000px; margin: 0 auto; }
        h1, h2, h3 { color: #2c3e50; }
        pre { background-color: #f8f9fa; padding: 15px; border-radius: 5px; 
              overflow-x: auto; border: 1px solid #e9ecef; }
        code { background-color: #f8f9fa; padding: 2px 4px; border-radius: 3px; }
        table { border-collapse: collapse; width: 100%; margin: 15px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .header { text-align: center; margin-bottom: 30px; }
        .back-link { margin-bottom: 20px; display: inline-block; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <a href="/" class="back-link">← Back to Documentation Index</a>
            <h1>{{ title }}</h1>
        </div>
        <div class="content">
            {{ content|safe }}
        </div>
    </div>
</body>
</html>"""

    with open(templates_dir / 'index.html', 'w') as f:
        f.write(index_html)
    
    with open(templates_dir / 'doc_viewer.html', 'w') as f:
        f.write(doc_viewer_html)