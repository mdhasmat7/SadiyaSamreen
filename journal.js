import {mountEngagement} from './engagement.js';
import {database, configured,el,cover,metadata,bodyNode} from './shared.js';
// Keep old index.html bookmarks working while displaying the directory URL.
if(location.pathname.endsWith('/index.html')){
 const cleanUrl=new URL(location.href);
 cleanUrl.pathname=cleanUrl.pathname.slice(0,-'index.html'.length);
 history.replaceState(history.state,'',cleanUrl.pathname+cleanUrl.search+cleanUrl.hash);
}
const notice=document.querySelector('#notice');document.querySelector('#year').textContent=new Date().getFullYear();
const examples=[
  {
    "id": "sample-1",
    "title": "Finding a little quiet in the everyday.",
    "category": "Reflections",
    "excerpt": "A pause, a deep breath, and a little space to notice what matters.",
    "body": "This is a sample article to preview your journal. Replace it with your own story when your publishing account is connected.\n\n## A moment to pause\n\nAn ordinary day can hold something worth noticing: a conversation, a small kindness, or a thought you want to remember.",
    "author": "Sample article",
    "published_at": "2026-10-05"
  },
  {
    "id": "sample-2",
    "title": "The stories we carry with us.",
    "category": "Stories",
    "excerpt": "Some moments stay with us long after they have passed.",
    "body": "This is a sample article, not a personal story by SadiyaSamreen.\n\n## Begin with a memory\n\nUse this space for your own experiences, stories, and ideas. Your writing gives this journal its voice.",
    "author": "Sample article",
    "published_at": "2026-10-04"
  },
  {
    "id": "sample-3",
    "title": "Make room for curiosity.",
    "category": "Inspiration",
    "excerpt": "A new book, an unexpected conversation, a different way of seeing.",
    "body": "This is sample text for your website preview.\n\n## Follow a small interest\n\nThere is inspiration in ordinary things. Your next article might begin with a question, a place, or something you have learned.",
    "author": "Sample article",
    "published_at": "2026-10-03"
  }
];
async function run(){try{const id=new URLSearchParams(location.search).get('article');let articles;if(!configured){articles=examples;notice.textContent='Preview edition · Sample articles. Connect your publishing account to replace these with your own.';}else{const db=await database();let query=db.from('articles').select('*').eq('status','published');if(id)query=query.eq('id',id);const result=await query.order('published_at',{ascending:false});if(result.error)throw result.error;articles=result.data;}
if(id){const a=articles.find(a=>a.id===id);const main=document.querySelector('#main');main.replaceChildren();const section=el('article',undefined,'article');const back=el('a','Back to the journal','back');back.href='./';section.append(back);if(!a){section.append(el('h1','Article not found'),el('p','This article may have been unpublished.'));}else{document.title=a.title+' — SadiyaSamreen';document.querySelector('meta[name="description"]').content=a.excerpt;section.append(metadata(a),el('h1',a.title),el('p',a.excerpt,'lede'),el('p','By '+a.author),cover(a),bodyNode(a.body));}main.append(section);if(a)await mountEngagement(a,section);return;}
const grid=document.querySelector('#articles');if(!articles.length){grid.append(el('p','The next good idea is on its way. Check back soon.','empty'));return;}for(const a of articles){const card=el('article',undefined,'card');const link=el('a');link.href='./?article='+encodeURIComponent(a.id);link.append(cover(a),metadata(a),el('h3',a.title),el('p',a.excerpt));card.append(link);grid.append(card);}}
catch(error){notice.textContent='The journal could not load. Please try again shortly.';console.error(error);}}
run();
