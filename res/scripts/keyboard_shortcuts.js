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
 * @file keyboard_shortcuts.js
 * @description Reflexive DOM Framework (RDF) Hotkeys component. Manages the Alt+Key listener matrix for workspace shortcuts.
 */
if (window._userCommandsListener) {
    document.removeEventListener('keydown', window._userCommandsListener);
}


window._userCommandsListener = function (event) {
    if (!event.altKey) return;

    const key = event.key.toLowerCase();

    
    const insertText = (text) => {
        const active = document.activeElement;
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
            const start = active.selectionStart;
            const end = active.selectionEnd;
            const val = active.value;
            active.value = val.substring(0, start) + text + val.substring(end);
            active.selectionStart = active.selectionEnd = start + text.length;
            active.focus();
        }
    };

    const commands = {
        '/': () => run_command(false, null),
        'm': () => run_command(true, 'm'),
        'r': () => run_command(true, 'reset'),
        'b': () => insertText('• '),
        '1': () => run_command(true, "l1"),
        '2': () => run_command(true, "l2"),
        'n': () => {
            
            const cn = document.getElementById('case-notes');
            if (cn && !cn.checked) {
                cn.click();
            }
            
            const res = document.getElementById('resolution');
            if (res) {
                
                setTimeout(() => {
                    res.focus();
                    res.selectionStart = res.selectionEnd = res.value.length;
                }, 50);
            }
        },
        't': () => {
            
            if (typeof toggleDrawer === 'function') {
                toggleDrawer('lead-drawer');
            }
        },
        'y': () => {
            
            if (typeof toggleDrawer === 'function') {
                toggleDrawer('cx-survey-drawer');
            }
        },
        'u': () => {
            
            if (typeof toggleDrawer === 'function') {
                toggleDrawer('t2-drawer-container');
            }
        },
        'c': () => run_command(true, 'copy'),
        'h': () => {
            if (typeof FindReplace !== 'undefined') {
                FindReplace.toggle();
            }
        },
        'i': () => {
            if (typeof toggleDrawer === 'function') {
                toggleDrawer('scratch-notes-drawer');
            }
        }
    };

    
    window.userCommands = commands;

    if (commands[key]) {
        event.preventDefault(); 
        commands[key]();
    }
};


document.addEventListener('keydown', window._userCommandsListener);
