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
        // YYYY-MM-DD HH:mm:ss format for UTC
        const pad = (n) => n < 10 ? '0' + n : n;
        return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
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

    const checkAnyFieldEmpty = () => {
        return !currentEpochDisplay.value || !currentUtcDisplay.value || !currentLocalDisplay.value;
    };

    const resetToCurrentTime = () => {
        userInputActive = false;
        updateCurrentTime();
    };

    // --- Event Listeners for Time Converter ---
    currentEpochDisplay.addEventListener('input', (e) => {
        userInputActive = true;
        if (checkAnyFieldEmpty()) {
            resetToCurrentTime();
            return;
        }
        updateFromEpoch(e.target.value);
    });

    currentUtcDisplay.addEventListener('input', (e) => {
        userInputActive = true;
        if (checkAnyFieldEmpty()) {
            resetToCurrentTime();
            return;
        }
        updateFromUTC(e.target.value);
    });

    currentLocalDisplay.addEventListener('input', (e) => {
        userInputActive = true;
        if (checkAnyFieldEmpty()) {
            resetToCurrentTime();
            return;
        }
        updateFromLocal(e.target.value);
    });

    // Initialize with current time (no auto-refresh)
    updateCurrentTime();

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

    // --- Base64 Encoder/Decoder ---
    const base64Input = document.getElementById('base64-input');
    const base64EncodeBtn = document.getElementById('base64-encode-btn');
    const base64DecodeBtn = document.getElementById('base64-decode-btn');
    const base64CopyBtn = document.getElementById('base64-copy-btn');
    const base64ClearBtn = document.getElementById('base64-clear-btn');
    const base64ResultBox = document.getElementById('base64-result');

    base64EncodeBtn.addEventListener('click', () => {
        try {
            base64Input.value = btoa(base64Input.value);
        } catch (e) {
            showMessage(base64ResultBox, 'Error: The input string contains invalid characters for encoding.', true);
        }
    });

    base64DecodeBtn.addEventListener('click', () => {
        try {
            base64Input.value = atob(base64Input.value);
        } catch (e) {
            showMessage(base64ResultBox, 'Error: The input string is not a valid Base64 string.', true);
        }
    });

    base64CopyBtn.addEventListener('click', () => {
        if (base64Input.value) {
            navigator.clipboard.writeText(base64Input.value)
                .then(() => {
                    const originalText = base64CopyBtn.textContent;
                    base64CopyBtn.textContent = 'Copied!';
                    base64CopyBtn.classList.add('copied');
                    setTimeout(() => {
                        base64CopyBtn.textContent = originalText;
                        base64CopyBtn.classList.remove('copied');
                    }, 1200);
                })
                .catch(err => console.error('Failed to copy: ', err));
        }
    });

    base64ClearBtn.addEventListener('click', () => {
        base64Input.value = '';
    });

    // --- Hash Generator ---
    const hashInput = document.getElementById('hash-input');
    const hashGenerateBtn = document.getElementById('hash-generate-btn');
    const hashClearBtn = document.getElementById('hash-clear-btn');
    const hashMd5Result = document.getElementById('hash-md5-result');
    const hashSha1Result = document.getElementById('hash-sha1-result');
    const hashSha256Result = document.getElementById('hash-sha256-result');
    const hashSha512Result = document.getElementById('hash-sha512-result');
    const hashResultBox = document.getElementById('hash-result');

    // Simple MD5 implementation
    function md5(string) {
        function md5cycle(x, k) {
            var a = x[0], b = x[1], c = x[2], d = x[3];
            a = ff(a, b, c, d, k[0], 7, -680876936);
            d = ff(d, a, b, c, k[1], 12, -389564586);
            c = ff(c, d, a, b, k[2], 17, 606105819);
            b = ff(b, c, d, a, k[3], 22, -1044525330);
            a = ff(a, b, c, d, k[4], 7, -176418897);
            d = ff(d, a, b, c, k[5], 12, 1200080426);
            c = ff(c, d, a, b, k[6], 17, -1473231341);
            b = ff(b, c, d, a, k[7], 22, -45705983);
            a = ff(a, b, c, d, k[8], 7, 1770035416);
            d = ff(d, a, b, c, k[9], 12, -1958414417);
            c = ff(c, d, a, b, k[10], 17, -42063);
            b = ff(b, c, d, a, k[11], 22, -1990404162);
            a = ff(a, b, c, d, k[12], 7, 1804603682);
            d = ff(d, a, b, c, k[13], 12, -40341101);
            c = ff(c, d, a, b, k[14], 17, -1502002290);
            b = ff(b, c, d, a, k[15], 22, 1236535329);
            a = gg(a, b, c, d, k[1], 5, -165796510);
            d = gg(d, a, b, c, k[6], 9, -1069501632);
            c = gg(c, d, a, b, k[11], 14, 643717713);
            b = gg(b, c, d, a, k[0], 20, -373897302);
            a = gg(a, b, c, d, k[5], 5, -701558691);
            d = gg(d, a, b, c, k[10], 9, 38016083);
            c = gg(c, d, a, b, k[15], 14, -660478335);
            b = gg(b, c, d, a, k[4], 20, -405537848);
            a = gg(a, b, c, d, k[9], 5, 568446438);
            d = gg(d, a, b, c, k[14], 9, -1019803690);
            c = gg(c, d, a, b, k[3], 14, -187363961);
            b = gg(b, c, d, a, k[8], 20, 1163531501);
            a = gg(a, b, c, d, k[13], 5, -1444681467);
            d = gg(d, a, b, c, k[2], 9, -51403784);
            c = gg(c, d, a, b, k[7], 14, 1735328473);
            b = gg(b, c, d, a, k[12], 20, -1926607734);
            a = hh(a, b, c, d, k[5], 4, -378558);
            d = hh(d, a, b, c, k[8], 11, -2022574463);
            c = hh(c, d, a, b, k[11], 16, 1839030562);
            b = hh(b, c, d, a, k[14], 23, -35309556);
            a = hh(a, b, c, d, k[1], 4, -1530992060);
            d = hh(d, a, b, c, k[4], 11, 1272893353);
            c = hh(c, d, a, b, k[7], 16, -155497632);
            b = hh(b, c, d, a, k[10], 23, -1094730640);
            a = hh(a, b, c, d, k[13], 4, 681279174);
            d = hh(d, a, b, c, k[0], 11, -358537222);
            c = hh(c, d, a, b, k[3], 16, -722521979);
            b = hh(b, c, d, a, k[6], 23, 76029189);
            a = hh(a, b, c, d, k[9], 4, -640364487);
            d = hh(d, a, b, c, k[12], 11, -421815835);
            c = hh(c, d, a, b, k[15], 16, 530742520);
            b = hh(b, c, d, a, k[2], 23, -995338651);
            a = ii(a, b, c, d, k[0], 6, -198630844);
            d = ii(d, a, b, c, k[7], 10, 1126891415);
            c = ii(c, d, a, b, k[14], 15, -1416354905);
            b = ii(b, c, d, a, k[5], 21, -57434055);
            a = ii(a, b, c, d, k[12], 6, 1700485571);
            d = ii(d, a, b, c, k[3], 10, -1894986606);
            c = ii(c, d, a, b, k[10], 15, -1051523);
            b = ii(b, c, d, a, k[1], 21, -2054922799);
            a = ii(a, b, c, d, k[8], 6, 1873313359);
            d = ii(d, a, b, c, k[15], 10, -30611744);
            c = ii(c, d, a, b, k[6], 15, -1560198380);
            b = ii(b, c, d, a, k[13], 21, 1309151649);
            a = ii(a, b, c, d, k[4], 6, -145523070);
            d = ii(d, a, b, c, k[11], 10, -1120210379);
            c = ii(c, d, a, b, k[2], 15, 718787259);
            b = ii(b, c, d, a, k[9], 21, -343485551);
            x[0] = add32(a, x[0]);
            x[1] = add32(b, x[1]);
            x[2] = add32(c, x[2]);
            x[3] = add32(d, x[3]);
        }
        function cmn(q, a, b, x, s, t) {
            a = add32(add32(a, q), add32(x, t));
            return add32((a << s) | (a >>> (32 - s)), b);
        }
        function ff(a, b, c, d, x, s, t) {
            return cmn((b & c) | ((~b) & d), a, b, x, s, t);
        }
        function gg(a, b, c, d, x, s, t) {
            return cmn((b & d) | (c & (~d)), a, b, x, s, t);
        }
        function hh(a, b, c, d, x, s, t) {
            return cmn(b ^ c ^ d, a, b, x, s, t);
        }
        function ii(a, b, c, d, x, s, t) {
            return cmn(c ^ (b | (~d)), a, b, x, s, t);
        }
        function add32(a, b) {
            return (a + b) & 0xFFFFFFFF;
        }
        function rhex(n) {
            var s = '', j = 0;
            for (; j < 4; j++)
                s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];
            return s;
        }
        var hex_chr = '0123456789abcdef'.split('');
        var n = string.length * 8;
        var x = [];
        string += '\x80';
        while (string.length % 64 !== 56) string += '\x00';
        for (var i = 0; i < string.length; i += 8) {
            x[i >> 5] |= (string.charCodeAt(i / 8) & 0xFF) << (i % 32);
        }
        x[n >> 5] |= 0x80 << (n % 32);
        x[(((n + 64) >>> 9) << 4) + 14] = n;
        var h = [1732584193, -271733879, -1732584194, 271733878];
        for (i = 0; i < x.length; i += 16) {
            var olda = h[0], oldb = h[1], oldc = h[2], oldd = h[3];
            h[0] = h[1] = h[2] = h[3] = 0;
            md5cycle(h, x.slice(i, i + 16));
            h[0] = add32(olda, h[0]);
            h[1] = add32(oldb, h[1]);
            h[2] = add32(oldc, h[2]);
            h[3] = add32(oldd, h[3]);
        }
        return rhex(h[0]) + rhex(h[1]) + rhex(h[2]) + rhex(h[3]);
    }

    // Generate SHA hashes using Web Crypto API
    async function generateSHA(text, algorithm) {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuffer = await crypto.subtle.digest(algorithm, data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    hashGenerateBtn.addEventListener('click', async () => {
        const text = hashInput.value;
        
        if (!text) {
            showMessage(hashResultBox, 'Please enter text to generate hash.', true);
            return;
        }

        try {
            // Generate MD5
            hashMd5Result.value = md5(text);
            
            // Generate SHA hashes
            hashSha1Result.value = await generateSHA(text, 'SHA-1');
            hashSha256Result.value = await generateSHA(text, 'SHA-256');
            hashSha512Result.value = await generateSHA(text, 'SHA-512');
            
        } catch (error) {
            showMessage(hashResultBox, 'Error generating hashes: ' + error.message, true);
        }
    });

    hashClearBtn.addEventListener('click', () => {
        hashInput.value = '';
        hashMd5Result.value = '';
        hashSha1Result.value = '';
        hashSha256Result.value = '';
        hashSha512Result.value = '';
    });

    // --- Text Diff Checker ---
    const diffOriginal = document.getElementById('diff-original');
    const diffNew = document.getElementById('diff-new');
    const diffCompareBtn = document.getElementById('diff-compare-btn');
    const diffCopyBtn = document.getElementById('diff-copy-btn');
    const diffClearBtn = document.getElementById('diff-clear-btn');
    const diffResultBox = document.getElementById('diff-result');

    let diffResultText = '';

    // Simple line-by-line diff algorithm
    function generateDiff(original, newText) {
        const originalLines = original.split('\n');
        const newLines = newText.split('\n');
        const maxLines = Math.max(originalLines.length, newLines.length);
        let diffHtml = '';
        let diffPlainText = '';

        for (let i = 0; i < maxLines; i++) {
            const originalLine = originalLines[i] || '';
            const newLine = newLines[i] || '';

            if (originalLine === newLine) {
                // No change
                if (originalLine !== '') {
                    diffHtml += `<div class="diff-line unchanged">${escapeHtml(originalLine)}</div>`;
                    diffPlainText += `  ${originalLine}\n`;
                }
            } else if (originalLine && newLine) {
                // Modified line
                diffHtml += `<div class="diff-line removed">- ${escapeHtml(originalLine)}</div>`;
                diffHtml += `<div class="diff-line added">+ ${escapeHtml(newLine)}</div>`;
                diffPlainText += `- ${originalLine}\n+ ${newLine}\n`;
            } else if (originalLine) {
                // Deleted line
                diffHtml += `<div class="diff-line removed">- ${escapeHtml(originalLine)}</div>`;
                diffPlainText += `- ${originalLine}\n`;
            } else if (newLine) {
                // Added line
                diffHtml += `<div class="diff-line added">+ ${escapeHtml(newLine)}</div>`;
                diffPlainText += `+ ${newLine}\n`;
            }
        }

        return { html: diffHtml, text: diffPlainText };
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    diffCompareBtn.addEventListener('click', () => {
        const originalText = diffOriginal.value;
        const newText = diffNew.value;

        if (!originalText && !newText) {
            showMessage(diffResultBox, 'Please enter text in both fields to compare.', true);
            return;
        }

        const diff = generateDiff(originalText, newText);
        
        if (diff.html === '') {
            diffResultBox.innerHTML = '<div class="diff-no-changes">No differences found.</div>';
            diffResultText = 'No differences found.';
        } else {
            diffResultBox.innerHTML = diff.html;
            diffResultText = diff.text;
        }
        
        diffResultBox.style.display = 'block';
        diffResultBox.style.color = '#e0e0e0';
    });

    diffCopyBtn.addEventListener('click', () => {
        if (diffResultText) {
            navigator.clipboard.writeText(diffResultText)
                .then(() => {
                    const originalText = diffCopyBtn.textContent;
                    diffCopyBtn.textContent = 'Copied!';
                    diffCopyBtn.classList.add('copied');
                    setTimeout(() => {
                        diffCopyBtn.textContent = originalText;
                        diffCopyBtn.classList.remove('copied');
                    }, 1200);
                })
                .catch(err => console.error('Failed to copy: ', err));
        }
    });

    diffClearBtn.addEventListener('click', () => {
        diffOriginal.value = '';
        diffNew.value = '';
        diffResultBox.style.display = 'none';
        diffResultText = '';
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
    const tabNav = document.querySelector('.tab-nav');
    
    // Tab switching functionality
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
    
    // Scroll indicator functionality
    function updateScrollIndicator() {
        if (tabNav.scrollWidth > tabNav.clientWidth) {
            tabNav.classList.add('scrollable');
        } else {
            tabNav.classList.remove('scrollable');
        }
    }
    
    // Check on load and resize
    window.addEventListener('load', updateScrollIndicator);
    window.addEventListener('resize', updateScrollIndicator);

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

    // --- SVG Viewer ---
    const svgInput = document.getElementById('svg-input');
    const svgPreview = document.getElementById('svg-preview');
    const svgCopyBtn = document.getElementById('svg-copy-btn');
    const svgClearBtn = document.getElementById('svg-clear-btn');

    function updateSvgPreview() {
        const svgCode = svgInput.value.trim();
        if (!svgCode) {
            svgPreview.innerHTML = '<p style="color: #888;">Enter SVG code to see preview</p>';
            return;
        }

        // Basic SVG validation
        if (!svgCode.includes('<svg') || !svgCode.includes('</svg>')) {
            svgPreview.innerHTML = '<p style="color: #ff6b6b;">Invalid SVG: Must contain &lt;svg&gt; tags</p>';
            return;
        }

        try {
            // Create a temporary container to validate SVG
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = svgCode;
            const svgElement = tempDiv.querySelector('svg');
            
            if (!svgElement) {
                svgPreview.innerHTML = '<p style="color: #ff6b6b;">Invalid SVG: No valid SVG element found</p>';
                return;
            }

            // Render the SVG
            svgPreview.innerHTML = svgCode;
        } catch (error) {
            svgPreview.innerHTML = '<p style="color: #ff6b6b;">Error rendering SVG: ' + error.message + '</p>';
        }
    }

    if (svgInput) {
        svgInput.addEventListener('input', updateSvgPreview);
        
        svgCopyBtn.addEventListener('click', () => {
            if (!svgInput.value) return;
            navigator.clipboard.writeText(svgInput.value)
                .then(() => {
                    const originalText = svgCopyBtn.textContent;
                    svgCopyBtn.textContent = 'Copied!';
                    svgCopyBtn.classList.add('copied');
                    setTimeout(() => {
                        svgCopyBtn.textContent = originalText;
                        svgCopyBtn.classList.remove('copied');
                    }, 1200);
                });
        });

        svgClearBtn.addEventListener('click', () => {
            svgInput.value = '';
            updateSvgPreview();
        });

        // Initialize preview
        updateSvgPreview();
    }

    // --- HTTP Client ---
    const httpMethod = document.getElementById('http-method');
    const httpUrl = document.getElementById('http-url');
    const httpHeadersContainer = document.getElementById('http-headers-container');
    const addHeaderBtn = document.getElementById('add-header-btn');
    const httpBodyType = document.getElementById('http-body-type');
    const httpBodyGroup = document.getElementById('http-body-group');
    const httpBody = document.getElementById('http-body');
    const httpSendBtn = document.getElementById('http-send-btn');
    const httpClearBtn = document.getElementById('http-clear-btn');
    const httpResponseSection = document.getElementById('http-response-section');
    const httpStatus = document.getElementById('http-status');
    const httpTime = document.getElementById('http-time');
    const httpResponseHeaders = document.getElementById('http-response-headers');
    const httpResponseBody = document.getElementById('http-response-body');
    const httpFormatResponseBtn = document.getElementById('http-format-response-btn');
    const httpError = document.getElementById('http-error');

    // Add header functionality
    function createHeaderRow() {
        const headerRow = document.createElement('div');
        headerRow.className = 'header-row';
        headerRow.innerHTML = `
            <input type="text" class="header-key" placeholder="Header name">
            <input type="text" class="header-value" placeholder="Header value">
            <button type="button" class="remove-header-btn">×</button>
        `;
        
        headerRow.querySelector('.remove-header-btn').addEventListener('click', () => {
            headerRow.remove();
        });
        
        return headerRow;
    }

    // Initialize with one header row
    httpHeadersContainer.querySelector('.remove-header-btn').addEventListener('click', function() {
        this.parentElement.remove();
    });

    addHeaderBtn.addEventListener('click', () => {
        httpHeadersContainer.appendChild(createHeaderRow());
    });

    // Body type change handler
    httpBodyType.addEventListener('change', () => {
        if (httpBodyType.value === 'none') {
            httpBodyGroup.style.display = 'none';
        } else {
            httpBodyGroup.style.display = 'block';
            const placeholders = {
                'json': '{\n  "key": "value",\n  "number": 123\n}',
                'text': 'Enter your text data here...',
                'form': 'key1=value1&key2=value2'
            };
            httpBody.placeholder = placeholders[httpBodyType.value] || '';
        }
    });

    // Collect headers from UI
    function getHeaders() {
        const headers = {};
        const headerRows = httpHeadersContainer.querySelectorAll('.header-row');
        
        headerRows.forEach(row => {
            const key = row.querySelector('.header-key').value.trim();
            const value = row.querySelector('.header-value').value.trim();
            if (key && value) {
                headers[key] = value;
            }
        });
        
        return headers;
    }

    // Format response headers for display
    function formatResponseHeaders(response) {
        let headersText = '';
        for (const [key, value] of response.headers.entries()) {
            headersText += `${key}: ${value}\n`;
        }
        return headersText || 'No headers';
    }

    // Send HTTP request
    httpSendBtn.addEventListener('click', async () => {
        const url = httpUrl.value.trim();
        
        if (!url) {
            showMessage(httpError, 'Please enter a URL.', true);
            return;
        }

        // Validate URL
        try {
            new URL(url);
        } catch (e) {
            showMessage(httpError, 'Please enter a valid URL.', true);
            return;
        }

        const method = httpMethod.value;
        const headers = getHeaders();
        const bodyType = httpBodyType.value;
        
        // Prepare request options
        const requestOptions = {
            method: method,
            headers: headers,
            mode: 'cors'
        };

        // Add body if needed
        if (bodyType !== 'none' && ['POST', 'PUT', 'PATCH'].includes(method)) {
            const bodyContent = httpBody.value.trim();
            if (bodyContent) {
                if (bodyType === 'json') {
                    try {
                        // Validate JSON
                        JSON.parse(bodyContent);
                        requestOptions.body = bodyContent;
                        if (!headers['Content-Type']) {
                            requestOptions.headers['Content-Type'] = 'application/json';
                        }
                    } catch (e) {
                        showMessage(httpError, 'Invalid JSON in request body: ' + e.message, true);
                        return;
                    }
                } else if (bodyType === 'form') {
                    requestOptions.body = bodyContent;
                    if (!headers['Content-Type']) {
                        requestOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                    }
                } else {
                    requestOptions.body = bodyContent;
                }
            }
        }

        // Show loading state
        httpSendBtn.textContent = 'Sending...';
        httpSendBtn.disabled = true;
        httpError.style.display = 'none';
        httpResponseSection.style.display = 'none';

        const startTime = performance.now();

        try {
            const response = await fetch(url, requestOptions);
            const endTime = performance.now();
            const duration = Math.round(endTime - startTime);

            // Update status
            httpStatus.value = `${response.status} ${response.statusText}`;
            httpTime.value = `${duration}ms`;

            // Update headers
            httpResponseHeaders.textContent = formatResponseHeaders(response);

            // Update body
            const contentType = response.headers.get('content-type') || '';
            let responseText = '';
            
            try {
                responseText = await response.text();
                
                // Try to format JSON automatically
                if (contentType.includes('application/json') || 
                   (responseText.trim().startsWith('{') && responseText.trim().endsWith('}'))) {
                    try {
                        const jsonData = JSON.parse(responseText);
                        httpResponseBody.textContent = JSON.stringify(jsonData, null, 2);
                    } catch {
                        httpResponseBody.textContent = responseText;
                    }
                } else {
                    httpResponseBody.textContent = responseText;
                }
            } catch (e) {
                httpResponseBody.textContent = 'Error reading response body: ' + e.message;
            }

            // Set response status color
            if (response.status >= 200 && response.status < 300) {
                httpStatus.style.color = '#4caf50';
            } else if (response.status >= 400) {
                httpStatus.style.color = '#ff6b6b';
            } else {
                httpStatus.style.color = '#ffde59';
            }

            httpResponseSection.style.display = 'block';
            
            // Fix Copy Headers button after response is displayed
            setTimeout(fixCopyHeadersButton, 100);

        } catch (error) {
            console.error('Request failed:', error);
            let errorMessage = 'Request failed: ';
            
            if (error.name === 'TypeError') {
                errorMessage += 'Network error or CORS issue. Make sure the server supports CORS.';
            } else {
                errorMessage += error.message;
            }
            
            showMessage(httpError, errorMessage, true);
        } finally {
            httpSendBtn.textContent = 'Send Request';
            httpSendBtn.disabled = false;
        }
    });

    // Format JSON response
    httpFormatResponseBtn.addEventListener('click', () => {
        try {
            const jsonData = JSON.parse(httpResponseBody.textContent);
            httpResponseBody.textContent = JSON.stringify(jsonData, null, 2);
            showMessage(httpError, 'JSON formatted successfully!', false);
        } catch (e) {
            showMessage(httpError, 'Response is not valid JSON: ' + e.message, true);
        }
    });

    // Clear HTTP client
    httpClearBtn.addEventListener('click', () => {
        httpMethod.value = 'GET';
        httpUrl.value = '';
        httpBodyType.value = 'none';
        httpBody.value = '';
        httpBodyGroup.style.display = 'none';
        httpResponseSection.style.display = 'none';
        httpError.style.display = 'none';
        httpStatus.style.color = '';
        
        // Clear all header rows except the first one
        const headerRows = httpHeadersContainer.querySelectorAll('.header-row');
        headerRows.forEach((row, index) => {
            if (index > 0) {
                row.remove();
            } else {
                row.querySelector('.header-key').value = '';
                row.querySelector('.header-value').value = '';
            }
        });
    });

    // Enhanced copy functionality for response elements
    const originalCopyButtonHandler = document.querySelector('.copy-btn').onclick;
    
    document.querySelectorAll('.copy-btn[data-target="http-response-headers"], .copy-btn[data-target="http-response-body"]').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            const targetElement = document.getElementById(targetId);
            
            if (targetElement && targetElement.textContent) {
                navigator.clipboard.writeText(targetElement.textContent)
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

    // Fix URL input field display issue
    function fixUrlInputDisplay() {
        const urlInput = document.getElementById('http-url');
        if (urlInput) {
            urlInput.style.cssText = `
                flex: 1 1 300px !important;
                width: 300px !important;
                min-width: 300px !important;
                max-width: none !important;
                margin-bottom: 0 !important;
                display: flex !important;
                align-items: center !important;
                visibility: visible !important;
                opacity: 1 !important;
                background: #232323 !important;
                color: #e0e0e0 !important;
                border: 1.5px solid #333 !important;
                border-radius: 6px !important;
                padding: 0.7rem 1rem !important;
                font-size: 1rem !important;
                box-sizing: border-box !important;
                overflow: visible !important;
                min-height: 44px !important;
                height: 44px !important;
                line-height: 1.2 !important;
            `;
            
            const parent = urlInput.parentElement;
            if (parent) {
                parent.style.cssText = `
                    display: flex !important;
                    gap: 0.5rem !important;
                    align-items: stretch !important;
                    width: 100% !important;
                    flex-wrap: nowrap !important;
                `;
            }
        }
    }

    // Apply fix when HTTP Client tab is clicked
    const httpClientTab = document.querySelector('[data-tab="http"]');
    if (httpClientTab) {
        httpClientTab.addEventListener('click', () => {
            setTimeout(fixUrlInputDisplay, 100);
        });
    }

    // Apply fix on initial load if HTTP Client is active
if (window.location.hash === '#http' || document.querySelector('.tab-http.active')) {
    setTimeout(fixUrlInputDisplay, 100);
}

// Fix Copy Headers button text truncation
function fixCopyHeadersButton() {
    const copyHeadersBtn = document.querySelector('.copy-btn[data-target="http-response-headers"]');
    if (copyHeadersBtn) {
        copyHeadersBtn.style.cssText = `
            margin-top: 0.8rem !important;
            border-top-left-radius: 6px !important;
            border-bottom-left-radius: 6px !important;
            border-left: 1.5px solid #333 !important;
            align-self: flex-start !important;
            min-width: 150px !important;
            width: 150px !important;
            height: 44px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            white-space: nowrap !important;
            box-sizing: border-box !important;
            overflow: visible !important;
            padding: 0.7rem 1rem !important;
            font-size: 1rem !important;
            font-weight: 600 !important;
            text-overflow: clip !important;
            word-wrap: normal !important;
            word-break: normal !important;
        `;
    }
}

// --- Color Palette Generator ---
const colorPicker = document.getElementById('color-picker');
const colorInput = document.getElementById('color-input');
const randomColorBtn = document.getElementById('random-color-btn');
const paletteType = document.getElementById('palette-type');
const colorCount = document.getElementById('color-count');
const colorCountDisplay = document.getElementById('color-count-display');
const generatePaletteBtn = document.getElementById('generate-palette-btn');
const exportPaletteBtn = document.getElementById('export-palette-btn');
const clearPaletteBtn = document.getElementById('clear-palette-btn');
const colorPaletteResult = document.getElementById('color-palette-result');
const paletteColors = document.getElementById('palette-colors');
const colorDetailsContainer = document.getElementById('color-details-container');
const accessibilityResults = document.getElementById('accessibility-results');
const colorError = document.getElementById('color-error');

// Color utilities
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    
    const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    };
    
    let r, g, b;
    
    if (s === 0) {
        r = g = b = l;
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function getContrastRatio(color1, color2) {
    const getLuminance = (color) => {
        const rgb = hexToRgb(color);
        const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map(c => {
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    
    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
}

function generateMonochromaticPalette(baseColor, count) {
    const rgb = hexToRgb(baseColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const colors = [];
    
    for (let i = 0; i < count; i++) {
        const lightness = 10 + (i * 80 / (count - 1));
        const newHsl = { ...hsl, l: Math.max(5, Math.min(95, lightness)) };
        const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
        colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    }
    
    return colors;
}

function generateAnalogousPalette(baseColor, count) {
    const rgb = hexToRgb(baseColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const colors = [];
    
    for (let i = 0; i < count; i++) {
        const hue = (hsl.h + (i - Math.floor(count / 2)) * 30) % 360;
        const newHsl = { ...hsl, h: hue < 0 ? hue + 360 : hue };
        const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
        colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    }
    
    return colors;
}

function generateComplementaryPalette(baseColor, count) {
    const rgb = hexToRgb(baseColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const colors = [];
    
    for (let i = 0; i < count; i++) {
        const hue = i % 2 === 0 ? hsl.h : (hsl.h + 180) % 360;
        const lightness = 20 + (Math.floor(i / 2) * 60 / (Math.floor(count / 2) - 1));
        const newHsl = { ...hsl, h: hue, l: Math.max(5, Math.min(95, lightness)) };
        const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
        colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    }
    
    return colors;
}

function generateTriadicPalette(baseColor, count) {
    const rgb = hexToRgb(baseColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const colors = [];
    
    for (let i = 0; i < count; i++) {
        const hue = (hsl.h + (i * 120)) % 360;
        const lightness = 20 + (Math.floor(i / 3) * 60 / (Math.floor(count / 3) - 1));
        const newHsl = { ...hsl, h: hue, l: Math.max(5, Math.min(95, lightness)) };
        const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
        colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    }
    
    return colors;
}

function generateTetradicPalette(baseColor, count) {
    const rgb = hexToRgb(baseColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const colors = [];
    
    for (let i = 0; i < count; i++) {
        const hue = (hsl.h + (i * 90)) % 360;
        const lightness = 20 + (Math.floor(i / 4) * 60 / (Math.floor(count / 4) - 1));
        const newHsl = { ...hsl, h: hue, l: Math.max(5, Math.min(95, lightness)) };
        const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
        colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    }
    
    return colors;
}

function generateSplitComplementaryPalette(baseColor, count) {
    const rgb = hexToRgb(baseColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const colors = [];
    
    for (let i = 0; i < count; i++) {
        let hue;
        if (i === 0) {
            hue = hsl.h;
        } else if (i % 2 === 1) {
            hue = (hsl.h + 150) % 360;
        } else {
            hue = (hsl.h + 210) % 360;
        }
        const lightness = 20 + (Math.floor(i / 3) * 60 / (Math.floor(count / 3) - 1));
        const newHsl = { ...hsl, h: hue, l: Math.max(5, Math.min(95, lightness)) };
        const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
        colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    }
    
    return colors;
}

function generatePalette(baseColor, type, count) {
    switch (type) {
        case 'monochromatic':
            return generateMonochromaticPalette(baseColor, count);
        case 'analogous':
            return generateAnalogousPalette(baseColor, count);
        case 'complementary':
            return generateComplementaryPalette(baseColor, count);
        case 'triadic':
            return generateTriadicPalette(baseColor, count);
        case 'tetradic':
            return generateTetradicPalette(baseColor, count);
        case 'split-complementary':
            return generateSplitComplementaryPalette(baseColor, count);
        default:
            return generateMonochromaticPalette(baseColor, count);
    }
}

function displayPalette(colors) {
    paletteColors.innerHTML = '';
    
    colors.forEach((color, index) => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.onclick = () => copyToClipboard(color);
        
        const rgb = hexToRgb(color);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        swatch.innerHTML = `
            <div class="color-preview" style="background-color: ${color}"></div>
            <div class="color-info">
                <div class="color-hex">${color}</div>
                <div class="color-rgb">RGB(${rgb.r}, ${rgb.g}, ${rgb.b})</div>
                <div class="color-hsl">HSL(${hsl.h}°, ${hsl.s}%, ${hsl.l}%)</div>
            </div>
        `;
        
        paletteColors.appendChild(swatch);
    });
}

function displayColorDetails(colors) {
    colorDetailsContainer.innerHTML = '';
    
    colors.forEach((color, index) => {
        const rgb = hexToRgb(color);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        const card = document.createElement('div');
        card.className = 'color-detail-card';
        
        card.innerHTML = `
            <h5>Color ${index + 1}</h5>
            <div class="color-swatch-small" style="background-color: ${color}" onclick="copyToClipboard('${color}')" title="Click to copy ${color}"></div>
            <div class="color-value">HEX: ${color}</div>
            <button class="copy-color-btn" onclick="copyToClipboard('${color}')">Copy HEX</button>
            <div class="color-value">RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}</div>
            <button class="copy-color-btn" onclick="copyToClipboard('${rgb.r}, ${rgb.g}, ${rgb.b}')">Copy RGB</button>
            <div class="color-value">HSL: ${hsl.h}°, ${hsl.s}%, ${hsl.l}%</div>
            <button class="copy-color-btn" onclick="copyToClipboard('${hsl.h}°, ${hsl.s}%, ${hsl.l}%')">Copy HSL</button>
        `;
        
        colorDetailsContainer.appendChild(card);
    });
}

function checkAccessibility(colors) {
    accessibilityResults.innerHTML = '';
    
    colors.forEach((color, index) => {
        const card = document.createElement('div');
        card.className = 'accessibility-card';
        
        const contrastWithWhite = getContrastRatio(color, '#ffffff');
        const contrastWithBlack = getContrastRatio(color, '#000000');
        
        const getContrastStatus = (ratio) => {
            if (ratio >= 7) return { status: 'pass', text: 'Excellent (AAA)' };
            if (ratio >= 4.5) return { status: 'pass', text: 'Good (AA)' };
            if (ratio >= 3) return { status: 'warning', text: 'Fair (A)' };
            return { status: 'fail', text: 'Poor' };
        };
        
        const whiteStatus = getContrastStatus(contrastWithWhite);
        const blackStatus = getContrastStatus(contrastWithBlack);
        
        card.innerHTML = `
            <h5>Color ${index + 1} (${color})</h5>
            <div class="color-swatch-small" style="background-color: ${color}" onclick="copyToClipboard('${color}')" title="Click to copy ${color}"></div>
            <div class="contrast-ratio">White Text: ${contrastWithWhite.toFixed(2)}:1</div>
            <div class="contrast-status ${whiteStatus.status}">${whiteStatus.text}</div>
            <div class="contrast-example white" style="background-color: ${color}">
                Sample text on ${color}
            </div>
            <div class="contrast-ratio">Black Text: ${contrastWithBlack.toFixed(2)}:1</div>
            <div class="contrast-status ${blackStatus.status}">${blackStatus.text}</div>
            <div class="contrast-example black" style="background-color: ${color}">
                Sample text on ${color}
            </div>
        `;
        
        accessibilityResults.appendChild(card);
    });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showMessage(colorError, `Copied: ${text}`, false);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showMessage(colorError, 'Failed to copy to clipboard', true);
    });
}

function exportCSS(colors) {
    const css = colors.map((color, index) => {
        const rgb = hexToRgb(color);
        return `/* Color ${index + 1} */
--color-${index + 1}: ${color};
--color-${index + 1}-rgb: ${rgb.r}, ${rgb.g}, ${rgb.b};`;
    }).join('\n\n');
    
    const fullCSS = `:root {
${css}
}`;
    
    copyToClipboard(fullCSS);
    showMessage(colorError, 'CSS variables copied to clipboard!', false);
}

// Event listeners
colorPicker.addEventListener('input', (e) => {
    colorInput.value = e.target.value.toUpperCase();
});

colorInput.addEventListener('input', (e) => {
    const value = e.target.value;
    if (/^#[0-9A-F]{6}$/i.test(value)) {
        colorPicker.value = value;
    }
});

randomColorBtn.addEventListener('click', () => {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    colorPicker.value = randomColor;
    colorInput.value = randomColor.toUpperCase();
});

colorCount.addEventListener('input', (e) => {
    colorCountDisplay.textContent = e.target.value;
});

generatePaletteBtn.addEventListener('click', () => {
    const baseColor = colorInput.value;
    const type = paletteType.value;
    const count = parseInt(colorCount.value);
    
    if (!/^#[0-9A-F]{6}$/i.test(baseColor)) {
        showMessage(colorError, 'Please enter a valid hex color (e.g., #ff6b6b)', true);
        return;
    }
    
    try {
        const colors = generatePalette(baseColor, type, count);
        displayPalette(colors);
        displayColorDetails(colors);
        checkAccessibility(colors);
        colorPaletteResult.style.display = 'block';
        colorError.style.display = 'none';
    } catch (error) {
        showMessage(colorError, 'Error generating palette: ' + error.message, true);
    }
});

exportPaletteBtn.addEventListener('click', () => {
    const colors = Array.from(paletteColors.querySelectorAll('.color-swatch')).map(swatch => {
        return swatch.querySelector('.color-hex').textContent;
    });
    
    if (colors.length > 0) {
        exportCSS(colors);
    } else {
        showMessage(colorError, 'Generate a palette first', true);
    }
});

clearPaletteBtn.addEventListener('click', () => {
    colorInput.value = '#ff6b6b';
    colorPicker.value = '#ff6b6b';
    paletteType.value = 'monochromatic';
    colorCount.value = 5;
    colorCountDisplay.textContent = '5';
    colorPaletteResult.style.display = 'none';
    colorError.style.display = 'none';
});

// Generate initial palette
generatePaletteBtn.click();

    // --- HTML Viewer ---
    const htmlInput = document.getElementById('html-input');
    const htmlPreview = document.getElementById('html-preview');
    const htmlCopyBtn = document.getElementById('html-copy-btn');
    const htmlClearBtn = document.getElementById('html-clear-btn');

    function updateHtmlPreview() {
        const htmlCode = htmlInput.value.trim();
        if (!htmlCode) {
            htmlPreview.innerHTML = '<div class="preview-placeholder">Enter HTML code to see preview</div>';
            return;
        }

        try {
            // Create a blob URL for the HTML content
            const blob = new Blob([htmlCode], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            
            // Create iframe for safe HTML rendering
            htmlPreview.innerHTML = `<iframe src="${url}" onload="this.parentElement.style.background='#fff'"></iframe>`;
            
            // Clean up the blob URL after a delay
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 1000);
            
        } catch (error) {
            htmlPreview.innerHTML = `<div class="preview-error">Error rendering HTML: ${error.message}</div>`;
        }
    }

    if (htmlInput) {
        htmlInput.addEventListener('input', updateHtmlPreview);
        
        htmlCopyBtn.addEventListener('click', () => {
            if (!htmlInput.value) return;
            navigator.clipboard.writeText(htmlInput.value)
                .then(() => {
                    const originalText = htmlCopyBtn.textContent;
                    htmlCopyBtn.textContent = 'Copied!';
                    htmlCopyBtn.classList.add('copied');
                    setTimeout(() => {
                        htmlCopyBtn.textContent = originalText;
                        htmlCopyBtn.classList.remove('copied');
                    }, 1200);
                });
        });

        htmlClearBtn.addEventListener('click', () => {
            htmlInput.value = '';
            updateHtmlPreview();
        });

        // Initialize preview
        updateHtmlPreview();
    }
}); 