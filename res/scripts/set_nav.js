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
 * @file set_nav.js
 * @description Set-Nav (Navigation Injection) component. Core configuration injection logic translating nav_config to active DOM elements.
 */
document.addEventListener('DOMContentLoaded', () => {
    const staticContainer = document.getElementById('persistent-links');
    if (!staticContainer) return;

    staticContainer.innerHTML = '';

    const config = window.NAV_CONFIG;

    if (config && config.staticLinks) {
        config.staticLinks.forEach(link => {
            const li = document.createElement('li');
            li.className = 'notice';
            li.style.backgroundColor = 'transparent';

            if (link.theme) {
                li.style.borderLeft = `4px solid ${link.theme}`;
            } else {
                li.classList.add('notice-dark');
            }

            const a = document.createElement('a');
            a.href = link.url;
            if (!link.url.startsWith('javascript:')) {
                a.target = '_blank';
            }
            a.textContent = link.label;
            a.style.display = 'inline-block';
            a.style.width = '100%';

            li.appendChild(a);
            staticContainer.appendChild(li);
        });
    } else {
        console.error("Set-Nav: `window.NAV_CONFIG` or `staticLinks` is missing.");
    }
});
