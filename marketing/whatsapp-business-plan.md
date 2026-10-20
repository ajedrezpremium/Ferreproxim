# WhatsApp Business — plan de integración (FERREPROXIM)

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
