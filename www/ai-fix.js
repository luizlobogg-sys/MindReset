(function(){'use strict';
var previousInteractionId=null;
function cfg(){return window.MINDRESET_AI_CONFIG&&window.MINDRESET_AI_CONFIG.apiKey}
function show(msg){var el=document.getElementById('aiAnswer');if(el)el.innerHTML=msg}
function escapeHtml(s){return String(s).replace(/[&<>\"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]})}
async function callGemini(text){var key=cfg();if(!key)throw new Error('Chave Gemini não foi incluída neste build');
 var body={model:'gemini-3.6-flash',input:text,system_instruction:'Você é o MindReset AI, um coach de foco, organização e bem-estar digital. Responda em português do Brasil, de forma prática, curta e útil. Não faça diagnóstico médico. Para situações graves de saúde, recomende procurar um profissional.',generation_config:{max_output_tokens:500}};
 if(previousInteractionId)body.previous_interaction_id=previousInteractionId;
 var r=await fetch('https://generativelanguage.googleapis.com/v1beta/interactions',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':key},body:JSON.stringify(body)});
 var data=await r.json();
 if(!r.ok)throw new Error((data&&data.error&&data.error.message)||('Gemini HTTP '+r.status));
 if(data&&data.id)previousInteractionId=data.id;
 var out='';
 if(data&&data.steps)for(var i=0;i<data.steps.length;i++){var step=data.steps[i];if(step.type==='model_output'&&step.content)for(var j=0;j<step.content.length;j++)if(step.content[j].type==='text')out+=step.content[j].text||''}
 out=out.trim()||(data&&data.output_text)||'';
 if(!out)throw new Error('O Gemini retornou uma resposta vazia');
 return out;
}
window.askAI=async function(){var input=document.getElementById('aiInput'),q=(input&&input.value||'').trim();if(!q){show('Digite uma pergunta primeiro.');return}show('<span class="ai-loading">Pensando…</span>');try{var ans=await callGemini(q);show(escapeHtml(ans).replace(/\n/g,'<br>'))}catch(e){show('<b>A IA não conseguiu responder agora.</b><br><small>'+escapeHtml(e.message||e)+'</small><br><br>Confira se a chave GEMINI_API_KEY está configurada no GitHub Actions e gere um novo APK.')}};
window.MindResetAI={ask:window.askAI,test:function(){return callGemini('Responda apenas: MindReset AI funcionando.')},resetConversation:function(){previousInteractionId=null}};
})();