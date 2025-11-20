const init = require('./app-script');

const fakeDocument = (function(){
  const listeners = {};
  let modal = { className: 'modal-overlay active', classList: { contains(n){ return this.className.split(' ').includes(n); } }, remove(){ modal = null; } };
  const ageInput = { name:'age', value: '' };
  const form = { querySelector: (s)=> s==='input[name="age"]' ? ageInput : null };
  const dobInput = { name:'date_of_birth', value:'', form, dispatchEvent(ev){ ev.target = this; if (listeners['change']) listeners['change'].forEach(fn=>fn(ev)); } };

  return {
    body: { appendChild(el){ modal = el; } },
    addEventListener(name, fn){ listeners[name] = listeners[name]||[]; listeners[name].push(fn); },
    dispatchEvent(ev){ const handlers = listeners[ev.type]; if (handlers) handlers.forEach(fn=>fn(ev)); },
    querySelector(sel){ if (sel==='input[name="age"]') return ageInput; if (sel==='.modal-overlay.active') return modal; return null; },
    createElement(tag){ return { className:'', classList:{ contains(n){ return this.className.split(' ').includes(n); } }, remove(){ modal = null; } }; },
    _dobInput: dobInput,
    _ageInput: ageInput,
    _modalRef: ()=> modal
  };
})();

init(fakeDocument);

// Simulate DOMContentLoaded
fakeDocument.dispatchEvent({ type: 'DOMContentLoaded' });

// Simulate change event on date_of_birth
const dob = fakeDocument._dobInput; dob.value = '1990-05-15'; dob.dispatchEvent({ type: 'change' });

console.log('Age input value:', fakeDocument._ageInput.value);

// Simulate click on overlay -> should remove it
const overlay = fakeDocument._modalRef();
if (overlay) {
  const clickEvent = { type: 'click', target: overlay };
  fakeDocument.dispatchEvent(clickEvent);
}
console.log('Overlay exists after click?', !!fakeDocument._modalRef());

// Re-add overlay to test escape key
const newOverlay = fakeDocument.createElement('div');
newOverlay.className = 'modal-overlay active';
fakeDocument.body.appendChild(newOverlay);

fakeDocument.dispatchEvent({ type: 'keydown', key: 'Escape' });
console.log('Overlay exists after Escape?', !!fakeDocument._modalRef());
