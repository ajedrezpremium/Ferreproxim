/* ═══════════ Ferreproxim · UI principal ═══════════ */
const $ = id => document.getElementById(id);

/* ---------- Helpers ---------- */
function toast(msg){
  const el = $('toast'); el.textContent = msg; el.hidden = false;
  clearTimeout(el._t); el._t = setTimeout(()=>el.hidden = true, 2600);
}
function setLang(l){
  LANG = l; localStorage.setItem('ferreproxim_lang', l);
  $('langSelect').value = l; $('voiceLang').value = l;
  Voice.lang = l; Voice.refreshVoices();
  applyI18n(); renderAll();
}
function agentKeyOf(){ return $('agentSelect').value; }
function isENGL(){ return LANG==='en' ? 'en' : LANG==='gl' ? 'gl' : 'es'; }

/* ---------- PRODUCTOS + BÚSQUEDA ---------- */
function productCard(p){
  const stockTxt = p.stock===0 ? `<span class="product-stock low-stock">${t('no_stock')}</span>`
    : p.stock<10 ? `<span class="product-stock low-stock">${p.stock} · ${t('low')}</span>`
    : `<span class="product-stock in-stock">${t('in_stock')}</span>`;
  return `<div class="product-card">
    <div class="product-tile">${p.emoji}</div>
    <div class="product-body">
      <span class="product-cat">${p.cat}</span>
      <span class="product-name">${p[LANG]||p.es}</span>
      <span class="product-sku">${p.sku}</span>
      <div class="product-foot">
        <div><div class="product-price">${money(p.price)}</div>${stockTxt}</div>
        <button class="add-btn" title="${t('add')}" data-add="${p.sku}">➕</button>
      </div>
    </div>
  </div>`;
}
function renderProducts(list){
  $('productGrid').innerHTML = list.length ? list.map(productCard).join('')
    : `<p class="muted">${t('results_none')}</p>`;
}
function semanticSearch(q){
  const res = findProducts(q, 8);
  renderProducts(res);
  $('resultsInfo').textContent = res.length ? `${t('results_semantic')} “${q}”` : t('results_none');
  $('productos').scrollIntoView({behavior:'smooth'});
}

/* ---------- MOCK CHAT HERO ---------- */
let mockTimer = null;
function runMock(){
  clearInterval(mockTimer);
  const box = $('mockChat'); box.innerHTML = '';
  const kit = findProducts('grifo junta llave paso teflón',3);
  const steps = [
    {delay:400, html:`<div class="mock-row user"><span class="mock-avatar">🧑</span><div class="mock-bubble bot user-box">${heroMock}</div></div>`},
    {delay:1600, html:`<div class="mock-row"><span class="mock-avatar">🤖</span><div class="mock-bubble bot">${L('diag_grifo').replace('<b>','').replace('</b>','')}<div class="mock-kit">${kit.map(p=>`<a href="#b2b"><b>${p.emoji} ${p[LANG]||p.es} (${p.sku})</b><span>${money(p.price)}</span></a>`).join('')}</div><div class="mock-cta">🛒 ${mockCta}</div></div></div>`},
  ];
  let i = 0;
  const tick = ()=>{ if(i < steps.length){ box.innerHTML += steps[i].html; i++; } else clearInterval(mockTimer); };
  tick(); tick();
}
/* valores dependientes de idioma */
let heroMock='mock: user', mockCta='mock: cta';

/* ---------- AGENTES GRID ---------- */
function renderAgents(){
  $('agentGrid').innerHTML = Object.entries(AGENTS).map(([k,a])=>`
    <div class="agent-card" data-open="${k}">
      <div class="a-icon">${a.icon}</div>
      <h3>${a.name[LANG]||a.name.es}</h3>
      <p>${a.role[isENGL()]||a.role.es}</p>
      <span class="agent-tag">${a.tag[isENGL()]||a.tag.es}</span>
    </div>`).join('');
  $('agentGrid').querySelectorAll('[data-open]').forEach(c=>
    c.addEventListener('click', ()=> openChat(c.dataset.open)));
}

/* ---------- SUGERENCIAS CHAT ---------- */
function renderSuggest(){
  const s = (SUGGESTIONS[agentKeyOf()] || SUGGESTIONS.bermobot)[isENGL()] || SUGGESTIONS.bermobot.es;
  $('chatSuggest').innerHTML = s.map(x=>`<button class="chip">${x}</button>`).join('');
  $('chatSuggest').querySelectorAll('.chip').forEach(c=>c.addEventListener('click',()=>sendMessage(c.textContent)));
}

