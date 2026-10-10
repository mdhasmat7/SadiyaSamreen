export const badgeTiers=[
 {key:'diamond',min:1,max:5,name:'Diamond',range:'1–5',color:'#94bbce',light:'#f2fbff',dark:'#4d7b97',shape:'gem'},
 {key:'ruby',min:6,max:10,name:'Ruby',range:'6–10',color:'#ef3e69',light:'#ffc0d3',dark:'#a1103e',shape:'gem'},
 {key:'aquamarine-star',min:11,max:30,name:'Aquamarine star',range:'11–30',color:'#18aaba',light:'#b2f6f3',dark:'#086373',shape:'star'},
 {key:'gold-star',min:31,max:60,name:'Gold star',range:'31–60',color:'#e8a51b',light:'#fff1a4',dark:'#a85d0b',shape:'star'},
 {key:'black-star',min:61,max:Infinity,name:'Black star',range:'61+',color:'#5d6570',light:'#c7cdd4',dark:'#1e2530',shape:'star'}
];
export function badgeForPosts(count){return Number.isSafeInteger(count)&&count>=1?badgeTiers.find(t=>count>=t.min&&count<=t.max)||null:null;}
export function writerBadge(count){
 const badge=badgeForPosts(count);if(!badge)return null;
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 32 32');svg.setAttribute('class','writer-badge');svg.setAttribute('role','img');svg.setAttribute('aria-label',badge.name+' writer badge · '+badge.range+' published journals');
 const title=document.createElementNS(svg.namespaceURI,'title');title.textContent=badge.name+' · '+badge.range+' published journals';svg.append(title);
 function path(d,fill){const p=document.createElementNS(svg.namespaceURI,'path');p.setAttribute('d',d);p.setAttribute('fill',fill);svg.append(p);}
 if(badge.shape==='star'){
  path('M16 2 20.3 11.1 30 12.3 23 19.1 25 29 16 24.1 7 29 9 19.1 2 12.3 11.7 11.1Z',badge.color);
  path('M16 2 16 16 11.7 11.1Z M2 12.3 16 16 9 19.1Z M7 29 16 16 16 24.1Z',badge.light);
  path('M16 16 20.3 11.1 30 12.3Z M16 16 23 19.1 25 29Z',badge.dark);
 }else{
  path('M8 4H24L31 13 16 30 1 13Z',badge.color);
  path('M8 4 16 13 1 13Z M8 4H24L16 13Z',badge.light);
  path('M24 4 31 13 16 13Z M31 13 16 30 22 13Z',badge.dark);
  path('M10 13H22L16 30Z',badge.light);
 }
 return svg;
}
