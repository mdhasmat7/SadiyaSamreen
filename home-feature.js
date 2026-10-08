import {el,cover,database,configured} from './shared.js';
import {avatar} from './social.js?v=20261008-heart1';
export async function mountHomeFeature(articles){
 const area=document.querySelector('#featured-journal');if(!area)return;
 area.hidden=true;let article;
 if(configured){try{const db=await database(),result=await db.rpc('homepage_featured_journal');if(result.error)throw result.error;article=articles.find(a=>a.id===result.data);}catch(error){console.warn('Featured journal unavailable:',error.message);return;}}
 else{article=articles.find(a=>a.cover_url?.startsWith('https://'))||articles[0];}
 if(!article){area.hidden=true;return;}
 const link=el('a',undefined,'featured-image');link.href='./?article='+encodeURIComponent(article.id);link.setAttribute('aria-label','Read '+article.title);link.append(cover(article));
 const copy=el('div',undefined,'featured-copy');copy.append(el('span','FEATURED JOURNAL','eyebrow'),el('h1',article.title),el('p',article.excerpt,'featured-excerpt'));
 const writer=el('a',undefined,'featured-writer');writer.href=article.owner_id?'profile.html?user='+encodeURIComponent(article.owner_id):link.href;writer.append(avatar(article.profiles?.display_name||article.author,article.profiles?.avatar_url),el('span',article.profiles?.display_name||article.author));
 const read=el('a','Read journal →','featured-read');read.href=link.href;copy.append(writer,read);area.replaceChildren(copy,link);area.hidden=false;
}
