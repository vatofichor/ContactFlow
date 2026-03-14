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
 * @file backspace_nav.js
 * @description Handles backspace interception to prevent unintended navigation outside of input forms within the workspace.
 */
console.log("Backspace Navigation Utility Loaded");

document.addEventListener('keydown', function (event) {
    if (event.key === 'Backspace') {
        const active = document.activeElement;

        
        const isInput = active.tagName === 'INPUT' || active.tagName === 'TEXTAREA';
        const isEditable = active.isContentEditable;

        
        if (isInput || isEditable) {
            return;
        }

        
        console.log("Backspace detected outside input: Navigating back.");
        event.preventDefault();
        window.history.back();
    }
}, true); 
