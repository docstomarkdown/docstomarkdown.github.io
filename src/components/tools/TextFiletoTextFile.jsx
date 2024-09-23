import React, { useState, useRef, useEffect } from 'react';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  
import {  
  faBold, faItalic, faUnderline, faListOl, faListUl, faQuoteRight,  
  faLink, faTable, faEraser, faUndo, faRedo  
} from '@fortawesome/free-solid-svg-icons';  

const TextFileToTextFile = ({ content, setContent }) => {  
  const editorRef = useRef(null);  
  const [history, setHistory] = useState([{ content: '' }]);  
  const [historyIndex, setHistoryIndex] = useState(0);  
  const placeholder = "// Paste your content here..."; // your placeholder text  

  const saveCursorPosition = () => {  
    const selection = window.getSelection();  
    return selection.rangeCount > 0 ? selection.getRangeAt(0) : null;  
  };  

  const restoreCursorPosition = (range) => {  
    if (range) {  
      const selection = window.getSelection();  
      selection.removeAllRanges();  
      selection.addRange(range);  
    }  
  };  

  useEffect(() => {  
    const editor = editorRef.current;  

    const handleContentChange = () => {  
      const newContent = editor.innerHTML;  
      setContent(newContent);  
      const updatedHistory = history.slice(0, historyIndex + 1);  
      setHistory([...updatedHistory, { content: newContent }]);  
      setHistoryIndex(updatedHistory.length);  
    };  

    editor.addEventListener('input', handleContentChange);  
    return () => {  
      editor.removeEventListener('input', handleContentChange);  
    };  
  }, [history, historyIndex, setContent]);  

  const wrapSelectedText = (before, after) => {  
    const selection = window.getSelection();  
    if (selection.rangeCount > 0) {  
      const range = selection.getRangeAt(0);  
      const selectedText = range.toString();  
      const newText = `${before}${selectedText}${after || before}`;  
      range.deleteContents();  

      const fragment = document.createElement('div');  
      fragment.innerHTML = newText;  
      const nodes = Array.from(fragment.childNodes);  
      nodes.forEach(node => range.insertNode(node));  

      const updatedContent = editorRef.current.innerHTML;  
      setContent(updatedContent);  
      setHistory(prevHistory => {  
        const newHistory = prevHistory.slice(0, historyIndex + 1);  
        return [...newHistory, { content: updatedContent }];  
      });  
      setHistoryIndex(prevIndex => prevIndex + 1);  
    }  
  };  

  const handleBold = () => {  
    const range = saveCursorPosition();  
    wrapSelectedText('<strong>', '</strong>');  
    restoreCursorPosition(range);  
  };  

  const handleItalic = () => {  
    const range = saveCursorPosition();  
    wrapSelectedText('<em>', '</em>');  
    restoreCursorPosition(range);  
  };  

  const handleUnderline = () => {  
    const range = saveCursorPosition();  
    wrapSelectedText('<u>', '</u>');  
    restoreCursorPosition(range);  
  };  

  const handleOrderedList = () => {  
    const range = saveCursorPosition();  
    wrapSelectedText('<ol><li>', '</li></ol>');  
    restoreCursorPosition(range);  
  };  

  const handleUnorderedList = () => {  
    const range = saveCursorPosition();  
    wrapSelectedText('<ul><li>', '</li></ul>');  
    restoreCursorPosition(range);  
  };  

  const handleQuote = () => {  
    const range = saveCursorPosition();  
    wrapSelectedText('<blockquote>', '</blockquote>');  
    restoreCursorPosition(range);  
  };  

  const handleLink = () => {  
    const range = saveCursorPosition();  
    wrapSelectedText('<a href="https://example.com">', '</a>');  
    restoreCursorPosition(range);  
  };  

  const handleTable = () => {  
    const range = saveCursorPosition();  
    const tableHTML = `  
      <table>  
        <thead>  
          <tr><th>Header 1</th><th>Header 2</th></tr>  
        </thead>  
        <tbody>  
          <tr><td>Row 1 Col 1</td><td>Row 1 Col 2</td></tr>  
          <tr><td>Row 2 Col 1</td><td>Row 2 Col 2</td></tr>  
        </tbody>  
      </table>`;  
    wrapSelectedText(tableHTML, '');  
    restoreCursorPosition(range);  
  };  

  const handleUndo = () => {  
    if (historyIndex > 0) {  
      setHistoryIndex(historyIndex - 1);  
      const previousContent = history[historyIndex - 1].content;  
      setContent(previousContent);  
      editorRef.current.innerHTML = previousContent;  
    }  
  };  

  const handleRedo = () => {  
    if (historyIndex < history.length - 1) {  
      setHistoryIndex(historyIndex + 1);  
      const nextContent = history[historyIndex + 1].content;  
      setContent(nextContent);  
      editorRef.current.innerHTML = nextContent;  
    }  
  };  

  const handleClear = () => {  
    setContent('');  
    setHistory([{ content: '' }]);  
    setHistoryIndex(0);  
    editorRef.current.innerHTML = '';  
  };  

  return (  
    <div>  
      {/* Toolbar */}  
      <div style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>  
        <button onClick={handleBold} style={styles.iconButton}><FontAwesomeIcon icon={faBold} /></button>  
        <button onClick={handleItalic} style={styles.iconButton}><FontAwesomeIcon icon={faItalic} /></button>  
        <button onClick={handleUnderline} style={styles.iconButton}><FontAwesomeIcon icon={faUnderline} /></button>  
        <button onClick={handleOrderedList} style={styles.iconButton}><FontAwesomeIcon icon={faListOl} /></button>  
        <button onClick={handleUnorderedList} style={styles.iconButton}><FontAwesomeIcon icon={faListUl} /></button>  
        <button onClick={handleQuote} style={styles.iconButton}><FontAwesomeIcon icon={faQuoteRight} /></button>  
        <button onClick={handleTable} style={styles.iconButton}><FontAwesomeIcon icon={faTable} /></button>  
        <button onClick={handleLink} style={styles.iconButton}><FontAwesomeIcon icon={faLink} /></button>  
        <button onClick={handleClear} style={styles.iconButton}><FontAwesomeIcon icon={faEraser} /></button>  
        <button onClick={handleUndo} style={styles.iconButton}><FontAwesomeIcon icon={faUndo} /></button>  
        <button onClick={handleRedo} style={styles.iconButton}><FontAwesomeIcon icon={faRedo} /></button>  
      </div>  

      {/* Editor and Raw Content Side by Side */}  
      <div style={{ display: 'flex', flexGrow: 1 }}>  
        {/* Content-Editable Div */}  
        <div   
          ref={editorRef}  
          contentEditable={true}  
          style={styles.editor}  
          onFocus={() => {  
            if (editorRef.current.innerHTML === '') {  
              editorRef.current.innerHTML = ''; // Clear default content if needed  
            }  
          }}  
          onBlur={() => {  
            if (editorRef.current.innerHTML === '') {  
              editorRef.current.innerHTML = ''; // Final check  
            }  
          }}  
        >  
          { content === '' && <div style={styles.placeholder}>{placeholder}</div> }  
          <div dangerouslySetInnerHTML={{ __html: content }} />  
        </div>  

        {/* Textarea to display raw content */}  
        <textarea  
          value={content}  
          readOnly  
          style={styles.textarea}  
        />  
      </div>  
    </div>  
  );  
};  

