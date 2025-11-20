const { JSDOM } = require('jsdom');
const init = require('./app-script');

const dom = new JSDOM(`<!doctype html><html><body>
<form id="frm"><input name="date_of_birth" /><input name="age" /></form>
<div class="modal-overlay active"></div>
</body></html>`, { runScripts: "outside-only", resources: "usable" });

global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.Event = dom.window.Event;
global.KeyboardEvent = dom.window.KeyboardEvent;

init(document);

// Simulate DOMContentLoaded
document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));

// Simulate change event on date_of_birth
const dobInput = document.querySelector('input[name="date_of_birth"]');
dobInput.value = '1990-05-15';
const changeEvent = new dom.window.Event('change', { bubbles: true });
dobInput.dispatchEvent(changeEvent);

console.log('Age input value:', document.querySelector('input[name="age"]').value);

// Simulate click on overlay -> should remove it
const overlay = document.querySelector('.modal-overlay');
const clickEvent = new dom.window.Event('click', { bubbles: true });
overlay.dispatchEvent(clickEvent);
console.log('Overlay exists after click?', !!document.querySelector('.modal-overlay'));

// Re-add overlay to test escape key
const newOverlay = document.createElement('div');
newOverlay.className = 'modal-overlay active';
document.body.appendChild(newOverlay);
const escEvent = new dom.window.KeyboardEvent('keydown', { key: 'Escape' });
document.dispatchEvent(escEvent);
console.log('Overlay exists after Escape?', !!document.querySelector('.modal-overlay'));