/* ---------- CABEZA CHAT ---------- */
function syncChatAgent(){
  const a = AGENTS[agentKeyOf()];
  $('chatAgentAvatar').textContent = a.icon;
  $('chatAgentName').textContent = a.name[LANG]||a.name.es;
  $('chatAgentRole').textContent = a.role[isENGL()]||a.role.es;
  renderSuggest();
}

/* ---------- CHAT ---------- */
let chatHistory = [];
const escHTML = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

/* Saneado de HTML del agente: solo etiquetas/atributos seguros (anti-XSS) */
const SAFE_TAGS = new Set(['B','STRONG','I','EM','BR','P','UL','OL','LI','DIV','SPAN','SMALL','H3','H4','CODE','PRE']);
const SAFE_CLASS = new Set(['kit','kit-item','warn']);
function sanitizeHTML(html){
  const doc = new DOMParser().parseFromString('<div id="r">'+html+'</div>','text/html');
  const root = doc.getElementById('r');
  const walk = node => {
    [...node.children].forEach(el=>{
      if(el.tagName === 'BUTTON'){
        if(!el.dataset.sku){ el.replaceWith(doc.createTextNode(el.textContent)); return; }
        [...el.attributes].forEach(a=>{ if(!['data-sku','class'].includes(a.name)) el.removeAttribute(a.name); });
        el.className = 'kit-item';
      } else if(!SAFE_TAGS.has(el.tagName)){
        el.replaceWith(doc.createTextNode(el.textContent)); return;
      } else {
        [...el.attributes].forEach(a=>{
          const keepClass = a.name === 'class' && SAFE_CLASS.has(a.value);
          if(!keepClass) el.removeAttribute(a.name);
        });
      }
      walk(el);
    });
  };
  walk(root);
  return root.innerHTML;
}

/* Markdown mínimo y seguro para respuestas del modelo */
function mdToHTML(md){
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const lines = String(md).split(/\r?\n/);
  let html = '', listType = null;
  const closeList = () => { if(listType){ html += '</' + listType + '>'; listType = null; } };
  for(const raw of lines){
    let line = esc(raw.trim());
    if(/^#{1,4}\s+/.test(line)){
      closeList();
      html += '<h3>' + line.replace(/^#{1,4}\s+/,'') + '</h3>';
      continue;
    }
    const ul = line.match(/^[-*•]\s+(.+)/);
    const ol = line.match(/^\*{0,2}(\d+)[.)]\*{0,2}\s+(.+)/);
    if(ul || ol){
      const type = ul ? 'ul' : 'ol';
      if(listType !== type){ closeList(); html += '<' + type + '>'; listType = type; }
      html += '<li>' + (ul ? ul[1] : ol[2]) + '</li>';
      continue;
    }
    closeList();
    if(line === ''){ if(!html.endsWith('<br>')) html += '<br>'; continue; }
    html += line + '<br>';
  }
  closeList();
  return html.replace(/\*\*(.+?)\*\*/g,'<b>$1</b>');
}

function bubble(role, html){
  const row = document.createElement('div');
  row.className = 'msg ' + role;
  const safe = role === 'bot' ? sanitizeHTML(html) : escHTML(html);
  row.innerHTML = `<span class="mock-avatar">${role==='user'?'🧑':AGENTS[agentKeyOf()].icon}</span><div class="bubble ${role==='user'?'user':'bot'}">${safe}</div>`;
  $('chatMsgs').appendChild(row);
  $('chatMsgs').scrollTop = $('chatMsgs').scrollHeight;
  return row;
}
function typingBubble(){
  const row = document.createElement('div');
  row.className = 'msg bot'; row.id = 'typingRow';
  row.innerHTML = `<span class="mock-avatar">${AGENTS[agentKeyOf()].icon}</span><div class="typing"><i></i><i></i><i></i></div>`;
  $('chatMsgs').appendChild(row);
  $('chatMsgs').scrollTop = $('chatMsgs').scrollHeight;
}
function removeTyping(){ $('typingRow')?.remove(); }

