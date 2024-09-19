import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBold, faItalic, faUnderline, faListOl, faListUl, faQuoteRight,
  faLink, faTable, faEraser, faUpload, faRedo, faCopy, faDownload, faExclamationCircle, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import TurndownService from 'turndown';
import mammoth from 'mammoth';
import '../../assets/styles/Converters.css';

const WordToMarkdownConverter = () => {
  const [htmlContent, setHtmlContent] = useState(''); // Stores the raw content
  const [markdownContent, setMarkdownContent] = useState(''); // Stores the Markdown content
  const [popupMessage, setPopupMessage] = useState(''); // Stores the popup message
  const editableContentRef = useRef(null); // Ref for the content-editable div
  const outputTextareaRef = useRef(null); // Ref for Markdown textarea
  const fileInputRef = useRef(null);
  const [history, setHistory] = useState([{ content: '' }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const turndownService = new TurndownService({
    headingStyle: 'atx',
  });

  useEffect(() => {
    const handleContentChange = () => {
      const editableDiv = editableContentRef.current;
      if (editableDiv) {
        const newHtmlContent = editableDiv.innerHTML;
        setHtmlContent(newHtmlContent);

        // Clean up the content by removing Word-specific and unnecessary tags
        const cleanedHtmlContent = cleanUpWordContent(newHtmlContent);
        setHtmlContent(cleanedHtmlContent);

        // Convert to Markdown
        const markdown = turndownService.turndown(cleanedHtmlContent);
        setMarkdownContent(markdown);

        // Update history
        const updatedHistory = history.slice(0, historyIndex + 1);
        setHistory([...updatedHistory, { content: markdown }]);
        setHistoryIndex(updatedHistory.length);
      }
    };

    if (editableContentRef.current) {
      editableContentRef.current.addEventListener('input', handleContentChange);
      return () => {
        editableContentRef.current.removeEventListener('input', handleContentChange);
      };
    }
  }, [history, historyIndex]);

  // Function to clean up unnecessary Word HTML elements
  const cleanUpWordContent = (html) => {
    let cleanedHtml = html.replace(/<o:p>.*?<\/o:p>/gi, ''); // Remove Word <o:p> tags
    cleanedHtml = cleanedHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ''); // Remove <style> tags
    cleanedHtml = cleanedHtml.replace(/style\s*=\s*(['"]).*?\1/gi, ''); // Remove inline styles
    return cleanedHtml;
  };

  const wrapSelectedText = (before, after) => {
    const editableDiv = editableContentRef.current;
    const selection = window.getSelection();
    const selectedText = selection.toString();

    if (selectedText) {
      document.execCommand('insertHTML', false, `${before}${selectedText}${after}`);
    }
  };

  const handleBold = () => wrapSelectedText('<b>', '</b>');
  const handleItalic = () => wrapSelectedText('<i>', '</i>');
  const handleUnderline = () => wrapSelectedText('<u>', '</u>');
  const handleOrderedList = () => document.execCommand('insertOrderedList');
  const handleUnorderedList = () => document.execCommand('insertUnorderedList');
  const handleQuote = () => wrapSelectedText('<blockquote>', '</blockquote>');
  const handleLink = () => wrapSelectedText('<a href="https://example.com">', '</a>');
  const handleTable = () => {
    const tableHtml = '<table><tr><th>Header 1</th><th>Header 2</th></tr><tr><td>Row 1 Col 1</td><td>Row 1 Col 2</td></tr></table>';
    document.execCommand('insertHTML', false, tableHtml);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const previousContent = history[historyIndex - 1].content;
      setMarkdownContent(previousContent);
      outputTextareaRef.current.value = previousContent;
      editableContentRef.current.innerHTML = turndownService.turndown(previousContent);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const nextContent = history[historyIndex + 1].content;
      setMarkdownContent(nextContent);
      outputTextareaRef.current.value = nextContent;
      editableContentRef.current.innerHTML = turndownService.turndown(nextContent);
    }
  };

  const handleClear = () => {
    setHtmlContent('');
    setMarkdownContent('');
    setHistory([{ content: '' }]);
    setHistoryIndex(0);
    if (editableContentRef.current && outputTextareaRef.current) {
      editableContentRef.current.innerHTML = '';
      outputTextareaRef.current.value = '';
    }
  };

  const handleCopy = () => {
    if (markdownContent) {
      navigator.clipboard.writeText(markdownContent).then(() => {
        setPopupMessage('Markdown copied to clipboard.');
        setTimeout(() => setPopupMessage(''), 3000); // Hide popup after 3 seconds
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    } else {
      setPopupMessage('No Markdown content to copy.');
      setTimeout(() => setPopupMessage(''), 3000);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        let html = result.value;
        html = cleanUpWordContent(html);
        const markdown = turndownService.turndown(html);
        setHtmlContent(html);
        setMarkdownContent(markdown);
        if (editableContentRef.current && outputTextareaRef.current) {
          editableContentRef.current.innerHTML = html; // Update the div with the uploaded file content
          outputTextareaRef.current.value = markdown;
        }
      } catch (error) {
        console.error('Error converting file:', error);
      }
    } else {
      alert('Please upload a valid Word document (.docx).');
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
          accept=".docx"
          ref={fileInputRef}
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        <button className='iconButton' onClick={() => fileInputRef.current.click()}>
          <FontAwesomeIcon icon={faUpload} /> Upload Google Docs
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
      <div
        ref={editableContentRef}
        contentEditable={true}
        style={styles.contentEditableDiv}
        >
        <span style={{ color: '#7a7676' }}>// Paste your google docs content here...</span>
        </div>
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
              backgroundColor: popupMessage.includes('No Markdown') ? 'white' : 'black',
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
  contentEditableDiv: {
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
    whiteSpace: 'pre-wrap',
    '::placeholder': {
       color: '#aaa',
    },   
  },
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

export default WordToMarkdownConverter;
