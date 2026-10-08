export function introductionFromBody(body){return Array.from(body.replace(/^\s*#{1,6}\s+/gm,'').replace(/\s+/g,' ').trim()).slice(0,400).join('');}
export function writingStats(body){const words=body.trim()?body.trim().split(/\s+/u).length:0;return {words,minutes:words?Math.max(1,Math.ceil(words/200)):0};}
