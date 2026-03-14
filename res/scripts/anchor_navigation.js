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
 * @file anchor_navigation.js
 * @description Reflexive DOM Framework (RDF) Anchors component. Handles smooth scrolling and hash-based inter-page navigation.
 */
function buildHotNav(options = {}) {
	const links = [
		{ id: 'top', label: 'Top' },
		{ id: 'notes', label: "Case Notes" },
		{ id: 'contactCodes-anchor', label: 'Scratchboard' },
		{ id: 'drawer-launchers', label: 'Drawers' },
		{ id: 'timer-anchor', label: 'Timer' },
		{ id: 'guide-me', label: 'Documentation Help' }
	];

	const htmlLinks = links
		.filter(link => !options[link.id]) 
		.map(link => `<a href="#${link.id}">${link.label}</a>`)
		.join(' ✶ ');

	return `<hr>\n<b>${htmlLinks}</b>`;
}

window.addEventListener('DOMContentLoaded', () => {
	const hotnavs = document.querySelectorAll('.hotnav');

	hotnavs.forEach(div => {
		const navData = div.getAttribute('data-nav');
		let options = {};

		if (navData) {
			try {
				options = JSON.parse(navData.replace(/'/g, '"')); // safe-ish parse
			} catch (e) {
				console.error('Invalid data-nav JSON:', navData);
			}
		}

		div.innerHTML = buildHotNav(options);
	});
});