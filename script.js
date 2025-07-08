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

    // --- Time Converter ---
    const currentEpochDisplay = document.getElementById('current-epoch-display');
    const currentUtcDisplay = document.getElementById('current-utc-display');
    const currentLocalDisplay = document.getElementById('current-local-display');
    const epochResultBox = document.getElementById('epoch-result');

    let userInputActive = false;
    let currentTimeInterval;

    const formatReadableDate = (date) => {
        // YYYY-MM-DD HH:mm:ss format
        const pad = (n) => n < 10 ? '0' + n : n;
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };

    const formatReadableUTCDate = (date) => {
        // YYYY-MM-DD HH:mm:ss format for UTC with day of week
        const pad = (n) => n < 10 ? '0' + n : n;
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayName = days[date.getUTCDay()];
        return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())} UTC (${dayName})`;
    };

    const updateFromEpoch = (epochSeconds) => {
        if (isNaN(epochSeconds) || epochSeconds === '') return;
        const date = new Date(epochSeconds * 1000);
        if (isNaN(date.getTime())) return;
        
        currentUtcDisplay.value = formatReadableUTCDate(date);
        currentLocalDisplay.value = formatReadableDate(date);
    };

    const updateFromUTC = (utcString) => {
        if (!utcString) return;
        const date = new Date(utcString);
        if (isNaN(date.getTime())) return;
        
        const epochSeconds = Math.floor(date.getTime() / 1000);
        currentEpochDisplay.value = epochSeconds;
        currentLocalDisplay.value = formatReadableDate(date);
    };

    const updateFromLocal = (localString) => {
        if (!localString) return;
        const date = new Date(localString);
        if (isNaN(date.getTime())) return;
        
        const epochSeconds = Math.floor(date.getTime() / 1000);
        currentEpochDisplay.value = epochSeconds;
        currentUtcDisplay.value = formatReadableUTCDate(date);
    };

    const updateCurrentTime = () => {
        if (userInputActive) return;
        
        const now = new Date();
        const epochSeconds = Math.floor(now.getTime() / 1000);
        
        currentEpochDisplay.value = epochSeconds;
        currentUtcDisplay.value = formatReadableUTCDate(now);
        currentLocalDisplay.value = formatReadableDate(now);
    };

    const checkAllFieldsEmpty = () => {
        return !currentEpochDisplay.value && !currentUtcDisplay.value && !currentLocalDisplay.value;
    };

    // --- Event Listeners for Time Converter ---
    currentEpochDisplay.addEventListener('input', (e) => {
        userInputActive = true;
        if (checkAllFieldsEmpty()) {
            userInputActive = false;
            updateCurrentTime();
            return;
        }
        updateFromEpoch(e.target.value);
    });

    currentUtcDisplay.addEventListener('input', (e) => {
        userInputActive = true;
        if (checkAllFieldsEmpty()) {
            userInputActive = false;
            updateCurrentTime();
            return;
        }
        updateFromUTC(e.target.value);
    });

    currentLocalDisplay.addEventListener('input', (e) => {
        userInputActive = true;
        if (checkAllFieldsEmpty()) {
            userInputActive = false;
            updateCurrentTime();
            return;
        }
        updateFromLocal(e.target.value);
    });

    // Initialize with current time
    updateCurrentTime();
    currentTimeInterval = setInterval(updateCurrentTime, 1000);

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