(function(){'use strict';
var previousInteractionId=null;
function cfg(){return window.MINDRESET_AI_CONFIG&&window.MINDRESET_AI_CONFIG.apiKey}
function show(msg){var el=document.getElementById('aiAnswer');if(el)el.innerHTML=msg}
function escapeHtml(s){return String(s).replace(/[&<>\"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]})}
async function callGemini(text,onDelta){
 var key=cfg();if(!key)throw new Error('Chave Gemini não foi incluída neste build');
 var body={model:'gemini-3.8-flash',input:text,stream:true,system_instruction:'Você é o MindReset AI. Responda em português do Brasil com clareza, profundidade e utilidade. Não encurte a resposta artificialmente. Responda com o tamanho necessário para atender completamente ao pedido. Use Markdown simples quando ajudar. Não faça diagnóstico médico; em situações graves, recomende procurar um profissional.'};
 if(previousInteractionId)body.previous_interaction_id=previousInteractionId;
 var r=await fetch('https://generativelanguage.googleapis.com/v1beta/interactions?alt=sse',{method:'POST',headers:{'Content-Type':'application/json','Accept':'text/event-stream','x-goog-api-key':key},body:JSON.stringify(body)});
 if(!r.ok){var er=await r.text();throw new Error(er||('Gemini HTTP '+r.status))}
 if(!r.body)throw new Error('Streaming não disponível neste dispositivo');
 var reader=r.body.getReader(),decoder=new TextDecoder(),buffer='',out='';
 function processLine(line){
   if(line.indexOf('data: ')!==0)return;
   var raw=line.slice(6).trim();if(!raw||raw==='[DONE]')return;
   try{
     var ev=JSON.parse(raw);
     if(ev.event_type==='interaction.created'&&ev.interaction&&ev.interaction.id)previousInteractionId=ev.interaction.id;
     if(ev.event_type==='interaction.completed'&&ev.interaction&&ev.interaction.id)previousInteractionId=ev.interaction.id;
     if(ev.event_type==='step.delta'&&ev.delta&&ev.delta.type==='text'&&ev.delta.text){
       out+=ev.delta.text;if(onDelta)onDelta(ev.delta.text,out);
     }
   }catch(_){}
 }
 while(true){
   var part=await reader.read();if(part.done)break;
   buffer+=decoder.decode(part.value,{stream:true});
   var lines=buffer.split(/\r?\n/);buffer=lines.pop()||'';
   lines.forEach(processLine);
 }
 buffer.split(/\r?\n/).forEach(processLine);
 out=out.trim();if(!out)throw new Error('O Gemini retornou uma resposta vazia');return out;
}
window.askAI=async function(){var input=document.getElementById('aiInput'),q=(input&&input.value||'').trim();if(!q){show('Digite uma pergunta primeiro.');return}show('<span class="ai-loading">Pensando…</span>');try{var ans=await callGemini(q);show(escapeHtml(ans).replace(/\n/g,'<br>'))}catch(e){show('<b>A IA não conseguiu responder agora.</b><br><small>'+escapeHtml(e.message||e)+'</small>')}};
window.MindResetAI={ask:window.askAI,askText:callGemini,test:function(){return callGemini('Responda apenas: MindReset AI funcionando.')},resetConversation:function(){previousInteractionId=null}};
})();