// JavaScript code will be written here. 

document.addEventListener('DOMContentLoaded', () => {
    // --- General Helper ---
    const showMessage = (element, message, isError = false) => {
        element.textContent = message;
        element.style.color = isError ? 'red' : 'green';
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 3000);
    };

    // --- Epoch Converter ---
    const currentEpochDisplay = document.getElementById('current-epoch-display');
    const currentUtcDisplay = document.getElementById('current-utc-display');
    const currentLocalDisplay = document.getElementById('current-local-display');
    
    const epochInput = document.getElementById('epoch-input');
    const toDateBtn = document.getElementById('to-date-btn');
    const epochToDateOutput = document.getElementById('epoch-to-date-output');
    
    const dateInput = document.getElementById('date-input');
    const toEpochBtn = document.getElementById('to-epoch-btn');
    const dateToEpochOutput = document.getElementById('date-to-epoch-output');

    const epochResultBox = document.getElementById('epoch-result');

    const formatReadableDate = (date) => {
        // YYYY-MM-DD HH:mm:ss format
        const pad = (n) => n < 10 ? '0' + n : n;
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };

    const updateCurrentTime = () => {
        const now = new Date();
        const epochSeconds = Math.floor(now.getTime() / 1000);
        
        currentEpochDisplay.value = epochSeconds;
        currentUtcDisplay.value = now.toUTCString();
        currentLocalDisplay.value = formatReadableDate(now);
    };

    const convertEpochToDate = () => {
        const epoch = epochInput.value;
        if (!epoch || isNaN(epoch)) {
            showMessage(epochResultBox, 'Error: Please enter a valid Epoch timestamp.', true);
            epochToDateOutput.value = '';
            return;
        }
        const date = new Date(epoch * 1000);
        epochToDateOutput.value = date.toUTCString();
    };

    const convertDateToEpoch = () => {
        const dateStr = dateInput.value;
        if (!dateStr) {
            showMessage(epochResultBox, 'Error: Please enter a date string.', true);
            dateToEpochOutput.value = '';
            return;
        }
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            showMessage(epochResultBox, 'Error: Invalid date format.', true);
            dateToEpochOutput.value = '';
            return;
        }
        dateToEpochOutput.value = Math.floor(date.getTime() / 1000);
    };
    
    // --- Event Listeners for Epoch Converter ---
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);

    toDateBtn.addEventListener('click', convertEpochToDate);
    toEpochBtn.addEventListener('click', convertDateToEpoch);

    // --- General Event Listeners ---
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            const targetInput = document.getElementById(targetId);
            if (targetInput && targetInput.value) {
                navigator.clipboard.writeText(targetInput.value)
                    .then(() => {
                        const originalText = button.textContent;
                        button.textContent = 'Copied!';
                        button.classList.add('copied');
                        setTimeout(() => {
                            button.textContent = originalText;
                            button.classList.remove('copied');
                        }, 1200);
                    })
                    .catch(err => console.error('Failed to copy: ', err));
            }
        });
    });

    // --- URL Encoder/Decoder ---
    const urlInput = document.getElementById('url-input');
    const urlEncodeBtn = document.getElementById('url-encode-btn');
    const urlDecodeBtn = document.getElementById('url-decode-btn');
    const urlClearBtn = document.getElementById('url-clear-btn');
    const urlResultBox = document.getElementById('url-result');

    urlEncodeBtn.addEventListener('click', () => {
        urlInput.value = encodeURIComponent(urlInput.value);
    });

    urlDecodeBtn.addEventListener('click', () => {
        try {
            urlInput.value = decodeURIComponent(urlInput.value);
        } catch (e) {
            showMessage(urlResultBox, 'Error: The input string is not a valid encoded URI.', true);
        }
    });

    urlClearBtn.addEventListener('click', () => {
        urlInput.value = '';
    });

    // --- JSON Formatter ---
    const jsonInput = document.getElementById('json-input');
    const jsonFormatBtn = document.getElementById('json-format-btn');
    const jsonClearBtn = document.getElementById('json-clear-btn');
    const jsonOutput = document.getElementById('json-output');

    jsonFormatBtn.addEventListener('click', () => {
        try {
            const jsonObj = JSON.parse(jsonInput.value);
            jsonOutput.textContent = JSON.stringify(jsonObj, null, 4);
            jsonOutput.style.color = '#333';
        } catch (e) {
            jsonOutput.textContent = `Error: Invalid JSON.\n${e.message}`;
            jsonOutput.style.color = 'red';
        }
    });

    jsonClearBtn.addEventListener('click', () => {
        jsonInput.value = '';
        jsonOutput.textContent = '';
    });

    // --- Markdown Viewer ---
    const markdownInput = document.getElementById('markdown-input');
    const markdownRenderBtn = document.getElementById('markdown-render-btn');
    const markdownCopyHtmlBtn = document.getElementById('markdown-copy-html-btn');
    const markdownClearBtn = document.getElementById('markdown-clear-btn');
    const markdownOutput = document.getElementById('markdown-output');

    let renderedHtml = '';

    // Configure marked options for better rendering
    if (typeof marked !== 'undefined') {
        marked.setOptions({
            highlight: function(code, lang) {
                // Simple syntax highlighting fallback
                return code;
            },
            breaks: true,
            gfm: true
        });
    }

    const renderMarkdown = () => {
        if (typeof marked === 'undefined') {
            markdownOutput.innerHTML = '<p style="color: red;">Error: Markdown library failed to load. Please refresh the page.</p>';
            return;
        }

        const markdownText = markdownInput.value;
        
        if (!markdownText.trim()) {
            markdownOutput.innerHTML = '<p style="color: #888; font-style: italic;">Enter some markdown text above and click "Render" to see the preview.</p>';
            renderedHtml = '';
            return;
        }

        try {
            renderedHtml = marked.parse(markdownText);
            markdownOutput.innerHTML = renderedHtml;
        } catch (error) {
            markdownOutput.innerHTML = `<p style="color: red;">Error rendering markdown: ${error.message}</p>`;
            renderedHtml = '';
        }
    };

    const copyMarkdownHtml = () => {
        if (!renderedHtml) {
            renderMarkdown();
        }
        
        if (renderedHtml) {
            navigator.clipboard.writeText(renderedHtml)
                .then(() => {
                    const originalText = markdownCopyHtmlBtn.textContent;
                    markdownCopyHtmlBtn.textContent = 'Copied!';
                    markdownCopyHtmlBtn.classList.add('copied');
                    setTimeout(() => {
                        markdownCopyHtmlBtn.textContent = originalText;
                        markdownCopyHtmlBtn.classList.remove('copied');
                    }, 1200);
                })
                .catch(err => console.error('Failed to copy HTML: ', err));
        }
    };

    const clearMarkdown = () => {
        markdownInput.value = '';
        markdownOutput.innerHTML = '';
        renderedHtml = '';
    };

    // Event listeners for markdown viewer
    markdownRenderBtn.addEventListener('click', renderMarkdown);
    markdownCopyHtmlBtn.addEventListener('click', copyMarkdownHtml);
    markdownClearBtn.addEventListener('click', clearMarkdown);

    // Auto-render on input (with debounce)
    let markdownTimeout;
    markdownInput.addEventListener('input', () => {
        clearTimeout(markdownTimeout);
        markdownTimeout = setTimeout(renderMarkdown, 500);
    });

    // Initial render if there's placeholder content
    setTimeout(() => {
        if (markdownInput.value.trim()) {
            renderMarkdown();
        }
    }, 100);
}); 