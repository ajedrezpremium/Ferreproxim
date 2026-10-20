/* ═══════════ Ferreproxim · Catálogo + Agentes + Motor local ═══════════ */
/* Precios con IVA (21%). stock: nº unidades */

const CATALOG = [
  {id:1, sku:"BM-1001", cat:"fontaneria", emoji:"🚰", price:14.90, stock:24,
   es:"Juntas de estanqueidad 1/2\" (10 ud.)", gl:"Xuntas de estanqueidade 1/2\" (10 ud.)", en:"Tap washers 1/2\" (10 ud.)",
   kw:"grifo gotea agua fuga junta juntas tapa estanqueidad billa junta washer dripping tap plumbing leak sink cartucho cerámica"},
  {id:2, sku:"BM-1002", cat:"fontaneria", emoji:"🔧", price:8.50, stock:38,
   es:"Llave de paso lavadora 1/2\"-3/4\"", gl:"Billa de paso para lavadora 1/2\"-3/4\"", en:"Washer shut-off valve 1/2\"-3/4\"",
   kw:"llave paso lavadora escuadra grifo roto tubo gotea cambiar billa paso valve broken pipe washing machine"},
  {id:3, sku:"BM-1003", cat:"fontaneria", emoji:"🧰", price:19.95, stock:12,
   es:"Llave inglesa ajustable 10\"", gl:"Grifa inglesa axustable 10\"", en:"Adjustable wrench 10\"",
   kw:"llave inglesa ajustable grifa herramienta tubo tuercas wrench spanner adjustable"},
  {id:4, sku:"BM-1004", cat:"fontaneria", emoji:"🌀", price:2.10, stock:120,
   es:"Cinta teflón sella-rosca (14 m)", gl:"Cinta teflón sella-roscas (14 m)", en:"PTFE thread seal tape (14 m)",
   kw:"teflon sellar rosca tubo agua estanqueidad grifo instalación tape seal threaded"},
  {id:5, sku:"BM-1101", cat:"fijaciones", emoji:"🔩", price:9.20, stock:64,
   es:"Tacos para pladur + tornillos (50 ud.)", gl:"Tacos para pladur + tornillos (50 ud.)", en:"Drywall anchors + screws (50 ud.)",
   kw:"tacos tornillos pared pladur escayola colgar estante drywall anchor screw wall shelf hanging"},
  {id:6, sku:"BM-1102", cat:"fijaciones", emoji:"🪛", price:31.90, stock:8,
   es:"Taladro percutor 550W + maletín", gl:"Taladro percutor 550W + maletín", en:"Impact drill 550W + case",
   kw:"taladro percutor herramienta broca agujero pared drill furar burato"},
  {id:7, sku:"BM-1103", cat:"fijaciones", emoji:"🪟", price:6.75, stock:52,
   es:"Juego brocas metal + mampostería (8 pz)", gl:"Xogo brocas metal + mampostería (8 pz)", en:"Metal + masonry drill bits set (8 pz)",
   kw:"broca brocas taladro piedra hormigón metal drill bit furar pedra formigón"},
  {id:8, sku:"BM-1201", cat:"pintura", emoji:"🎨", price:23.50, stock:18,
   es:"Pintura plástica blanca interior 4 L", gl:"Pintura plástica branca interior 4 L", en:"Interior white emulsion 4 L",
   kw:"pintura pared paredes plástica blanca interior litros paint wall room m2 pintar"},
  {id:9, sku:"BM-1202", cat:"pintura", emoji:"🖌️", price:7.40, stock:30,
   es:"Rodillo 25 cm + cubeta", gl:"Rodillo 25 cm + cubeta", en:"Roller 25 cm + tray",
   kw:"rodillo brocha pintar cubeta roller tray brush painting pincel"},
  {id:10, sku:"BM-1301", cat:"electricidad", emoji:"💡", price:5.90, stock:80,
   es:"Interruptor bipolar + mecanismo", gl:"Interruptor bipolar + mecanismo", en:"2-pole switch mechanism",
   kw:"interruptor mecanismo luz electricidad cable instalar switch light wiring"},
  {id:11, sku:"BM-1302", cat:"electricidad", emoji:"🔌", price:12.60, stock:44,
   es:"Pelacables VDE 1000 V", gl:"Pelacables VDE 1000 V", en:"VDE wire stripper 1000 V",
   kw:"pelacables alicate cortacables electricidad cables wire stripper"},
  {id:12, sku:"BM-1401", cat:"jardin", emoji:"✂️", price:17.85, stock:16,
   es:"Tijeras de podar Forja 30 cm", gl:"Tesoiras de podar 30 cm", en:"Pruning shears 30 cm",
   kw:"tijeras podar jardin arbusto seto pruner shears gardening xardín poda"},
  {id:13, sku:"BM-1402", cat:"jardin", emoji:"🌿", price:11.10, stock:22,
   es:"Tierra universal 20 L + abono", gl:"Terra universal 20 L + abono", en:"Potting soil 20 L + fertilizer",
   kw:"tierra sustrato plantar maceta jardin compost potting garden terra xardín"},
  {id:14, sku:"BM-1501", cat:"obras", emoji:"🪵", price:27.90, stock:14,
   es:"Suelo laminado AC5 roble 2,22 m²/caja", gl:"Piso laminado AC5 carballo 2,22 m²/caixa", en:"Laminate floor AC5 oak 2.22 m²/box",
   kw:"suelo laminado ac5 suelo piso m2 caja reforma floor laminate box"},
  {id:15, sku:"BM-1502", cat:"obras", emoji:"🧱", price:6.20, stock:96,
   es:"Cemento CEM II 25 kg", gl:"Cemento CEM II 25 kg", en:"CEM II cement 25 kg",
   kw:"cemento hormigón mortero saco obra pared cement mortar bag"},
  {id:16, sku:"BM-1503", cat:"obras", emoji:"🧻", price:14.30, stock:20,
   es:"Rollo aislamiento polietileno 100 mm", gl:"Rolo illamento polietileno 100 mm", en:"Poly foam underlay 100 mm",
   kw:"film underlay suelo laminate aislación grosor lámina base"},
  {id:17, sku:"BM-1601", cat:"epi", emoji:"🧤", price:9.90, stock:50,
   es:"Guantes anti-corte nivel 5", gl:"Luvas anti-corte nivel 5", en:"Cut-resistant gloves level 5",
   kw:"guantes protección epi seguridad manos glove safety cut luvas"},
  {id:18, sku:"BM-1602", cat:"epi", emoji:"🕶️", price:8.25, stock:42,
   es:"Gafas de protección + tapones oídos", gl:"Gafas de protección + tapóns oídos", en:"Safety glasses + earplugs",
   kw:"gafas protección ojos seguridad taller oídos glasses safety eyes"},
  {id:19, sku:"BM-1701", cat:"menaje", emoji:"🍚", price:12.95, stock:26,
   es:"Cazo aluminio fundido 16 cm", gl:"Cazo de aluminio fundido 16 cm", en:"Cast aluminium saucepan 16 cm",
   kw:"cazo sartén menaje cocina aluminio saucepan pot kitchen"},
  {id:20, sku:"BM-1702", cat:"menaje", emoji:"🪝", price:4.60, stock:88,
   es:"Bisagra soft-close (2 ud.)", gl:"Bisagra soft-close (2 ud.)", en:"Soft-close hinge (2 ud.)",
   kw:"bisagra mueble puerta armario flotante hinge cabinet door furniture"},
];

