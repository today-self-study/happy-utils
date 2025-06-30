// JavaScript code will be written here. 

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const currentEpochSpan = document.getElementById('current-epoch');
    const refreshEpochBtn = document.getElementById('refresh-epoch');
    const epochInput = document.getElementById('epoch-input');
    const toDateBtn = document.getElementById('to-date-btn');
    const dateInput = document.getElementById('date-input');
    const toEpochBtn = document.getElementById('to-epoch-btn');
    const epochResultBox = document.getElementById('epoch-result');

    // --- Functions ---
    const updateCurrentEpoch = () => {
        const now = Math.floor(Date.now() / 1000);
        currentEpochSpan.textContent = now;
    };

    const convertEpochToDate = () => {
        const epoch = epochInput.value;
        if (!epoch || isNaN(epoch)) {
            epochResultBox.textContent = 'Error: Please enter a valid Epoch timestamp.';
            epochResultBox.style.color = 'red';
            return;
        }
        // Assumes seconds, needs milliseconds for Date constructor
        const date = new Date(epoch * 1000);
        epochResultBox.textContent = `UTC: ${date.toUTCString()}\nLocal: ${date.toLocaleString()}`;
        epochResultBox.style.color = '#333';
    };

    const convertDateToEpoch = () => {
        const dateStr = dateInput.value;
        if (!dateStr) {
            epochResultBox.textContent = 'Error: Please enter a date string.';
            epochResultBox.style.color = 'red';
            return;
        }
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            epochResultBox.textContent = 'Error: Invalid date format. Please use a recognized format like YYYY-MM-DDTHH:mm:ssZ.';
            epochResultBox.style.color = 'red';
            return;
        }
        const epoch = Math.floor(date.getTime() / 1000);
        epochResultBox.textContent = `Epoch Timestamp: ${epoch}`;
        epochResultBox.style.color = '#333';
    };


    // --- Event Listeners ---
    // Initial call and set interval for current epoch time
    updateCurrentEpoch();
    setInterval(updateCurrentEpoch, 1000);

    refreshEpochBtn.addEventListener('click', updateCurrentEpoch);
    toDateBtn.addEventListener('click', convertEpochToDate);
    toEpochBtn.addEventListener('click', convertDateToEpoch);


    // --- URL Encoder/Decoder ---
    const urlInput = document.getElementById('url-input');
    const urlEncodeBtn = document.getElementById('url-encode-btn');
    const urlDecodeBtn = document.getElementById('url-decode-btn');
    const urlCopyBtn = document.getElementById('url-copy-btn');
    const urlClearBtn = document.getElementById('url-clear-btn');
    const urlResultBox = document.getElementById('url-result');

    const showURLMessage = (message, isError = false) => {
        urlResultBox.textContent = message;
        urlResultBox.style.color = isError ? 'red' : 'green';
        urlResultBox.style.display = 'block';
        setTimeout(() => {
            urlResultBox.style.display = 'none';
        }, 3000);
    };

    urlEncodeBtn.addEventListener('click', () => {
        urlInput.value = encodeURIComponent(urlInput.value);
    });

    urlDecodeBtn.addEventListener('click', () => {
        try {
            urlInput.value = decodeURIComponent(urlInput.value);
        } catch (e) {
            showURLMessage('Error: The input string is not a valid encoded URI.', true);
        }
    });

    urlCopyBtn.addEventListener('click', () => {
        if (!urlInput.value) return;
        navigator.clipboard.writeText(urlInput.value)
            .then(() => showURLMessage('Copied to clipboard!'))
            .catch(() => showURLMessage('Failed to copy.', true));
    });

    urlClearBtn.addEventListener('click', () => {
        urlInput.value = '';
    });

    // --- JSON Formatter ---
    const jsonInput = document.getElementById('json-input');
    const jsonFormatBtn = document.getElementById('json-format-btn');
    const jsonCopyBtn = document.getElementById('json-copy-btn');
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

    jsonCopyBtn.addEventListener('click', () => {
        if (!jsonOutput.textContent || jsonOutput.style.color === 'red') {
            // Do not copy if there is no content or if it's an error message
            return;
        }
        navigator.clipboard.writeText(jsonOutput.textContent)
            .then(() => showURLMessage('Formatted JSON copied!')) // Re-using the message function
            .catch(() => showURLMessage('Failed to copy.', true));
    });

    jsonClearBtn.addEventListener('click', () => {
        jsonInput.value = '';
        jsonOutput.textContent = '';
    });
}); 