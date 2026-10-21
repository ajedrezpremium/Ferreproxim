# PLAN DEMO V1.0 — FERREPROXIM (Bermo Ferretería, Vigo)

**Objetivo:** demo de 15 min con Bermo/Ferreproxim y cierre de **piloto de 30 días** del asistente IA para tienda y mostrador.
**URL demo:** https://ferreproxim.vercel.app
**Estado:** desplegado en Vercel; chat IA (proxy OpenRouter con rate limit), buscador semántico, calculadoras DIY, presupuestos B2B, ES/GL/EN, voz. Catálogo actual = datos demo (`js/data.js`), Supabase desactivado.

## 1. Checklist antes de la demo (48 h)

| # | Tarea | Quién | Estado |
|---|---|---|---|
| 1 | Cargar **catálogo real** (top 50–100 SKU: nombre, precio, stock, unidad, foto) | Cliente + yo importo | Pendiente |
| 2 | Sustituir datos mock por catálogo real en `js/data.js` o Supabase (`products`) | Yo | Pendiente |
| 3 | Validar calculadoras (pintura, tornillería, césped, etc.) con precios reales | Yo + cliente | Pendiente |
| 4 | Presupuesto B2B: generar PDF/email real con logo y datos fiscales | Yo | Pendiente |
| 5 | WhatsApp click-to-chat con número confirmado + email de pedidos | Cliente | HECHO (API pendiente de Meta) |
| 6 | Crédito OpenRouter (~5–10 €) para respuestas fiables | Cliente | Pendiente |
| 7 | Probar en móvil: chat, voz, calculadoras, presupuesto | Yo | Pendiente |
| 8 | Vídeo 60 s + one-pager PDF | Yo | Pendiente |

## 2. Guion de la demo (12 minutos)

1. **Mostrador (3 min)** — “Tengo un grifo que gotea, ¿qué necesito?”
   → Lista exacta de materiales + alternativa según tipo de grifo.
2. **Identificación (2 min)** — Subir foto de una pieza (si la función está activa) o describirla.
   → Pieza + referencias compatibles.
3. **Calculadora DIY (2 min)** — “¿Cuánta pintura para una habitación de 4×3 m?”
   → Litros, botes y coste estimado.
4. **Presupuesto B2B (2 min)** — “20 cajas de tornillos y 10 kg de cemento para una obra”.
   → Presupuesto con precios, IVA y plazo; descarga/envío.
5. **Multi-idioma (1 min)** — Atención a cliente extranjero en EN/GL.
6. **Cierre (2 min)** — Piloto 30 días, condiciones y siguiente paso.

## 3. Oferta piloto

- **30 días gratis** con agente en su web + WhatsApp.
- Precio tras piloto: **149 €/mes** (tienda) o **3 % de pedidos** generados (mín. 99 €/mes).
- Setup incluido: catálogo, calculadoras y presupuestos con su marca.
- Métrica de éxito: **50 conversaciones**, **10 presupuestos**, **3 pedidos** en 30 días; si no, se amplía el piloto sin coste.

## 4. Materiales de demo

- Enlace: https://ferreproxim.vercel.app
- QR para la presentación.
- Vídeo 60 s (pendiente) y one-pager (pendiente).
- Email D+1 con enlace y propuesta.

**Email D+1:**
> Hola [nombre], gracias por la demo. Aquí tienes el asistente: [URL]. Puedo dejar cargado vuestro catálogo real y las calculadoras con vuestros precios en 48 h. ¿Arrancamos el piloto de 30 días?

## 5. KPIs del piloto

- Conversaciones/semana y tema más consultado
- Conversaciones → presupuesto (≥20 %)
- Presupuestos → pedido (≥15 %)
- Ticket medio y ahorro de tiempo en mostrador
- Idiomas usados (ES/GL/EN)

## 6. Riesgos y mitigación

| Riesgo | Mitigación |
|---|---|
| Catálogo demo poco creíble | Cargar top SKU reales antes de la demo |
| Identificación por foto en mock | Implementarla o retirarla del guion |
| Modelos free con 429 | Crédito OpenRouter + fallback local |
| Precios/stock desactualizados | Importación semanal desde CSV/ERP |
| Sin dominio propio | ferreproxim.vercel.app ya activo; valorar ferreproxim.es |

## 7. Plan de ejecución

- **D-3:** catálogo real + calculadoras + prueba completa en móvil.
- **D-1:** vídeo 60 s + one-pager + confirmación de reunión.
- **Día D:** demo de 15 min con casos reales del mostrador.
- **D+1:** email de seguimiento + propuesta piloto.
- **D+7:** llamada de cierre y plan de catálogo.
