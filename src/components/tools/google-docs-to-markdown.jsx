import React, { useState, useRef, useEffect } from 'react';
import TurndownService from 'turndown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faDownload, faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import '../../assets/styles/Converters.css';

const GoogleDocsToMarkdownConverter = () => {
    const [rawHtmlContent, setRawHtmlContent] = useState(''); // Stores raw HTML content
    const [markdownContent, setMarkdownContent] = useState(''); // Stores Markdown content
    const [popupMessage, setPopupMessage] = useState(''); // Stores popup messages
    const editableContentRef = useRef(null); // Ref for the content-editable div
    const [showPlaceholder, setShowPlaceholder] = useState(true); // Controls the visibility of the placeholder

    useEffect(() => {
        const handleContentChange = () => {
            const editableDiv = editableContentRef.current;
            if (editableDiv) {
                const newHtmlContent = editableDiv.innerHTML || '';
                setRawHtmlContent(newHtmlContent);

                const isEmpty = editableDiv.textContent.trim() === '';
                setShowPlaceholder(isEmpty);

                // Convert HTML to Markdown
                const markdown = convertHtmlToMarkdown(newHtmlContent);
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

    const convertHtmlToMarkdown = (html) => {
        const turndownService = new TurndownService();
        return turndownService.turndown(html);
    };

    const handleCopy = () => {
        if (markdownContent) {
            navigator.clipboard.writeText(markdownContent)
                .then(() => {
                    setPopupMessage('Copied Markdown to clipboard.');
                    setTimeout(() => setPopupMessage(''), 3000);
                })
                .catch((err) => {
                    console.error('Failed to copy Markdown: ', err);
                    setPopupMessage('Failed to copy Markdown.');
                    setTimeout(() => setPopupMessage(''), 3000);
                });
        } else {
            setPopupMessage('No Markdown content to copy.');
            setTimeout(() => setPopupMessage(''), 3000);
        }
    };

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
        a.download = 'GoogleDocsContent.md';
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
                    <FontAwesomeIcon icon={faCopy} /> Copy Markdown
                </button>
                <button className='iconButton' onClick={handleDownload}>
                    <FontAwesomeIcon icon={faDownload} /> Download Markdown
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
                        suppressContentEditableWarning={true}
                    />
                </div>

                {/* Output Section as a Textarea */}
                <textarea
                    value={markdownContent}
                    readOnly
                    className="textareaplaceholder"
                    style={styles.textarea}
                    placeholder={markdownContent === '' ? '... Get your Markdown here' : ''}
                />
            </div>

            {/* Popup Message */}
            {popupMessage && (
                <div style={popupStyles.container}>
                    <div
                        style={{
                            ...popupStyles.popup,
                            color: popupMessage.includes('Failed') || popupMessage.includes('No Markdown') ? 'red' : 'white',
                            backgroundColor: popupMessage.includes('Failed') || popupMessage.includes('No Markdown') ? 'white' : 'black',
                        }}
                    >
                        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FontAwesomeIcon
                                icon={popupMessage.includes('Failed') || popupMessage.includes('No Markdown') ? faExclamationCircle : faCheckCircle}
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
        minHeight: '300px',
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
        resize: 'none',
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
        zIndex: 1,
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
        pointerEvents: 'none',
    },
    popup: {
        backgroundColor: '#4BB543',
        color: '#fff',
        padding: '20px 30px',
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        pointerEvents: 'all',
        display: 'flex',
        alignItems: 'center',
    },
};

export default GoogleDocsToMarkdownConverter;