async function sendMessage(raw){
  const text = (raw || $('chatInput').value).trim();
  if(!text) return;
  $('chatInput').value = '';
  bubble('user', text);
  chatHistory.push({role:'user', content:text});
  const routed = routeAgent(text);
  if(agentKeyOf()==='bermobot' && routed!=='bermobot'){ $('agentSelect').value = routed; syncChatAgent(); }
  agentPending = agentKeyOf();
  typingBubble();
  let reply, isMarkdown = false;
  if(AIcfg.endpoint){
    try{
      reply = await callAPI(agentPending, text, chatHistory);
      if(reply) isMarkdown = true;
      if(!reply && AIcfg.local) reply = localAgentReply(text);
      if(!reply) reply = `<span class="warn">El modelo no devolvió respuesta. Prueba otro modelo en ⚙️.</span>`;
    }
    catch(e){ reply = AIcfg.local ? localAgentReply(text)
      : `<span class="warn">API error ${e.message}. Revisa ⚙️ configuración.</span>`; }
  } else {
    reply = AIcfg.local ? localAgentReply(text) : t('settings_sub');
  }
  await new Promise(r=>setTimeout(r, 450));
  removeTyping();
  bubble('bot', isMarkdown ? mdToHTML(reply) : reply);
  chatHistory.push({role:'assistant', content:reply});
  if(ttsOn) Voice.speak(reply);
}
let agentPending = 'bermobot';

/* ---------- CALCULADORAS ---------- */
function calcPaint(){
  const area = Math.max(0, +$('pintArea').value||0);
  const coats = Math.max(1, +$('pintManos').value||1);
  const rend = Math.max(0.5, +$('pintRend').value||8);
  const liters = area*coats/rend;
  const cans = Math.ceil(liters/4);
  $('resPintura').innerHTML = `<h3>${t('calc_r_paint')}</h3>
    <div class="calc-row"><span>${t('calc_litters')}</span><b>${liters.toFixed(1)} L</b></div>
    <div class="calc-row"><span>${area} m² × ${coats} ${t('calc_coat')} · ${rend} m²/L</span><b>—</b></div>
    <div class="calc-row"><span>${t('calc_litters_up')}</span><b>${cans} × 4 L 🎨</b></div>
    <div class="calc-row"><span>${t('calc_btn')} EPI</span><b>${money(CATALOG.find(x=>x.sku==='BM-1601').price)}</b></div>`;
}
function calcFloor(){
  const area = Math.max(0, +$('sueloArea').value||0);
  const perBox = Math.max(.1, +$('sueloCaja').value||2.22);
  const waste = Math.min(30, +$('sueloWaste').value||8);
  const total = area*(1+waste/100);
  const boxes = Math.ceil(total/perBox);
  $('resSuelo').innerHTML = `<h3>${t('calc_r_floor')}</h3>
    <div class="calc-row"><span>${t('calc_m2_total')}</span><b>${total.toFixed(1)} m²</b></div>
    <div class="calc-row"><span>${t('calc_boxes')}</span><b>${boxes} 🪵</b></div>
    <div class="calc-row"><span>PVP total</span><b>${money(boxes*CATALOG.find(x=>x.sku==='BM-1501').price)}</b></div>
    <div class="calc-row"><span>Kit: film + fijaciones</span><b>+ ${money(14.30)} </b></div>`;
}
function calcCement(){
  const area = Math.max(0, +$('cemArea').value||0);
  const cm = Math.max(.5, +$('cemSpc').value||5);
  const perM2 = +$('cemTipo').value; // kg por m²·cm
  const kg = area*cm*perM2;
  const bagKg = perM2 >= 24 ? 25 : 22;
  const bags = Math.ceil(kg/bagKg);
  $('resCemento').innerHTML = `<h3>${t('calc_r_cement')}</h3>
    <div class="calc-row"><span>${t('calc_kg')}</span><b>${kg.toFixed(1)} kg</b></div>
    <div class="calc-row"><span>${t('calc_bags')}</span><b>${bags} × ${bagKg} kg 🧱</b></div>
    <div class="calc-row"><span>PVP total</span><b>${money(bags*CATALOG.find(x=>x.sku==='BM-1502').price)}</b></div>`;
}

