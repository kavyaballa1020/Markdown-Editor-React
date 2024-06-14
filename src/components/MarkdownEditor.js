// src/MarkdownEditor.js
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Dropzone from 'react-dropzone';
import './MarkdownEditor.css'; // Add some basic styling

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState('');

  const handleMarkdownChange = (e) => {
    setMarkdown(e.target.value);
  };

  const handleDrop = (files) => {
    const reader = new FileReader();
    reader.onload = () => {
      setMarkdown(reader.result);
    };
    reader.readAsText(files[0]);
  };

  const handleExport = () => {
    const element = document.createElement("a");
    const file = new Blob([markdown], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "markdown.md";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="markdown-editor">
      <div className="editor-pane">
        <textarea
          value={markdown}
          onChange={handleMarkdownChange}
          placeholder="Enter markdown here..."
        />
        <button onClick={handleExport}>Export</button>
        <Dropzone onDrop={handleDrop}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()} className="dropzone">
              <input {...getInputProps()} />
              <p>Drag & drop a markdown file here, or click to select a file</p>
            </div>
          )}
        </Dropzone>
      </div>
      <div className="preview-pane">
        <ReactMarkdown
          children={markdown}
          components={{
            code({node, inline, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter
                  style={docco}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }
          }}
        />
      </div>
    </div>
  );
};

export default MarkdownEditor;
