# WhatsApp Business — plan de integración (FERREPROXIM)

## Datos confirmados (21/10/2026)

- **Número de WhatsApp Business:** +34 986 13 85 96 (el mismo fijo de la tienda).
- **Enlaces web:** botón flotante, botón de presupuesto y footer apuntan a `https://wa.me/34986138596`.
- **Email administrador:** vigo8019@ferreproxim.es.
- **Requisito:** el fijo debe poder recibir la verificación de Meta (llamada/SMS) y no puede estar activo a la vez en WhatsApp personal/Business app. Si ya tiene WhatsApp, hay que migrarlo o liberarlo.
- **Importante:** el botón actual es **click-to-chat**. Para que el agente IA atienda dentro de WhatsApp Business hace falta la Cloud API y las credenciales de Meta; no se activa solo con el enlace.

## Checklist de alta en Meta

- [ ] Portfolio de Meta Business verificado (CIF, dirección, web y dominio).
- [ ] WABA y app de Meta con producto WhatsApp.
- [ ] Número +34 986 13 85 96 verificado y dado de alta.
- [ ] Token permanente, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_BUSINESS_ACCOUNT_ID`, `WHATSAPP_VERIFY_TOKEN`, `META_APP_SECRET`.
- [ ] Webhook: `https://ferreproxim.vercel.app/api/whatsapp/webhook`.
- [ ] Método de pago y plantillas aprobadas.
- [ ] Política de privacidad y opt-in publicados.
- [ ] Prueba completa: mensaje entrante → agente → respuesta → CRM.


## Estado actual (implementado)
- Botón flotante de WhatsApp en la web.
- Enlace “Cómo llegar” y dirección con Google Maps.
- Botón **WhatsApp** en el constructor de presupuesto: envía las líneas, cantidades y total aproximado.
- Número configurable en `js/config.js` (`company.whatsapp`).

## Fase 2 — WhatsApp Cloud API (2–4 semanas)
1. **Meta Business + verificación** y número dedicado (WhatsApp Business).
2. **Cloud API** (directa o BSP). Variables: `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_VERIFY_TOKEN`.
3. **Webhook** ya incluido en `api/whatsapp/webhook.js` (verificación + recepción; pendiente firma y envío).
4. **Plantillas aprobadas**:
   - `presupuesto_listo` · `pedido_confirmado` · `pedido_listo_recogida`
   - `reposicion_stock` (B2B) · `recordatorio_compra` · `encuesta_satisfaccion`
5. **Bandeja compartida** para mostrador: handoff a dependiente con contexto (cliente, lista, presupuesto).

## Fase 3 — Proceso completo (1–2 meses)
- Diagnóstico por WhatsApp (texto o foto) → lista de materiales → presupuesto PDF → pedido.
- Estado de pedido y aviso de recogida.
- Cuenta B2B: tarifas por volumen, pedidos recurrentes y reposición automática.
- Postventa: encuesta, garantía, recomendaciones de recompra.
- Métricas: conversaciones, presupuestos, pedidos, ticket medio, tiempo ahorrado en mostrador.

## Requisitos y cumplimiento
- Opt-in explícito y enlace a privacidad.
- Ventana de 24 h; plantillas para mensajes proactivos.
- No listas compradas.
- RGPD y conservación de datos.

## Costes orientativos
- Cloud API: coste por conversación/plantilla según Meta y país (orientativo 0,03–0,10 €/mensaje).
- BSP: cuota mensual + margen (20–50 €/mes).
- Implementación incluida en el piloto; integración con WooCommerce/ERP como fase aparte.

## KPIs del piloto
- Conversaciones → presupuesto ≥ 20 %.
- Presupuesto → pedido ≥ 15 %.
- Ticket medio y aumento de recompra.
- Reducción de consultas repetitivas en mostrador.
