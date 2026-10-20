/* ═══════════ Ferreproxim · Orquestador multi-agente ═══════════ */
const IS_FILE = location.protocol === 'file:';
const _base = window.FERRE_CONFIG || {};
const _local = window.FERRE_CONFIG_LOCAL || {};
const CFG = {
  ..._base,
  apiProxy: _base.apiProxy || '/api/chat',
  openrouter: { ...(_base.openrouter||{}), ...(_local.openrouter||{}) },
  supabase: { ...(_base.supabase||{}), ...(_local.supabase||{}) },
  company: _base.company || {}
};
function AIcfgDefaults(){
  const saved = {
    endpoint: localStorage.getItem('ai_endpoint'), key: localStorage.getItem('ai_key'), model: localStorage.getItem('ai_model')
  };
  const or = CFG.openrouter || {};
  return {
    endpoint: saved.endpoint ?? (IS_FILE ? (or.endpoint || '') : CFG.apiProxy),
    key: saved.key ?? (IS_FILE ? (or.key || '') : ''),
    model: saved.model ?? or.model ?? 'minimax/minimax-m3.1-flash:free',
    pro: localStorage.getItem('ai_pro') !== '0',
    local: localStorage.getItem('ai_local') !== '0',
  };
}
const AIcfg = AIcfgDefaults();
window.AIcfg = AIcfg;

function routeAgent(text){
  const t_ = text.toLowerCase();
  if(/pedido|devoluc|garant|recogid|recol|order|return|warranty/i.test(t_)) return 'postventa';
  if(/presupu|orzam|tarifa|mayor|stock|sku|ean|referencia|quote|factur|albar/i.test(t_)) return 'tecnipro';
  if(/instalar|proyecto|proxecto|como|hacer|facero|paso|montar|calcular|cuanta|canta|m2|kit|diy|arreglar|reparar/i.test(t_)) return 'manitas';
  return 'bermobot';
}

function catalogForPrompt(){
  return CATALOG.map(p=>`${p.sku} | ${p[LANG]||p.es} | ${p.cat} | ${money(p.price)} | stock ${p.stock}`).join('\n');
}

const PRO_DIRECTIVE = {
  es:' MODO PRO: razona internamente paso a paso (sin mostrar la cadena de razonamiento) y presenta la conclusión accionable.',
  en:' PRO MODE: reason internally step by step (do not show the reasoning chain) and present the actionable conclusion.',
  gl:' MODO PRO: razoa internamente paso a paso (sen amosar a cadea) e presenta a conclusión accionable.'
};

async function callAPI(agentKey, text, history){
  const agent = AGENTS[agentKey];
  const sys = (agent.sys[LANG==='gl'?'gl':LANG==='en'?'en':'es'] || agent.sys.es)
    + '\n\nCATÁLOGO ACTUAL:\n' + catalogForPrompt()
    + (AIcfg.pro ? PRO_DIRECTIVE[LANG==='gl'?'gl':LANG==='en'?'en':'es'] : '');
  const messages = [
    {role:'system', content: sys},
    ...history.slice(-7).map(m=>({role: m.role, content: m.content.replace(/<[^>]+>/g,'')}))
  ];
  if(messages[messages.length-1].content !== text) messages.push({role:'user', content:text});

  const isProxy = !/^https?:\/\//i.test(AIcfg.endpoint || '');
  const endpoint = isProxy ? (AIcfg.endpoint || CFG.apiProxy || '/api/chat') : AIcfg.endpoint.replace(/\/+$/,'') + '/chat/completions';
  const headers = { 'Content-Type':'application/json' };
  if(!isProxy && AIcfg.key) headers['Authorization'] = 'Bearer ' + AIcfg.key;
  if(!isProxy && endpoint.includes('openrouter')){
    headers['HTTP-Referer'] = CFG.company?.web || location.href;
    headers['X-Title'] = 'Ferreproxim · Bermo Ferretería';
  }

  const res = await fetch(endpoint, {
    method:'POST',
    headers,
    body: JSON.stringify({
      model: AIcfg.model,
      messages,
      temperature: 0.2,
      max_tokens: 1600
    })
  });
  if(!res.ok) throw new Error('API ' + res.status);
  const data = await res.json();
  if(isProxy) return (data.content || '').trim();
  return (data.choices?.[0]?.message?.content || '').trim();
}