// Custom styles  
const styles = {  
  iconButton: {  
    backgroundColor: 'transparent',  
    border: 'none',  
    cursor: 'pointer',  
    fontSize: '14px',  
    margin: '0 5px',  
    padding: '5px',  
    color: '#333',  
  },  
  editor: {  
    width: '50%',  
    padding: '10px',  
    fontSize: '18px',  
    fontFamily: 'auto',  
    border: '1px solid #ddd',  
    backgroundColor: '#f4f4f4',  
    height: 'calc(100vh - 160px)', // Adjust for full height  
    overflowY: 'auto',  
    outline: 'none',  
    marginRight: '7px',  
    whiteSpace: 'pre-wrap',  
    boxSizing: 'border-box',  
    position: 'relative', // Needed for placeholder positioning  
  },  
  textarea: {  
    width: '50%',  
    padding: '10px',  
    fontSize: '16px',  
    border: '1px solid #ddd',  
    height: 'calc(100vh - 160px)', // Adjust for full height  
    overflowY: 'auto',  
    boxSizing: 'border-box',  
    fontFamily: 'auto',  
    backgroundColor: '#f9f9f9',  
  },  
  placeholder: {  
    position: 'absolute', // Absolute positioning for overlay effect  
    top: '1',  
    left: '10px',
    color: '#80848a',  
    pointerEvents: 'none', // Let clicks pass through  
  },  
};  

export default TextFileToTextFile;