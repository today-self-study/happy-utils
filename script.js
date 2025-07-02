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

    // --- Tab Navigation ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            // Add active to selected
            btn.classList.add('active');
            const tab = btn.dataset.tab;
            document.querySelector('.tab-' + tab).classList.add('active');
        });
    });

    // --- Markdown Viewer ---
    const markdownInput = document.getElementById('markdown-input');
    const markdownPreview = document.getElementById('markdown-preview');
    const markdownCopyBtn = document.getElementById('markdown-copy-btn');
    const markdownClearBtn = document.getElementById('markdown-clear-btn');

    // Simple markdown to HTML parser (supports headers, bold, italics, code, lists, links)
    function simpleMarkdownToHtml(md) {
        if (!md) return '';
        let html = md
            .replace(/^###### (.*$)/gim, '<h6>$1</h6>')
            .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
            .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/gim, '<em>$1</em>')
            .replace(/`([^`]+)`/gim, '<code>$1</code>')
            .replace(/\n\n/gim, '<br/><br/>')
            .replace(/\n/gim, '<br/>')
            .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank">$1</a>');
        // Lists (unordered)
        html = html.replace(/<br\/>[-*] (.*?)(?=<br\/>|$)/gim, '<ul><li>$1</li></ul>');
        // Merge adjacent <ul>
        html = html.replace(/<\/ul><ul>/gim, '');
        return html;
    }

    function updateMarkdownPreview() {
        const md = markdownInput.value;
        markdownPreview.innerHTML = simpleMarkdownToHtml(md);
    }

    if (markdownInput) {
        markdownInput.addEventListener('input', updateMarkdownPreview);
        markdownCopyBtn.addEventListener('click', () => {
            if (!markdownPreview.innerHTML) return;
            navigator.clipboard.writeText(markdownPreview.innerHTML)
                .then(() => {
                    const originalText = markdownCopyBtn.textContent;
                    markdownCopyBtn.textContent = 'Copied!';
                    markdownCopyBtn.classList.add('copied');
                    setTimeout(() => {
                        markdownCopyBtn.textContent = originalText;
                        markdownCopyBtn.classList.remove('copied');
                    }, 1200);
                });
        });
        markdownClearBtn.addEventListener('click', () => {
            markdownInput.value = '';
            updateMarkdownPreview();
        });
        // Initialize preview
        updateMarkdownPreview();
    }
}); 