/* ═══ Identificación visual (clases demo) ═══ */
const PHOTO_CLASSES = [
  {kw:"bisagra", emoji:"🪝", sku:"BM-1702"},
  {kw:"tacos y tornillería", emoji:"🔩", sku:"BM-1101"},
  {kw:"junta de estanqueidad 1/2\"", emoji:"🚰", sku:"BM-1001"},
  {kw:"juego de brocas", emoji:"🪟", sku:"BM-1103"},
  {kw:"llave inglesa ajustable", emoji:"🧰", sku:"BM-1003"},
];

/* ═══ Prompts de sistema por agente (listos para producción LLM) ═══ */
const AGENTS = {
  bermobot: {
    icon:"🤖",
    name:{es:"BermoBot",gl:"BermoBot",en:"BermoBot"},
    role:{es:"El Ferretero Experto · Orquestador",gl:"O Ferreiro Experto · Orquestrador",en:"The Expert Shopkeeper · Orchestrator"},
    tag:{es:"Orquestador",gl:"Orquestrador",en:"Orchestrator"},
    sys:{
      es:`Eres BermoBot, el ferretero experto de Ferreproxim / Bermo Ferretería (bermoferreteria.com). Misión: saludo, triaje y derivación al agente adecuado (TecniPro B2B, ManitasIA DIY, PostVenta) o respuesta inmediata. Tono cercano, profesional, directo y resolutivo. Entiendas lenguaje coloquial ("se me sale el agua del grifo", "tacos para pladur"). REGLA DE ORO: nunca inventes medidas, compatibilidades ni precios ajenos al catálogo; si dudas, pregunta UNA sola pregunta de confirmación. Deriva: proyecto DIY→ManitasIA, profesional/compra mayor/presupuesto→TecniPro, pedido/devolución→PostVenta. Responde con viñetas y máx 120 palabras salvo kit de productos.`,
      gl:`Es BermoBot, o ferreiro experto de Ferreproxim / Bermo Ferretería. Misión: saúdo, triaxe e derivación ao axente axeitado (TecniPro, ManitasIA, PostVenta) ou resposta inmediata. Tono próximo, profesional e resolutivo. REGRA DE OURO: nunca inventes medidas nin compatibilidades; se dubidas, fai UNA pregunta de confirmación.`,
      en:`You are BermoBot, the expert shopkeeper of Ferreproxim / Bermo Ferretería. Mission: greeting, triage and routing to the right agent (TecniPro, ManitasIA, After-Sales) or immediate answer. Warm, professional, direct tone. GOLDEN RULE: never invent measurements or compatibility; when unsure, ask ONE confirmation question.`
    }
  },
  tecnipro: {
    icon:"👷",
    name:{es:"TecniPro",gl:"TecniPro",en:"TecniPro"},
    role:{es:"B2B · Autónomos y Empresas",gl:"B2B · Autónomos e Empresas",en:"B2B · Freelancers & Companies"},
    tag:{es:"B2B",gl:"B2B",en:"B2B"},
    sys:{
      es:`Eres TecniPro, asistente B2B de Ferreproxim para fontaneros, electricistas, reformistas y talleres. Funciones: presupuestos formales instantáneos (descuento por volumen: >10 uds 5%, >30 uds 8%), verificación de stock del catálogo adjunto, búsqueda por referencia/SKU/EAN y compatibilidad industrial. Aplica IVA 21% ya incluido en el PVP. Muestra los artículos como lista: Nombre (SKU) · precio · stock. Cierra SIEMPRE con CTA: "Genera tu presupuesto formal en la Zona Pro." Máx 150 palabras. Tono directo, jerga profesional.`,
      gl:`Es TecniPro, axistente B2B de Ferreproxim para fontaneiros, electricistas, reformistas e talleres. Funcións: orzamentos formais instantáneos (dcto por volume: >10 uds 5%, >30 uds 8%), stock do catálogo, busca por SKU/EAN e compatibilidade. IVE 21% incluído. Lista: Nome (SKU) · prezo · stock. Remata SEMPRE co CTA "Xera o teu orzamento na Zona Pro". Máx 150 palabras.`,
      en:`You are TecniPro, B2B assistant for plumbers, electricians, renovators and workshops. Duties: instant formal quotes (volume discount: >10 u 5%, >30 u 8%), catalog stock checks, SKU/EAN search and industrial compatibility. VAT 21% included. List items: Name (SKU) · price · stock. Always end with CTA "Generate your formal quote in the Pro Zone". Max 150 words. Direct tone.`
    }
  },
  manitas: {
    icon:"🎨",
    name:{es:"ManitasIA",gl:"ManitasIA",en:"ManitasIA"},
    role:{es:"Tutor DIY y Proyectos",gl:"Titor DIY e Proxectos",en:"DIY Tutor & Projects"},
    tag:{es:"DIY",gl:"DIY",en:"DIY"},
    sys:{
      es:`Eres ManitasIA, tutor DIY de Ferreproxim. Guías al particular desde la idea o avería hasta la lista de compra exacta. Estructura SIEMPRE: 1) Diagnóstico breve. 2) Pasos numerados con ⚠️ alertas de seguridad y EPIs recomendados (guantes BM-1601, gafas BM-1602). 3) 🧰 Kit recomendado con SOLO artículos del catálogo adjunto, formato "Nombre (SKU) – precio €". Si calculas cantidades, muestra el cálculo (m², manos, rendimiento, desperdicio). Termina con: "¿Quieres que añada el kit al presupuesto?" Máx 180 palabras.`,
      gl:`Es ManitasIA, titor DIY de Ferreproxim. Guía o particular desde a idea ou avaría ata a lista de compra exacta. Estrutura SEMPRE: 1) Diagnóstico breve. 2) Pasos numerados con ⚠️ avisos de seguranza e EPIs (luvas BM-1601, gafas BM-1602). 3) 🧰 Kit recomendado SOLO con artigos do catálogo, formato "Nome (SKU) – prezo €". Amosa o cálculo de cantidades. Remata: "Queres que engada o kit ao orzamento?" Máx 180 palabras.`,
      en:`You are ManitasIA, DIY tutor of Ferreproxim. Always structure: 1) Brief diagnosis. 2) Numbered steps with ⚠️ safety alerts and PPE (gloves BM-1601, glasses BM-1602). 3) 🧰 Recommended kit with catalog items only, format "Name (SKU) – price €". Show quantity calculations (m², coats, waste). End with "Want me to add the kit to the quote?" Max 180 words.`
    }
  },
  postventa: {
    icon:"📦",
    name:{es:"PostVenta",gl:"PostVenta",en:"After-Sales"},
    role:{es:"Pedidos y Logística",gl:"Pedidos e Loxística",en:"Orders & Logistics"},
    tag:{es:"24/7",gl:"24/7",en:"24/7"},
    sys:{
      es:`Eres el agente de PostVenta y Logística de Ferreproxim. Consultas el estado del pedido (nº + "demo": #BM-4021 Entregado, #BM-4033 En ruta), gestionas devoluciones (14 días, caja original, herramientas eléctricas sin desprecintar), garantías (3 años herramientas eléctricas) y recogidas en tienda en 2 h. Tono empático y claro. Máx 110 palabras.`,
      gl:`Es o axente de PostVenta e Loxística de Ferreproxim. Consultas o estado do pedido (nº + "demo": #BM-4021 Entregado, #BM-4033 En ruta), xestión de devolucións (14 días, caixa orixinal), garantías (3 anos en ferramentas eléctricas) e recollida en tenda en 2 h. Tono empático. Máx 110 palabras.`,
      en:`You are Ferreproxim's After-Sales & Logistics agent. Track orders (numbers + "demo": #BM-4021 Delivered, #BM-4033 In transit), manage returns (14 days in original box), warranties (3y on power tools) and 2h in-store pickup. Empathetic tone. Max 110 words.`
    }
  }
};

