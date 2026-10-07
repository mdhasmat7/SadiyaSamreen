import {database,config,el} from './shared.js';
export async function member(){
 const db=await database();const {data,error}=await db.auth.getUser();if(error||!data.user||data.user.is_anonymous)return null;
 const result=await db.rpc('is_journal_member');if(result.error)throw result.error;return result.data?data.user:null;
}
export async function profile(){const db=await database();const {data,error}=await db.rpc('ensure_journal_profile');if(error)throw error;return data;}
export async function googleSignIn(){try{sessionStorage.setItem('journal-login-profile','1');}catch{}const db=await database();const {error}=await db.auth.signInWithOAuth({provider:'google',options:{redirectTo:new URL('account.html',location.href).href}});if(error)throw error;}
export async function requireMember(){const user=await member();if(!user)throw Error('Please sign in with Google first.');await profile();return user;}
export async function accountNavigation(){const {readerHeader}=await import('./reader.js');await readerHeader();}


