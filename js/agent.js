/* ═══════════ Ferreproxim · Orquestador multi-agente ═══════════ */
const CFG = window.FERRE_CONFIG || {openrouter:{}, supabase:{}, company:{}};
function AIcfgDefaults(){
  const saved = {
    endpoint: localStorage.getItem('ai_endpoint'), key: localStorage.getItem('ai_key'), model: localStorage.getItem('ai_model')
  };
  const or = CFG.openrouter || {};
  return {
    endpoint: saved.endpoint ?? or.endpoint ?? '',
    key: saved.key ?? or.key ?? '',
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
  const base = AIcfg.endpoint.replace(/\/+$/,'');
  const headers = { 'Content-Type':'application/json', ...(AIcfg.key ? {'Authorization':'Bearer '+AIcfg.key} : {}) };
  if(base.includes('openrouter')){
    headers['HTTP-Referer'] = CFG.company?.web || location.href;
    headers['X-Title'] = 'Ferreproxim · Bermo Ferretería';
  }
  const res = await fetch(base + '/chat/completions', {
    method:'POST',
    headers,
    body: JSON.stringify({
      model: AIcfg.model,
      messages: [
        {role:'system', content: sys},
        ...history.slice(-6).map(m=>({role: m.role, content: m.content.replace(/<[^>]+>/g,'')})),
        {role:'user', content: text}
      ],
      temperature: 0.2,
      max_tokens: 1600
    })
  });
  if(!res.ok) throw new Error('API ' + res.status);
  const data = await res.json();
  return (data.choices?.[0]?.message?.content || '').trim();
}