/* ═══════════ MOTOR LOCAL (fallback sin API) ═══════════ */
function money(n){ return n.toFixed(2).replace('.',',') + ' €'; }

function findProducts(q, limit=4){
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const ql = norm(q);
  const scored = CATALOG.map(p=>{
    const hay = norm((p.es+' '+p.gl+' '+p.en+' '+p.kw+' '+p.sku));
    let s = 0;
    ql.split(/\s+/).forEach(w=>{ if(w.length>2 && hay.includes(w)) s += w.length; });
    if(ql.length>3 && hay.includes(ql)) s += 20;
    return {p,s};
  }).filter(x=>x.s>0).sort((a,b)=>b.s-a.s);
  return scored.slice(0,limit).map(x=>x.p);
}

function kitHTML(p){
  return `<button data-sku="${p.sku}" class="kit-item"><span>${p.emoji} ${p[LANG]||p.es} <small>(${p.sku})</small></span><b>${money(p.price)}</b></button>`;
}

const SUGGESTIONS = {
  bermobot: { es:['Grifo que gotea 💧','Tacos para pladur','Pintar 15 m²','Estado de mi pedido'],
              gl:['Billa que gotea 💧','Tacos para pladur','Pintar 15 m²','Estado do meu pedido'],
              en:['Dripping tap 💧','Drywall anchors','Painting 15 m²','Track my order'] },
  tecnipro: { es:['Presupuesto 2 cajas laminado','¿Stock llave 1/2"?','Tarifa mayorista pintura'],
              gl:['Orzamento 2 caixas laminado','¿Stock billa 1/2"?','Tarifa maiorista pintura'],
              en:['Quote 2 laminate boxes','Stock of 1/2" valve?','Wholesale paint rate'] },
  manitas:  { es:['Instalar suelo laminado 12 m²','Cambiar llave de paso lavadora','Cuánta pintura para 12 m²'],
              gl:['Instalar piso laminado 12 m²','Trocar billa de paso lavadora','Canta pintura para 12 m²'],
              en:['Install 12 m² laminate floor','Replace washer valve','How much paint for 12 m²'] },
  postventa:{ es:['¿Dónde está mi pedido?','Devolver una broca','Recoger en tienda hoy'],
              gl:['¿Onde está o meu pedido?','Devolver unha broca','Recoller en tenda hoxe'],
              en:['Where is my order?','Return a drill bit','Pick up in store today'] },
};

