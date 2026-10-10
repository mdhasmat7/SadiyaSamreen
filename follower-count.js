import {database,el} from './shared.js';
export async function mountFollowerCount(area,id){
 const count=el('p','','profile-follower-count');count.hidden=true;count.setAttribute('aria-live','polite');area.append(count);let version=0;
 async function refresh(){const token=++version;try{const db=await database(),r=await db.rpc('journal_follower_count',{target_profile:id});if(r.error)throw r.error;const total=Number(r.data);if(!Number.isSafeInteger(total)||total<0)throw Error('Invalid follower count');if(token!==version)return;count.textContent=total.toLocaleString()+' '+(total===1?'follower':'followers');count.hidden=false;}catch(error){if(token===version){count.hidden=true;console.warn('Follower count unavailable:',error.message);}}}
 document.addEventListener('journal-follow',e=>{if(e.detail.id===id)refresh();});await refresh();
}
