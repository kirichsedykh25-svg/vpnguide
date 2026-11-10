import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {layout,renderMain,card} from '../lib/site-render.js';
const articles=JSON.parse(await fs.readFile('content-seed.json','utf8'));
assert.equal(articles.length,61);assert.equal(new Set(articles.map(a=>a.slug)).size,61);
for(const a of articles){const html=await fs.readFile('articles/'+a.slug+'/index.html','utf8');assert(html.includes(a.title));assert(html.includes('114170972'));assert(!html.includes('images.unsplash.com'));assert(!html.includes('_next/static'));assert(a.content.length>=4);}
const a={...articles[0],image:'https://infovpn.site/vpnguide-content/generated-media/'+articles[0].id+'/v2/cover',version:2,imageVersion:2};
assert(card(a).includes('/v2/cover'));assert(!card({...a,imageVersion:1}).includes('<img'));
assert(renderMain('/articles/'+a.slug+'/',[a]).includes('Версия 2'));
assert(!layout('/',[{...a,title:'<script>bad()</script>'}]).includes('<script>bad()'));
console.log('PASS: 61 complete static article routes; real counter on every article; stock/shared images removed; no obsolete React hydration; unique versioned cover; stale image hidden; content escaped.');
