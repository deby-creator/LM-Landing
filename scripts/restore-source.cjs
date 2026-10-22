const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'reference/Landing_Liqui_Moly_Evolucion.html'), 'utf8');
const decorativeImage = (name, className = 'support-icon', width = 93, height = 93) => `<img class="${className}" src="assets/${name}.png" alt="" aria-hidden="true" width="${width}" height="${height}" loading="lazy">`;
let page = source.replace(/<style>[\s\S]*?<\/style>/, '<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">\n<link rel="stylesheet" href="source-theme.css">');
const script = page.match(/<script>([\s\S]*?)<\/script>/);
if (!script) throw new Error('Original navigation script is missing');
page = page.replace(script[0], '<script src="app.js"></script>');
function insertBefore(marker, addition) {
  if (!page.includes(marker)) throw new Error(`Source marker not found: ${marker}`);
  page = page.replace(marker, addition + marker);
}
function inView(name, transform) {
  const pattern = new RegExp(`(<section class="view(?: active)?" id="view-${name}"[\\s\\S]*?<\\/section>)`);
  const match = page.match(pattern);
  if (!match) throw new Error(`Source view not found: ${name}`);
  page = page.replace(match[0], transform(match[0]));
}
// Insert images only. All source text, including editorial notes, stays verbatim.
insertBefore('<div class="lm">', '<span class="official-logo" aria-hidden="true"><img src="assets/liqui-moly-header-logo.png" alt="" width="189" height="53"></span>');
page = page.replace('<div class="hero">', '<div class="hero">\n      <img class="hero-photo" src="assets/hero-liqui-moly-station.png" alt="" aria-hidden="true" width="1955" height="1248" fetchpriority="high">');
insertBefore('<span class="badge">Landing híbrida', '<span class="hero-flags" aria-hidden="true"><img src="assets/flag-germany.png" alt="" width="40" height="40"><img src="assets/flag-mexico.png" alt="" width="41" height="40"></span>');
const statIcons = ['icon-global', 'icon-mexico', 'icon-made-in-germany'];
let statIndex = 0;
inView('inicio', view => view.replace(/<div class="stat">/g, opening => opening + decorativeImage(statIcons[statIndex++], 'stat-icon')));
inView('respaldo', view => {
  let iconIndex = 0;
  return view.replace(/<div class="item">/g, opening => opening + decorativeImage(statIcons[iconIndex++], 'list-icon'))
    .replace('<div class="metric-grid">', decorativeImage('world-presence-map', 'world-map', 493, 301) + '<div class="metric-grid">');
});
inView('quienes', view => view.replace('<strong>Calidad al máximo nivel</strong>', decorativeImage('quality-box', 'quality-seal', 108, 108) + '<strong>Calidad al máximo nivel</strong>')
  .replace('<span class="media-label">Lectura rápida</span>', decorativeImage('app-mobile-screens', 'app-screens', 512, 326) + '<span class="media-label">Lectura rápida</span>'));
inView('service', view => view.replace('<span class="media-label">Cómo se presenta mejor</span>', decorativeImage('app-mobile-screens', 'app-screens', 512, 326) + '<span class="media-label">Cómo se presenta mejor</span>'));
inView('beneficios', view => {
  const images = ['icon-fuel-truck', 'quality-box', 'app-mobile-screens', 'icon-handshake'];
  let i = 0;
  return view.replace(/<article class="number-card">/g, opening => {
    const index = i++;
    const image = images[index];
    const number = decorativeImage(`benefit-number-${index + 1}`, 'benefit-number-image', index === 1 ? 44 : 45, 46);
    return opening + number + decorativeImage(image, index === 2 ? 'benefit-art benefit-art-app' : 'benefit-art', index === 2 ? 512 : image === 'quality-box' ? 108 : 93, index === 2 ? 326 : image === 'quality-box' ? 108 : 93);
  });
});
const originalText = html => html.match(/<body>([\s\S]*?)<\/body>/)[1]
  .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/<!--[\s\S]*?-->/g, '').split(/<[^>]+>/).map(value => value.replace(/\s+/g, ' ').trim()).filter(Boolean);
const expected = originalText(source);
const actual = originalText(page);
if (JSON.stringify(expected) !== JSON.stringify(actual)) throw new Error('Text fidelity check failed: source text must not change');
fs.writeFileSync(path.join(root, 'dist/index.html'), page);
fs.writeFileSync(path.join(root, 'dist/app.js'), script[1].trim() + '\n');
console.log(`Restored all ${expected.length} source text nodes, seven views and original navigation. Decorative assets inserted without text changes.`);
