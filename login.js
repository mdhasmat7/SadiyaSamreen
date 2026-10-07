import {member,googleSignIn} from './member-auth.js';
const button=document.querySelector('#google-login'),status=document.querySelector('#login-status');
button.onclick=async()=>{button.disabled=true;status.textContent='Connecting to Google…';try{await googleSignIn();}catch(err){status.textContent='Could not sign in: '+err.message;button.disabled=false;}};
try{if(await member())location.replace('account.html');}catch{status.textContent='Sign-in is temporarily unavailable. Please try again.';}
