import fs from 'node:fs/promises';
import path from 'node:path';
import {labels,layout} from '../lib/site-render.js';
import {withMetrika} from '../lib/yandex-metrika.mjs';
const fallback=JSON.parse(await fs.readFile('content-seed.json','utf8'));
let articles=fallback;
try{const r=await fetch('https://infovpn.site/vpnguide-content/api/articles',{signal:AbortSignal.timeout(20000)});if(r.ok){const j=await r.json();if(j.articles?.length===fallback.length)articles=j.articles;}}catch{}
articles=articles.map(a=>({...a,image:a.imageVersion===a.version&&String(a.image).startsWith('https://infovpn.site/vpnguide-content/generated-media/')?a.image:null}));
const routes=['/','/search/',...Object.keys(labels).map(k=>'/'+k+'/'),...articles.map(a=>'/articles/'+a.slug+'/')];
for(const route of routes){const file=path.join('.',route==='/'?'index.html':route.slice(1)+'index.html');await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,withMetrika(layout(route,articles),114170972));}
await fs.writeFile('404.html',withMetrika(layout('/search/',articles).replace('<title>','<title>Страница не найдена — '),114170972));
await fs.mkdir('article',{recursive:true});await fs.writeFile('article/index.html','<!doctype html><html lang="ru"><meta charset="utf-8"><title>VPN Guide</title><script>var s=new URLSearchParams(location.search).get("slug");location.replace(s?"/articles/"+encodeURIComponent(s)+"/":"/");</script><a href="/">Все статьи</a></html>');
await fs.writeFile('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+routes.map(route=>'<url><loc>https://vpnguide.site'+route+'</loc></url>').join('')+'</urlset>');
console.log('Rendered '+routes.length+' pages and '+articles.length+' full articles; live updates pull from the protected editorial service through its read-only public proxy.');
