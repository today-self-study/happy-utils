# Happy Utils

A collection of simple, useful, and geek-styled web-based utilities for developers.  
This project is built with vanilla HTML, CSS, and JavaScript, and is hosted via GitHub Pages.

**Live Demo:**  
[https://today-self-study.github.io/happy-utils/](https://today-self-study.github.io/happy-utils/)

---

## ✨ Features

- **Premium glass UI** with Inter + JetBrains Mono, hero spotlight, and stat cards that establish immediate credibility.
- **Responsive & Mobile-friendly:** All tools are centered, with proper padding and spacing for any device.
- **Tab Navigation:** Instantly switch between tools using the top tab bar with intuitive icons and responsive design.

### 🆕 November 2025 Refresh

- Rebuilt the HTML skeleton with a semantic `<head>`, hero header, and descriptive meta tags.
- Introduced a glassmorphism shell, stat cards, pill CTAs, and refreshed typography for a modern feel.
- Hardened the CSS token system (`:root` custom properties) to avoid regressions that previously blanked the theme variables.
- Expanded README UI notes to reflect the new interaction model.

### Included Tools

1. **Epoch & Unix Timestamp Converter**
    - Interactive time converter with real-time conversion between epoch, UTC, and local time.
    - Enter a value in any field and the other fields automatically update.
    - Defaults to current time when all fields are empty.
    - All results are easily copyable with one-click copy buttons.

2. **URL Encoder / Decoder**
    - Encode/decode text for safe URL usage.
    - Copy and clear with a single click.

3. **Base64 Encoder / Decoder**
    - Encode text to Base64 format and decode Base64 strings back to text.
    - Perfect for data encoding, API testing, and web development.
    - Copy and clear with a single click.

4. **Hash Generator**
    - Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from any text input.
    - Perfect for password hashing, file integrity checks, and API authentication.
    - All hash types generated simultaneously with individual copy buttons.
    - Uses Web Crypto API for SHA algorithms and pure JavaScript for MD5.

5. **Text Diff Checker**
    - Compare two texts line-by-line and highlight differences.
    - Visual diff display with color-coded additions, deletions, and changes.
    - Perfect for code reviews, document comparison, and version control.
    - Copy diff results or clear inputs with a single click.

6. **JSON Formatter & Viewer**
    - Beautify and validate JSON.
    - Copy formatted JSON with one click.
    - Error messages for invalid JSON.

7. **Markdown Viewer**
    - Write or paste Markdown and see a live HTML preview.
    - Supports headings, lists, code, links, and more.
    - Copy the rendered HTML or clear the input with one click.

8. **SVG Viewer**
    - Paste SVG code and see a live visual preview.
    - Real-time rendering with error validation.
    - Copy SVG code or clear the input with one click.
    - Perfect for testing and previewing SVG graphics.

9. **HTTP Client**
    - Send HTTP requests like Postman with full method support (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS).
    - Add custom headers with dynamic key-value pairs.
    - Support for JSON, Text, and Form data request bodies.
    - Complete response display including status code, headers, and formatted body.
    - Automatic JSON formatting and response time measurement.
    - CORS-aware with helpful error messages.
    - Copy response data with one-click buttons.

10. **Color Palette Generator**
    - Generate professional color palettes from a base color.
    - Support for 6 palette types: Monochromatic, Analogous, Complementary, Triadic, Tetradic, and Split Complementary.
    - Color picker with hex input and random color generation.
    - Adjustable color count (3-12 colors).
    - Real-time color format conversion (HEX, RGB, HSL).
    - WCAG accessibility compliance checking with contrast ratios.
    - Visual color swatches with hover effects.
    - One-click copy for all color formats.
    - Export palette as CSS variables.
    - Detailed accessibility analysis for each color.

11. **HTML Viewer & Preview**
    - Write or paste HTML code and see a live preview.
    - Real-time rendering using iframe for safe HTML execution.
    - Perfect for testing HTML snippets, templates, and web components.
    - Copy HTML code or clear the input with one click.
    - Error handling for invalid HTML with helpful messages.

---

## 🖥️ UI/UX

- **Hero spotlight**: Title, subtitle, call-to-action chips, and stat cards introduce the toolkit like a SaaS landing page.
- **Glass tabs**: Scrollable pill buttons keep the section switching lightweight yet premium.
- **Consistent copy UX**: All copy buttons show "Copied!" momentarily, reinforcing the action.
- **Live previews**: Markdown/SVG/HTML viewers render on white cards for contrast.
- **Responsive**: Breakpoints tighten paddings, stack hero actions, and keep tabs scrollable.

---

## 🚀 How to Use

1. Visit the [Live Demo](https://today-self-study.github.io/happy-utils/).
2. Use the top tab bar to switch between tools.
3. Enter your input and use the buttons to get and copy results.

---

## 🛠️ Local Development

To run this project locally:

```bash
git clone https://github.com/today-self-study/happy-utils.git
cd happy-utils
# Open index.html in your browser
```

---

## License

MIT

---

*This project is for practice and demonstration purposes.*