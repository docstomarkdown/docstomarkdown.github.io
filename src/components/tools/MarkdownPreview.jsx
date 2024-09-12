import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBold, faItalic, faUnderline, faListOl, faListUl, faQuoteRight,
  faCode, faImage, faLink, faHighlighter, faHeading, faTable, faEraser, faUndo,
  faCopy, faDownload
} from '@fortawesome/free-solid-svg-icons';
import 'highlight.js/styles/github.css';
import './MarkdownPreview.css' // Optional: Use a highlight.js theme

const defaultMarkdown = `
# Markdown syntax guide

## Headers

# This is a Heading h1
## This is a Heading h2
###### This is a Heading h6

## Emphasis

*This text will be italic*  
_This will also be italic_

**This text will be bold**  
__This will also be bold__

_You **can** combine them_

## Lists

## Images

![This is an alt text.]( "This is a sample image.")

## Links

You may be using [Markdown Live Preview](https://markdownlivepreview.com/).

## Blockquotes

> Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
>
>> Markdown is often used to format readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.

## Tables

| Left columns  | Right columns |
| ------------- |:-------------:|
| left foo      | right foo     |
| left bar      | right bar     |
| left baz      | right baz     |

## Code Block

\\\javascript
function greet() {
  console.log("Hello, World!");
}
greet();
\\\
`;

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState(defaultMarkdown); // Initial state with default example
  const inputRef = useRef(null);

  // Copy markdown content to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(markdown).then(() => {
      alert("Markdown copied to clipboard!");
    }).catch(err => {
      console.error("Failed to copy text: ", err);
    });
  };

  // Download markdown as a file
  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'markdown-content.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Save and restore cursor position
  const saveCursorPosition = () => {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      return { start: range.startOffset, end: range.endOffset, node: range.startContainer };
    }
    return null;
  };

  const restoreCursorPosition = (cursorPosition) => {
    if (cursorPosition && cursorPosition.node) {
      const range = document.createRange();
      const sel = window.getSelection();
      range.setStart(cursorPosition.node, cursorPosition.start);
      range.setEnd(cursorPosition.node, cursorPosition.end);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  const wrapSelectedText = (prefix, suffix = '') => {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const selectedText = range.toString();
      
      // Replace the selected text with the formatted version
      const formattedText = `${prefix}${selectedText}${suffix || prefix}`;
      range.deleteContents();
      range.insertNode(document.createTextNode(formattedText));
      handleInputChange(); // Update state with the new content
    }
  };

  // Event handler for input changes
  const handleInputChange = () => {
    const cursorPosition = saveCursorPosition(); // Save cursor before state update
    if (inputRef.current) {
      setMarkdown(inputRef.current.innerText); // Get the innerText of the contenteditable div
    }
    setTimeout(() => restoreCursorPosition(cursorPosition), 0); // Restore cursor after state update
  };

  // Clear the editor content
  const handleClear = () => {
    setMarkdown(''); // Clear the editor
  };

  // Reset the editor content to the default example
  const handleReset = () => {
    setMarkdown(defaultMarkdown); // Reset to the default example
  };


const handleBold = () => wrapSelectedText('**'); // Wraps the selected text in '**' for bold
const handleItalic = () => wrapSelectedText('_'); // Wraps the selected text in '_' for italic
const handleUnderline = () => wrapSelectedText('__'); // Wraps the selected text in '__' for underline
const handleHeader1 = () => wrapSelectedText('# ');
const handleHeader2 = () => wrapSelectedText('## ');
const handleHeader3 = () => wrapSelectedText('### ');
const handleOrderedList = () => wrapSelectedText('1. ');
const handleUnorderedList = () => wrapSelectedText('* ');
const handleQuote = () => wrapSelectedText('> ');
const handleTable = () => insertTextAtCursor('| Header 1 | Header 2 |\n| --- | --- |\n| Row 1 Col 1 | Row 1 Col 2 |\n| Row 2 Col 1 | Row 2 Col 2 |');
const handleCode = () => wrapSelectedText('```javascript\n', '\n```');
const handleImage = () => insertTextAtCursor('![Alt text](image-url)');
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
        <button onClick={handleReset} style={styles.iconButton}><FontAwesomeIcon icon={faUndo} /> </button>
        <button onClick={handleCopy} className="iconButton copy"><FontAwesomeIcon icon={faCopy} /> Copy Output</button>
        <button onClick={handleDownload} className="iconButton download"><FontAwesomeIcon icon={faDownload} /> Download</button>
      </div>

      {/* Markdown Editor & Preview */}
      <div style={{ display: 'flex', flexGrow: 1 }}>
        {/* Editable Div Input */}
        <div
          ref={inputRef}
          contentEditable
          onInput={handleInputChange}
          style={styles.editor}
          placeholder="Type Markdown here..."
        >
          {markdown}
        </div>

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
