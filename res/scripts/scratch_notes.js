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
 * @file scratch_notes.js
 * @description Independent Tooling. Manages 'ScratchNotes' (formerly Custom Templates), saving and retrieving text templates via contactflow_scratch_notes LocalStorage.
 */
const TEMPLATE_STORAGE_KEY = 'contactflow_scratch_notes';
const OLD_TEMPLATE_STORAGE_KEY = 'contactflow_custom_templates';

function migrateScratchNotes() {
    const oldTemplates = localStorage.getItem(OLD_TEMPLATE_STORAGE_KEY);
    if (oldTemplates) {
        
        if (!localStorage.getItem(TEMPLATE_STORAGE_KEY)) {
            localStorage.setItem(TEMPLATE_STORAGE_KEY, oldTemplates);
            console.log("Migrated ScratchNotes from old storage key.");
        }
        
        localStorage.removeItem(OLD_TEMPLATE_STORAGE_KEY);
    }
}

function loadScratchNotes() {
    migrateScratchNotes();
    const listContainer = document.getElementById('scratch-notes-list');

    if (listContainer) listContainer.innerHTML = '';

    let templates = JSON.parse(localStorage.getItem(TEMPLATE_STORAGE_KEY)) || [];

    
    const editor = document.getElementById('editor-scratch-notes');
    const isEditorOpen = editor && editor.style.display !== 'none';

    templates.forEach((template, idx) => {
        if (listContainer) {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.alignItems = 'center';
            wrapper.style.marginBottom = '2px';
            wrapper.style.gap = '8px';

            const btn = document.createElement('button');
            btn.className = 'tool-button';
            btn.style.flexGrow = '1';
            btn.style.textAlign = 'left';
            btn.style.padding = '8px 12px';
            btn.textContent = template.title;
            
            btn.onclick = () => copyScratchNote(template.content, true);

            const editBtn = document.createElement('button');
            editBtn.className = 'tool-small-button scratch-notes-edit-btn';
            editBtn.textContent = '✏️';
            editBtn.title = 'Edit';
            editBtn.style.display = isEditorOpen ? 'inline-block' : 'none';
            editBtn.onclick = () => openEditScratchNote(idx);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'tool-small-button scratch-notes-delete-btn';
            deleteBtn.textContent = '❌';
            deleteBtn.title = 'Delete';
            deleteBtn.style.display = isEditorOpen ? 'inline-block' : 'none';
            deleteBtn.onclick = () => deleteScratchNote(idx);

            wrapper.appendChild(btn);
            wrapper.appendChild(editBtn);
            wrapper.appendChild(deleteBtn);
            listContainer.appendChild(wrapper);
        }
    });
}


function copyScratchNote(content, isDrawer = false) {
    if (typeof write_to_clipboard === 'function') {
        write_to_clipboard(content, true);
        console.log("ScratchNote copied");
    } else {
        navigator.clipboard.writeText(content)
            .then(() => console.log("ScratchNote copied"))
            .catch(err => console.error("Copy failed:", err));
    }

    
    if (isDrawer && typeof toggleDrawer === 'function') {
        toggleDrawer('scratch-notes-drawer');
    }
}

function toggleScratchNotesEditor() {
    const editor = document.getElementById('editor-scratch-notes');
    if (!editor) return;

    const isHidden = editor.style.display === 'none';
    editor.style.display = isHidden ? 'block' : 'none';

    
    if (isHidden) {
        document.getElementById('scratch-notes-title').value = '';
        document.getElementById('scratch-notes-content').value = '';
        document.getElementById('scratch-notes-edit-index').value = '-1';
    }

    
    const editBtns = document.querySelectorAll('.scratch-notes-edit-btn');
    const deleteBtns = document.querySelectorAll('.scratch-notes-delete-btn');

    editBtns.forEach(btn => btn.style.display = isHidden ? 'inline-block' : 'none');
    deleteBtns.forEach(btn => btn.style.display = isHidden ? 'inline-block' : 'none');
}

function openEditScratchNote(index) {
    let templates = JSON.parse(localStorage.getItem(TEMPLATE_STORAGE_KEY)) || [];
    if (index < 0 || index >= templates.length) return;

    const template = templates[index];
    document.getElementById('scratch-notes-title').value = template.title;
    document.getElementById('scratch-notes-content').value = template.content;
    document.getElementById('scratch-notes-edit-index').value = index;

    
    const editor = document.getElementById('editor-scratch-notes');
    if (editor && editor.style.display === 'none') {
        toggleScratchNotesEditor();
    }
}

function saveScratchNote() {
    const titleInput = document.getElementById('scratch-notes-title');
    const contentInput = document.getElementById('scratch-notes-content');
    const editIndexInput = document.getElementById('scratch-notes-edit-index');

    const title = titleInput.value.trim();
    const content = contentInput.value;
    const index = parseInt(editIndexInput.value, 10);

    if (!title || !content) {
        alert("Please provide both a title and content for the ScratchNote.");
        return;
    }

    let templates = JSON.parse(localStorage.getItem(TEMPLATE_STORAGE_KEY)) || [];

    if (index >= 0 && index < templates.length) {
        
        templates[index] = { title, content };
    } else {
        
        templates.push({ title, content });
    }

    localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templates));

    
    titleInput.value = '';
    contentInput.value = '';
    editIndexInput.value = '-1';

    loadScratchNotes();
}

function deleteScratchNote(index) {
    if (!confirm("Delete this ScratchNote?")) return;

    let templates = JSON.parse(localStorage.getItem(TEMPLATE_STORAGE_KEY)) || [];
    templates.splice(index, 1);
    localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
    loadScratchNotes();
}

function exportScratchNotes() {
    const templates = localStorage.getItem(TEMPLATE_STORAGE_KEY) || '[]';
    const blob = new Blob([templates], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contactflow_scratch_notes.json';
    a.click();
    URL.revokeObjectURL(url);
}

function importScratchNotes(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (Array.isArray(imported)) {
                localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(imported));
                loadScratchNotes();
                alert("ScratchNotes imported successfully.");
            } else {
                alert("Invalid format. Expected JSON array of templates.");
            }
        } catch (err) {
            alert("Error parsing file.");
        }
    };
    reader.readAsText(file);
    event.target.value = ''; 
}


document.addEventListener('DOMContentLoaded', loadScratchNotes);
