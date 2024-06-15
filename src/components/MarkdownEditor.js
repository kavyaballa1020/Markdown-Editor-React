import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Dropzone from 'react-dropzone';
import './MarkdownEditor.css'; 

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
      <header>
        <h1>Markdown Editor</h1>
        <p>Edit and preview your Markdown content.</p>
      </header>
      <div className="editor-container">
        <div className="editor-pane">
          <textarea
            value={markdown}
            onChange={handleMarkdownChange}
            placeholder="Enter markdown here..."
          />
          <button onClick={handleExport}>Download MarkDown</button>
          <Dropzone onDrop={handleDrop}>
            {({getRootProps, getInputProps}) => (
              <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                <p>Drag & drop a markdown file here, or click to select a file</p>
              </div>
            )}
          </Dropzone>
        </div>
        <div className="divider" />
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
      <footer>
        <p>Markdown Editor by Kavya Balla. &copy; 2024</p>
      </footer>
    </div>
  );
};

export default MarkdownEditor;