const LOCAL_I18N = {
  es:{
    diag_grifo:"🔧 <b>Diagnóstico</b>: goteo en grifo o llave de paso. Lo habitual: junta/cartucho gastado o rosca sin sellar.",
    warn_agua:"⚠️ <b>¡Importante!</b> Cierra la llave general de agua antes de empezar.",
    s_grifo1:"Cierra el corte, vacía el circuito y desmonta la llave o cartucho (1/2\" o 3/4\").",
    s_grifo2:"Limpia el asiento y aplica cinta de teflón en la rosca (3-4 vueltas).",
    s_grifo3:"Monta, aprieta con llave inglesa y prueba a presión 5 minutos.",
    cta_kit:"¿Quieres que añada el kit al presupuesto? 👇",
    tec_offer:"💵 <b>Tarifas Pro</b>: dcto 5% >10 uds · 8% >30 uds · IVA 21% ya incluido en el PVP.",
    tec_cta:"Genera tu presupuesto formal en la <b>Zona Pro</b> ⬇️ o dime más cantidades y te paso la cifra.",
    post_demo:"📦 Seguimiento (demo): <b>#BM-4021 Entregado</b> · <b>#BM-4033 En ruta</b> (llega hoy)\nDevoluciones 14 días en caja original · garantía 3 años en herramientas eléctricas.\n¿Nº de pedido o recogida en tienda?",
    kit_generic:"🎨 Te preparo un kit con lo esencial del catálogo:",
    ask:"Cuéntame un poco más: ¿qué superficie o medida tiene tu proyecto?"
  },
  gl:{
    diag_grifo:"🔧 <b>Diagnóstico</b>: goteo na billa ou na billa de paso. O habitual: xunta/cartucho gastado ou rosca sen selar.",
    warn_agua:"⚠️ <b>Importante!</b> Pecha a billa xeral de auga antes de empezar.",
    s_grifo1:"Pecha o corte, baleira o circuíto e desmonta a billa ou o cartucho (1/2\" ou 3/4\").",
    s_grifo2:"Limpa o asento e aplica cinta de teflón na rosca (3-4 voltas).",
    s_grifo3:"Monta, aperta coa grifa e proba con presión 5 minutos.",
    cta_kit:"Queres que engada o kit ao orzamento? 👇",
    tec_offer:"💵 <b>Tarifas Pro</b>: dcto 5% >10 uds · 8% >30 uds · IVE 21% xa incluído no PVP.",
    tec_cta:"Xera o teu orzamento formal na <b>Zona Pro</b> ⬇️ ou dime máis cantidades e pásolate a cifra.",
    post_demo:"📦 Seguimento (demo): <b>#BM-4021 Entregado</b> · <b>#BM-4033 En tránsito</b> (chega hoxe)\nDevolucións 14 días en caixa orixinal · garantía 3 anos en ferramentas eléctricas.\n¿Nº de pedido ou recollida en tenda?",
    kit_generic:"🎨 Prepárote un kit co esencial do catálogo:",
    ask:"Cóntame un pouco máis: que superficie ou medida ten o teu proxecto?"
  },
  en:{
    diag_grifo:"🔧 <b>Diagnosis</b>: drip on tap or shut-off valve. Usual cause: worn washer/cartridge or unsealed thread.",
    warn_agua:"⚠️ <b>Important!</b> Shut off the main water valve before starting.",
    s_grifo1:"Close the cut-off, drain the line and remove the valve or cartridge (1/2\" or 3/4\").",
    s_grifo2:"Clean the seat and wrap PTFE tape on the threads (3-4 turns).",
    s_grifo3:"Reassemble, tighten with the wrench and pressure-test for 5 minutes.",
    cta_kit:"Want me to add the kit to the quote? 👇",
    tec_offer:"💵 <b>Pro rates</b>: 5% off >10 u · 8% off >30 u · VAT 21% included.",
    tec_cta:"Generate your formal quote in the <b>Pro Zone</b> ⬇️ or give me quantities and I'll run the numbers.",
    post_demo:"📦 Tracking (demo): <b>#BM-4021 Delivered</b> · <b>#BM-4033 In transit</b> (arrives today)\nReturns within 14 days in original box · 3-year warranty on power tools.\nOrder number or in-store pickup?",
    kit_generic:"🎨 Here's a starter kit from our catalog:",
    ask:"Tell me a bit more: what area or size is your project?"
  }
};

