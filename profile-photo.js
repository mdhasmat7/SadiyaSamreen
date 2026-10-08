import {member} from './member-auth.js';
import {photoControls} from './photo-upload.js';
try{
 const user=await member();
 if(!user){location.replace('login.html');}
 else{
  document.querySelector('#back').href='profile.html?user='+encodeURIComponent(user.id);
  const controls=photoControls(async()=>{});
  // This page offers only image selection. The shared account controls also support removal.
  controls.querySelector('button').remove();
  document.querySelector('#photo-picker').append(controls);
 }
}catch(err){document.querySelector('#notice').textContent=err.message;}

