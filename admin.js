import {database,configured,config,el} from './shared.js';
const login=document.querySelector('#login'),workspace=document.querySelector('#workspace'),editor=document.querySelector('#editor'),notice=document.querySelector('#notice'),logout=document.querySelector('#logout'),status=document.querySelector('#editor-status');let db,articles=[];
const field=name=>editor.elements.namedItem(name);
function reset(){editor.reset();field('id').value='';document.querySelector('#delete').hidden=true;editor.querySelector('[value="publish"]').textContent='Publish article';status.textContent='';}
async function authorized(){const {data,error}=await db.auth.getUser();return !error&&data.user?.id===config.adminUserId;}
async function show(){if(!await authorized()){workspace.hidden=true;logout.hidden=true;login.hidden=false;return;}login.hidden=true;workspace.hidden=false;logout.hidden=false;notice.textContent='';await load();}
function editArticle(a){
 if(field('title').value&&field('id').value!==a.id&&!confirm('Open this article? Unsaved edits will be lost.'))return;
 for(const key of ['id','title','category','author','excerpt','cover_url','body'])field(key).value=a[key]||'';
 document.querySelector('#delete').hidden=false;
 editor.querySelector('[value="publish"]').textContent=a.status==='published'?'Update published article':'Publish article';
 status.textContent=a.status==='published'?'Editing published article · Save your changes with Update published article. Saving as a draft removes it from the journal.':'Editing draft';
 editor.scrollIntoView({behavior:'smooth',block:'start'});field('title').focus({preventScroll:true});
}
async function deleteArticle(a,button){
 if(!confirm('Permanently delete "'+a.title+'"? This also removes it from the journal.'))return;
 if(button)button.disabled=true;
 try{
  if(!await authorized())throw Error('Please sign in again.');
  const {data,error}=await db.from('articles').delete().eq('id',a.id).select('id').single();
  if(error)throw error;if(!data)throw Error('The article could not be deleted.');
  if(field('id').value===a.id)reset();await load();notice.textContent='Article deleted.';
 }catch(err){notice.textContent='Could not delete: '+err.message;}
 finally{if(button)button.disabled=false;}
}
async function load(){
 const {data,error}=await db.from('articles').select('*').order('created_at',{ascending:false});if(error)throw error;articles=data;
 const list=document.querySelector('#list');list.replaceChildren();if(!data.length)list.append(el('p','Your first article starts here.'));
 for(const a of data){
  const item=el('div',undefined,'article-list-item');item.append(el('strong',a.title),el('small',a.status==='published'?'Published':'Draft'));
  const actions=el('div',undefined,'article-list-actions');const edit=el('button','Edit');edit.type='button';edit.setAttribute('aria-label','Edit '+a.title);edit.onclick=()=>editArticle(a);
  const remove=el('button','Delete','danger');remove.type='button';remove.setAttribute('aria-label','Delete '+a.title);remove.onclick=()=>deleteArticle(a,remove);
  actions.append(edit,remove);if(a.status==='published'){const view=el('a','View','article-view');view.href='index.html?article='+encodeURIComponent(a.id);view.target='_blank';view.rel='noopener';actions.append(view);}
  item.append(actions);list.append(item);
 }
}
login.onsubmit=async e=>{e.preventDefault();const button=login.querySelector('button');button.disabled=true;try{if(!configured)throw Error('Complete the one-time setup in README.md first.');db=await database();if(login.elements.username.value!==config.adminUsername)throw Error('Incorrect username or password.');const {error}=await db.auth.signInWithPassword({email:config.adminEmail,password:login.elements.password.value});if(error)throw Error('Incorrect username or password.');if(!await authorized()){await db.auth.signOut();throw Error('This account does not have admin access.');}login.reset();await show();}catch(err){notice.textContent=err.message;}finally{button.disabled=false;}};
logout.onclick=async()=>{try{await db.auth.signOut();reset();await show();}catch{notice.textContent='Could not sign out. Try again.';}};
document.querySelector('#new').onclick=()=>{if(!field('title').value||confirm('Start a new article? Unsaved edits will be lost.'))reset();};
editor.onsubmit=async e=>{e.preventDefault();const buttons=[...editor.querySelectorAll('button')];buttons.forEach(b=>b.disabled=true);try{if(!await authorized())throw Error('Please sign in again.');const id=field('id').value;const existing=articles.find(a=>a.id===id);const published=e.submitter?.value==='publish';const payload={};for(const key of ['title','category','author','excerpt','cover_url','body'])payload[key]=field(key).value.trim();if(['title','category','author','excerpt','body'].some(key=>!payload[key]))throw Error('Please fill in the article fields.');if(payload.cover_url&&new URL(payload.cover_url).protocol!=='https:')throw Error('Use an HTTPS image URL.');payload.status=published?'published':'draft';payload.published_at=published?(existing?.published_at||new Date().toISOString()):null;const query=id?db.from('articles').update(payload).eq('id',id):db.from('articles').insert(payload);const {data,error}=await query.select().single();if(error)throw error;field('id').value=data.id;document.querySelector('#delete').hidden=false;await load();status.textContent=published?'Published. Your article is now on the main website.':'Draft saved. Only you can see it.';}catch(err){status.textContent='Could not save: '+err.message;}finally{buttons.forEach(b=>b.disabled=false);}};
document.querySelector('#delete').onclick=()=>{const a=articles.find(a=>a.id===field('id').value);if(a)return deleteArticle(a,document.querySelector('#delete'));};
if(configured){try{db=await database();await show();}catch(err){notice.textContent='Could not connect: '+err.message;}}else{notice.textContent='One-time setup required. Follow README.md to connect your publishing account.';}
