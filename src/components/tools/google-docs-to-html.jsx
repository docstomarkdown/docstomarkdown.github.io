import React, { useState, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify'; // Import DOMPurify for sanitizing HTML
import beautify from 'js-beautify'; // Default import for js-beautify
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faDownload, faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import '../../assets/styles/Converters.css';

const GoogleDocsToHtmlConverter = () => {
  const [rawHtmlContent, setRawHtmlContent] = useState(''); // Stores raw HTML content
  const [cleanedHtmlContent, setCleanedHtmlContent] = useState(''); // Stores cleaned/sanitized HTML content
  const [popupMessage, setPopupMessage] = useState(''); // Stores popup messages
  const editableContentRef = useRef(null); // Ref for the content-editable div
  const outputTextareaRef = useRef(null); // Ref for the HTML textarea
  const [showPlaceholder, setShowPlaceholder] = useState(true); // Controls the visibility of the placeholder

  // Destructure the 'html' function from js-beautify
  const beautifyHtml = beautify.html;

  useEffect(() => {
    const handleContentChange = () => {
      const editableDiv = editableContentRef.current;
      if (editableDiv) {
        const newHtmlContent = editableDiv.innerHTML || '';
        setRawHtmlContent(newHtmlContent);

        // Determine if the input is empty to toggle placeholder
        const isEmpty = editableDiv.textContent.trim() === '';
        setShowPlaceholder(isEmpty);

        // Clean, sanitize, and beautify the HTML content
        const cleaned = cleanUpGoogleDocsContent(newHtmlContent);
        setCleanedHtmlContent(cleaned || '');
      }
    };

    if (editableContentRef.current) {
      editableContentRef.current.addEventListener('input', handleContentChange);
      return () => {
        editableContentRef.current.removeEventListener('input', handleContentChange);
      };
    }
  }, []);

  // Function to clean, sanitize, and beautify Google Docs HTML content

  const cleanUpGoogleDocsContent = (html) => {
    let cleanedHtml = (html || '')
    .replace(/<span[^>]*>(.*?)<\/span>/gi, '$1') // Remove <span> tags but keep inner content
    .replace(/style="[^"]*"/gi, ''); // Trim leading and trailing whitespace

    // Use DOMPurify to sanitize the HTML
    cleanedHtml = DOMPurify.sanitize(cleanedHtml, { USE_PROFILES: { html: true } });

    // Use js-beautify to format the HTML
    const beautifyOptions = {
        indent_size: 2,
        space_in_empty_paren: true,
        wrap_line_length: 80,
        end_with_newline: true,
    };
    cleanedHtml = beautify.html(cleanedHtml, beautifyOptions);

    return cleanedHtml || ''; // Return empty string if content is null or undefined
};

  
  // Function to handle copying HTML content to clipboard
  const handleCopy = () => {
    if (cleanedHtmlContent) {
      const blob = new Blob([cleanedHtmlContent], { type: 'text/html' });
      const clipboardItem = new ClipboardItem({ 'text/html': blob });
  
      navigator.clipboard.write([clipboardItem])
        .then(() => {
          setPopupMessage('Copied as rich text to clipboard.');
          setTimeout(() => setPopupMessage(''), 3000); // Hide popup after 3 seconds
        })
        .catch((err) => {
          console.error('Failed to copy rich text: ', err);
          setPopupMessage('Failed to copy HTML as rich text.');
          setTimeout(() => setPopupMessage(''), 3000);
        });
    } else {
      setPopupMessage('No HTML content to copy.');
      setTimeout(() => setPopupMessage(''), 3000);
    }
  };

  // Function to handle downloading HTML content as a file
  const handleDownload = () => {
    if (!cleanedHtmlContent) {
      setPopupMessage('No HTML content to download.');
      setTimeout(() => setPopupMessage(''), 3000);
      return;
    }

    const blob = new Blob([cleanedHtmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'GoogleDocsContent.html';
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
                <FontAwesomeIcon icon={faCopy} />  Copy HTML
            </button>
            <button className='iconButton' onClick={handleDownload}>
                <FontAwesomeIcon icon={faDownload} />  Download HTML
            </button>
        </div>

        {/* Input and Output Sections */}
        <div style={{ display: 'flex', flexGrow: 1, marginTop: '10px', height: 'calc(100vh - 160px)' }}>
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
                    suppressContentEditableWarning={true} // Suppress React warnings for contentEditable
                />
            </div>

            {/* Output Section as a Textarea */}
            <textarea
                value={cleanedHtmlContent} // Directly use cleanedHtmlContent here
                readOnly
                className="textareaplaceholder"
                style={styles.textarea}
                placeholder={cleanedHtmlContent === '' ? '... Get your HTML here' : ''}
            />
        </div>

        {/* Popup Message */}
        {popupMessage && (
            <div style={popupStyles.container}>
                <div
                    style={{
                        ...popupStyles.popup,
                        color: popupMessage.includes('Failed') || popupMessage.includes('No HTML') ? 'red' : 'white',
                        backgroundColor: popupMessage.includes('Failed') || popupMessage.includes('No HTML') ? 'white' : 'black',
                    }}
                >
                    <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FontAwesomeIcon
                            icon={popupMessage.includes('Failed') || popupMessage.includes('No HTML') ? faExclamationCircle : faCheckCircle}
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
    pointerEvents: 'none', // Allow clicks to pass through
  },
  popup: {
    backgroundColor: '#4BB543',  // Green background for success
    color: '#fff',
    padding: '20px 30px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    pointerEvents: 'all', // Enable interaction with the popup
    display: 'flex',
    alignItems: 'center',
  },
};

export default GoogleDocsToHtmlConverter;
