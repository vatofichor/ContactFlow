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
var templates = [];

/** Initializes the page on load */
window.onload = () => {
	const stored = get_templates_from_storage();
	set_runtime_templates(stored);
	update_DOM_buttons();
	initHelpPanel();
};

/** Injects the Help System iframe */
function initHelpPanel() {
	const container = document.getElementById('iframe-container');
	const input = document.getElementById('iframe-src');
	if (!container || !input) return;

	let url = localStorage.getItem('help_panel_src') || "https://example.com";
	input.value = url;

	const iframe = document.createElement('iframe');
	iframe.src = url;
	iframe.title = "Help System";
	iframe.style.width = "100%";
	iframe.style.height = "100%";
	iframe.style.border = "none";

	container.innerHTML = '';
	container.appendChild(iframe);
}

function updateIframeSRC() {
	const input = document.getElementById('iframe-src');
	if (!input) return;
	let url = input.value.trim();
	if (!url) return;
	if (!url.startsWith('http')) url = 'https://' + url;
	localStorage.setItem('help_panel_src', url);
	initHelpPanel();
	notify('URL Saved and Updated.');
}

function resetIframeSRC() {
	localStorage.removeItem('help_panel_src');
	const input = document.getElementById('iframe-src');
	if (input) input.value = '';
	initHelpPanel();
	notify('URL Reset to default.');
}

/** Toggles the link creator form */
function toggleLinkCreator() {
	const form = document.getElementById('custom-form');
	if (form) {
		form.classList.toggle('hide');
	}
}

/** Adds a custom template */
function addCustomTemplate() {
	const label_text = document.getElementById('buttonText').value.trim();
	const content = document.getElementById('templateContent').value.trim();
	const upload = document.getElementById('template_upload').files[0];

	if (upload) {
		importTemplatesFromCSV(upload);
		return;
	}

	if (!label_text || !content) {
		notify("Both fields are required.");
		return;
	}

	const template = { label_text, content };
	const rtemplates = get_runtime_templates();

	if (run_dupe_check(rtemplates, template.label_text)) {
		notify('Template with that name already exists.');
		return;
	}

	rtemplates.push(template);
	set_localStorage_customTemplates(rtemplates);
	update_DOM_buttons();

	document.getElementById('buttonText').value = '';
	document.getElementById('templateContent').value = '';
}

/** Appends a custom button to the container */
function appendCustomButton(dx) {
	const container = document.getElementById('custom-buttons-container');

	const wrapper = document.createElement('div');
	wrapper.className = 'article-item';

	const btn = document.createElement('button');
	btn.innerText = dx.label_text;
	btn.onclick = () => link_opener(dx.content);

	const close = document.createElement('span');
	close.innerText = "✕";
	close.title = "Delete this link";
	close.onclick = (e) => {
		e.stopPropagation();
		deleteTemplate(dx.label_text);
	};

	wrapper.appendChild(btn);
	wrapper.appendChild(close);
	container.appendChild(wrapper);
}

/** Deletes a template by name */
function deleteTemplate(buttonText) {
	if (!confirm(`Are you sure you want to delete "${buttonText}"?`)) return;

	let rtemplates = get_runtime_templates();
	rtemplates = rtemplates.filter(t => t.label_text !== buttonText);
	set_localStorage_customTemplates(rtemplates);
	update_DOM_buttons();
}

/** Exports templates to CSV */
function exportTemplatesToCSV() {
	const rtemplates = get_runtime_templates();

	if (rtemplates.length === 0) {
		notify("No templates to export.");
		return;
	}

	const rows = [["Button Text", "Content"]];
	rtemplates.forEach(t => rows.push([t.label_text, t.content]));

	const csvContent = rows.map(r =>
		r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")
	).join("\n");

	const blob = new Blob([csvContent], { type: "text/csv" });
	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = `exported_articles_${filename_date_stamp()}.csv`;
	a.click();
	URL.revokeObjectURL(url);
}

/** Imports templates from CSV */
function importTemplatesFromCSV(file) {
	if (!file) return;

	const reader = new FileReader();
	reader.onload = e => {
		const text = e.target.result;
		if (!text) return notify("File is empty.");

		const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l);
		if (lines.length < 2) return notify("No data found in file.");

		let imported = [];
		for (let i = 1; i < lines.length; i++) {
			const parts = lines[i].split(/,(.+)/);
			if (!parts[0]) continue;
			imported.push({
				label_text: parts[0].replace(/(^"|"$)/g, "").trim(),
				content: (parts[1] || "").replace(/(^"|"$)/g, "").trim()
			});
		}

		if (imported.length === 0) return notify("No valid templates found.");

		let rtemplates = get_runtime_templates();
		imported = remove_template_dupes(rtemplates, imported);

		const newTemplates = rtemplates.concat(imported);
		set_localStorage_customTemplates(newTemplates);
		update_DOM_buttons();

		notify(`${imported.length} articles imported.`);
	};
	reader.readAsText(file);
}

/** Saves templates to storage */
function set_localStorage_customTemplates(dx) {
	try {
		localStorage.setItem("savedArticles_cache", JSON.stringify(dx));
	} catch (err) {
		notify('Storage error: Check your browser privacy settings.');
	}
	set_runtime_templates(dx);
}

/** Generates a file timestamp */
function filename_date_stamp() {
	const now = new Date();
	return `${now.getMonth() + 1}_${now.getDate()}_${now.getHours()}_${now.getMinutes()}`;
}

/** Returns the runtime templates */
function get_runtime_templates() {
	return templates;
}

/** Retrieves templates from storage */
function get_templates_from_storage() {
	try {
		return JSON.parse(localStorage.getItem("savedArticles_cache") || "[]");
	} catch (err) {
		return [];
	}
}

/** Checks for duplicate names */
function run_dupe_check(dx, dy) {
	return dx.some(t => t.label_text === dy);
}

/** Updates the DOM buttons */
function update_DOM_buttons() {
	const container = document.getElementById('custom-buttons-container');
	if (!container) return;
	container.innerHTML = '';
	templates.forEach(appendCustomButton);
}

/** Updates the templates array */
function set_runtime_templates(dx) {
	templates.splice(0, templates.length, ...dx);
}

/** Filters duplicates from incoming data */
function remove_template_dupes(existing, incoming) {
	return incoming.filter(newItem =>
		!existing.some(oldItem => oldItem.label_text === newItem.label_text)
	);
}

/** Opens a URL in a new window */
function link_opener(url) {
	if (!url.startsWith('http')) {
		url = 'https://' + url;
	}
	window.open(url, '_blank');
}

/** Displays a notification */
function notify(msg) {
	const el = document.getElementById('notify-copy');
	if (!el) return;

	el.innerText = msg;
	el.className = "show";

	setTimeout(() => {
		el.className = "hide";
	}, 2500);
}