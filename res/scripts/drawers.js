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
 * @file drawers.js
 * @description Reflexive DOM Framework (RDF) Drawers component. Core logic for responsive drawer states and dynamic data-rdf-launcher instantiation.
 */
const DRAWERS = ['t2-drawer-container', 'cx-survey-drawer', 'lead-drawer', 'scratch-notes-drawer'];
const MOBILE_BREAKPOINT = 1000;
const INITIAL_POSITIONS = new Map();

const getEl = (id) => document.getElementById(id);


function toggleDrawer(drawerId) {
    const drawer = getEl(drawerId);
    if (!drawer) return;

    
    if (window.innerWidth <= MOBILE_BREAKPOINT) {
        const rootContainer = getEl('rdf-drawers-root');
        if (rootContainer) rootContainer.style.height = 'auto';
    }

    const isOpen = drawer.classList.contains('open');

    if (!isOpen) {
        DRAWERS.forEach(id => {
            const d = getEl(id);
            if (d && d !== drawer && d.classList.contains('open')) {
                d.classList.remove('open');
            }
        });
    }

    drawer.classList.toggle('open');

    
    if (drawer.classList.contains('open')) {
        
        if (window.innerWidth <= MOBILE_BREAKPOINT) {
            drawer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        const firstInput = drawer.querySelector('input, textarea, select');
        if (firstInput) {
            
            setTimeout(() => {
                firstInput.focus();

                

                
            }, 50);
        }
    }
}


function toggleT2Drawer() {
    toggleDrawer('t2-drawer-container');
}


function copyT2Form() {
    const custInfo = getEl('t2-cust-info').value.trim();
    const issue = getEl('t2-issue').value.trim();
    const trouble = getEl('t2-trouble').value.trim();
    const reason = getEl('t2-reason').value.trim();
    const notes = getEl('t2-notes').value.trim();

    const formatted = `*Customer Information__
${custInfo || 'N/A'}

*Issue Summary__
${issue || 'N/A'}

*Troubleshooting Attempts__
${trouble || 'N/A'}

*Reason for Escalation__
${reason || 'N/A'}

Notes____:
${notes || 'N/A'}
`;

    if (typeof write_to_clipboard === 'function') {
        write_to_clipboard(formatted, true);
    } else {
        navigator.clipboard.writeText(formatted);
    }

    toggleDrawer('t2-drawer-container');
}


function copyCXForm() {
    const getVal = (id) => getEl(id) ? getEl(id).value.trim() : '';
    const getCheck = (id) => getEl(id) ? (getEl(id).checked ? 'Yes' : 'No') : 'No';

    const phone = getVal('cx-phone');
    const name = getVal('cx-name');
    const coid = getVal('cx-coid');
    const email = getVal('cx-email');
    const caseNum = getVal('cx-case');
    const tax = getVal('cx-tax');
    const product = getVal('cx-product');
    const principal = getCheck('cx-principal');
    const lvl1 = getVal('cx-lvl1');
    const lvl2 = getVal('cx-lvl2');

    const formatted = `Phone: ${phone}
Name: ${name}
ID: ${coid}
Email: ${email}
Case Number: ${caseNum}
Product Information: ${product}
Verified User: ${principal}

Other:
${tax}

Verfication:
${lvl1}
${lvl2}
`;

    const res = getEl('resolution');
    if (res) {
        res.value = formatted + "\n" + res.value;
    }

    if (typeof write_to_clipboard === 'function') {
        write_to_clipboard(formatted, true);
    }

    toggleDrawer('cx-survey-drawer');
}


function handleResponsiveDrawer() {
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

    DRAWERS.forEach(id => {
        const drawer = getEl(id);
        if (!drawer) return;

        if (isMobile) {
            drawer.classList.remove('drawer-fixed');
            drawer.classList.add('drawer-inline');

            if (INITIAL_POSITIONS.has(id)) {
                const pos = INITIAL_POSITIONS.get(id);
                if (pos.parent && drawer.parentElement !== pos.parent) {
                    if (pos.nextSibling) {
                        pos.parent.insertBefore(drawer, pos.nextSibling);
                    } else {
                        pos.parent.appendChild(drawer);
                    }
                }
            }
        } else {
            if (drawer.parentElement !== document.body) {
                if (!INITIAL_POSITIONS.has(id)) {
                    INITIAL_POSITIONS.set(id, {
                        parent: drawer.parentElement,
                        nextSibling: drawer.nextElementSibling
                    });
                }
                document.body.appendChild(drawer);
            }
            drawer.classList.remove('drawer-inline');
            drawer.classList.add('drawer-fixed');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    
    let rootContainer = getEl('rdf-drawers-root');
    if (!rootContainer) {
        rootContainer = document.createElement('div');
        rootContainer.id = 'rdf-drawers-root';
        rootContainer.className = 'rdf-drawers-root toggle-evaporate'; 
        rootContainer.style.width = '100%';
        rootContainer.style.resize = 'vertical';
        rootContainer.style.overflowY = 'auto';
        rootContainer.style.display = 'block';

        const launchersDiv = getEl('drawer-launchers');
        if (launchersDiv && launchersDiv.parentNode) {
            launchersDiv.parentNode.appendChild(rootContainer);
        }
    }

    document.querySelectorAll('[data-rdf-launcher]').forEach(el => {
        const targetId = el.getAttribute('data-rdf-launcher');
        const label = el.getAttribute('data-rdf-label');
        const note = el.getAttribute('data-rdf-note');
        const hotkey = el.getAttribute('data-rdf-hotkey');
        const id = el.id;

        el.removeAttribute('id');

        const btn = document.createElement('button');
        if (id) btn.id = id;
        if (note) btn.dataset.note = note;
        btn.className = 'tool-button';
        btn.textContent = label + (hotkey ? ` (${hotkey})` : '');
        btn.onclick = () => {
            
            if (window.innerWidth <= MOBILE_BREAKPOINT) {
                if (rootContainer) rootContainer.style.height = 'auto';
            }
            toggleDrawer(targetId);
        };

        el.appendChild(btn);

        INITIAL_POSITIONS.set(targetId, {
            parent: rootContainer,
            nextSibling: null
        });
    });

    DRAWERS.forEach(id => {
        const drawer = getEl(id);
        if (drawer && !INITIAL_POSITIONS.has(id)) {
            INITIAL_POSITIONS.set(id, {
                parent: drawer.parentElement, 
                nextSibling: drawer.nextElementSibling
            });
        }
    });

    handleResponsiveDrawer();
    window.addEventListener('resize', handleResponsiveDrawer);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (document.getElementById('prompt-screen')) return;

            let handled = false;

            if (window.FindReplace && window.FindReplace.active) {
                window.FindReplace.toggle();
                handled = true;
            }

            const openDrawerId = DRAWERS.find(id => {
                const drawer = getEl(id);
                return drawer && drawer.classList.contains('open');
            });

            if (openDrawerId) {
                toggleDrawer(openDrawerId);
                handled = true;
            }

            if (handled) {
                e.preventDefault();
                e.stopPropagation();
            }
        }
    });
});

window.toggleT2Drawer = toggleT2Drawer;
window.toggleDrawer = toggleDrawer;
window.copyT2Form = copyT2Form;
window.copyCXForm = copyCXForm;
