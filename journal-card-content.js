import {el,cover,safeImage} from './shared.js';
export function journalCardContent(article){
 const link=el('a',undefined,'post-content');link.href='./?article='+encodeURIComponent(article.id);link.append(el('h3',article.title),el('p',article.excerpt));
 if(safeImage(article.cover_url)){link.classList.add('has-thumbnail');link.append(cover(article));}else{link.append(el('span',article.category,'journal-category'));}
 return link;
}
