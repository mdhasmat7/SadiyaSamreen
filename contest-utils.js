export function contestState(c,now=Date.now()){const started=now>=Date.parse(c.starts_at);return {entries:started&&c.visible&&c.entries_open&&now<Date.parse(c.entries_close),voting:started&&c.visible&&c.voting_open&&now<Date.parse(c.voting_close),finished:now>=Date.parse(c.voting_close)||!c.voting_open};}
export function contestDate(value){return new Date(value).toLocaleString(undefined,{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});}
export function communityWinners(entries){if(!entries.length)return [];const max=Math.max(...entries.map(e=>Number(e.votes)));return max>0?entries.filter(e=>Number(e.votes)===max):[];}

