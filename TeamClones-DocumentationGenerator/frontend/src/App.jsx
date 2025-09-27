// frontend/src/App.jsx
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

function App() {
  const [originalCode, setOriginalCode] = useState('');
  const [commentedCode, setCommentedCode] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.endsWith('.py')) {
      alert('Please upload a .py file');
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalCode(event.target.result);
      setCommentedCode('');
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    if (!originalCode) return;
    
    setLoading(true);
    const formData = new FormData();
    const blob = new Blob([originalCode], { type: 'text/python' });
    formData.append('file', blob, fileName || 'code.py');

    try {
      const res = await fetch('http://localhost:8000/comment', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setCommentedCode(data.commented_code);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Simple Doc Gen</h1>
      <p>Upload a Python file → Get LLM-commented code</p>

      <input type="file" accept=".py" onChange={handleFileUpload} />
      <button onClick={handleSubmit} disabled={!originalCode || loading}>
        {loading ? 'Generating...' : 'Generate Docs'}
      </button>

      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div style={{ flex: 1 }}>
          <h3>Original Code</h3>
          <Editor
            width="600px"
            height="500px"
            language="python"
            value={originalCode}
            theme="vs-dark"
            options={{ readOnly: true }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <h3>Commented Code</h3>
          <Editor
            width="1000px"
            height="500px"
            language="python"
            value={commentedCode}
            theme="vs-dark"
            options={{ readOnly: true }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;