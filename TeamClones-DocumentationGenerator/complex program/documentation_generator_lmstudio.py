import os
import requests
import json
import re
from pathlib import Path
from typing import Dict, List, Tuple
import ast
from datetime import datetime

class LMStudioDocumentationGenerator:
    def __init__(self, lmstudio_url="http://localhost:1234", model_name="qwen/qwen3-4b-2507"):
        self.lmstudio_url = lmstudio_url
        self.model_name = model_name
        self.supported_extensions = ['.py', '.js', '.ts', '.java', '.cpp', '.c', '.go', '.rs']
        
    def query_lmstudio(self, prompt: str, max_tokens: int = 2000, temperature: float = 0.7) -> Dict:
        headers = {
            'Content-Type': 'application/json'
        }
        
        data = {
            "model": self.model_name,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": temperature,
            "max_tokens": max_tokens,
            "stream": False
        }
        
        try:
            response = requests.post(
                f"{self.lmstudio_url}/v1/chat/completions",
                headers=headers,
                json=data,
                timeout=300
            )
            
            if response.status_code == 200:
                result = response.json()
                content = result['choices'][0]['message']['content']
                
                json_match = re.search(r'\{.*\}', content, re.DOTALL)
                if json_match:
                    json_string = json_match.group().strip().strip('`').strip()
                    return json.loads(json_string)
                else:
                    return {"analysis": content}
            else:
                return {"error": f"LM Studio API error: {response.status_code} - {response.text}"}
                
        except requests.exceptions.RequestException as e:
            return {"error": f"Connection error: {str(e)}. Ensure LM Studio is running at {self.lmstudio_url}."}
        except json.JSONDecodeError as e:
            return {"error": f"Invalid JSON response from LM Studio: {str(e)}"}
    
    def analyze_code(self, file_path: str) -> Dict:
        with open(file_path, 'r', encoding='utf-8') as f:
            code_content = f.read()
        
        analysis_prompt = f"""
        Analyze the following code and provide detailed documentation. The code is:

        {code_content}

        Please provide the analysis in the following JSON format:
        {{
            "file_summary": "Brief summary of the file's purpose and functionality",
            "function_explanations": [
                {{
                    "name": "function_name",
                    "summary": "Brief explanation of the function",
                    "parameters": ["param1: description", "param2: description"],
                    "returns": "description of return value",
                    "purpose": "what the function does"
                }}
            ],
            "class_explanations": [
                {{
                    "name": "class_name",
                    "summary": "Brief explanation of the class",
                    "methods": [
                        {{
                            "name": "method_name",
                            "summary": "Brief explanation of the method"
                        }}
                    ]
                }}
            ],
            "imports": ["list of imported modules and their purpose"],
            "key_variables": ["variable_name: purpose"],
            "algorithm_explanation": "Explanation of complex algorithms in plain language",
            "complexity_analysis": "Time and space complexity analysis",
            "improvements": "Suggested improvements and optimizations",
            "security_considerations": "Security implications if any",
            "comments_for_code": "Provide a version of the code with short, helpful comments added inline"
        }}

        Make sure the response is valid JSON and contains detailed explanations.
        """
        
        return self.query_lmstudio(analysis_prompt)
    
    def _get_relevant_docstring(self, analysis: Dict, node) -> str:
        explanation = analysis.get('algorithm_explanation', 'Auto-generated documentation.')
        
        if isinstance(node, ast.FunctionDef) or isinstance(node, ast.AsyncFunctionDef):
            return f"Function: {node.name}\n{explanation}"
        elif isinstance(node, ast.ClassDef):
            return f"Class: {node.name}\n{explanation}"
        elif isinstance(node, ast.Module):
            return f"Module Documentation\n{explanation}"
        return "Auto-generated documentation"
    
    def add_docstrings_to_code(self, file_path: str, analysis: Dict) -> str:
        with open(file_path, 'r', encoding='utf-8') as f:
            original_code = f.read()
        
        if not file_path.endswith('.py'):
             return original_code 

        try:
            tree = ast.parse(original_code)
        except SyntaxError:
            return original_code
        
        lines = original_code.split('\n')
        
        insertions = []
        for node in ast.walk(tree):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef, ast.Module)):
                docstring_content = self._get_relevant_docstring(analysis, node)
                
                if docstring_content and hasattr(node, 'body') and node.body:
                    first_child = node.body[0]
                    
                    docstring_exists = (
                        isinstance(first_child, ast.Expr) and 
                        hasattr(first_child.value, 'value') and 
                        isinstance(first_child.value.value, str)
                    )
                    
                    if not docstring_exists:
                        line_num = getattr(node, 'lineno', None)
                        if line_num is None: continue
                        
                        indent = ' ' * (getattr(node, 'col_offset', 0))
                        
                        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
                            docstring_indent = indent + '    '
                        else:
                            docstring_indent = indent
                        
                        formatted_docstring = f'"""\n{docstring_content}\n{docstring_indent}"""'
                        docstring_line = f'{docstring_indent}{formatted_docstring}'
                        
                        insertions.append((line_num, docstring_line))
        
        insertions.sort(key=lambda x: x[0], reverse=True)
        
        for line_num, docstring_line in insertions:
            lines.insert(line_num, docstring_line)
            
        return '\n'.join(lines)
    
    def create_per_file_documentation(self, file_path: str, analysis: Dict, output_dir: str) -> str:
        file_name = Path(file_path).stem
        file_docs_dir = os.path.join(output_dir, file_name)
        os.makedirs(file_docs_dir, exist_ok=True)
        
        doc_filename = f"{file_name}_docs.md"
        doc_path = os.path.join(file_docs_dir, doc_filename)
        
        commented_code = analysis.get('comments_for_code', 'No commented code provided')
        
        file_summary = analysis.get('file_summary', 'No summary available')
        function_explanations = analysis.get('function_explanations', [])
        class_explanations = analysis.get('class_explanations', [])
        imports = analysis.get('imports', [])
        key_variables = analysis.get('key_variables', [])
        algorithm_explanation = analysis.get('algorithm_explanation', 'No algorithm explanation available')
        complexity_analysis = analysis.get('complexity_analysis', 'No complexity analysis available')
        security_considerations = analysis.get('security_considerations', 'No security considerations identified')
        improvements = analysis.get('improvements', 'No suggestions available')
        
        func_explanations_str = ""
        for func in function_explanations:
            func_explanations_str += f"### Function: {func.get('name', 'Unknown')}\n"
            func_explanations_str += f"**Summary:** {func.get('summary', '')}\n\n"
            if func.get('parameters'):
                func_explanations_str += f"**Parameters:**\n"
                for param in func['parameters']:
                    func_explanations_str += f"- {param}\n"
                func_explanations_str += "\n"
            if func.get('returns'):
                func_explanations_str += f"**Returns:** {func['returns']}\n\n"
            if func.get('purpose'):
                func_explanations_str += f"**Purpose:** {func['purpose']}\n\n"
        
        class_explanations_str = ""
        for cls in class_explanations:
            class_explanations_str += f"### Class: {cls.get('name', 'Unknown')}\n"
            class_explanations_str += f"**Summary:** {cls.get('summary', '')}\n\n"
            if cls.get('methods'):
                class_explanations_str += f"**Methods:**\n"
                for method in cls['methods']:
                    class_explanations_str += f"- {method.get('name', 'Unknown')}: {method.get('summary', '')}\n"
                class_explanations_str += "\n"
        
        code_lang = Path(file_path).suffix.lstrip('.') if Path(file_path).suffix else 'code'

        doc_content = f"""# Documentation for {file_path}

**Generated on:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Model:** {self.model_name}
**File:** {file_path}

## File Summary
{file_summary}

## Imports
{chr(10).join([f'- {imp}' for imp in imports])}

## Key Variables
{chr(10).join([f'- {var}' for var in key_variables])}

## Function Explanations
{func_explanations_str}

## Class Explanations
{class_explanations_str}

## Algorithm Explanation
{algorithm_explanation}

## Complexity Analysis
{complexity_analysis}

## Security Considerations
{security_considerations}

## Improvements
{improvements}

## Code with Comments
```{code_lang}
{commented_code}
```
""" 
        with open(doc_path, 'w', encoding='utf-8') as f:
            f.write(doc_content)
        
        return doc_path

