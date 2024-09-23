import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBold, faItalic, faUnderline, faQuoteRight, faLink,
  faTable, faEraser, faCopy, faDownload, faExclamationCircle, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import TurndownService from 'turndown';
import '../../assets/styles/Converters.css'

const WordToMarkdownConverter = () => {
  const [htmlContent, setHtmlContent] = useState(''); // Stores raw content
  const [markdownContent, setMarkdownContent] = useState(''); // Stores the Markdown content
  const [popupMessage, setPopupMessage] = useState(''); // Stores popup message
  const editableContentRef = useRef(null); // Ref for content-editable div
  const outputTextareaRef = useRef(null); // Ref for Markdown textarea
  const [showPlaceholder, setShowPlaceholder] = useState(true); // Show placeholder for input

  const turndownService = new TurndownService({
    headingStyle: 'atx',
  });

  useEffect(() => {
    const handleContentChange = () => {
      const editableDiv = editableContentRef.current;
      if (editableDiv) {
        const newHtmlContent = editableDiv.innerHTML;
        setHtmlContent(newHtmlContent);

        // Hide placeholder only if there is content
        setShowPlaceholder(newHtmlContent === '' || newHtmlContent === '<br>');

        // Clean up Word-specific and unnecessary tags
        const cleanedHtmlContent = cleanUpWordContent(newHtmlContent);

        // Convert to Markdown
        const markdown = turndownService.turndown(cleanedHtmlContent);
        setMarkdownContent(markdown);
      }
    };

    if (editableContentRef.current) {
      editableContentRef.current.addEventListener('input', handleContentChange);
      return () => {
        editableContentRef.current.removeEventListener('input', handleContentChange);
      };
    }
  }, []);

  // Clean up unnecessary Word HTML elements
  const cleanUpWordContent = (html) => {
    let cleanedHtml = html.replace(/<o:p>.*?<\/o:p>/gi, ''); // Remove Word <o:p> tags
    cleanedHtml = cleanedHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ''); // Remove <style> tags
    cleanedHtml = cleanedHtml.replace(/style\s*=\s*(['"]).*?\1/gi, ''); // Remove inline styles
    return cleanedHtml;
  };

  // Wrap selected text in custom HTML tags
  const wrapSelectedText = (before, after) => {
    const selection = window.getSelection();
    const selectedText = selection.toString();
    if (selectedText) {
      document.execCommand('insertHTML', false, `${before}${selectedText}${after}`);
    }
  };

  // Handle bold, italic, etc.
  const handleBold = () => wrapSelectedText('<b>', '</b>');
  const handleItalic = () => wrapSelectedText('<i>', '</i>');
  const handleUnderline = () => wrapSelectedText('<u>', '</u>');
  const handleQuote = () => wrapSelectedText('<blockquote>', '</blockquote>');
  const handleLink = () => wrapSelectedText('<a href="https://example.com">', '</a>');
  const handleTable = () => {
    const tableHtml = '<table><tr><th>Header 1</th><th>Header 2</th></tr><tr><td>Row 1 Col 1</td><td>Row 1 Col 2</td></tr></table>';
    document.execCommand('insertHTML', false, tableHtml);
  };

  // Handle clearing the input and output
  const handleClear = () => {
    setHtmlContent('');
    setMarkdownContent('');
    setShowPlaceholder(true);
    if (editableContentRef.current && outputTextareaRef.current) {
      editableContentRef.current.innerHTML = '';
      outputTextareaRef.current.value = '';
    }
  };

  // Handle copying Markdown content
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

  // Handle Markdown file download
  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MarkdownFile.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ padding: '10px' }}>
        <button onClick={handleBold} style={styles.iconButton}><FontAwesomeIcon icon={faBold} /></button>
        <button onClick={handleItalic} style={styles.iconButton}><FontAwesomeIcon icon={faItalic} /></button>
        <button onClick={handleUnderline} style={styles.iconButton}><FontAwesomeIcon icon={faUnderline} /></button>
        <button onClick={handleQuote} style={styles.iconButton}><FontAwesomeIcon icon={faQuoteRight} /></button>
        <button onClick={handleLink} style={styles.iconButton}><FontAwesomeIcon icon={faLink} /></button>
        <button onClick={handleTable} style={styles.iconButton}><FontAwesomeIcon icon={faTable} /></button>
        <button onClick={handleClear} style={styles.iconButton}><FontAwesomeIcon icon={faEraser} /></button>
        <div style={{ float: 'right' }}>
          <button className='iconButton' style={{ marginRight: 10 }} onClick={handleCopy}>
            <FontAwesomeIcon icon={faCopy} /> Copy Markdown
          </button>
          <button className='iconButton' onClick={handleDownload}>
            <FontAwesomeIcon icon={faDownload} /> Download Markdown
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexGrow: 1, position: 'relative' }}>
        {showPlaceholder && (
          <span style={styles.placeholder}>
            Paste your Google Docs content here ...
          </span>
        )}
        <div
          ref={editableContentRef}
          contentEditable
          style={styles.contentEditableDiv}
        />
        
        <textarea
          ref={outputTextareaRef}
          value={markdownContent}
          readOnly
          className="markdown-textarea"
          style={styles.textarea}
          placeholder={htmlContent === '' ? '... and get your Markdown here' : ''}
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
    marginTop: '10px',
    border: '1px solid #ddd',
    height: 'calc(100vh - 160px)',
    overflowY: 'auto',
    boxSizing: 'border-box',
    marginRight: '5px',
    fontFamily: 'auto',
    backgroundColor: '#f9f9f9',
    whiteSpace: 'pre-wrap',
  },
  textarea: {
    width: '50%',
    padding: '10px',
    fontSize: '16px',
    marginTop: '10px',
    border: '1px solid #ddd',
    height: 'calc(100vh - 160px)',
    overflowY: 'auto',
    boxSizing: 'border-box',
    fontFamily: 'auto',
    backgroundColor: '#f9f9f9',
  },
  placeholder: {
    color: '#aaa',
    fontSize: '24px',
    position: 'absolute',
    marginTop: '10px',
    pointerEvents: 'none',
    fontFamily: 'auto',
    top: '10px',
    left: '10px',
  },
  iconButton: {
    marginRight: '5px',
    padding: '5px 10px',
    fontSize: '14px',
    cursor: 'pointer',
  },
};

const popupStyles = {
  container: {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    zIndex: '1000',
  },
  popup: {
    padding: '10px 20px',
    backgroundColor: 'green',
    borderRadius: '5px',
    color: 'white',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
  },
};

export default WordToMarkdownConverter;
