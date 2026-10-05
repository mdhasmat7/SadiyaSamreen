export const config = window.OFFICELIFE_CONFIG;
export const configured = Boolean(config.supabaseUrl && config.supabasePublicKey && config.adminUserId && config.adminEmail);
let client;
export async function database() {
  if (!configured) throw new Error('Complete config.js and the Supabase setup before publishing.');
  if (!client) {
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.57.4');
    client = createClient(config.supabaseUrl, config.supabasePublicKey);
  }
  return client;
}
export function el(tag, text, className) { const node=document.createElement(tag); if(text!==undefined)node.textContent=text; if(className)node.className=className; return node; }
export function safeImage(url) { try { return new URL(url).protocol==='https:' ? url : ''; } catch { return ''; } }
export function cover(article) {
  if(safeImage(article.cover_url)){const img=el('img',undefined,'cover');img.src=article.cover_url;img.alt='';img.loading='lazy';img.referrerPolicy='no-referrer';img.onerror=()=>img.replaceWith(typeCover(article));return img;}
  return typeCover(article);
}
function typeCover(article){ const box=el('div',undefined,'cover type-cover');box.append(el('small','SADIYASAMREEN / '+article.category),el('strong',article.title),el('small','A FRESH PERSPECTIVE'));return box; }
export function metadata(a){const box=el('div',undefined,'meta');const date=new Date(a.published_at);box.append(el('span',a.category),el('span',Number.isNaN(date.getTime())?'Draft':date.toLocaleDateString('en',{month:'short',day:'numeric',year:'numeric'})));return box;}
export function bodyNode(body){const box=el('div',undefined,'article-body');for(const p of body.split(/\n\s*\n/)){if(p.trim())box.append(el(p.startsWith('## ')?'h2':'p',p.startsWith('## ')?p.slice(3):p));}return box;}
