"""
Onesto: vygeneruje soubory stránek (onesto-<stránka>.json) z hotového buildu webu.

Dělá totéž co otevření stránky s ?onesto-schema v prohlížeči, jen pro všechny stránky naráz
a bez stahování. Soubory pak nahrajete v Onestu: Nastavení webu → 2. Nahrajte stránky webu.

Použití (po `npm run build`):
    python scripts/onesto-schemas.py http://localhost:8765
Argument je adresa, na které web běží (z ní se skládají adresy obrázků). Výstup: onesto/*.json
"""
import json
import pathlib
import re
import sys
from html.parser import HTMLParser
from urllib.parse import urljoin

VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'}


class Node:
    def __init__(self, tag, attrs, parent):
        self.tag, self.attrs, self.parent, self.children = tag, dict(attrs), parent, []

    def elements(self):
        return [c for c in self.children if isinstance(c, Node)]

    def walk(self):
        for c in self.elements():
            yield c
            yield from c.walk()

    def text(self):
        return ''.join(c if isinstance(c, str) else c.text() for c in self.children if not (isinstance(c, Node) and c.tag in ('script', 'style')))

    def inner_html(self):
        out = []
        for c in self.children:
            if isinstance(c, str):
                out.append(c.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;'))
            else:
                attrs = ''.join(f' {k}="{v}"' if v is not None else f' {k}' for k, v in c.attrs.items())
                out.append(f'<{c.tag}{attrs}>' + ('' if c.tag in VOID else c.inner_html() + f'</{c.tag}>'))
        return ''.join(out)


class Builder(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node('#root', [], None)
        self.cur = self.root

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs, self.cur)
        self.cur.children.append(node)
        if tag not in VOID:
            self.cur = node

    def handle_startendtag(self, tag, attrs):
        self.cur.children.append(Node(tag, attrs, self.cur))

    def handle_endtag(self, tag):
        n = self.cur
        while n is not self.root and n.tag != tag:
            n = n.parent
        if n is not self.root:
            self.cur = n.parent

    def handle_data(self, data):
        self.cur.children.append(data)


def squash(s):
    return re.sub(r'\s+', ' ', s or '').strip()


def type_of(el, attr):
    t = el.attrs.get('data-edit-type')
    if t:
        return t
    if attr == 'field':
        return {'img': 'image', 'a': 'link', 'time': 'date'}.get(el.tag, 'text')
    return 'text'


def text_holder(el):
    t = el
    while len(t.elements()) == 1 and t.elements()[0].tag not in ('img', 'svg'):
        t = t.elements()[0]
    return t


def read_part(el, typ, page_url):
    if typ == 'image':
        img = el if el.tag == 'img' else next((n for n in el.walk() if n.tag == 'img'), None)
        return {'src': urljoin(page_url, img.attrs.get('src') or ''), 'alt': img.attrs.get('alt') or ''} if img else None
    if typ == 'link':
        return {'href': el.attrs.get('href') or '#', 'text': squash(text_holder(el).text())}
    if typ == 'rich':
        return el.inner_html().strip()
    if typ == 'date':
        return (el.attrs.get('datetime') or '')[:10]
    return squash(el.text())


def describe(root, path, page_url):
    title_el = next((n for n in root.walk() if n.tag == 'title'), None)
    named = next((n for n in root.walk() if n.tag == 'meta' and n.attrs.get('name') == 'onesto-page'), None)
    fields = []
    for el in (n for n in root.walk() if 'data-edit' in n.attrs):
        typ = type_of(el, 'edit')
        field = {'key': el.attrs['data-edit'], 'type': typ, 'label': el.attrs.get('data-edit-label') or el.attrs['data-edit'], 'default': None}
        if typ == 'gallery':
            field['default'] = [v for v in (read_part(c, 'image', page_url) for c in el.elements()) if v and v['src']]
        elif typ == 'list':
            items = el.elements()
            first = items[0] if items else None
            parts = [
                {'name': p.attrs['data-edit-field'], 'type': type_of(p, 'field'), 'label': p.attrs.get('data-edit-label') or p.attrs['data-edit-field']}
                for p in (first.walk() if first else []) if 'data-edit-field' in p.attrs
            ]
            field['itemFields'] = parts
            field['default'] = []
            for child in items:
                item = {}
                for p in parts:
                    part = next((n for n in child.walk() if n.attrs.get('data-edit-field') == p['name']), None)
                    if part is not None:
                        item[p['name']] = read_part(part, p['type'], page_url)
                field['default'].append(item)
        else:
            field['default'] = read_part(el, typ, page_url)
        fields.append(field)
    # Společná patička patří jen k hlavní stránce: v editoru se pak neopakuje u každé stránky.
    if path != '/':
        fields = [f for f in fields if '(na všech stránkách)' not in f['label']]
    title = (named.attrs.get('content') if named else None) or (squash(title_el.text()) if title_el else path)
    return {'onesto': 1, 'page': {'path': path, 'title': title, 'fields': fields}}


def main():
    base = (sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8765').rstrip('/') + '/'
    here = pathlib.Path(__file__).resolve().parent.parent
    dist, out = here / 'dist', here / 'onesto'
    out.mkdir(exist_ok=True)
    for html in sorted(dist.rglob('index.html')):
        rel = html.relative_to(dist).parent.as_posix()
        path = '/' if rel == '.' else f'/{rel}/'
        builder = Builder()
        builder.feed(html.read_text(encoding='utf-8'))
        schema = describe(builder.root, path, urljoin(base, path.lstrip('/')))
        # Stránka jen se společnou patičkou nemá v editoru co dělat: patička se upravuje na hlavní stránce.
        if not schema['page']['fields']:
            continue
        slug = re.sub(r'[^a-z0-9]+', '-', path.strip('/'), flags=re.I) or 'home'
        target = out / f'onesto-{slug}.json'
        target.write_text(json.dumps(schema, ensure_ascii=False, indent=2), encoding='utf-8')
        print(f'{target.name}: {path} ({len(schema["page"]["fields"])} parts)')


if __name__ == '__main__':
    main()
