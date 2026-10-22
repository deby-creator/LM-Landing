const fs = require('node:fs');
const path = require('node:path');
const { parse, nodes, text, texts, byClass: cls, byTag: tag } = require('./source-parser.cjs');
const root = path.resolve(__dirname, '..');
const tree = parse(fs.readFileSync(path.join(root, 'reference/Landing_Liqui_Moly_Evolucion.html'), 'utf8'));
const one = (n, c) => cls(n, c)[0];
const copy = (n, c) => text(one(n, c));
const route = n => ({ label: text(n), target: n.attrs['data-view'] || 'inicio' });
const features = n => cls(n, 'item').map(item => ({ marker: text(tag(item, 'i')[0]), title: text(tag(item, 'strong')[0]), description: text(tag(item, 'span')[0]) }));
const splits = n => cls(n, 'split-card').map(item => ({ title: text(tag(item, 'strong')[0]), description: text(tag(item, 'span')[0]) }));
const metrics = n => [...cls(n, 'stat'), ...cls(n, 'metric')].map(item => ({ value: text(tag(item, 'b')[0]), label: text(tag(item, 'span')[0]) }));
const header = tag(tree, 'header')[0];
const views = Object.fromEntries(cls(tree, 'view').map(n => [n.attrs['data-view'], n]));
const home = views.inicio;
const heroLead = texts(one(home, 'lead'));
const content = {
  header: { brand: texts(one(header, 'brand')), links: tag(header, 'button').map(route) },
  hero: {
    badge: copy(home, 'badge'), title: texts(tag(home, 'h1')[0]), tagline: heroLead[0], description: heroLead[1],
    actions: tag(one(home, 'hero__actions'), 'button').map(route), metrics: metrics(home),
    explanation: { title: text(tag(one(home, 'panel'), 'h3')[0]), description: text(tag(one(home, 'panel'), 'p')[0]),
      features: cls(home, 'mini').map(n => ({ title: text(tag(n, 'strong')[0]), description: text(tag(n, 'span')[0]) })) },
    index: cls(home, 'home-card').map(n => ({ number: copy(n, 'tag'), title: text(tag(n, 'h4')[0]), description: text(tag(n, 'p')[0]), label: copy(n, 'go'), target: n.attrs['data-view'] })),
    footnote: copy(home, 'footer-note')
  },
  sections: {}
};
for (const [id, view] of Object.entries(views).filter(([id]) => id !== 'inicio')) {
  const transition = one(view, 'cta-banner');
  const aside = one(view, 'card--dark') || one(view, 'media-box') || one(view, 'video-box');
  content.sections[id] = {
    id, back: copy(view, 'back-btn'), label: copy(view, 'badge'), kicker: copy(view, 'kicker'),
    title: text(tag(view, 'h2')[0]), lead: copy(view, 'lead'),
    features: features(view).filter(item => !aside || !features(aside).some(a => a.title === item.title)),
    pillars: splits(view),
    benefits: cls(view, 'number-card').map(n => ({ number: copy(n, 'n'), title: text(tag(n, 'h3')[0]), description: text(tag(n, 'p')[0]) })),
    tags: aside ? cls(view, 'pill').filter(n => !nodes(aside).includes(n)).map(text) : [],
    transition: { title: text(tag(transition, 'strong')[0]), description: text(tag(transition, 'p')[0]), action: route(tag(transition, 'button')[0]) },
    aside: aside ? {
      label: one(aside, 'media-label') ? copy(aside, 'media-label') : '',
      title: text(tag(aside, 'h3')[0]), description: tag(aside, 'p').length ? text(tag(aside, 'p')[0]) : '',
      metrics: metrics(aside), tags: cls(aside, 'pill').map(text), features: features(aside),
      play: one(aside, 'play') ? copy(aside, 'play') : ''
    } : null
  };
}
const dir = path.join(root, 'src/app/content');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'content.generated.json'), JSON.stringify(content, null, 2) + '\n');
console.log(`Extracted ${texts(tag(tree, 'body')[0]).length} original text nodes into typed section data.`);
