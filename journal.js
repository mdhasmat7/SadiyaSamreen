import {recordView} from './views.js';
import {mountHomeFeature} from './home-feature.js?v=20261010-cardlink1';
import {mountTopJournals} from './top-journals.js';
import {mountFeed} from './feed.js?v=20261010-cardbadges1';
import {bookmarkButton} from './reader.js?v=20261008-contest1';
import {readingMinutes} from './reader-utils.js';
import {writerHeader,socialActions} from './social.js?v=20261010-cardbadges1';
import {accountNavigation} from './member-auth.js';
accountNavigation();
import {mountEngagement} from './engagement.js?v=20261010-cardbadges1';
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
function authorLink(a){const p=el('p');if(a.owner_id){const link=el('a','By '+a.author,'article-view');link.href='profile.html?user='+a.owner_id;p.append(link);}else{p.textContent='By '+a.author;}return p;}
async function run(){try{const id=new URLSearchParams(location.search).get('article');let articles;if(!configured){articles=examples;notice.textContent='Preview edition · Sample articles. Connect your publishing account to replace these with your own.';}else{const db=await database();let query=db.from('articles').select('*,profiles!articles_owner_id_fkey(id,display_name,avatar_url)').eq('status','published');if(id)query=query.eq('id',id);articles=[];let offset=0;while(true){const result=await query.order('published_at',{ascending:false}).order('id').range(offset,offset+199);if(result.error)throw result.error;articles.push(...result.data);if(result.data.length<200)break;offset+=200;}}
if(id){const a=articles.find(a=>a.id===id);const main=document.querySelector('#main');main.replaceChildren();const section=el('article',undefined,'article');const back=el('a','Back to the journal','back');back.href='./';section.append(back);if(!a){section.append(el('h1','Article not found'),el('p','This article may have been unpublished.'));}else{document.title=a.title+' — TheCommonJournal';document.querySelector('meta[name="description"]').content=a.excerpt;section.append(metadata(a),el('h1',a.title),el('p',a.excerpt,'lede'),await writerHeader(a,a.profiles||{}),cover(a),bodyNode(a.body));const tools=el('div',undefined,'article-reader-tools');tools.append(el('span',readingMinutes(a.body)+' min read'),await bookmarkButton(a));section.append(tools);}main.append(section);if(a){if(configured)await recordView(a.id);await mountEngagement(a,section);}return;}
await Promise.all([mountHomeFeature(articles),mountTopJournals(),mountFeed(articles)]);}
catch(error){notice.textContent='The journal could not load. Please try again shortly.';console.error(error);}}
run();




