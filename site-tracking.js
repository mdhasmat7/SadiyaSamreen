import {database} from './shared.js';
export function dailyVisitorToken(storage,cryptoApi,now=new Date()) {
 const day=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Qatar',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
 const key='journal-daily-visitor';let saved;try{saved=JSON.parse(storage.getItem(key));}catch{}
 if(saved?.day===day&&/^[0-9a-f-]{36}$/i.test(saved.token))return saved.token;
 const token=cryptoApi.randomUUID();storage.setItem(key,JSON.stringify({day,token}));return token;
}
try {const token=dailyVisitorToken(localStorage,crypto),db=await database();await db.auth.getSession();await db.rpc('record_site_visit',{browser_token:token});}catch{}
