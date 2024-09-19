import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBold, faItalic, faUnderline, faListOl, faListUl, faQuoteRight,
  faLink, faTable, faEraser, faUndo, faRedo, faUpload, faCopy, faDownload, faExclamationCircle, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import TurndownService from 'turndown'; // npm install turndown
import jsBeautify from 'js-beautify';
import '../../assets/styles/Converters.css'; // Optional: for additional styles

const { html: beautifyHtml } = jsBeautify;

const HtmlToMarkdownConverter = () => {
  const [htmlContent, setHtmlContent] = useState(''); // Stores the raw HTML content
  const [markdownContent, setMarkdownContent] = useState(''); // Stores the Markdown content
  const [popupMessage, setPopupMessage] = useState(''); // Stores the popup message
  const fileInputRef = useRef(null);
  const inputTextareaRef = useRef(null); // Ref for raw HTML textarea
  const outputTextareaRef = useRef(null); // Ref for Markdown textarea
  const [history, setHistory] = useState([{ content: '' }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const turndownService = new TurndownService({
    headingStyle: 'atx',
  });
  

  useEffect(() => {
    const handleContentChange = () => {
      const inputTextarea = inputTextareaRef.current;
      if (inputTextarea) {
        const newHtmlContent = inputTextarea.value;
        setHtmlContent(newHtmlContent);

        // Clean HTML content by removing <style> tags and inline styles
        const cleanedHtmlContent = removeStyles(newHtmlContent);
        setHtmlContent(cleanedHtmlContent);

        // Extract body content from the cleaned HTML
        const bodyContent = extractBodyContent(cleanedHtmlContent);

        // Convert the body content to Markdown
        const markdown = turndownService.turndown(bodyContent);
        setMarkdownContent(markdown);

        // Update history
        const updatedHistory = history.slice(0, historyIndex + 1);
        setHistory([...updatedHistory, { content: markdown }]);
        setHistoryIndex(updatedHistory.length);
      }
    };

    if (inputTextareaRef.current) {
      inputTextareaRef.current.addEventListener('input', handleContentChange);
      return () => {
        inputTextareaRef.current.removeEventListener('input', handleContentChange);
      };
    }
  }, [history, historyIndex]);

  const extractBodyContent = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const body = doc.body;
    return body.outerHTML; // Return the body content with all tags
  };

  const removeStyles = (html) => {
    // Remove <style> tags
    const withoutStyleTags = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    // Remove inline styles
    const withoutInlineStyles = withoutStyleTags.replace(/style\s*=\s*(['"]).*?\1/gi, '');

    return withoutInlineStyles;
  };

  const wrapSelectedText = (before, after) => {
    const textarea = inputTextareaRef.current;
    const { selectionStart, selectionEnd, value } = textarea;

    if (selectionStart !== null && selectionEnd !== null) {
      const selectedText = value.substring(selectionStart, selectionEnd);
      const newText = `${before}${selectedText}${after || before}`;
      const newContent = value.slice(0, selectionStart) + newText + value.slice(selectionEnd);

      setHtmlContent(newContent);
      textarea.value = newContent;

      const newSelectionStart = selectionStart + before.length;
      const newSelectionEnd = newSelectionStart + selectedText.length;
      textarea.setSelectionRange(newSelectionStart, newSelectionEnd);

      setHistory(prevHistory => {
        const newHistory = prevHistory.slice(0, historyIndex + 1);
        return [...newHistory, { content: newContent }];
      });
      setHistoryIndex(prevIndex => prevIndex + 1);
    }
  };

  const handleBold = () => wrapSelectedText('<b>', '</b>');
  const handleItalic = () => wrapSelectedText('<i>', '</i>');
  const handleUnderline = () => wrapSelectedText('<u>', '</u>');
  const handleOrderedList = () => wrapSelectedText('<ol>\n<li>', '</li>\n</ol>');
  const handleUnorderedList = () => wrapSelectedText('<ul>\n<li>', '</li>\n</ul>');
  const handleQuote = () => wrapSelectedText('<blockquote>', '</blockquote>');
  const handleLink = () => wrapSelectedText('<a href="https://example.com">Link Text</a>', '');
  const handleTable = () => wrapSelectedText('<table><tr><th>Header 1</th><th>Header 2</th></tr><tr><td>Row 1 Col 1</td><td>Row 1 Col 2</td></tr><tr><td>Row 2 Col 1</td><td>Row 2 Col 2</td></tr></table>', '');

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const previousContent = history[historyIndex - 1].content;
      setMarkdownContent(previousContent);
      outputTextareaRef.current.value = previousContent;
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const nextContent = history[historyIndex + 1].content;
      setMarkdownContent(nextContent);
      outputTextareaRef.current.value = nextContent;
    }
  };

  const handleClear = () => {
    setHtmlContent('');
    setMarkdownContent('');
    setHistory([{ content: '' }]);
    setHistoryIndex(0);
    if (inputTextareaRef.current && outputTextareaRef.current) {
      inputTextareaRef.current.value = '';
      outputTextareaRef.current.value = '';
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/html') {
      try {
        const reader = new FileReader();
        reader.onload = () => {
          let html = reader.result;
          html = beautifyHtml(html, { indent_size: 2 });
          const bodyContent = extractBodyContent(html);
          const markdown = turndownService.turndown(bodyContent);
          setHtmlContent(bodyContent); // Set the body content as the HTML content
          setMarkdownContent(markdown);
          if (inputTextareaRef.current && outputTextareaRef.current) {
            inputTextareaRef.current.value = bodyContent;
            outputTextareaRef.current.value = markdown;
          }
        };
        reader.readAsText(file);
      } catch (error) {
        console.error('Error converting file:', error);
      }
    } else {
      alert('Please upload a valid HTML file.');
    }
  };

  const handleCopy = () => {
    if (markdownContent) { 
    navigator.clipboard.writeText(markdownContent).then(() => {
      setPopupMessage('Html copied to clipboard.');
      setTimeout(() => setPopupMessage(''), 3000); // Hide popup after 3 seconds
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  } else {
    setPopupMessage('No Markdown content to copy.');
    setTimeout(() => setPopupMessage(''), 3000); // Hide popup after 3 seconds
  } 
  };

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
        <input
          type="file"
          accept=".html"
          ref={fileInputRef}
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        <button className='iconButton' onClick={() => fileInputRef.current.click()}>
          <FontAwesomeIcon icon={faUpload} /> Upload HTML File
        </button>
        <div style={{ float: 'right' }}>
          <button className='iconButton' style={{ marginRight: 10 }} onClick={handleCopy}>
            <FontAwesomeIcon icon={faCopy} /> Copy Markdown
          </button>
          <button className='iconButton' onClick={handleDownload}>
            <FontAwesomeIcon icon={faDownload} /> Download Markdown
          </button>
        </div>
      </div>

      <div style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
        <button onClick={handleBold} style={styles.iconButton}><FontAwesomeIcon icon={faBold} /></button>
        <button onClick={handleItalic} style={styles.iconButton}><FontAwesomeIcon icon={faItalic} /></button>
        <button onClick={handleUnderline} style={styles.iconButton}><FontAwesomeIcon icon={faUnderline} /></button>
        <button onClick={handleOrderedList} style={styles.iconButton}><FontAwesomeIcon icon={faListOl} /></button>
        <button onClick={handleUnorderedList} style={styles.iconButton}><FontAwesomeIcon icon={faListUl} /></button>
        <button onClick={handleQuote} style={styles.iconButton}><FontAwesomeIcon icon={faQuoteRight} /></button>
        <button onClick={handleLink} style={styles.iconButton}><FontAwesomeIcon icon={faLink} /></button>
        <button onClick={handleTable} style={styles.iconButton}><FontAwesomeIcon icon={faTable} /></button>
        <button onClick={handleClear} style={styles.iconButton}><FontAwesomeIcon icon={faEraser} /></button>
      </div>

      <div style={{ display: 'flex', flexGrow: 1 }}>
        <textarea
          ref={inputTextareaRef}
          value={htmlContent}
          onChange={(e) => setHtmlContent(e.target.value)}
          style={styles.textarea}
          placeholder="// Type or paste your Html here..."
        />
        <textarea
          ref={outputTextareaRef}
          value={markdownContent}
          readOnly
          style={styles.textarea}
        />
      </div>

      {popupMessage && (
  <div style={popupStyles.container}>
    <div
      style={{
        ...popupStyles.popup,
        color: popupMessage.includes('No Markdown') ? 'red' : 'white',
        backgroundColor: popupMessage.includes('No Markdown') ? 'white' : 'black', // Conditionally apply red or black
      }}
    >
      <p>
        <FontAwesomeIcon
          icon={popupMessage.includes('No Markdown') ? faExclamationCircle : faCheckCircle}
          style={{ marginRight: '10px' }}
        />
        {popupMessage}
      </p>
    </div>
  </div>
)}

    </div>
  );
};

const styles = {
  textarea: {
    width: '50%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    height: 'calc(100vh - 160px)',
    overflowY: 'auto',
    boxSizing: 'border-box',
    marginRight: '5px',
    fontFamily: 'auto',
    backgroundColor: '#f9f9f9',
  },
  iconButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    margin: '0 5px',
    padding: '5px',
    color: '#333',
  },
};
const popupStyles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  popup: {
    backgroundColor: 'black',  // Default background color
    color: '#fff',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
  },
};


export default HtmlToMarkdownConverter;
