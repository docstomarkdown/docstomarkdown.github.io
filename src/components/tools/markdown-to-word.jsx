import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faDownload, faUpload, faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { marked } from 'marked'; // Import marked for Markdown to HTML conversion
import '../../assets/styles/Converters.css';

const MarkdownToWordConverter = () => {
  const [markdownContent, setMarkdownContent] = useState(''); // Stores the Markdown content
  const [htmlContent, setHtmlContent] = useState(''); // Stores the converted HTML content
  const [popupMessage, setPopupMessage] = useState(''); // Stores popup message
  const editableContentRef = useRef(null); // Ref for content-editable div
  const outputTextareaRef = useRef(null); // Ref for HTML textarea
  const [showPlaceholder, setShowPlaceholder] = useState(true); // Show placeholder for input

  // Handle change in the Markdown textarea
  const handleMarkdownChange = (e) => {
    const newMarkdown = e.target.value;
    setMarkdownContent(newMarkdown);

    // Convert Markdown to HTML
    const html = marked(newMarkdown);
    setHtmlContent(html);

    // Check if the text content is empty
    const isEmpty = newMarkdown.trim() === '';
    setShowPlaceholder(isEmpty);
  };

  // Handle copying HTML content
  const handleCopy = () => {
    if (htmlContent) {
      navigator.clipboard.writeText(htmlContent).then(() => {
        setPopupMessage('HTML copied to clipboard.');
        setTimeout(() => setPopupMessage(''), 3000); // Hide popup after 3 seconds
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    } else {
      setPopupMessage('No HTML content to copy.');
      setTimeout(() => setPopupMessage(''), 3000);
    }
  };

  // Handle HTML file download
  const handleDownload = () => {
    if (!htmlContent) {
      setPopupMessage('No HTML content to download.');
      setTimeout(() => setPopupMessage(''), 3000);
      return;
    }

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ConvertedDocument.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle file upload (if needed in the future)
  const handleFileUpload = (e) => {
    // Logic for file upload can be implemented if needed
  };

  return (
    <div>
      {/* Action Buttons */}
      <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="file"
            accept=".md" // Assuming we might want to allow .md files in the future
            ref={outputTextareaRef}
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <button className='iconButton' onClick={() => outputTextareaRef.current.click()}>
            <FontAwesomeIcon icon={faUpload} /> Upload Markdown File
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button className='iconButton' style={{ marginRight: 10 }} onClick={handleCopy}>
            <FontAwesomeIcon icon={faCopy} /> Copy Output
          </button>
          <button className='iconButton' onClick={handleDownload}>
            <FontAwesomeIcon icon={faDownload} /> Download Output
          </button>
        </div>
      </div>

      {/* Input and Output Sections */}
      <div style={{ display: 'flex', flexGrow: 1, marginTop: '10px' }}>
        {/* Input Section for Markdown */}
        <textarea
          value={markdownContent}
          onChange={handleMarkdownChange}
          className="textareaplaceholder"
          style={styles.textarea}
          placeholder={showPlaceholder ? 'Write your Markdown here...' : ''}
        />

        {/* Output Section for HTML */}
        <div
          ref={editableContentRef}
          contentEditable
          style={styles.contentEditableDiv}
          dangerouslySetInnerHTML={{ __html: htmlContent }} // Set inner HTML directly
        />
      </div>

      {/* Popup Message */}
      {popupMessage && (
        <div style={popupStyles.container}>
          <div
            style={{
              ...popupStyles.popup,
              color: popupMessage.includes('No HTML') ? 'red' : 'white',
              backgroundColor: popupMessage.includes('No HTML') ? 'white' : 'black',
            }}
          >
            <p>
              <FontAwesomeIcon
                icon={popupMessage.includes('No HTML') ? faExclamationCircle : faCheckCircle}
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
    fontSize: '14px',
    border: '1px solid #ddd',
    height: 'calc(100vh - 160px)',
    overflowY: 'auto',
    boxSizing: 'border-box',
    backgroundColor: '#f9f9f9',
  },
  textarea: {
    width: '50%',
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    height: 'calc(100vh - 160px)',
    overflowY: 'auto',
    boxSizing: 'border-box',
    backgroundColor: '#f9f9f9',
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

export default MarkdownToWordConverter;