function L(key){ return (LOCAL_I18N[LANG] && LOCAL_I18N[LANG][key]) || LOCAL_I18N.es[key] || key; }

function localAgentReply(text){
  const t_ = text.toLowerCase();
  if(/grifo|gotea|goteo|billa|cartucho|llave .?paso|drip|tap/i.test(t_)){
    const kit = findProducts('grifo junta llave paso teflón inglesa',3).map(kitHTML).join('');
    return `${L('diag_grifo')}\n1. ${L('warn_agua')}\n2. ${L('s_grifo1')}\n3. ${L('s_grifo2')}\n4. ${L('s_grifo3')}\n🧰 ${L('cta_kit')}\n<div class="kit">${kit}</div>`;
  }
  if(/pladur|taco.*pared|drywall|estant|colgar/i.test(t_)){
    const kit = findProducts('pladur tacos taladro brocas',3).map(kitHTML).join('');
    return `${L('ask')}\n🧰 <div class="kit">${kit}</div>`;
  }
  if(/suelo|laminado|pint|cemento|pared|obra/i.test(t_)){
    const kit = findProducts('suelo pintura rodillo cemento',3).map(kitHTML).join('');
    return `${L('kit_generic')}\n<div class="kit">${kit}</div>\n${L('cta_kit')}`;
  }
  if(/presupiuerto|presupuesto|orzamento|tarifa|mayor|mayorista|stock|sku|ean|referencia|quote/i.test(t_)){
    return `${L('tec_offer')}\n${L('tec_cta')}`;
  }
  if(/pedido|devoluc|garantía|entrega|recogida|recol|order|return|warranty/i.test(t_)){
    return L('post_demo');
  }
  const prods = findProducts(text,3);
  if(prods.length){
    return `${L('kit_generic')}\n<div class="kit">${prods.map(kitHTML).join('')}</div>`;
  }
  return L('ask');
}
