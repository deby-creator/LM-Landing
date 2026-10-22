// Small, deterministic parser for our fixed HTML reference (not a general HTML sanitizer).
const normalize = text => text.replace(/\s+/g, ' ').trim();
function parse(html) {
  const root = { tag: 'root', attrs: {}, children: [] };
  const stack = [root];
  const clean = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '').replace(/<!--[\s\S]*?-->/g, '');
  for (const token of clean.match(/<[^>]*>|[^<]+/g) || []) {
    if (token.startsWith('</')) { stack.pop(); continue; }
    if (token.startsWith('<!')) continue;
    if (token.startsWith('<')) {
      const tag = token.match(/^<([\w-]+)/)?.[1];
      if (!tag) continue;
      const attrText = token.replace(/^<[\w-]+/, '').replace(/\/?>$/, '');
      const attrs = Object.fromEntries([...attrText.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)].map(m => [m[1], m[2] ?? m[3] ?? m[4] ?? '']));
      const node = { tag, attrs, children: [] };
      stack.at(-1).children.push(node);
      if (!['meta', 'link', 'br', 'img', 'input', 'hr', 'source', 'wbr', 'base'].includes(tag) && !token.endsWith('/>')) stack.push(node);
    } else if (normalize(token)) stack.at(-1).children.push(normalize(token));
  }
  return root;
}
const nodes = n => typeof n === 'string' ? [] : [n, ...n.children.flatMap(nodes)];
const texts = n => typeof n === 'string' ? [n] : n.children.flatMap(texts);
const text = n => texts(n).join(' ');
const byClass = (n, cls) => nodes(n).filter(v => (v.attrs.class || '').split(/\s+/).includes(cls));
const byTag = (n, tag) => nodes(n).filter(v => v.tag === tag);
module.exports = { parse, nodes, texts, text, byClass, byTag, normalize };