/* ---------- PRESUPUESTO B2B ---------- */
let quote = [];
function addQuoteBySku(sku, qty=1){
  const line = quote.find(x=>x.sku===sku);
  if(line) line.qty += +qty; else quote.push({sku, qty:+qty});
  renderQuote(); toast(t('added_to_quote').replace(' ✅',''));
}
function renderQuote(){
  const sel = $('quoteProduct');
  sel.innerHTML = CATALOG.map(p=>`<option value="${p.sku}">${p.emoji} ${p[LANG]||p.es} — ${money(p.price)}</option>`).join('');
  if(!quote.length){
    $('quoteTable').innerHTML = `<tr><td colspan="4" class="muted">${t('quote_empty')}</td></tr>`;
    $('quoteTotals').innerHTML = '';
    return;
  }
  $('quoteTable').innerHTML = `<tr><th>${t('quote_prod')}</th><th>${t('qty')}</th><th>${t('quote_price')}</th><th>${t('quote_subtot')}</th></tr>` +
    quote.map(l=>{
      const p = CATALOG.find(x=>x.sku===l.sku);
      return `<tr><td>${p.emoji} ${p[LANG]||p.es}<br><small class="muted">${p.sku}</small></td>
      <td><input class="quote-qty" type="number" min="1" value="${l.qty}" data-qty="${l.sku}"></td>
      <td>${money(p.price)}</td><td><b>${money(p.price*l.qty)}</b></td></tr>`;
    }).join('');
  const units = quote.reduce((s,l)=>s+l.qty,0);
  const rate = units >= 30 ? .08 : units >= 10 ? .05 : 0;
  const gross = quote.reduce((s,l)=> s + CATALOG.find(x=>x.sku===l.sku).price*l.qty, 0);
  const disc = gross*rate;
  const total = gross - disc;
  const base = total/1.21, iva = total - base;
  $('quoteTotals').innerHTML = `
    <div class="qrow"><span>${t('quote_subtotal')}</span><span>${money(gross)}</span></div>
    <div class="qrow"><span>${t('quote_b2b')} (${(rate*100).toFixed(0)}%)</span><span>-${money(disc)}</span></div>
    <div class="qrow Total"><span>${t('quote_total')}</span><span>${money(total)}</span></div>
    <div class="qrow muted"><span>${t('quote_net')}</span><span>${money(base)}</span></div>
    <div class="qrow muted"><span>${t('quote_iva')}</span><span>${money(iva)}</span></div>`;
}
function quoteText(){
  const lines = quote.map(l=>{ const p = CATALOG.find(x=>x.sku===l.sku); return `${p[LANG]||p.es} (${p.sku}) ×${l.qty} — ${money(p.price*l.qty)}`; });
  const {total} = quoteTotalsCalc();
  return `${t('quote_to_copy')}\n${new Date().toLocaleDateString()}\n\n${lines.join('\n')}\n\n${t('quote_total')}: ${money(total)}`;
}
function quoteTotalsCalc(){
  const units = quote.reduce((s,l)=>s+l.qty,0);
  const rate = units >= 30 ? .08 : units >= 10 ? .05 : 0;
  const gross = quote.reduce((s,l)=> s + CATALOG.find(x=>x.sku===l.sku).price*l.qty, 0);
  const total = gross*(1-rate);
  return {gross, rate, total};
}
function downloadQuotePDF(){
  if(!quote.length){ toast(t('quote_empty')); return; }
  const p = CATALOG; const {gross, rate, total} = quoteTotalsCalc();
  const no = 'FP-' + Date.now().toString().slice(-6);
  const rows = quote.map(l=>{ const pr = p.find(x=>x.sku===l.sku); return `<tr><td>${pr.sku}</td><td>${pr[LANG]||pr.es}</td><td style="text-align:center">${l.qty}</td><td style="text-align:right">${money(pr.price)}</td><td style="text-align:right"><b>${money(pr.price*l.qty)}</b></td></tr>`; }).join('');
  const w = window.open('','QUOTE','width=820,height=900');
  w.document.write(`<html><head><title>${no}</title><style>
    body{font-family:Segoe UI,Arial,sans-serif;margin:40px;color:#111}
    h1{color:#e67400} table{width:100%;border-collapse:collapse;margin-top:16px}
    td,th{border-bottom:1px solid #ddd;padding:8px;font-size:14px}
    tfoot td{font-weight:bold;border-top:2px solid #111}
    .muted{color:#777;font-size:12px}</style></head><body>
    <h1>🔧 FERREPROXIM · Bermo Ferretería</h1>
    <p><b>${t('quote_to_copy')} ${no}</b><br>${new Date().toLocaleString()}<br><span class="muted">www.bermoferreteria.com · info@bermoferreteria.com</span></p>
    <table><thead><tr><th>SKU</th><th>${t('quote_prod')}</th><th>${t('qty')}</th><th>${t('quote_price')}</th><th>${t('quote_subtot')}</th></tr></thead><tbody>${rows}</tbody></table>
    <p style="margin-top:14px;font-size:14px">
      ${t('quote_subtotal')}: <b>${money(gross)}</b><br>
      ${t('quote_b2b')} (${(rate*100).toFixed(0)}%): <b>-${money(gross*rate)}</b><br>
      ${t('quote_total')} (IVA 21%): <span style="font-size:20px;color:#e67400"><b>${money(total)}</b></span></p>
    <p class="muted">${L('tec_offer').replace(/<[^>]+>/g,'')}<br>${L('post_demo').replace(/<[^>]+>/g,'').split('\n')[1]||''}</p>
  </body></html>`);
  w.document.close(); w.focus(); setTimeout(()=>w.print(), 350);
}

