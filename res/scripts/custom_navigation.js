/*
 * MIT License
 *
 * Copyright (c) 2026:
 * vatofichor - Sebastian Mass     [>_<]
 * & Assisted By Gemini Antigravity /|\  
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/**
 * @file custom_navigation.js
 * @description Set-Nav (Navigation Injection) component. Handles user-defined Custom Links logic via DOM injection and LocalStorage.
 */
const NAV_STORAGE_KEY = 'contactflow_custom_links';
const DEFAULT_LINK_COLOR = 'notice-dark';

function loadCustomLinks() {
    const customContainer = document.getElementById('custom-links-container');
    if (!customContainer) return;

    customContainer.innerHTML = '';

    const config = window.NAV_CONFIG;

    
    let customLinks = JSON.parse(localStorage.getItem(NAV_STORAGE_KEY));
    if (!customLinks) {
        customLinks = config && config.customLinks && config.customLinks.length > 0 ? config.customLinks : [
            { label: 'Leads Tracker', url: './leads/tracker.html', theme: '#4a90e2' }
        ];
        if (customLinks.length > 0) {
            localStorage.setItem(NAV_STORAGE_KEY, JSON.stringify(customLinks));
        }
    }

    customLinks.forEach((link, idx) => {
        const li = document.createElement('li');
        li.className = 'notice';
        li.style.backgroundColor = 'transparent';
        if (link.theme) {
            li.style.borderLeft = `4px solid ${link.theme}`;
        } else {
            li.classList.add(DEFAULT_LINK_COLOR);
        }

        const a = document.createElement('a');
        a.href = link.url;
        a.target = '_blank';
        a.textContent = link.label;
        a.style.display = 'inline-block';
        a.style.width = 'calc(100% - 30px)';

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '❌';
        deleteBtn.className = 'delete-custom-link-btn';
        deleteBtn.style.background = 'transparent';
        deleteBtn.style.border = 'none';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.display = 'none';
        deleteBtn.style.verticalAlign = 'middle';
        deleteBtn.title = 'Delete Link';
        deleteBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteCustomLink(idx);
        };

        li.appendChild(a);
        li.appendChild(deleteBtn);
        customContainer.appendChild(li);
    });

    
    const editor = document.getElementById('link-editor-container');
    if (editor && editor.style.display !== 'none') {
        const btns = customContainer.querySelectorAll('.delete-custom-link-btn');
        btns.forEach(btn => btn.style.display = 'inline-block');
    }
}

function toggleLinkEditor() {
    const editor = document.getElementById('link-editor-container');
    const isHidden = editor.style.display === 'none';
    editor.style.display = isHidden ? 'block' : 'none';

    
    const btns = document.querySelectorAll('.delete-custom-link-btn');
    btns.forEach(btn => btn.style.display = isHidden ? 'inline-block' : 'none');
}

function closeLinkEditor() {
    const editor = document.getElementById('link-editor-container');
    if (editor) editor.style.display = 'none';
    const btns = document.querySelectorAll('.delete-custom-link-btn');
    btns.forEach(btn => btn.style.display = 'none');
}

function addCustomLink() {
    const labelInput = document.getElementById('link-label');
    const urlInput = document.getElementById('link-url');
    const themeInput = document.getElementById('link-theme');

    const label = labelInput.value.trim();
    let url = urlInput.value.trim();
    const theme = themeInput.value;

    if (!label || !url) {
        alert("Please provide both a label and a URL.");
        return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    let links = JSON.parse(localStorage.getItem(NAV_STORAGE_KEY)) || [];
    links.push({ label, url, theme });
    localStorage.setItem(NAV_STORAGE_KEY, JSON.stringify(links));

    labelInput.value = '';
    urlInput.value = '';
    themeInput.value = '';

    loadCustomLinks();
}

function deleteCustomLink(index) {
    let links = JSON.parse(localStorage.getItem(NAV_STORAGE_KEY)) || [];
    links.splice(index, 1);
    localStorage.setItem(NAV_STORAGE_KEY, JSON.stringify(links));
    loadCustomLinks();
}

function exportLinks() {
    const links = localStorage.getItem(NAV_STORAGE_KEY) || '[]';
    const blob = new Blob([links], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const now = new Date();
    const tstamp = `${now.getMonth() + 1}_${now.getDate()}_${now.getHours()}_${now.getMinutes()}`;
    a.download = `contactflow_links_backup_${tstamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importLinks(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (Array.isArray(imported)) {
                localStorage.setItem(NAV_STORAGE_KEY, JSON.stringify(imported));
                loadCustomLinks();
            } else {
                alert("Invalid format.");
            }
        } catch (err) {
            alert("Error parsing file.");
        }
    };
    reader.readAsText(file);
    
    event.target.value = '';
}


function adjustColor(color, amount) {
    return '#' + color.replace(/^#/, '').match(/.{2}/g).map(c =>
        Math.max(0, Math.min(255, parseInt(c, 16) + amount)).toString(16).padStart(2, '0')
    ).join('');
}


document.addEventListener('DOMContentLoaded', () => {
    loadCustomLinks();
});
window.exportLinks = exportLinks;
window.importLinks = importLinks;
window.addCustomLink = addCustomLink;
window.toggleLinkEditor = toggleLinkEditor;
window.closeLinkEditor = closeLinkEditor;
