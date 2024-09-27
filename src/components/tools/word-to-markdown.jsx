import React, { useState, useRef, useEffect } from 'react';
import TurndownService from 'turndown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faDownload, faUpload, faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { gfm } from 'turndown-plugin-gfm'; // Import the GFM plugin
import mammoth from 'mammoth';
import '../../assets/styles/Converters.css';

const WordToMarkdownConverter = () => {
  const [htmlContent, setHtmlContent] = useState(''); // Stores raw content
  const [markdownContent, setMarkdownContent] = useState(''); // Stores the Markdown content
  const [popupMessage, setPopupMessage] = useState(''); // Stores popup message
  const editableContentRef = useRef(null); // Ref for content-editable div
  const outputTextareaRef = useRef(null); // Ref for Markdown textarea
  const fileInputRef = useRef(null); // Ref for file input
  const [showPlaceholder, setShowPlaceholder] = useState(true); // Show placeholder for input

  // Initialize TurndownService with GFM plugin
  const turndownService = new TurndownService({
    headingStyle: 'atx',
  });

  turndownService.use(gfm); // Enable GFM (GitHub-Flavored Markdown) support including tables

  // Custom rule for table conversion
  turndownService.addRule('table', {
    filter: (node) => node.nodeName === 'TABLE',
    replacement: (content, node) => {
      const rows = Array.from(node.querySelectorAll('tr'));
      const markdownTable = rows.map((row, rowIndex) => {
        const cells = Array.from(row.querySelectorAll('td, th')).map(cell => cell.textContent.trim());
        const rowContent = `| ${cells.join(' | ')} |`;
        if (rowIndex === 0) {
          const headerDivider = cells.map(() => '---').join(' | ');
          return `${rowContent}\n| ${headerDivider} |`;
        }
        return rowContent;
      }).join('\n');

      return markdownTable;
    }
  });

  useEffect(() => {
    const handleContentChange = () => {
      const editableDiv = editableContentRef.current;
      if (editableDiv) {
        const newHtmlContent = editableDiv.innerHTML || '';
        setHtmlContent(newHtmlContent);

        // Check if the text content is empty
        const isEmpty = editableDiv.textContent.trim() === '';
        setShowPlaceholder(isEmpty);

        const cleanedHtmlContent = cleanUpWordContent(newHtmlContent);
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

  // Function to clean up unnecessary Word HTML elements
  const cleanUpWordContent = (html) => {
    let cleanedHtml = (html || '')
      .replace(/<o:p>.*?<\/o:p>/gi, '') // Remove Word <o:p> tags
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove <style> tags
      .replace(/style\s*=\s*(['"]).*?\1/gi, '') // Remove inline styles
      .replace(/<br\s*\/?>/gi, '\n') // Replace <br> with newlines
      .replace(/<\/?div>/gi, '<p>') // Replace divs with paragraphs
      .replace(/\n\s*\n/g, '\n') // Collapse multiple newlines into one
      .replace(/^\s+|\s+$/g, '') // Trim leading/trailing spaces
      .replace(/<h(\d)>(.*?)<\/h\d>/gi, (match, level, content) => {
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
  const handleDownload = () => {
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
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle file upload and conversion
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        const html = cleanUpWordContent(result.value);
        const markdown = turndownService.turndown(html);

        setHtmlContent(html);
        setMarkdownContent(markdown);
        editableContentRef.current.innerHTML = html;
        outputTextareaRef.current.value = markdown;

        setShowPlaceholder(html === '' || html === '<br>');
      } catch (error) {
        console.error('Error converting file:', error);
      }
    } else {
      alert('Please upload a valid Word document (.docx).');
    }
  };

  return (
    <div>
      {/* Action Buttons */}
      <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="file"
            accept=".docx"
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <button className='iconButton' onClick={() => fileInputRef.current.click()}>
            <FontAwesomeIcon icon={faUpload} /> Upload Word Document
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button className='iconButton' style={{ marginRight: 10 }} onClick={handleCopy}>
            <FontAwesomeIcon icon={faCopy} /> Copy Markdown
          </button>
          <button className='iconButton' onClick={handleDownload}>
            <FontAwesomeIcon icon={faDownload} /> Download Markdown
          </button>
        </div>
      </div>

      {/* Input and Output Sections */}
      <div style={{ display: 'flex', flexGrow: 1, marginTop: '10px' }}>
        {/* Input Section with Placeholder */}
        <div style={{ position: 'relative', width: '50%', marginRight: '5px' }}>
          {showPlaceholder && (
            <span style={styles.placeholder}>
              Paste your Word content here ...
            </span>
          )}
          <div
            ref={editableContentRef}
            contentEditable
            style={styles.contentEditableDiv}
          />
        </div>

        {/* Output Section */}
        <textarea
          ref={outputTextareaRef}
          value={markdownContent}
          readOnly
          className="textareaplaceholder"
          style={styles.textarea}
          placeholder={htmlContent === '' ? '... Get your Markdown here' : ''}
        />
      </div>

      {/* Popup Message */}
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
    width: '100%',
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
    padding: '0 10px',
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
