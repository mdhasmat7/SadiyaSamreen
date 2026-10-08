import {database,el,cover,configured} from './shared.js';
import {avatar,formatReactionSummary} from './social.js';
export async function mountTopJournals(){
 const section=document.querySelector('#top-journals');if(!section)return;
 const heading=el('div',undefined,'top-heading'),text=el('div'),title=el('h2','Top journals'),caption=el('p','Most loved journals published in the last 7 days.');text.append(title,caption);
 const filter=el('select');filter.setAttribute('aria-label','Top journals time period');for(const [value,label] of [['week','This week'],['all','All time']]){const option=el('option',label);option.value=value;filter.append(option);}heading.append(text,filter);
 const status=el('p','','top-status');status.setAttribute('role','status');const cards=el('div',undefined,'top-cards');section.append(heading,status,cards);let version=0;
 async function load(){const token=++version;cards.replaceChildren();status.textContent='Loading top journals…';caption.textContent=filter.value==='week'?'Most loved journals published in the last 7 days.':'Most loved journals across the community.';
  try{if(!configured)throw Error('Connect the publishing account to show top journals.');const db=await database(),result=await db.rpc('top_journals',{period:filter.value});if(token!==version)return;if(result.error)throw result.error;status.textContent=result.data?.length?'':'No published journals in this period yet. Choose All time to explore more.';
   for(const [index,a] of (result.data||[]).entries()){const card=el('article',undefined,'top-card'),link=el('a',undefined,'top-link');link.href='./?article='+encodeURIComponent(a.id);const image=el('div',undefined,'top-cover');image.append(cover(a),el('span',String(index+1).padStart(2,'0'),'top-rank'));const writer=el('div',undefined,'top-writer');writer.append(avatar(a.profiles?.display_name||a.author,a.profiles?.avatar_url),el('span',a.profiles?.display_name||a.author));link.append(image,writer,el('h3',a.title));const counts=el('div',undefined,'top-counts');counts.append(el('span',formatReactionSummary(a.summary)),el('span',Number(a.summary.comments).toLocaleString()+' comments'));card.append(link,counts);cards.append(card);}
  }catch{if(token===version)status.textContent='Top journals could not load. Please try again later.';}
 }
 filter.onchange=load;await load();
}
