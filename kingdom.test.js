import { JSDOM } from 'jsdom';
import {
  get,
  on,
  update,
  each,
  show,
  hide,
  set,
  setStyle,
  remove,
  toggle,
  append,
  exists,
  create,
  load,
  disable,
  enable,
  checked,
  focus
} from './kingdom.js';
import assert from 'assert';

// Configurar jsdom
const { window } = new JSDOM(`
  <!DOCTYPE html>
  <html>
    <body>
      <div id="test-div" class="d-none"></div>
    </body>
  </html>
`);

global.window = window;
global.document = window.document;
global.HTMLElement = window.HTMLElement;
global.Node = window.Node;

// Mock document for testing
document.body.innerHTML = `
  <div id="test-div" class="d-none"></div>
  <input id="test-input" type="text" value="initial">
  <select id="test-select">
    <option value="1">One</option>
    <option value="2">Two</option>
  </select>
  <button id="test-button">Click me</button>
`;

// Test cases
describe('KingDom.js', () => {
  it('get() should select an element', () => {
    const el = get('#test-div');
    assert.notStrictEqual(el, null);
  });

  it('show() should remove d-none class', () => {
    show('#test-div');
    const el = get('#test-div');
    assert.strictEqual(el.classList.contains('d-none'), false);
  });

  it('hide() should add d-none class', () => {
    hide('#test-div');
    const el = get('#test-div');
    assert.strictEqual(el.classList.contains('d-none'), true);
  });

  it('update() should change element content', () => {
    update('#test-div', 'New content');
    const el = get('#test-div');
    assert.strictEqual(el.innerHTML, 'New content');
  });

  it('set() should set an attribute', () => {
    set('#test-div', 'data-test', 'value');
    const el = get('#test-div');
    assert.strictEqual(el.getAttribute('data-test'), 'value');
  });

  it('setStyle() should set a style property', () => {
    setStyle('#test-div', 'color', 'red');
    const el = get('#test-div');
    assert.strictEqual(el.style.color, 'red');
  });

  it('toggle() should toggle a class', () => {
    const el = get('#test-div');
    const classContains = el.classList.contains('d-none');
    toggle('#test-div', 'd-none');
    assert.strictEqual(el.classList.contains('d-none'), !classContains);
  });

  it('append() should append content to an element', () => {
    append('#test-select', '<option value="3">Three</option>');
    const el = get('#test-select');
    assert.strictEqual(el.innerHTML.includes('Three'), true);
  });

  it('exists() should check if an element exists', () => {
    assert.strictEqual(exists('#test-input'), true);
    assert.strictEqual(exists('#non-existent'), false);
  });

  it('create() should create a new element', () => {
    const el = create('div', { id: 'new-div', text: 'Hello' }, document.body);
    assert.strictEqual(el.id, 'new-div');
    assert.strictEqual(el.textContent, 'Hello');
  });

  it('load() should load a script or stylesheet', () => {
    const el = load('test.css', { id: 'test-css' });
    assert.strictEqual(el.id, 'test-css');
  });

  it('disable() should disable an element', () => {
    disable('#test-input');
    const el = get('#test-input');
    assert.strictEqual(el.disabled, true);
  });

  it('enable() should enable an element', () => {
    enable('#test-input');
    const el = get('#test-input');
    assert.strictEqual(el.disabled, false);
  });

  it('checked() should get values of checked checkboxes', () => {
    document.body.innerHTML += `
      <input type="checkbox" class="test-checkbox" value="1" checked>
      <input type="checkbox" class="test-checkbox" value="2">
    `;
    const els = document.querySelectorAll('.test-checkbox');
    assert.deepStrictEqual(checked(els), ['1']);
  });

  it('focus() should focus an element', () => {
    const el = get('#test-input');
    focus(el);
    assert.strictEqual(document.activeElement, el);
  });

  it('on() should add an event listener to an element', () => {
    const el = get('#test-button');
    let clicked = false;
    on(el, 'click', () => {
      clicked = true;
    });
    el.click();
    assert.strictEqual(clicked, true);
  });

  it('each() should iterate over elements and apply a function', () => {
    document.body.innerHTML += `
      <div class="test-div">1</div>
      <div class="test-div">2</div>
      <div class="test-div">3</div>
    `;
    const elements = document.querySelectorAll('.test-div');
    each(Array.from(elements), (el, index) => {
      el.textContent = `Item ${index + 1}`;
    });
    elements.forEach((el, index) => {
      assert.strictEqual(el.textContent, `Item ${index + 1}`);
    });
  });

  it('remove() should remove an element', () => {
    remove('#test-div');
    const divExists = exists('#test-div');
    assert.strictEqual(divExists, false);
  });
});