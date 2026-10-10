import {journalCardContent} from './journal-card-content.js?v=20261010-shared1';
import {avatar,followButton,writerHeader,socialActions} from './social.js?v=20261010-aligned3';
import {database,el,cover} from './shared.js';
import {member,requireMember} from './member-auth.js';
import {bookmarkButton} from './reader.js?v=20261008-contest1';
import {readingMinutes} from './reader-utils.js';
import {mountFollowerCount} from './follower-count.js?v=20261010-profile2';
import {mountWriterDashboard} from './writer-dashboard.js?v=20261010-lifetime3';
import {writerBadge,badgeForPosts} from './writer-badge.js?v=20261010-scale2';
const fields=[['current_city','Current city','Lives in ','⌖',120],['hometown','Hometown','From ','⌂',120],['school','School / College','','🎓',180],['qualification','Course / Qualification','','🎓',180],['languages','Languages','','◎',200]];
try {
 const id=new URLSearchParams(location.search).get('user');
 if(!id||! /^[0-9a-f-]{36}$/i.test(id))throw Error('Profile not found.');
 const db=await database();let {data:p,error}=await db.from('profiles').select('*').eq('id',id).single();
 if(error)throw Error('Profile not found.');
 document.title=p.display_name+' — TheCommonJournal';
 const user=await member().catch(()=>null),own=user?.id===id;
 const area=document.querySelector('#profile');
 const identity=el('div',undefined,'profile-identity'),info=el('div',undefined,'profile-identity-info'),stats=el('div',undefined,'profile-stats'),posts=el('p','','profile-post-count');
 posts.hidden=true;stats.append(posts);info.append(el('h1',p.display_name,'profile-name'),stats);identity.append(avatar(p.display_name,p.avatar_url,'avatar-large'),info);area.append(identity);
 await mountFollowerCount(stats,id,true);
 try{const r=await db.from('articles').select('id',{count:'exact',head:true}).eq('owner_id',id).eq('status','published');if(r.error)throw r.error;posts.textContent=r.count.toLocaleString()+'\n'+(r.count===1?'post':'posts');posts.hidden=false;const badge=writerBadge(r.count);if(badge){const tier=badgeForPosts(r.count),badgeLink=el('a',undefined,'writer-badge-link');badgeLink.href='badge-scale.html#'+tier.key;badgeLink.setAttribute('aria-label',tier.name+' badge: view writer badge scale');badgeLink.title='View writer badge scale';badgeLink.append(badge);info.querySelector('.profile-name').append(badgeLink);}}catch(error){console.warn('Post count unavailable:',error.message);}
 if(p.bio)area.append(el('p',p.bio,'profile-bio'));
 if(own){const edit=el('a','Edit profile photo','profile-photo-link');edit.href='profile-photo.html';area.append(edit);}else area.append(await followButton(id));
 if(own)await mountWriterDashboard(area);
 const details=document.querySelector('#personal-details'),heading=el('div',undefined,'details-heading');heading.append(el('h2','Personal details'));
 const list=el('div',undefined,'details-list');details.append(heading,list);
 function renderDetails(){list.replaceChildren();for(const [key,,prefix,symbol] of fields){if(!p[key]?.trim())continue;const row=el('div',undefined,'detail-row'),icon=el('span',symbol,'detail-symbol');icon.setAttribute('aria-hidden','true');row.append(icon,el('span',prefix+p[key]));list.append(row);}if(!list.children.length)list.append(el('p',own?'Add your city, education, and languages.':'No personal details shared yet.','hint'));}
 renderDetails();
 if(own){const edit=el('button','✎','icon-button details-edit');edit.type='button';edit.setAttribute('aria-label','Edit personal details');edit.title='Edit personal details';heading.append(edit);
  const dialog=el('dialog',undefined,'details-dialog'),form=el('form'),top=el('div',undefined,'details-heading'),title=el('h2','Edit personal details'),close=el('button','×','icon-button');title.id='details-title';dialog.setAttribute('aria-labelledby',title.id);close.type='button';close.setAttribute('aria-label','Close');close.onclick=()=>dialog.close();top.append(title,close);form.append(top);
  for(const [key,label,,,max] of fields){const wrapper=el('label',label),input=el('input');input.name=key;input.maxLength=max;wrapper.append(input);form.append(wrapper);}
  form.append(el('p','Leave a field empty to hide it from your public profile.','hint'));const status=el('p','','hint');status.setAttribute('role','status');const actions=el('div',undefined,'actions'),cancel=el('button','Cancel'),save=el('button','Save','primary');cancel.type='button';cancel.onclick=()=>dialog.close();save.type='submit';actions.append(cancel,save);form.append(status,actions);dialog.append(form);document.body.append(dialog);
  edit.onclick=()=>{for(const [key] of fields)form.elements.namedItem(key).value=p[key]||'';status.textContent='';dialog.showModal();};
  form.onsubmit=async e=>{e.preventDefault();save.disabled=true;try{const viewer=await requireMember();if(viewer.id!==id)throw Error('You can only edit your own profile.');const values=Object.fromEntries(fields.map(([key])=>[key,form.elements.namedItem(key).value.trim()]));const result=await db.from('profiles').update(values).eq('id',id).select('*').single();if(result.error)throw result.error;p=result.data;renderDetails();dialog.close();}catch(err){status.textContent='Could not save details. '+(err.message||'Please try again.');}finally{save.disabled=false;}};
 }
 const grid=document.querySelector('#articles');let offset=0;
 while(true){const result=await db.from('articles').select('*').eq('owner_id',id).eq('status','published').order('published_at',{ascending:false}).order('id').range(offset,offset+199);if(result.error)throw result.error;
  for(const a of result.data){const card=el('article',undefined,'feed-card'),header=await writerHeader(a,p),tools=el('div',undefined,'writer-tools'),follow=header.querySelector('.follow-button');if(follow)tools.append(follow);tools.append(await bookmarkButton(a));header.append(tools);const date=header.querySelector('small');if(date)date.textContent+=' · '+readingMinutes(a.body)+' min read';const link=journalCardContent(a);card.append(header,link);grid.append(card);await socialActions(a,card);}
  if(result.data.length<200)break;offset+=200;
 }
 if(!grid.children.length)grid.append(el('p','No published journals yet.','empty'));
}catch(err){document.querySelector('#notice').textContent=err.message;}



