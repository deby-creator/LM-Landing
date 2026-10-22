const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const original = fs.readFileSync(path.join(root, 'reference/Landing_Liqui_Moly_Evolucion.html'), 'utf8');
const page = fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8');
const navigation = fs.readFileSync(path.join(root, 'dist/app.js'), 'utf8');

// These source files contain ordinary HTML text and no entities in body copy.
// Keep punctuation and letter case exact; ignore only indentation whitespace.
function textNodes(html) {
  const cleaned = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  return [...cleaned.matchAll(/(?:^|>)([^<]*)(?=<|$)/g)]
    .map(match => match[1].replace(/\s+/g, ' ').trim()).filter(Boolean);
}
function body(html) {
  return html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)[1];
}
function attributes(text) {
  return Object.fromEntries([...text.matchAll(/([\w:-]+)\s*=\s*(["'])([\s\S]*?)\2/g)]
    .map(match => [match[1], match[3]]));
}
function viewDefinitions(html) {
  return [...html.matchAll(/<section\b([^>]*)>([\s\S]*?)<\/section>/g)]
    .map(match => ({ ...attributes(match[1]), text: textNodes(match[2]) }));
}
function controlDefinitions(html) {
  return [...html.matchAll(/<(button|a)\b([^>]*)>([\s\S]*?)<\/\1>/g)]
    .map(match => ({ tag: match[1], ...attributes(match[2]), text: textNodes(match[3]) }));
}

const expectedText = textNodes(body(original));
const actualText = textNodes(body(page));
assert.equal(expectedText.length, 195, 'Unexpected reference text count');
assert.deepEqual(actualText, expectedText, 'Every body text node must match in order');
const expectedViews = viewDefinitions(original);
const actualViews = viewDefinitions(page);
assert.deepEqual(actualViews, expectedViews, 'All seven view identities and text must match');
assert.deepEqual(controlDefinitions(page), controlDefinitions(original), 'All original controls and labels must match');
assert.equal(controlDefinitions(page).filter(control => control.tag === 'button').length, 26);
assert.equal(controlDefinitions(page).filter(control => control.tag === 'a').length, 1);
for (const tag of ['title']) {
  const expression = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`);
  assert.equal(page.match(expression)[1], original.match(expression)[1]);
}
const originalScript = original.match(/<script>([\s\S]*?)<\/script>/)[1];
assert.equal(navigation, originalScript.trim() + '\n', 'Navigation source must be byte-identical after wrapper trimming');

function simulatedPage(initialHash = '') {
  function element(definition) {
    const classes = new Set((definition.class || '').split(/\s+/));
    const listeners = new Map();
    return {
      definition,
      dataset: { view: definition['data-view'] },
      classList: {
        add: name => classes.add(name),
        remove: name => classes.delete(name),
        contains: name => classes.has(name),
      },
      addEventListener(name, handler) {
        if (!listeners.has(name)) listeners.set(name, []);
        listeners.get(name).push(handler);
      },
      click() {
        const handlers = listeners.get('click') || [];
        assert.equal(handlers.length, 1, 'Each navigation control needs one click handler');
        const event = { prevented: false, preventDefault() { this.prevented = true; } };
        handlers.forEach(handler => handler(event));
        return event;
      },
    };
  }
  const views = actualViews.map(element);
  const controls = controlDefinitions(page).map(element);
  const go = controls.filter(control => control.classList.contains('js-go'));
  const home = controls.filter(control => control.classList.contains('js-home'));
  const location = { hash: initialHash };
  const pushed = [];
  const events = new Map();
  const scrolls = [];
  const document = {
    querySelectorAll(selector) {
      if (selector === '.view') return views;
      if (selector === '.js-go') return go;
      if (selector === '.js-home') return home;
      throw new Error(`Unexpected DOM selector: ${selector}`);
    },
  };
  const window = {
    addEventListener: (event, handler) => events.set(event, handler),
    scrollTo: options => scrolls.push(options),
  };
  const history = {
    pushState(state, title, hash) { pushed.push({ state, title, hash }); location.hash = hash; },
  };
  vm.runInNewContext(navigation, { document, window, history, location }, { timeout: 1000 });
  return { views, controls, go, home, location, pushed, events, scrolls };
}
function assertView(runtime, name) {
  const active = runtime.views.filter(view => view.classList.contains('active'));
  assert.equal(active.length, 1, 'Exactly one view must be active');
  assert.equal(active[0].dataset.view, name);
  assert.equal(runtime.scrolls.at(-1).top, 0, 'Navigation returns to top');
}

const runtime = simulatedPage();
assertView(runtime, 'inicio');
assert.equal(runtime.go.length, 19);
assert.equal(runtime.home.length, 8);
for (const control of runtime.controls) {
  const expected = control.classList.contains('js-home') ? 'inicio' : control.dataset.view;
  const before = runtime.pushed.length;
  const event = control.click();
  assertView(runtime, expected);
  assert.equal(runtime.location.hash, `#${expected}`);
  assert.equal(runtime.pushed.length, before + 1, 'Clicks must update history once');
  if (control.classList.contains('js-home')) assert.equal(event.prevented, true);
}

const hashes = ['', ...actualViews.map(view => `#${view['data-view']}`), '#unknown'];
for (const hash of hashes) {
  const name = actualViews.some(view => `#${view['data-view']}` === hash) ? hash.slice(1) : 'inicio';
  const fresh = simulatedPage(hash);
  assertView(fresh, name);
  assert.equal(fresh.location.hash, hash, 'Startup must not rewrite the requested URL');
  assert.equal(fresh.pushed.length, 0, 'Startup must not add history entries');
  runtime.location.hash = hash;
  const before = runtime.pushed.length;
  assert.equal(typeof runtime.events.get('popstate'), 'function');
  runtime.events.get('popstate')();
  assertView(runtime, name);
  assert.equal(runtime.location.hash, hash, 'History navigation must preserve the URL');
  assert.equal(runtime.pushed.length, before, 'History navigation must not add entries');
}

const images = [...page.matchAll(/<img\b([^>]*)>/g)].map(match => attributes(match[1]));
const imageSources = new Set(images.map(image => image.src));
for (const image of images) {
  assert.equal(image.alt, '', 'Inserted images must not introduce new text');
  const resolved = path.resolve(root, 'dist', image.src);
  assert.ok(resolved.startsWith(path.join(root, 'dist') + path.sep), 'Images must resolve inside dist');
  const bytes = fs.readFileSync(resolved);
  assert.deepEqual([...bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10], `Invalid PNG: ${image.src}`);
  assert.ok(bytes.readUInt32BE(16) > 0 && bytes.readUInt32BE(20) > 0, `Empty PNG: ${image.src}`);
}
const newAssets = [
  'icon-fuel-truck.png', 'icon-handshake.png', 'icon-made-in-germany.png',
  'icon-mexico.png', 'icon-global.png', 'app-mobile-screens.png',
  'world-presence-map.png', 'quality-box.png',
];
for (const asset of newAssets) assert.ok(imageSources.has(`assets/${asset}`), `New image is not used: ${asset}`);
for (const match of page.matchAll(/<(?:script|link)\b([^>]*)>/g)) {
  const attrs = attributes(match[1]);
  const target = attrs.src || attrs.href;
  if (target && !/^(?:https?:|data:|#)/.test(target)) assert.ok(fs.existsSync(path.resolve(root, 'dist', target)), `Missing page resource: ${target}`);
}

console.log(JSON.stringify({
  result: 'PASS',
  exactBodyTextNodes: actualText.length,
  views: actualViews.map(view => ({ name: view['data-view'], textNodes: view.text.length })),
  exactNavigationScript: true,
  simulatedButtonClicks: 26,
  simulatedLogoClicks: 1,
  startupHashCases: hashes.length,
  popstateCases: hashes.length,
  validImageReferences: images.length,
  uniqueImageFiles: imageSources.size,
  requiredNewImages: newAssets.length,
}, null, 2));
