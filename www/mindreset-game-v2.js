(function(){'use strict';
function cleanup(){document.querySelectorAll('.floatingPiece,.path,#mr2248,#mrGameModal').forEach(function(e){if(e&&e.parentNode)e.parentNode.removeChild(e)});document.body.style.overflow='';}
function open2248(){cleanup();if(window.MindReset2248&&window.MindReset2248.open)window.MindReset2248.open();}
window.addEventListener('pagehide',cleanup);window.addEventListener('beforeunload',cleanup);document.addEventListener('visibilitychange',function(){if(document.hidden)cleanup()});
new MutationObserver(function(){if(!document.getElementById('mrGameModal'))document.querySelectorAll('.floatingPiece').forEach(function(e){e.remove()})}).observe(document.body,{childList:true});
document.addEventListener('click',function(e){var g=e.target.closest&&e.target.closest('.game');if(!g)return;var t=(g.innerText||'').toLowerCase();if(t.indexOf('2048')>=0||t.indexOf('2248')>=0){e.preventDefault();e.stopImmediatePropagation();open2248();}},true);
})();