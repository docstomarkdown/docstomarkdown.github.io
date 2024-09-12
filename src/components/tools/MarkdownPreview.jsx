import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBold, faItalic, faUnderline, faListOl, faListUl, faQuoteRight,
  faCode, faImage, faLink, faHighlighter, faHeading, faTable, faEraser, faUndo,
  faRedo, faCopy, faDownload
} from '@fortawesome/free-solid-svg-icons';
import ReactDOMServer from 'react-dom/server';
import 'highlight.js/styles/github.css';
import './MarkdownPreview.css'; // Optional: Use a highlight.js theme

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState(''); // Initial state with empty string
  const [history, setHistory] = useState([{ content: '' }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const inputRef = useRef(null);

  // Update editor content and history
  const updateContent = (newContent) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ content: newContent });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setMarkdown(newContent);
  };

  // Handle input change
  const handleInputChange = (e) => {
    updateContent(e.target.value);
  };

  // Undo action
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setMarkdown(history[historyIndex - 1].content);
    }
  };

  // Redo action
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setMarkdown(history[historyIndex + 1].content);
    }
  };

  // Copy markdown content to clipboard
  const handleCopy = () => {
    // Convert markdown to HTML
    const htmlContent = ReactDOMServer.renderToStaticMarkup(
      <ReactMarkdown
        children={markdown}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize, rehypeHighlight]}
      />
    );
    
    // Copy HTML content to clipboard
    navigator.clipboard.writeText(htmlContent).then(() => {
      alert("Rich text copied to clipboard!");
    }).catch(err => {
      console.error("Failed to copy text: ", err);
    });
  };

  // Download markdown as a file
  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'markdown-content.docx'; // Change file extension to .docx
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Wrap selected text with prefix and suffix
  const wrapSelectedText = (prefix, suffix = '') => {
    const textarea = inputRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      
      // Apply formatting
      const newText = `${prefix}${selectedText}${suffix || prefix}`;
      const newContent = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
      updateContent(newContent);
      
      // Set cursor position after the formatted text
      textarea.setSelectionRange(start + newText.length, start + newText.length);
      textarea.focus();
    }
  };
  
  // Specific handler for image button
  const handleImage = () => {
    const imageSyntax = '![Alt text](image-url)';
    const textarea = inputRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentContent = textarea.value;
  
      // Check if the selected text is empty and replace it with image syntax
      let newContent;
      if (currentContent.substring(start, end).trim() === '') {
        newContent = currentContent.substring(0, start) + imageSyntax + currentContent.substring(end);
      } else {
        newContent = currentContent.substring(0, start) + imageSyntax + currentContent.substring(end);
      }
  
      updateContent(newContent);
      
      // Set cursor position after the inserted image syntax
      textarea.setSelectionRange(start + imageSyntax.length, start + imageSyntax.length);
      textarea.focus();
    }
  };

  // Clear the editor content
  const handleClear = () => {
    updateContent(''); // Clear the editor
  };

  // Button handlers
  const handleBold = () => wrapSelectedText('**');
  const handleItalic = () => wrapSelectedText('_');
  const handleUnderline = () => wrapSelectedText('__');
  const handleHeader1 = () => wrapSelectedText('# ');
  const handleHeader2 = () => wrapSelectedText('## ');
  const handleHeader3 = () => wrapSelectedText('### ');
  const handleOrderedList = () => wrapSelectedText('1. ');
  const handleUnorderedList = () => wrapSelectedText('* ');
  const handleQuote = () => wrapSelectedText('> ');
  const handleTable = () => wrapSelectedText('| Header 1 | Header 2 |\n| --- | --- |\n| Row 1 Col 1 | Row 1 Col 2 |\n| Row 2 Col 1 | Row 2 Col 2 |');
  const handleCode = () => wrapSelectedText('```javascript\n', '\n```');
  const handleLink = () => wrapSelectedText('[', '](https://example.com)');
  const handleHighlight = () => wrapSelectedText('==', '==');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Toolbar */}
      <div style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
        <button onClick={handleBold} style={styles.iconButton}><FontAwesomeIcon icon={faBold} /></button>
        <button onClick={handleItalic} style={styles.iconButton}><FontAwesomeIcon icon={faItalic} /></button>
        <button onClick={handleUnderline} style={styles.iconButton}><FontAwesomeIcon icon={faUnderline} /></button>
        <button onClick={handleHeader1} style={styles.iconButton}><FontAwesomeIcon icon={faHeading} />1</button>
        <button onClick={handleHeader2} style={styles.iconButton}><FontAwesomeIcon icon={faHeading} />2</button>
        <button onClick={handleHeader3} style={styles.iconButton}><FontAwesomeIcon icon={faHeading} />3</button>
        <button onClick={handleOrderedList} style={styles.iconButton}><FontAwesomeIcon icon={faListOl} /></button>
        <button onClick={handleUnorderedList} style={styles.iconButton}><FontAwesomeIcon icon={faListUl} /></button>
        <button onClick={handleQuote} style={styles.iconButton}><FontAwesomeIcon icon={faQuoteRight} /></button>
        <button onClick={handleTable} style={styles.iconButton}><FontAwesomeIcon icon={faTable} /></button>
        <button onClick={handleCode} style={styles.iconButton}><FontAwesomeIcon icon={faCode} /></button>
        <button onClick={handleImage} style={styles.iconButton}><FontAwesomeIcon icon={faImage} /></button>
        <button onClick={handleLink} style={styles.iconButton}><FontAwesomeIcon icon={faLink} /></button>
        <button onClick={handleHighlight} style={styles.iconButton}><FontAwesomeIcon icon={faHighlighter} /></button>
        <button onClick={handleClear} style={styles.iconButton}><FontAwesomeIcon icon={faEraser} /> </button>
        <button onClick={handleUndo} style={styles.iconButton}><FontAwesomeIcon icon={faUndo} /> </button>
        <button onClick={handleRedo} style={styles.iconButton}><FontAwesomeIcon icon={faRedo} /> </button>
        <div style={{ float: 'right', justifyContent: 'space-between' }}>
          <button onClick={handleCopy} className="iconButton" style={{ marginRight: 10 }}><FontAwesomeIcon icon={faCopy} />  Copy</button>
          <button onClick={handleDownload} className="iconButton"><FontAwesomeIcon icon={faDownload} /> Download</button>
        </div>
      </div>

      {/* Markdown Editor & Preview */}
      <div style={{ display: 'flex', flexGrow: 1 }}>
        {/* Editable Textarea Input */}
        <textarea
          ref={inputRef}
          value={markdown}
          onChange={handleInputChange}
          style={styles.editor}
          placeholder="Type or paste your Markdown here..."
        />

        {/* Preview Area */}
        <div style={styles.preview}>
          <ReactMarkdown
            children={markdown}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSanitize, rehypeHighlight]}
          />
        </div>
      </div>
    </div>
  );
};

// Custom styles for icon buttons and other elements
const styles = {
  iconButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px', // Adjust font size to reduce icon size
    margin: '0 5px',
    padding: '5px',
    color: '#333',
    outline: 'none',
  },
  editor: {
    width: '50%',
    padding: '10px',
    fontSize: '18px',
    fontFamily: 'auto',
    border: '1px solid #ddd',
    backgroundColor: '#f4f4f4',
    height: 'calc(100vh - 50px)', // Fixed height with vertical scrolling
    overflowY: 'auto', // Enable vertical scrolling
    outline: 'none',
    whiteSpace: 'pre-wrap',
    boxSizing: 'border-box',
    marginRight: '5px' 
  },
  preview: {
    width: '50%',
    padding: '10px',
    fontFamily: 'auto',
    backgroundColor: '#f9f9f9',
    borderLeft: '1px solid #ddd',
    height: 'calc(100vh - 50px)', // Fixed height with vertical scrolling
    overflowY: 'auto', // Enable vertical scrolling
    boxSizing: 'border-box',
  },
};

export default MarkdownEditor;
