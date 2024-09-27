import React, { useState, useRef, useEffect } from 'react';
import TurndownService from 'turndown';
import TurndownService from 'turndown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faDownload, faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { gfm } from 'turndown-plugin-gfm'; // Import the GFM plugin
import { faCopy, faDownload, faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { gfm } from 'turndown-plugin-gfm'; // Import the GFM plugin
import '../../assets/styles/Converters.css';

const GoogleDocsToMarkdownConverter = () => {
  const [htmlContent, setHtmlContent] = useState(''); // Stores raw content
const GoogleDocsToMarkdownConverter = () => {
  const [htmlContent, setHtmlContent] = useState(''); // Stores raw content
  const [markdownContent, setMarkdownContent] = useState(''); // Stores the Markdown content
  const [popupMessage, setPopupMessage] = useState(''); // Stores popup message
  const editableContentRef = useRef(null); // Ref for content-editable div
  const [popupMessage, setPopupMessage] = useState(''); // Stores popup message
  const editableContentRef = useRef(null); // Ref for content-editable div
  const outputTextareaRef = useRef(null); // Ref for Markdown textarea
  const [showPlaceholder, setShowPlaceholder] = useState(true); // Show placeholder for input
  const [showPlaceholder, setShowPlaceholder] = useState(true); // Show placeholder for input

  const turndownService = new TurndownService({
    headingStyle: 'atx',
  });
  
  turndownService.use(gfm); // Enable GFM (GitHub-Flavored Markdown) support including tables

  // Custom rule to handle bold conversion
  turndownService.addRule('bold', {
    filter: (node) => node.style.fontWeight === '700' || node.tagName === 'STRONG',
    replacement: (content) => `**${content}**`,
  });
  
  // Custom rule to handle italic conversion
  turndownService.addRule('italic', {
    filter: (node) => node.nodeName === 'I' || node.nodeName === 'EM' || node.style.fontStyle === 'italic',
    replacement: (content, node) => {
      return `*${content}*`;
    }
  });

  // Custom rule to handle table conversion
  turndownService.addRule('table', {
    filter: 'table',
    replacement: function (content, node) {
      const rows = Array.from(node.querySelectorAll('tr')).map((row) => {
        const cells = Array.from(row.querySelectorAll('th, td')).map((cell) => {
          const cellText = cell.textContent.trim();
          return cellText ? `**${cellText}**` : ''; // Prevent undefined
        });
        return `| ${cells.join(' | ')} |`;
      });

      if (rows.length > 0) {
        const headerDivider = `${rows[0].split('|').map(cell => '-'.repeat(cell.trim().length)).join(' | ')}`;
        return `\n\n${rows[0]}\n${headerDivider}\n${rows.slice(1).join('\n')}\n\n`;
      }
      return ''; // Return empty string if no rows
    },
  });
  
  turndownService.use(gfm); // Enable GFM (GitHub-Flavored Markdown) support including tables

  // Custom rule to handle bold conversion
  turndownService.addRule('bold', {
    filter: (node) => node.style.fontWeight === '700' || node.tagName === 'STRONG',
    replacement: (content) => `**${content}**`,
  });
  
  // Custom rule to handle italic conversion
  turndownService.addRule('italic', {
    filter: (node) => node.nodeName === 'I' || node.nodeName === 'EM' || node.style.fontStyle === 'italic',
    replacement: (content, node) => {
      return `*${content}*`;
    }
  });

  // Custom rule to handle table conversion
  turndownService.addRule('table', {
    filter: 'table',
    replacement: function (content, node) {
      const rows = Array.from(node.querySelectorAll('tr')).map((row) => {
        const cells = Array.from(row.querySelectorAll('th, td')).map((cell) => {
          const cellText = cell.textContent.trim();
          return cellText ? `**${cellText}**` : ''; // Prevent undefined
        });
        return `| ${cells.join(' | ')} |`;
      });

      if (rows.length > 0) {
        const headerDivider = `${rows[0].split('|').map(cell => '-'.repeat(cell.trim().length)).join(' | ')}`;
        return `\n\n${rows[0]}\n${headerDivider}\n${rows.slice(1).join('\n')}\n\n`;
      }
      return ''; // Return empty string if no rows
    },
  });

  useEffect(() => {
    const handleContentChange = () => {
      const editableDiv = editableContentRef.current;
      if (editableDiv) {
        const newHtmlContent = editableDiv.innerHTML || '';
        const newHtmlContent = editableDiv.innerHTML || '';
        setHtmlContent(newHtmlContent);

        // Check if the text content is empty
        const isEmpty = editableDiv.textContent.trim() === '';
        setShowPlaceholder(isEmpty);

        const cleanedHtmlContent = cleanUpGoogleDocsContent(newHtmlContent);
        const markdown = turndownService.turndown(cleanedHtmlContent || '');
        setMarkdownContent(markdown || '');
        // Check if the text content is empty
        const isEmpty = editableDiv.textContent.trim() === '';
        setShowPlaceholder(isEmpty);

        const cleanedHtmlContent = cleanUpGoogleDocsContent(newHtmlContent);
        const markdown = turndownService.turndown(cleanedHtmlContent || '');
        setMarkdownContent(markdown || '');
      }
    };

    if (editableContentRef.current) {
      editableContentRef.current.addEventListener('input', handleContentChange);
      return () => {
        editableContentRef.current.removeEventListener('input', handleContentChange);
      };
    }
  }, []);
  }, []);

  // Clean up unnecessary Google Docs HTML elements
  const cleanUpGoogleDocsContent = (html) => {
    let cleanedHtml = (html || '')
      .replace(/<b>(.*?)<\/b>/gi, '<strong>$1</strong>') // Replace <b> with <strong>
      .replace(/<i>(.*?)<\/i>/gi, '<em>$1</em>') // Replace <i> with <em>
      .replace(/<u>(.*?)<\/u>/gi, '<u>$1</u>') // Replace <u> with <u>
      .replace(/<div>/gi, '<p>') // Replace divs with paragraphs
      .replace(/<\/div>/gi, '</p>') // Close divs as paragraphs
      .replace(/<br\s*\/?>/gi, '\n') // Replace <br> with newlines
      .replace(/<\/?o:p>/gi, '') // Remove any <o:p> tags
      .replace(/\n\s*\n/g, '\n') // Collapse multiple newlines into one
      .replace(/^\s+|\s+$/g, '') // Trim leading/trailing spaces
      .replace(/<h(\d)>(.*?)<\/h\d>/gi, (match, level, content) => { // Handle headings
        const headingLevel = '#'.repeat(level); // Create Markdown heading
        return `${headingLevel} ${content.trim()}`;
      });
      
    return cleanedHtml || ''; // Return empty string if content is null/undefined
  };

  // Handle copying Markdown content
  // Clean up unnecessary Google Docs HTML elements
  const cleanUpGoogleDocsContent = (html) => {
    let cleanedHtml = (html || '')
      .replace(/<b>(.*?)<\/b>/gi, '<strong>$1</strong>') // Replace <b> with <strong>
      .replace(/<i>(.*?)<\/i>/gi, '<em>$1</em>') // Replace <i> with <em>
      .replace(/<u>(.*?)<\/u>/gi, '<u>$1</u>') // Replace <u> with <u>
      .replace(/<div>/gi, '<p>') // Replace divs with paragraphs
      .replace(/<\/div>/gi, '</p>') // Close divs as paragraphs
      .replace(/<br\s*\/?>/gi, '\n') // Replace <br> with newlines
      .replace(/<\/?o:p>/gi, '') // Remove any <o:p> tags
      .replace(/\n\s*\n/g, '\n') // Collapse multiple newlines into one
      .replace(/^\s+|\s+$/g, '') // Trim leading/trailing spaces
      .replace(/<h(\d)>(.*?)<\/h\d>/gi, (match, level, content) => { // Handle headings
        const headingLevel = '#'.repeat(level); // Create Markdown heading
        return `${headingLevel} ${content.trim()}`;
      });
      
    return cleanedHtml || ''; // Return empty string if content is null/undefined
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
  // Handle Markdown file download
  const handleDownload = () => {
    if (!markdownContent) {
      setPopupMessage('No Markdown content to download.');
      setTimeout(() => setPopupMessage(''), 3000);
      return;
    }

    if (!markdownContent) {
      setPopupMessage('No Markdown content to download.');
      setTimeout(() => setPopupMessage(''), 3000);
      return;
    }

    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MarkdownFile.md';
    a.download = 'MarkdownFile.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Action Buttons */}
      <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
        <button className='iconButton' style={{ marginRight: 10 }} onClick={handleCopy}>
          <FontAwesomeIcon icon={faCopy} />  Copy Markdown
        </button>
        <button className='iconButton' onClick={handleDownload}>
          <FontAwesomeIcon icon={faDownload} />  Download Markdown
        </button>
      {/* Action Buttons */}
      <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
        <button className='iconButton' style={{ marginRight: 10 }} onClick={handleCopy}>
          <FontAwesomeIcon icon={faCopy} />  Copy Markdown
        </button>
        <button className='iconButton' onClick={handleDownload}>
          <FontAwesomeIcon icon={faDownload} />  Download Markdown
        </button>
      </div>

      {/* Input and Output Sections */}
      <div style={{ display: 'flex', flexGrow: 1, marginTop: '10px' }}>
        {/* Input Section with Placeholder */}
        <div style={{ position: 'relative', width: '50%', marginRight: '5px' }}>
          {showPlaceholder && (
            <span style={styles.placeholder}>
              Paste your Google Docs here ...
            </span>
          )}
          <div
            ref={editableContentRef}
            contentEditable
            style={styles.contentEditableDiv}
          />
      {/* Input and Output Sections */}
      <div style={{ display: 'flex', flexGrow: 1, marginTop: '10px' }}>
        {/* Input Section with Placeholder */}
        <div style={{ position: 'relative', width: '50%', marginRight: '5px' }}>
          {showPlaceholder && (
            <span style={styles.placeholder}>
              Paste your Google Docs here ...
            </span>
          )}
          <div
            ref={editableContentRef}
            contentEditable
            style={styles.contentEditableDiv}
          />
        </div>
        
        {/* Output Section */}
        
        {/* Output Section */}
        <textarea
          ref={outputTextareaRef}
          value={markdownContent}
          readOnly
          className="textareaplaceholder"
          className="textareaplaceholder"
          style={styles.textarea}
          placeholder={htmlContent === '' ? '... Get your Markdown here' : ''}
          placeholder={htmlContent === '' ? '... Get your Markdown here' : ''}
        />
      </div>

      {/* Popup Message */}
      {/* Popup Message */}
      {popupMessage && (
        <div style={popupStyles.container}>
          <div
            style={{
              ...popupStyles.popup,
              color: popupMessage.includes('No Markdown') ? 'red' : 'white',
              backgroundColor: popupMessage.includes('No Markdown') ? 'white' : 'black',
            }} > 
              <p>
                <FontAwesomeIcon
                  icon={popupMessage.includes('No Markdown') ? faExclamationCircle : faCheckCircle}
                  style={{ marginRight: '10px' }}
                />
                {popupMessage}
              </p>
            </div> 
          </div> 
        )
      } 
    </div> 
  ); 
            }} > 
              <p>
                <FontAwesomeIcon
                  icon={popupMessage.includes('No Markdown') ? faExclamationCircle : faCheckCircle}
                  style={{ marginRight: '10px' }}
                />
                {popupMessage}
              </p>
            </div> 
          </div> 
        )
      } 
    </div> 
  ); 
};

const styles = {
  contentEditableDiv: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    height: '100%',
    overflowY: 'auto',
    boxSizing: 'border-box',
    backgroundColor: '#f9f9f9',
    whiteSpace: 'pre-wrap',
    position: 'relative',
    borderRadius: '4px',
    minHeight: '300px', // Ensure a minimum height for better UX
  },
  textarea: {
    width: '50%', 
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    height: '100%',
    overflowY: 'auto',
    boxSizing: 'border-box',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
    resize: 'none', // Use monospace font for code-like display
  },
  placeholder: {
    color: '#aaa',
    fontSize: '24px',
    position: 'absolute',
    fontWeight: 'bold',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    zIndex: 1, // Ensure placeholder is above the contentEditable div
    textAlign: 'center',
    width: '100%',
    padding: '0 10px', // Add padding for better readability
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

export default GoogleDocsToMarkdownConverter;
export default GoogleDocsToMarkdownConverter;
