import React, { useState, useRef } from 'react';
import * as mammoth from 'mammoth'; // npm install mammoth
import TextFileToTextFile from './TextFiletoTextFile'; // Import the new component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faCopy, faDownload, faExclamationCircle, faCheckCircle} from '@fortawesome/free-solid-svg-icons';
import jsBeautify from 'js-beautify'; // Import js-beautify
import '../../assets/styles/Converters.css' // Optional: Use a highlight.js theme

const { html: beautifyHtml } = jsBeautify; // Extract the html beautifier from the default export

const WordToHtmlConverter = () => {
  const [htmlContent, setHtmlContent] = useState(''); // Stores the HTML content
  const [popupMessage, setPopupMessage] = useState(''); // Stores the popup message
  const fileInputRef = useRef(null);

  // Convert Word document to HTML and beautify it
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        let html = result.value;
        html = beautifyHtml(html, { indent_size: 2 }); // Beautify HTML
        setHtmlContent(html); // Insert the converted HTML into the editor
      } catch (error) {
        console.error('Error converting file:', error);
      }
    } else {
      alert('Please upload a valid Word document (.docx).');
    }
  };

  // Handle content copy to clipboard
  const handleCopy = () => {
    if (htmlContent) { 
    navigator.clipboard.writeText(htmlContent).then(() => {
      setPopupMessage('Html copied to clipboard.');
      setTimeout(() => setPopupMessage(''), 3000); // Hide popup after 3 seconds
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  } else {
    setPopupMessage('No Html content to copy.');
    setTimeout(() => setPopupMessage(''), 3000); // Hide popup after 3 seconds
  } 
  };

  // Download content as a text file
  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Toolbar for uploading Word document */}
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
        <div style={{ float: 'right'}}>
          <button className='iconButton' style={{ marginRight: 10 }} onClick={handleCopy}>
            <FontAwesomeIcon icon={faCopy} /> Copy Html
          </button>
          <button className='iconButton' onClick={handleDownload}>
            <FontAwesomeIcon icon={faDownload} /> Download Html
          </button>
        </div>
      </div>

      {/* Reuse TextFileToTextFile Component */}
      <TextFileToTextFile content={htmlContent} setContent={setHtmlContent} />

      {/* Simple Popup */}
      {popupMessage && (
   <div style={popupStyles.container}>
  <div
    style={{
      ...popupStyles.popup,
      color: popupMessage.includes('No Html') ? 'red' : 'white',
      backgroundColor: popupMessage.includes('No Html') ? 'white' : 'black', // Conditionally apply red or black
    }}
  >
    <p>
      <FontAwesomeIcon
        icon={popupMessage.includes('No Html') ? faExclamationCircle : faCheckCircle}
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

// Inline styles for popup
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

export default WordToHtmlConverter;
