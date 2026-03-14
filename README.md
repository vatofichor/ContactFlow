# ContactFlow

<!-- 
# Copyright (c) 2026:
# vatofichor - Sebastian Mass     [>_<]
# & Assisted By Gemini Antigravity /|\

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
-->

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Build](https://img.shields.io/badge/Build-Vanilla_JS-yellow.svg)
![Architecture](https://img.shields.io/badge/Architecture-Serverless-brightgreen.svg)

ContactFlow is a high-density, completely serverless agent workspace tool designed for rapid case resolution, live documentation, and zero-latency tool switching. 

Driven by the custom **Reflexive DOM Framework (RDF)**, ContactFlow operates entirely within the browser using Vanilla JavaScript, HTML, and CSS. It requires no databases, no backend servers, and zero package managers.

## 🧠 Core Architecture Concept Map

The application is built on several interconnected core systems that maintain logic-density without relying on heavy external libraries.

### 1. Reflexive DOM Framework (RDF)
The RDF makes the dense, single-page interface actionable. It consists of:
*   **Drawers (`drawers.js` & `drawer_toggler.js`):** Slide-out panels for auxiliary tools (like the Phonetic Alphabet or CX Surveys). Drawer states are managed dynamically via `data-rdf-launcher` attributes.
*   **Anchors (`anchor_navigation.js`):** Hijacks standard hash navigation (`#`) to provide smooth scrolling across the dense layout without triggering page reloads.
*   **Command Launcher (`user_commands.js`):** A centralized `Alt + /` prompt that routes commands to specific DOM elements or Javascript functions globally.
*   **Accessibility (`keyboard_shortcuts.js`):** Global event listeners mapping `Alt+Key` combinations to RDF actions.

### 2. Navigation Injection System
The dynamic sidebar navigation is not hardcoded. 
*   It is powered by `set_nav.js`, which fetches structural logic from `config/nav_config.json`.
*   User-defined custom links are managed by `custom_navigation.js` allowing operators to extend the navigator dynamically.

### 3. Markdown Editor Environment
The core documentation space (`index.html` main view).
*   **Engine:** `md_editor.js` and `editor_init.js` handle formatting syntax (Markdown bolding, auto-bulleting).
*   **Tooling:** `md-toolbar-tool-generator.js` and `md-toolbar-fixed-scroll.js` generate the sticky interaction buttons above the active text area.
*   **Utilities:** Integrated `find_replace.js` for rapid typos correction before passing data to the clipboard (`clipboard_actions.js`).

### 4. Independent Tooling Containers
*   **ScratchBoard (`scratchboard.js`):** A temporary data sanitization space with its own editor.
*   **ScratchNotes (`scratch_notes.js`):** The custom template manager. Replaces legacy hardcoded macros with a dynamic, user-editable LocalStorage template system.

---

## 💾 Technical Stack & Storage Constraints

**"Vanilla First" Philosophy:** ContactFlow intentionally avoids dependencies like React, Vue, Webpack, or NPM.
*   **Client-Side Only:** There is no Node.js backend or SQL database. 
*   **Data Persistence:** Application state and user data are stored entirely within the browser's `LocalStorage`.

### LocalStorage Mapping
If migrating or debugging, these are the primary storage keys:
*   `scratchboard_cache`: Contains data saved to the ScratchBoard staging area.
*   `contactflow_scratch_notes`: JSON array of user templates created in the ScratchNotes drawer.
*   `contactflow_custom_links`: User-added navigation shortcuts.

---

## 📁 Script Directory Glossary (`res/scripts/`)

A technical breakdown of the logic files powering the UI.

| Script File | Primary Function |
| :--- | :--- |
| `anchor_navigation.js` | Parses `#` hrefs and smooth-scrolls the DOM to the target ID. |
| `backspace_nav.js` | Prevents the backspace key from navigating away from the app. |
| `clipboard_actions.js` | Handles extracting and formatting text from the main editor to the OS clipboard. |
| `custom_navigation.js` | CRUD operations for the user's custom links in the drawer. |
| `drawer_toggler.js` | Event routing and DOM hooks for RDF drawers. |
| `drawers.js` | Core logic for calculating height, toggling visibility, and managing `rdf-drawers-root`. |
| `editor_init.js` | Bootstraps the Markdown editor event listeners on page load. |
| `find_replace.js` | Floating contextual menu logic for manipulating editor strings. |
| `keyboard_shortcuts.js` | The `Alt+Key` listener matrix bridging keyboard input to RDF commands. |
| `md-toolbar-fixed-scroll.js` | Keeps the formatting toolbar visible on scroll. |
| `md-toolbar-tool-generator.js` | Parses the DOM to build the interactive formatting buttons for the editor. |
| `md_editor.js` | Handles typing logic, auto-bulleting, and syntax highlighting algorithms. |
| `meta_copy_fields.js` | Extracts structured data from side-panels (Escalation, CX Survey) into the main editor. |
| `scratch_notes.js` | Manages the creation, injection, and UI rendering of custom templates. |
| `scratchboard.js` | Separate editor logic specifically for the ScratchBoard data sanitization area. |
| `set_nav.js` | Injects the sidebar HTML structure based on the external config file. |
| `space_remover.js` | Utility script for sanitizing copied strings (removing double spaces, etc). |
| `timer_controller.js` | Logic for the embedded countdown utility. |
| `user_commands.js` | The processor for the `Alt + /` prompt. |

---

## 🚀 Local Setup & Development

Because ContactFlow is serverless, deployment is instantaneous.

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/vatofichor/contactflow.git
    ```
2.  **Launch:**
    Simply double click `index.html` or open it in your preferred modern browser (Chrome/Edge recommended).
3.  **Local Server (Optional):**
    If making cross-origin script changes (like editing `nav_config.json`), you may need a basic local server to bypass CORS file restrictions during development.
    ```bash
    php -S localhost:8000
    # or
    python -m http.server 8000
    ```

### ⚠️ Critical Development Warning
**Never re-encode the HTML/JS files using shell batch scripts or lossy text editors.** 
ContactFlow utilizes specific Unicode characters for UI elements (like the navigation anchors) which will corrupt if the file encoding is unintentionally mutated. Always use atomic file operations or a standard IDE (VS Code).

---

## 📜 License

This project is licensed under the MIT License - see the `LICENSE` section within the repository files for details.

**Attribution Requirement:**
The copyright notice and license must remain with the software in its parts or whole. This is a non-viral license; it does not apply to your entire product, only to the code sourced from this repository.
