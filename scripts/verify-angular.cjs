const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { parse, nodes, texts, text, byClass, byTag } = require('./source-parser.cjs');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist/angular/browser');
const original = parse(fs.readFileSync(path.join(root, 'reference/Landing_Liqui_Moly_Evolucion.html'), 'utf8'));
const html = fs.readFileSync(path.join(out, 'index.html'), 'utf8');
const rendered = parse(html);
const sourceBody = byTag(original, 'body')[0];
const actualBody = byTag(rendered, 'body')[0];
const decode = value => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
const actual = texts(actualBody).map(decode).sort();
assert.equal(texts(sourceBody).length, 195, 'The untouched reference must retain its original 195 text nodes.');
const controls = byTag(actualBody, 'a').map(n => ({ target: (n.attrs.href || '').split('#')[1], label: decode(text(n)) }));
const removedByRequest = [
  'Qué gana esta vista independiente', 'Sección interna',
  'Después del respaldo, el siguiente paso natural es explicar quiénes son.',
  'Esta pantalla debe contar, en pocos segundos, qué representa LIQUI MOLY Service Station y por qué es relevante para una estación de servicio en México.',
  'Lectura rápida', 'Una propuesta que combina marca, operación y tecnología.',
  'Una vez entendido el “quiénes somos”, debe aparecer el “qué es”.',
  'Qué debe ver el usuario primero', 'Cómo se presenta mejor',
  'Esta vista conduce naturalmente a beneficios.',
  'Esta pantalla concentra únicamente los beneficios para que el usuario no los pierda entre otros mensajes. La lectura mejora porque cada beneficio tiene su propio bloque y jerarquía.',
  'Cuando el beneficio ya quedó claro, el video se vuelve el refuerzo ideal.',
  'Contenido audiovisual', 'Una pantalla dedicada al video comercial.',
  'El siguiente paso es la conversión.', 'Llamada a la acción final',
  'Qué convendría agregar en la versión publicada', 'Recomendación final',
  'Esta es la última pantalla del flujo.'
];
for (const value of removedByRequest) assert.ok(!actual.includes(value), `Removed content remains visible: ${value}`);
assert.ok(actual.includes('INGENIERÍA ALEMANA. VISIÓN MEXICANA.'));
const sections = byTag(actualBody, 'section');
assert.deepEqual(sections.map(n => n.attrs.id), ['inicio','respaldo','quienes','service','beneficios','contacto']);
const restoredService = sections.find(section => section.attrs.id === 'service');
assert.ok(byTag(restoredService, 'img').some(img => img.attrs.src === 'assets/app-mobile-screens@2x.png'), 'Service Station must include the supplied app mockup.');
const ids = new Set(nodes(rendered).map(n => n.attrs.id).filter(Boolean));
for (const control of controls) assert.ok(ids.has(control.target), `Unresolved navigation target: ${control.target}`);
assert.ok(controls.some(control => control.target === 'service'), 'Service Station must be reachable from navigation.');
assert.ok(!controls.some(control => control.target === 'video'), 'Removed video section must not retain navigation links.');
for (const section of sections) assert.ok(ids.has(section.attrs['aria-labelledby']), `Section ${section.attrs.id} needs a real heading.`);
const forms = byTag(actualBody, 'form');
assert.equal(forms.length, 1, 'Contact must render a real form.');
const fields = byTag(forms[0], 'input');
const textFields = fields.filter(field => field.attrs.type !== 'radio');
assert.deepEqual(textFields.map(field => field.attrs.name), ['name', 'company', 'city', 'phone', 'email']);
const labels = byTag(forms[0], 'label');
for (const field of textFields) {
  assert.ok(field.attrs.id && labels.some(label => label.attrs.for === field.attrs.id), `Field ${field.attrs.name} needs a connected label.`);
  assert.ok('required' in field.attrs && field.attrs.autocomplete, `Field ${field.attrs.name} needs native validation and autocomplete.`);
}
assert.equal(fields.filter(field => field.attrs.type === 'radio').length, 2);
assert.ok(byTag(forms[0], 'button').some(button => button.attrs.type === 'submit' && 'disabled' in button.attrs), 'Submission must stay unavailable without a destination.');
assert.equal(byTag(actualBody, 'h1').length, 1);
assert.equal(byTag(rendered, 'html')[0].attrs.lang, 'es');
assert.equal(text(byTag(rendered, 'title')[0]), text(byTag(original, 'title')[0]));

const assetPaths = new Set();
for (const img of byTag(rendered, 'img')) {
  assert.ok('alt' in img.attrs, `Missing image alternative: ${img.attrs.src}`);
  assert.ok(img.attrs.width && img.attrs.height, `Missing dimensions: ${img.attrs.src}`);
  const file = path.join(out, img.attrs.src.replace(/^\//, ''));
  assert.ok(fs.existsSync(file), `Missing image: ${img.attrs.src}`);
  assetPaths.add(path.basename(file));
}
for (const source of byTag(rendered, 'source')) {
  for (const candidate of source.attrs.srcset.split(',')) {
    const file = candidate.trim().split(' ')[0];
    assert.ok(fs.existsSync(path.join(out, file)), `Missing responsive image ${file}`);
  }
}
const required = ['hero-liqui-moly-station.png','liqui-moly-header-logo.png','flag-germany.png','flag-mexico.png','icon-global.png','icon-mexico.png','icon-made-in-germany.png','icon-fuel-truck.png','icon-handshake.png','app-mobile-screens@2x.png','world-presence-map@2x.png','quality-box.png',...Array.from({length:4},(_,i)=>`benefit-number-${i+1}.png`)];
for (const file of required) assert.ok(assetPaths.has(file), `Required supplied asset not displayed: ${file}`);
for (const file of fs.readdirSync(path.join(root,'dist/assets'))) assert.ok(fs.existsSync(path.join(root,'public/assets',file)), `Original asset not preserved: ${file}`);
const details = byTag(rendered, 'details');
for (const detail of details) assert.ok(byTag(detail, 'summary').length, 'Disclosure missing native summary');
const benefitDetails = details.filter(n => n.attrs.name === 'station-benefits');
assert.equal(benefitDetails.length, 4);
assert.ok(html.includes('ngh='), 'Prerendered page needs hydration annotations');
const css = fs.readdirSync(out).filter(name => name.endsWith('.css')).map(file => fs.readFileSync(path.join(out,file),'utf8')).join('\n');
assert.ok(css.includes('prefers-reduced-motion'));
assert.ok(css.includes('@media'));
assert.ok(css.includes('/fonts/barlow-400.woff2'));
for (const font of fs.readdirSync(path.join(out,'fonts'))) assert.ok(fs.statSync(path.join(out,'fonts',font)).size > 1000);
console.log(JSON.stringify({result:'PASS',visibleTextNodes:actual.length,navigationControls:controls.length,sections:sections.length,formFields:textFields.length,requiredAssets:required.length,validRenderedImages:byTag(rendered,'img').length,nativeDisclosures:details.length,prerendered:true,localFonts:7},null,2));
