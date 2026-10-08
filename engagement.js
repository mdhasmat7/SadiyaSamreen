import {reportButton} from './reporting.js';
import {socialActions,avatar} from './social.js?v=20261008-heart1';
import {database,el,configured} from './shared.js';
import {requireMember,member,profile} from './member-auth.js';
async function guest(){return requireMember();}
export async function mountEngagement(article,parent){
 const section=el('section',undefined,'engagement');section.id='comments';section.append(el('h2','Join the conversation'));parent.append(section);
 if(!configured||article.id.startsWith('sample-')){section.append(el('p','Reactions and comments will be available for published articles.'));return;}
 const feedback=el('p','','hint');feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');
 const heading=el('h3','Comments'),list=el('div',undefined,'comments-list');
 const form=el('form',undefined,'comment-form');const nameLabel=el('label','Your name'),name=el('input');name.required=true;name.maxLength=60;name.autocomplete='name';nameLabel.append(name);
 const bodyLabel=el('label','Your comment'),body=el('textarea');body.required=true;body.maxLength=2000;body.rows=4;bodyLabel.append(body);
 name.readOnly=true;
 const send=el('button','Post comment','primary');send.type='submit';form.append(nameLabel,bodyLabel,el('p','Comments are published immediately. Please keep the conversation respectful.','hint'),send);
 const signin=el('a','Sign in with Google to react or comment.','article-view');signin.href='account.html';signin.hidden=true;
 section.append(signin,feedback,heading,list,form);let db,mine=0,viewer=null;
 async function comments(){const {data,error}=await db.from('article_comments').select('id,name,body,created_at,user_id').eq('article_id',article.id).eq('approved',true).order('created_at',{ascending:false}).limit(100);if(error)throw error;list.replaceChildren();heading.textContent='Comments'+(data.length?' ('+data.length+')':'');if(!data.length)list.append(el('p','Be the first to share a thought.','hint'));for(const c of data){const item=el('article',undefined,'comment');const author=el('a',c.name);author.href='profile.html?user='+c.user_id;author.prepend(avatar(c.name,''));author.className='writer-link';item.append(author,el('small',new Date(c.created_at).toLocaleDateString()),el('p',c.body));if(viewer&&(viewer.id===c.user_id||viewer.id===article.owner_id||viewer.id===window.OFFICELIFE_CONFIG.adminUserId)){const remove=el('button','Delete comment','danger');remove.type='button';remove.onclick=async()=>{if(!confirm('Permanently delete this comment?'))return;remove.disabled=true;try{await requireMember();const {error}=await db.from('article_comments').delete().eq('id',c.id).select('id').single();if(error)throw error;await comments();feedback.textContent='Comment deleted.';}catch(err){feedback.textContent=err.message;remove.disabled=false;}};item.append(remove);}item.append(reportButton(article.id,c.id));list.append(item);}}
 form.onsubmit=async e=>{e.preventDefault();send.disabled=true;try{if(!body.value.trim())throw Error('Enter your comment.');await requireMember();const p=await profile();const {error}=await db.from('article_comments').insert({article_id:article.id,name:p.display_name,body:body.value.trim()});if(error)throw error;body.value='';await comments();feedback.textContent='Your comment is published.';document.dispatchEvent(new CustomEvent('journal-comments',{detail:article.id}));}catch(err){feedback.textContent='Could not send your comment: '+err.message;}finally{send.disabled=false;}};
 try{db=await database();viewer=await member();if(viewer){const p=await profile();name.value=p.display_name;}else{signin.hidden=false;form.hidden=true;}await socialActions(article,section,()=>{section.scrollIntoView({behavior:'smooth'});if(viewer)body.focus();});await comments();if(location.hash==='#comments')section.scrollIntoView();}catch{feedback.textContent='Comments are temporarily unavailable.';send.disabled=true;}
}


