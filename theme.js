// Apply a saved preference before page content paints. No sign-in required.
(()=>{let theme='day';try{theme=localStorage.getItem('common-jornal-theme')||'day';}catch{}document.documentElement.dataset.theme=theme==='night'?'night':'day';})();