/* ---------- FOTO ---------- */
function identifyPhoto(file){
  const reader = new FileReader();
  reader.onload = ev=>{
    const cls = PHOTO_CLASSES[file.size % PHOTO_CLASSES.length];
    const p = CATALOG.find(x=>x.sku===cls.sku);
    const alt = CATALOG.filter(x=>x.sku!==cls.sku && x.cat===p.cat).slice(0,2);
    $('photoResult').innerHTML = `
      <img src="${ev.target.result}" alt="pieza">
      <span class="product-cat">${t('photo_identified')}</span>
      <div class="match"><span class="m-emoji">${cls.emoji}</span><div><b>${cls.kw}</b><small>→ ${p[LANG]||p.es} · ${p.sku} · ${money(p.price)}</small></div><button class="add-btn" data-add="${p.sku}">➕</button></div>
      ${alt.map(x=>`<div class="match"><span class="m-emoji">${x.emoji}</span><div><b>${x[LANG]||x.es}</b><small>${x.sku} · ${money(x.price)}</small></div><button class="add-btn" data-add="${x.sku}">➕</button></div>`).join('')}`;
    toast('📷 ' + t('photo_identified'));
  };
  reader.readAsDataURL(file);
}

/* ---------- COMPARTIR / RRSS ---------- */
function shareTo(network, text){
  const url = location.href;
  const txt = encodeURIComponent((text||t('share_text')) + ' ' + url);
  const map = {
    whatsapp:`https://wa.me/?text=${txt}`,
    x:`https://twitter.com/intent/tweet?text=${txt}`,
    facebook:`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin:`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    telegram:`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text||t('share_text'))}`,
    email:`mailto:?subject=${encodeURIComponent('Ferreproxim · Bermo Ferretería')}&body=${txt}`
  };
  if(network==='native' && navigator.share){ navigator.share({title:'Ferreproxim', text:text||t('share_text'), url}).catch(()=>{}); return; }
  window.open(map[network], '_blank');
}
async function copyText(txt){
  try{ await navigator.clipboard.writeText(txt); toast(t('copied')); }
  catch{ const ta = document.createElement('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); toast(t('copied')); }
}

/* ---------- MODALES ---------- */
function openModal(id){ $(id).hidden = false; }
function closeModal(id){ $(id).hidden = true; }
function greetKey(){ return {bermobot:'greet', tecnipro:'greet_tec', manitas:'greet_man', postventa:'greet_post'}[agentKeyOf()] || 'greet'; }
function openChat(agent){
  if(agent){ $('agentSelect').value = agent; syncChatAgent(); }
  $('chatOverlay').classList.add('open');
  $('chatDrawer').classList.add('open');
  if(!$('chatMsgs').children.length){
    bubble('bot', t(greetKey()));
    chatHistory.push({role:'assistant', content:(t(greetKey())||'').replace(/<[^>]+>/g,'')});
  }
  $('chatInput').focus();
}
function closeChat(){
  $('chatOverlay').classList.remove('open');
  $('chatDrawer').classList.remove('open');
  Voice.stop(); if(micRec) micRec?.stop?.();
}
let micRec = null;

/* ---------- RENDER GLOBAL ---------- */
const HERO_CHIPS = {
  es:['Grifo que gotea 💧','Tacos para pladur 🔩','Instalar suelo laminado 🪵','Pintar habitación 🎨','Guantes anti-corte 🧤'],
  gl:['Billa que gotea 💧','Tacos para pladur 🔩','Instalar piso laminado 🪵','Pintar habitación 🎨','Luvas anti-corte 🧤'],
  en:['Dripping tap 💧','Drywall anchors 🔩','Install laminate floor 🪵','Paint a room 🎨','Cut-resistant gloves 🧤']
};
function renderAll(){
  $('heroChips').innerHTML = HERO_CHIPS[isENGL()].map(c=>`<button class="chip">${c}</button>`).join('');
  $('heroChips').querySelectorAll('.chip').forEach(c=>c.addEventListener('click',()=>{ $('heroSearch').value = c.textContent; semanticSearch(c.textContent); }));
  heroMock = {
    es:'“¡Hola! Se me sale el agua del grifo del fregadero, no sé qué comprar.”',
    gl:'“¡Ola! Sácheme a auga da billa do fregadoiro, non sei que comprar.”',
    en:'“Hi! Water is dripping from my sink tap, I don\'t know what to buy.”'
  }[isENGL()];
  mockCta = {es:'Añadir kit completo al presupuesto', gl:'Engadir o kit completo ao orzamento', en:'Add the full kit to the quote'}[isENGL()];
  runMock();
  renderProducts(CATALOG.slice(0,8));
  $('resultsInfo').textContent = t('results_info');
  renderAgents(); syncChatAgent(); renderQuote();
}

/* ---------- SUPABASE (catálogo opcional) ---------- */
const CAT_EMOJI = {fontaneria:'🚰', fijaciones:'🔩', pintura:'🎨', electricidad:'💡', jardin:'🌿', obras:'🧱', epi:'🧤', menaje:'🍚', herramientas:'🧰', suministros:'📦'};
async function loadSupabaseCatalog(){
  const {url, anonKey, enabled} = CFG.supabase || {};
  if(!enabled || !url || !anonKey) return;
  try{
    const res = await fetch(`${url}/rest/v1/products?select=*`, {
      headers:{ apikey:anonKey, Authorization:'Bearer '+anonKey }
    });
    if(!res.ok) return;
    const rows = await res.json();
    if(!Array.isArray(rows) || !rows.length) return;
    const mapped = rows.map((r,i)=>({
      id: r.id || i+1,
      sku: r.sku || ('SUP-'+(r.id||i)),
      cat: r.categoria || r.category || 'suministros',
      emoji: CAT_EMOJI[(r.categoria||r.category||'').toLowerCase()] || '📦',
      price: +(r.precio ?? r.price ?? 0),
      stock: +(r.stock ?? 0),
      es: r.nombre || r.nombre_es || r.name || r.sku,
      gl: r.nome || r.nombre || r.name || r.sku,
      en: r.name || r.nombre || r.sku,
      kw: (r.kw || ((r.nombre||r.name||'')+' '+(r.categoria||''))).toLowerCase()
    }));
    CATALOG.length = 0; CATALOG.push(...mapped);
  }catch(e){ /* sin conexión: se usa el catálogo local */ }
}

/* ---------- EVENTOS ---------- */
document.addEventListener('DOMContentLoaded', async ()=>{
  $('langSelect').value = LANG;
  $('voiceLang').value = LANG;
  await loadSupabaseCatalog();
  applyI18n(); renderAll();
  Voice.init();

  $('langSelect').addEventListener('change', e=> setLang(e.target.value));
  $('heroSearchForm').addEventListener('submit', e=>{ e.preventDefault(); semanticSearch($('heroSearch').value); });
  $('agentSelect').addEventListener('change', ()=>{ syncChatAgent(); });
  $('btnChat').addEventListener('click', ()=> openChat());
  $('btnChatClose').addEventListener('click', closeChat);
  $('chatOverlay').addEventListener('click', closeChat);
  $('chatForm').addEventListener('submit', e=>{ e.preventDefault(); sendMessage(); });

  $('btnSettings').addEventListener('click', ()=>{
    $('cfgEndpoint').value = AIcfg.endpoint;
    $('cfgKey').value = AIcfg.key;
    $('cfgModel').value = AIcfg.model;
    $('cfgPro').checked = AIcfg.pro; $('cfgLocal').checked = AIcfg.local;
    openModal('settingsModal');
  });
  $('footerSettings')?.addEventListener('click', e=>{ e.preventDefault(); openModal('settingsModal'); });
  $('btnSettingsClose').addEventListener('click', ()=> closeModal('settingsModal'));
  $('btnSaveSettings').addEventListener('click', ()=>{
    AIcfg.endpoint = $('cfgEndpoint').value.trim();
    AIcfg.key = $('cfgKey').value.trim();
    AIcfg.model = $('cfgModel').value.trim() || 'gpt-4o-mini';
    AIcfg.pro = $('cfgPro').checked; AIcfg.local = $('cfgLocal').checked;
    Object.entries({ai_endpoint:'endpoint', ai_key:'key', ai_model:'model', ai_pro:'pro', ai_local:'local'}).forEach(([k,v])=>
      localStorage.setItem(k, typeof AIcfg[v]==='boolean' ? (AIcfg[v]?'1':'0') : AIcfg[v]));
    closeModal('settingsModal'); toast(t('settings_saved'));
  });

  $('btnVoiceSettings').addEventListener('click', ()=>{ openModal('voiceModal'); Voice.refreshVoices(); });
  $('btnVoiceClose').addEventListener('click', ()=> closeModal('voiceModal'));
  $('btnTestVoice').addEventListener('click', ()=> { Voice.lang = $('voiceLang').value; Voice.pickVoiceFromModal(); });
  document.querySelectorAll('.gender-row .btn').forEach(b=>{
    if(b.dataset.gender === Voice.gender){ b.classList.add('active'); document.querySelector(`.gender-row .btn:not([data-gender="${Voice.gender}"])`)?.classList.remove('active'); }
  });

  let ttsOn = localStorage.getItem('vx_tts')==='1';
  window.ttsOn = ttsOn;
  const ttsBtn = $('btnTTS');
  const syncTTS = ()=>{ window.ttsOn = ttsOn; ttsBtn.classList.toggle('on', ttsOn); ttsBtn.title = ttsOn ? t('chat_enable_tts') : t('chat_disable_tts'); };
  ttsBtn.addEventListener('click', ()=>{
    ttsOn = !ttsOn; localStorage.setItem('vx_tts', ttsOn?'1':'0'); syncTTS();
    if(ttsOn) Voice.speak(t(greetKey())); else Voice.stop();
  });
  syncTTS();

  /* micrófonos */
  $('chatMic').addEventListener('click', ()=>{
    if(micRec){ micRec.stop?.(); micRec = null; return; }
    micRec = Voice.listen($('chatMic'), (txt, isFinal)=>{
      $('chatInput').value = txt;
      if(isFinal){ sendMessage(txt); micRec = null; }
    });
  });
  $('heroMic').addEventListener('click', ()=>{
    Voice.listen($('heroMic'), (txt, isFinal)=>{ $('heroSearch').value = txt; if(isFinal) semanticSearch(txt); });
  });
  $('chatMsgs').addEventListener('click', e=>{
    const btn = e.target.closest('.kit-item'); if(btn) addQuoteBySku(btn.dataset.sku);
  });
  document.addEventListener('click', e=>{ const a = e.target.closest('[data-add]'); if(a) addQuoteBySku(a.dataset.add); });

  /* calculadoras */
  $('btnPintura').addEventListener('click', calcPaint);
  $('btnSuelo').addEventListener('click', calcFloor);
  $('btnCemento').addEventListener('click', calcCement);
  calcPaint(); calcFloor(); calcCement();
  $('calcTabs').querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click', ()=>{
    $('calcTabs').querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.calc-panel').forEach(p=>p.classList.remove('active'));
    $('calc-' + tab.dataset.calc).classList.add('active');
  }));

  /* presupuesto */
  $('btnQuoteAdd').addEventListener('click', ()=> addQuoteBySku($('quoteProduct').value, $('quoteQty').value||1));
  $('quoteTable').addEventListener('change', e=>{
    const sku = e.target.dataset?.qty; if(!sku) return;
    const line = quote.find(x=>x.sku===sku); line.qty = Math.max(1, +e.target.value||1); renderQuote();
  });
  $('btnQuotePDF').addEventListener('click', downloadQuotePDF);
  $('btnQuoteCopy').addEventListener('click', ()=> copyText(quote.length ? quoteText() : t('quote_empty')));
  $('btnQuoteShare').addEventListener('click', ()=>{
    if(!quote.length){ toast(t('quote_empty')); return; }
    if(navigator.share){ navigator.share({title:'Ferreproxim', text:quoteText()}).catch(()=>{ shareTo('telegram', quoteText()); }); }
    else shareTo('telegram', quoteText());
  });
  document.querySelectorAll('[data-share]').forEach(a=>a.addEventListener('click', e=>{
    e.preventDefault(); shareTo(a.dataset.share);
  }));

  /* foto */
  $('btnPhoto').addEventListener('click', ()=>$('photoInput').click());
  $('photoInput').addEventListener('change', e=> e.target.files[0] && identifyPhoto(e.target.files[0]));
  $('btnChatPhoto').addEventListener('click', ()=>$('chatPhotoInput').click());
  $('chatPhotoInput').addEventListener('change', e=>{
    if(!e.target.files[0]) return;
    bubble('user', '📷 ' + e.target.files[0].name);
    typingBubble();
    setTimeout(()=>{
      removeTyping();
      const cls = PHOTO_CLASSES[e.target.files[0].size % PHOTO_CLASSES.length];
      const p = CATALOG.find(x=>x.sku===cls.sku);
      bubble('bot', `🤖📷 <b>${t('photo_identified')}</b>: ${cls.kw} → ${p.emoji} ${p[LANG]||p.es} (${p.sku}) · ${money(p.price)}\nobservación: modo demo. <div class="kit">${kitHTML(p)}</div>`);
    }, 900);
  });

  /* Accesibilidad: etiqueta controles sin <label> asociado */
  document.querySelectorAll('input:not([type=hidden]), select').forEach(el=>{
    if(el.getAttribute('aria-label')) return;
    const lab = (el.labels && el.labels[0] && el.labels[0].textContent)
      || (el.previousElementSibling && el.previousElementSibling.tagName === 'LABEL' && el.previousElementSibling.textContent)
      || el.getAttribute('placeholder') || el.id;
    if(lab) el.setAttribute('aria-label', String(lab).trim());
  });
});

