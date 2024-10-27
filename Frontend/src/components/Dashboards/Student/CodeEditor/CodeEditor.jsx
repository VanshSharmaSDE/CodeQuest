import React, { useRef, useState, useEffect } from 'react';
import './CodeEditor.css';
import { Editor } from '@monaco-editor/react';
import { CODE_SNIPPETS } from './constants'; // Define your code snippets in this file

function CodeEditor({ onCodeChange, defaultCode }) {
  const editorRef = useRef();
  const [value, setValue] = useState(defaultCode || CODE_SNIPPETS.javascript); // Default to passed defaultCode or JavaScript
  const [language, setLanguage] = useState('');

  useEffect(() => {
    setValue(defaultCode); // Update editor value when defaultCode changes
  }, [defaultCode]);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    setValue(CODE_SNIPPETS[selectedLanguage]);
    onCodeChange(CODE_SNIPPETS[selectedLanguage]); // Immediately pass the selected default code
  };

  // Handle code change event
  const handleEditorChange = (newValue) => {
    setValue(newValue);
    onCodeChange(newValue,language); // Pass the updated code to the parent
  };

  return (
    <div className="code-editor-container">
      {/* Language selection dropdown */}
      <div className="language-select">
        <label htmlFor="language-select">Select Language:</label>
        <select
          id="language-select"
          value={language}
          onChange={onSelect}
          defaultValue="Select"
          style={{ color: 'var(--theme-color)' }} // Highlight selected language
        >
          <option value="" disabled>Select Language</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
        </select>
      </div>

      {/* Code editor */}
      <Editor
        options={{
          minimap: { enabled: false },
          padding: { top: 30 },
        }}
        height="50vh"
        theme="vs-dark"
        language={language}
        value={value}
        onMount={onMount}
        onChange={handleEditorChange} // Capture changes in the code editor
        fontFamily="monospace"
      />
    </div>
  );
}

export default CodeEditor;
