(function(){
'use strict';
const root=document.documentElement;
const $=s=>document.querySelector(s);
const $$=s=>Array.from(document.querySelectorAll(s));
function addStyle(){
 if($('#mrMotionStyle'))return;
 const css=`
:root{--mr-glow:rgba(108,99,255,.28);--mr-ease:cubic-bezier(.2,.8,.2,1)}
html{scroll-behavior:smooth}body{overflow-x:hidden}
body:before{content:"";position:fixed;inset:-20%;z-index:-2;pointer-events:none;background:radial-gradient(circle at 15% 10%,rgba(108,99,255,.12),transparent 28%),radial-gradient(circle at 90% 30%,rgba(155,140,255,.10),transparent 30%),radial-gradient(circle at 50% 100%,rgba(35,165,106,.06),transparent 25%);animation:mrAmbient 14s ease-in-out infinite alternate}
@keyframes mrAmbient{from{transform:translate3d(-1%,-1%,0) scale(1)}to{transform:translate3d(1%,1%,0) scale(1.04)}}
.top{position:sticky;top:0;z-index:40;padding:12px 2px 14px;background:color-mix(in srgb,var(--bg) 82%,transparent);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);animation:mrDrop .65s var(--mr-ease)}
.brand{letter-spacing:-.7px;animation:mrBrand 1.2s var(--mr-ease)}
@keyframes mrBrand{0%{opacity:0;transform:translateX(-18px);letter-spacing:3px}100%{opacity:1;transform:none;letter-spacing:-.7px}}
.card{position:relative;overflow:hidden;transition:transform .35s var(--mr-ease),box-shadow .35s var(--mr-ease),border-color .35s ease;animation:mrRise .65s var(--mr-ease) both}
.card:after{content:"";position:absolute;inset:-100% 45% -100% -45%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent);transform:translateX(-120%) rotate(12deg);pointer-events:none}
.card:hover{transform:translateY(-4px);box-shadow:0 18px 45px rgba(32,35,67,.12)}.card:hover:after{animation:mrShine 1s ease}
.hero{position:relative;background-size:180% 180%;animation:mrGradient 9s ease infinite, mrRise .7s var(--mr-ease) both;box-shadow:0 22px 55px rgba(108,99,255,.24)}
.hero:before{content:"";position:absolute;width:180px;height:180px;right:-55px;top:-70px;border:1px solid rgba(255,255,255,.2);border-radius:50%;animation:mrOrbit 8s linear infinite}.hero:after{content:"";position:absolute;width:90px;height:90px;right:50px;bottom:-45px;border:1px solid rgba(255,255,255,.16);border-radius:50%;animation:mrOrbit 5s linear infinite reverse}
.hero h1{animation:mrText .8s .12s var(--mr-ease) both}.hero p{animation:mrText .8s .2s var(--mr-ease) both}.hero .btn{animation:mrPop .7s .3s var(--mr-ease) both}
@keyframes mrGradient{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}@keyframes mrOrbit{to{transform:rotate(360deg)}}
@keyframes mrRise{from{opacity:0;transform:translateY(18px) scale(.985)}to{opacity:1;transform:none}}@keyframes mrDrop{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:none}}@keyframes mrText{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes mrPop{0%{opacity:0;transform:scale(.75)}70%{transform:scale(1.06)}100%{opacity:1;transform:scale(1)}}@keyframes mrShine{to{transform:translateX(240%) rotate(12deg)}}
.metrics{perspective:700px}.metric{transition:transform .3s var(--mr-ease),background .3s ease;animation:mrMetric .65s var(--mr-ease) both}.metric:nth-child(2){animation-delay:.08s}.metric:nth-child(3){animation-delay:.16s}.metric:hover{transform:translateY(-5px) rotateX(3deg);background:color-mix(in srgb,var(--card) 88%,var(--a) 12%)}
@keyframes mrMetric{from{opacity:0;transform:translateY(14px) rotateX(-8deg)}to{opacity:1;transform:none}}
.btn{position:relative;overflow:hidden;transition:transform .18s ease,box-shadow .25s ease,filter .25s ease}.btn:hover{transform:translateY(-2px);box-shadow:0 9px 22px var(--mr-glow);filter:saturate(1.1)}.btn:active{transform:scale(.96)}
.mood{transition:transform .25s var(--mr-ease),border-color .25s ease,box-shadow .25s ease}.mood:hover{transform:translateY(-6px) scale(1.03);box-shadow:0 10px 24px rgba(108,99,255,.12)}.mood.selected{animation:mrSelected .45s var(--mr-ease)}.emoji{transition:transform .25s ease}.mood:hover .emoji{transform:scale(1.22) rotate(-5deg)}@keyframes mrSelected{50%{transform:scale(1.08)}100%{transform:scale(1)}}
.bottom{box-shadow:0 -10px 30px rgba(20,22,45,.07);animation:mrBottom .7s var(--mr-ease)}.bottom button{position:relative;transition:transform .25s ease,color .25s ease,background .25s ease}.bottom button:hover{transform:translateY(-3px)}.bottom button.active{animation:mrNav .4s var(--mr-ease)}@keyframes mrNav{50%{transform:translateY(-4px) scale(1.08)}}
.circle{position:relative;box-shadow:inset 0 0 25px rgba(108,99,255,.08),0 15px 40px rgba(108,99,255,.10);animation:mrBreathe 4s ease-in-out infinite}.circle:before{content:"";position:absolute;inset:-12px;border-radius:50%;border:2px solid rgba(108,99,255,.12);animation:mrPulse 2.5s ease-out infinite}.circle strong{animation:mrNumber 1s ease both}@keyframes mrBreathe{50%{transform:scale(1.025)}}@keyframes mrPulse{0%{opacity:.7;transform:scale(.96)}100%{opacity:0;transform:scale(1.12)}}@keyframes mrNumber{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}
.page.active{animation:mrPage .48s var(--mr-ease)}@keyframes mrPage{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.toast.show{animation:mrToast .4s var(--mr-ease),mrToastOut .35s 1.85s ease forwards}@keyframes mrToast{from{opacity:0;transform:translate(-50%,18px) scale(.9)}to{opacity:1;transform:translate(-50%,0) scale(1)}}@keyframes mrToastOut{to{opacity:0;transform:translate(-50%,12px)}}
.mr-ripple{position:absolute;border-radius:50%;pointer-events:none;background:rgba(255,255,255,.38);transform:scale(0);animation:mrRipple .6s ease-out}.mr-float{animation:mrFloat 4s ease-in-out infinite}.mr-spark{position:fixed;width:6px;height:6px;border-radius:50%;pointer-events:none;z-index:1000;animation:mrSpark .8s ease-out forwards}@keyframes mrRipple{to{transform:scale(4);opacity:0}}@keyframes mrFloat{50%{transform:translateY(-7px)}}@keyframes mrSpark{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(0)}}
@keyframes mrBottom{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
.mr-section-title{display:flex;align-items:center;justify-content:space-between;gap:10px}.mr-badge{display:inline-flex;align-items:center;gap:5px;padding:6px 9px;border-radius:999px;background:color-mix(in srgb,var(--a) 12%,var(--card));color:var(--a);font-size:11px;font-weight:900;animation:mrFloat 3.5s ease-in-out infinite}
@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.01ms!important}}
`;
 const st=document.createElement('style');st.id='mrMotionStyle';st.textContent=css;document.head.appendChild(st);
}
function ripple(e){const b=e.currentTarget;if(!b||b.classList.contains('mr-no-ripple'))return;const r=document.createElement('span');r.className='mr-ripple';const rect=b.getBoundingClientRect();const d=Math.max(rect.width,rect.height);r.style.width=r.style.height=d+'px';r.style.left=(e.clientX-rect.left-d/2)+'px';r.style.top=(e.clientY-rect.top-d/2)+'px';b.appendChild(r);setTimeout(()=>r.remove(),650)}
function sparks(el){if(!el)return;const r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;for(let i=0;i<10;i++){const s=document.createElement('i');s.className='mr-spark';s.style.left=cx+'px';s.style.top=cy+'px';const a=Math.random()*Math.PI*2,d=35+Math.random()*75;s.style.setProperty('--dx',Math.cos(a)*d+'px');s.style.setProperty('--dy',Math.sin(a)*d+'px');document.body.appendChild(s);setTimeout(()=>s.remove(),900)}}
function animateScore(){['scoreHome','homeXp','recoveryScore','brainScore','profileXp','profileGames','profileFocus'].forEach(id=>{const el=$('#'+id);if(el){el.animate([{transform:'scale(.8)',opacity:.35},{transform:'scale(1.08)',opacity:1},{transform:'scale(1)',opacity:1}],{duration:550,easing:'cubic-bezier(.2,.8,.2,1)'})}})}
function boot(){addStyle();$$('.btn,.bottom button,.mood').forEach(b=>b.addEventListener('click',ripple));$$('.hero,.metric').forEach((e,i)=>{if(i<5)e.classList.add('mr-float')});
 const oldShow=window.show; if(typeof oldShow==='function'&&!window.__mrShowWrapped){window.__mrShowWrapped=true;window.show=function(id){oldShow(id);requestAnimationFrame(()=>{const p=$('#'+id);if(p){p.animate([{opacity:.25,transform:'translateY(12px)'},{opacity:1,transform:'none'}],{duration:420,easing:'cubic-bezier(.2,.8,.2,1)'})}})}}
 const oldToast=window.toast;if(typeof oldToast==='function'&&!window.__mrToastWrapped){window.__mrToastWrapped=true;window.toast=function(x){oldToast(x);setTimeout(()=>sparks($('.toast')),40)}}
 const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.style.animationPlayState='running';obs.unobserve(e.target)}}),{threshold:.08});$$('.card,.metric').forEach(e=>{e.style.animationPlayState='paused';obs.observe(e)});
 animateScore();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.MindResetDesign={sparks,animateScore};
})();
