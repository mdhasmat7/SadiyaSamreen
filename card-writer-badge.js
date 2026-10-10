import {database,el} from './shared.js';
import {writerBadge,badgeForPosts} from './writer-badge.js?v=20261010-scale2';
const counts=new Map();
export async function cardWriterBadge(id){
 if(!id)return null;
 if(!counts.has(id)){const request=(async()=>{const db=await database(),r=await db.from('articles').select('id',{count:'exact',head:true}).eq('owner_id',id).eq('status','published');if(r.error)throw r.error;return r.count;})();counts.set(id,request);}
 try{const count=await counts.get(id),tier=badgeForPosts(count);if(!tier)return null;const link=el('a',undefined,'card-writer-badge');link.href='badge-scale.html#'+tier.key;link.setAttribute('aria-label',tier.name+' badge: view writer badge scale');link.title=tier.name+' · View writer badge scale';link.append(writerBadge(count));return link;}catch(error){counts.delete(id);console.warn('Writer badge unavailable:',error.message);return null;}
}
