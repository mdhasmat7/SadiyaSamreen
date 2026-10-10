import {badgeTiers,writerBadge} from './writer-badge.js?v=20261010-scale2';
import {el} from './shared.js';
const list=document.querySelector('#badge-scale');
for(const tier of badgeTiers){const row=el('li',undefined,'badge-scale-row');row.id=tier.key;const text=el('div');text.append(el('h2',tier.name),el('p',tier.range+' published journals'));row.append(writerBadge(tier.min),text);list.append(row);}
function highlight(){for(const row of list.children){const active='#'+row.id===location.hash;row.classList.toggle('badge-highlight',active);if(active)row.setAttribute('aria-current','true');else row.removeAttribute('aria-current');}}
window.addEventListener('hashchange',highlight);highlight();
const back=document.querySelector('#badge-back');back.onclick=()=>{try{if(new URL(document.referrer).origin===location.origin&&history.length>1){history.back();return;}}catch{}location.href='./';};
