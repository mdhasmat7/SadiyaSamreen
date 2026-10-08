import {member,googleSignIn} from './member-auth.js?v=20261007-profile4';
const button=document.querySelector('#google-login'),status=document.querySelector('#login-status');
button.onclick=async()=>{button.disabled=true;status.textContent='Connecting to Google…';try{await googleSignIn();}catch(err){status.textContent='Could not sign in: '+err.message;button.disabled=false;}};
try{const user=await member();if(user)location.replace('profile.html?user='+encodeURIComponent(user.id));}catch{status.textContent='Sign-in is temporarily unavailable. Please try again.';}