def process_code_files(directory: str, output_dir: str = "docs", lmstudio_url: str = "http://localhost:1234") -> List[Tuple[str, str, Dict]]:
    generator = LMStudioDocumentationGenerator(lmstudio_url=lmstudio_url)
    
    os.makedirs(output_dir, exist_ok=True)
    
    processed_files = []
    
    for root, _, files in os.walk(directory):
        for file in files:
            if any(file.endswith(ext) for ext in generator.supported_extensions):
                file_path = os.path.join(root, file)
                
                print(f"Processing: {file_path}")
                
                analysis = generator.analyze_code(file_path)
                
                if 'error' not in analysis:
                    doc_path = generator.create_per_file_documentation(file_path, analysis, output_dir)
                    processed_files.append((file_path, doc_path, analysis))
                    print(f"Documentation created: {doc_path}")
                else:
                    print(f"Error analyzing {file_path}: {analysis['error']}")
                    
    return processed_files

if __name__ == "__main__":
    test_file_path = "test_module.py"
    if not os.path.exists(test_file_path):
        print(f"Creating dummy file for testing: {test_file_path}")
        with open(test_file_path, 'w') as f:
            f.write("""
import math
def calculate_area(radius: float) -> float:
    area = math.pi * (radius ** 2)
    return area

class Geometry:
    def perimeter(self, radius: float) -> float:
        return 2 * math.pi * radius
""")

    source_directory = "." 
    output_directory = "docs_output"
    
    print(f"Starting documentation generation in '{output_directory}'. Ensure LM Studio server is running at http://localhost:1234...")
    processed_files = process_code_files(
        directory=source_directory, 
        output_dir=output_directory
    )
    
    print("\n--- Documentation Generation Summary ---")
    if processed_files:
        for original_file, doc_file, _ in processed_files:
            print(f"SUCCESS: Documented {original_file} -> {doc_file}")
    else:
        print("INFO: No supported files were processed, or errors occurred. Check the console for details.")