/* Reanudar el mock del hero solo al cambiar de idioma (sin parpadeos) */


/* Mapa bajo demanda (sin cargar Google hasta el clic) */
document.querySelectorAll('.map-toggle').forEach(function(btn){btn.addEventListener('click',function(){var wrap=btn.nextElementSibling;if(!wrap)return;if(wrap.hidden){if(!wrap.querySelector('iframe')){var iframe=document.createElement('iframe');iframe.src=btn.dataset.map;iframe.loading='lazy';iframe.title='Mapa de la tienda';iframe.style.width='100%';iframe.style.height='220px';iframe.style.border='0';iframe.style.borderRadius='12px';wrap.appendChild(iframe);}wrap.hidden=false;btn.textContent='🗺 Ocultar mapa';}else{wrap.hidden=true;btn.textContent='🗺 Ver mapa';}});});

/* ---------- WHATSAPP ---------- */
(function () {
  var cfg = (window.FERRE_CONFIG || {}).company || {};
  var n = String(cfg.whatsapp || '').replace(/\D/g, '');
  if (!n) return;
  var f = document.getElementById('waFloat');
  if (f) f.href = 'https://wa.me/' + n + '?text=' + encodeURIComponent('Hola, vengo de la web de Ferreproxim. Necesito ayuda con un producto o avería.');
  var b = document.getElementById('btnQuoteWA');
  if (b) b.addEventListener('click', function () {
    if (!quote.length) { toast('Añade productos al presupuesto'); return; }
    var lines = quote.map(function (l) {
      var p = CATALOG.find(function (x) { return x.sku === l.sku; });
      return l.qty + ' x ' + ((p && (p[LANG] || p.es)) || l.sku) + ' (' + l.sku + ')';
    }).join('\n');
    var total = quote.reduce(function (s, l) {
      var p = CATALOG.find(function (x) { return x.sku === l.sku; });
      return s + (p ? p.price * l.qty : 0);
    }, 0);
    var txt = 'Hola, quiero este presupuesto:\n' + lines + '\n\nTotal aprox: ' + total.toFixed(2) + ' € (IVA incluido)';
    window.open('https://wa.me/' + n + '?text=' + encodeURIComponent(txt), '_blank');
  });
})();

/* ---------- TEMA CLARO/OSCURO ---------- */
(function () {
  var root = document.documentElement;
  var KEY = 'site_theme';

  function paint() {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    var dark = root.getAttribute('data-theme') === 'dark';
    btn.textContent = dark ? '\u2600\uFE0F' : '\uD83C\uDF19';
    btn.title = dark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro';
    btn.setAttribute('aria-label', btn.title);
    btn.setAttribute('aria-pressed', dark ? 'false' : 'true');
  }

  function setTheme(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem(KEY, t); } catch (e) {}
    paint();
  }

  document.addEventListener('click', function (e) {
    var btn = e.target && e.target.closest ? e.target.closest('#themeToggle') : null;
    if (!btn) return;
    e.preventDefault();
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', paint);
  } else {
    paint();
  }
})();


/* Modo embebido: evitar duplicar botones flotantes */
if (window.self !== window.top) { document.documentElement.classList.add('po-embedded'); }
